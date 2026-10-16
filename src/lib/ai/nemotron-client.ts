// ─────────────────────────────────────────────────────────────────────────────
// THE single Nemotron client for GyanSetu.
//
// Every online AI call in the application goes through this file. It is
// server-side ONLY — the OPENROUTER_API_KEY / NVIDIA_API_KEY never leave the
// server. Provider chain: OpenRouter (Nemotron 3 Ultra) → NVIDIA NIM direct
// (same Nemotron model) as a resilience fallback. Both are NVIDIA Nemotron.
// ─────────────────────────────────────────────────────────────────────────────

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const DEFAULT_NEMOTRON_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
export const NVIDIA_MODEL_SLUG = "nvidia/nemotron-3-ultra-550b-a55b";

export interface NemotronConfig {
  model: string;
  provider: "openrouter" | "nvidia" | "none";
  configured: boolean;
}

/** Strips stray quotes some deploy environments wrap values in. */
function cleanEnv(v: string | undefined): string {
  return (v ?? "").trim().replace(/^"+|"+$/g, "");
}

const OR_KEY_RE = /^sk-or-v1-[A-Za-z0-9]{60,}$/; // OpenRouter key shape
const NV_KEY_RE = /^nvapi-[A-Za-z0-9_-]{50,}$/; // NVIDIA NIM key shape

export function getNemotronConfig(): NemotronConfig {
  const rawModel = cleanEnv(process.env.NEMOTRON_MODEL);
  // SANITIZATION: the model must look like a real model slug. If a deploy
  // environment shuffled variables (key inside NEMOTRON_MODEL etc.), we
  // fall back to the correct default instead of sending a garbage model.
  const model = rawModel.startsWith("nvidia/") ? rawModel : DEFAULT_NEMOTRON_MODEL;

  if (getOpenRouterKeys().length > 0) return { model, provider: "openrouter", configured: true };
  if (getNvidiaKeys().length > 0) return { model: NVIDIA_MODEL_SLUG, provider: "nvidia", configured: true };
  return { model, provider: "none", configured: false };
}

/** All VALID OpenRouter keys (primary + backups) — invalid values ignored. */
export function getOpenRouterKeys(): string[] {
  const seen = new Set<string>();
  return [
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_API_KEY_2,
    process.env.OPENROUTER_API_KEY_3,
  ]
    .map(cleanEnv)
    .filter((k) => OR_KEY_RE.test(k))
    .filter((k) => (seen.has(k) ? false : (seen.add(k), true)));
}

/** All VALID NVIDIA NIM keys. Also scans NEMOTRON_MODEL: some deployment
 *  environments shuffle variables, leaving a valid nvapi-* key stranded in
 *  the model slot — we recover it so Nemotron keeps working. */
export function getNvidiaKeys(): string[] {
  const seen = new Set<string>();
  return [
    process.env.NVIDIA_API_KEY,
    process.env.NVIDIA_API_KEY_2,
    process.env.NEMOTRON_MODEL, // heal shuffled-env deployments
  ]
    .map(cleanEnv)
    .filter((k) => NV_KEY_RE.test(k))
    .filter((k) => (seen.has(k) ? false : (seen.add(k), true)));
}

export interface NemotronMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface NemotronCallOptions {
  messages: NemotronMessage[];
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  stream?: boolean;
  /** Fast single-attempt mode for health pings — no long retry cycles. */
  quick?: boolean;
}

export interface NemotronResult {
  text: string;
  provider: "openrouter" | "nvidia";
  model: string;
  latencyMs: number;
}

/** Why the AI call failed — drives distinct, honest UI states. */
export type NemotronErrorKind = "config" | "rate_limit" | "network" | "invalid";

export class NemotronUnavailableError extends Error {
  kind: NemotronErrorKind;
  constructor(message: string, kind: NemotronErrorKind = "network") {
    super(message);
    this.name = "NemotronUnavailableError";
    this.kind = kind;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ProviderCall {
  name: string; // unique internal id (nvidia, nvidia1, nvidia2…)
  reportAs: "openrouter" | "nvidia"; // what the UI/DB sees
  key: string;
  url: string;
  model: string;
  buildBody: (opts: NemotronCallOptions) => Record<string, unknown>;
  buildHeaders: (key: string) => Record<string, string>;
}

function openRouterCall(model: string, key: string, label: string): ProviderCall {
  return {
    name: label,
    reportAs: "openrouter",
    key,
    url: OPENROUTER_CHAT_URL,
    model,
    buildBody: (opts) => {
      const body: Record<string, unknown> = {
        model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 800,
        // Low-latency path (SIH ≤3s target): disable long reasoning.
        reasoning: { enabled: false },
      };
      if (opts.json) body.response_format = { type: "json_object" };
      if (opts.stream) body.stream = true;
      return body;
    },
    buildHeaders: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://gyansetu.app",
      "X-Title": "GyanSetu",
    }),
  };
}

function nvidiaCall(key: string, label: string): ProviderCall {
  return {
    name: label,
    reportAs: "nvidia",
    key,
    url: NVIDIA_CHAT_URL,
    model: NVIDIA_MODEL_SLUG,
    buildBody: (opts) => ({
      model: NVIDIA_MODEL_SLUG,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.4,
      top_p: 0.95,
      max_tokens: opts.maxTokens ?? 800,
      // Disable long internal reasoning for the ≤3s classroom latency target.
      chat_template_kwargs: { enable_thinking: false },
      stream: opts.stream === true,
    }),
    buildHeaders: (k) => ({
      Authorization: `Bearer ${k}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  };
}

interface ProviderError extends Error {
  retryable?: boolean;
  rateLimited?: boolean;
}

async function callProvider(
  provider: ProviderCall,
  opts: NemotronCallOptions,
  startedAt: number,
): Promise<{ text: string }> {
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: provider.buildHeaders(provider.key),
      body: JSON.stringify(provider.buildBody(opts)),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const err = new Error(
        `[${provider.name}] HTTP ${res.status} — ${detail.slice(0, 300)}`,
      ) as ProviderError;
      // 429 handling:
      //  • "free-models-per-day" (OpenRouter daily cap) → NOT retryable —
      //    waiting seconds will never help; fail fast to the next provider.
      //  • per-minute 429 (NVIDIA) → retryable after a quiet pause.
      //  • 503 "Service temporarily overloaded" → busy, retryable, treated
      //    like a rate-limit for classification (honest "busy" message).
      const isDailyLimit = res.status === 429 && /per-day|free-models/.test(detail);
      err.retryable = res.status >= 500 || (res.status === 429 && !isDailyLimit);
      err.rateLimited = res.status === 429 || res.status === 503;
      throw err;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content || !content.trim()) {
      throw new Error(`[${provider.name}] empty completion`);
    }
    // Remove stray code fences around JSON.
    let text = content.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("completion exceeded timeout");
    }
    return { text };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls Nemotron through the provider chain with one retry per provider on
 * transient (429/5xx/network) failures. Throws NemotronUnavailableError when
 * every provider fails — callers convert that into a friendly UI message.
 */
/** Remembers the last working provider so subsequent calls skip dead ones. */
let lastWorkingProvider: "openrouter" | "nvidia" | null = null;
/** Timestamp of the last fully-failed cycle — used for overload cooldown. */
let lastTotalFailure: number | null = null;
/** Timestamp of the last SUCCESSFUL Nemotron call — drives the sticky
 *  "online" health state so the badge never flaps during free-tier bursts. */
export let lastSuccessAt: number | null = null;

export function getLastProvider(): "openrouter" | "nvidia" | null {
  return lastWorkingProvider;
}

/** Builds the ordered provider list (independent keys = independent providers). */
function buildProviders(cfg: NemotronConfig): ProviderCall[] {
  const providers: ProviderCall[] = [];
  getOpenRouterKeys().forEach((key, i) => {
    providers.push(openRouterCall(cfg.model, key, `or${i}`));
  });
  getNvidiaKeys().forEach((key, i) => {
    providers.push(nvidiaCall(key, `nvidia${i}`));
  });
  // Smart ordering: the provider family that worked last time goes first.
  // On a cold start, NVIDIA NIM goes first (its per-minute window resets
  // quickly while OpenRouter's free daily cap can stay exhausted all day).
  if (lastWorkingProvider) {
    providers.sort((a) => (a.reportAs === lastWorkingProvider ? -1 : 1));
  } else {
    providers.sort((a) => (a.reportAs === "nvidia" ? -1 : 1));
  }
  return providers;
}

/** Classifies a failure run into a distinct, honest error kind. */
function classifyFailure(errors: string[], sawRateLimit: boolean): NemotronErrorKind {
  const joined = errors.join(" ");
  if (!joined) return "network";
  if (sawRateLimit && !/connection|fetch|ENOTFOUND|ECONN|aborted|timeout/i.test(joined)) {
    return "rate_limit";
  }
  if (/connection|fetch|ENOTFOUND|ECONN|timeout|aborted/i.test(joined)) {
    return "network";
  }
  return "network";
}

export async function callNemotron(
  opts: NemotronCallOptions,
): Promise<NemotronResult> {
  const cfg = getNemotronConfig();
  const startedAt = Date.now();
  const errors: string[] = [];
  const providers = buildProviders(cfg);

  if (providers.length === 0) {
    throw new NemotronUnavailableError(
      "NVIDIA/OpenRouter API keys are missing — Nemotron is not configured.",
      "config",
    );
  }

  // QUICK MODE: one attempt per provider, short timeout — used by health
  // pings so they never block or hammer the free tier during busy windows.
  if (opts.quick) {
    for (const provider of providers) {
      try {
        const { text } = await callProvider(
          provider,
          { ...opts, timeoutMs: opts.timeoutMs ?? 12_000 },
          startedAt,
        );
        lastWorkingProvider = provider.reportAs;
        lastSuccessAt = Date.now();
        return {
          text,
          provider: provider.reportAs,
          model: provider.model,
          latencyMs: Date.now() - startedAt,
        };
      } catch (err) {
        errors.push(err instanceof Error ? err.message : String(err));
      }
    }
    console.error("[gyansetu:ai] quick health ping failed:", errors.slice(0, 3).join(" | "));
    throw new NemotronUnavailableError(
      `All Nemotron providers busy: ${errors.slice(0, 1).join(" | ")}`,
      "network",
    );
  }

  // Overload cooldown: when the free tier is in a burst, hammering it with
  // retries makes the overload WORSE.
  if (lastTotalFailure && Date.now() - lastTotalFailure < 4000) {
    await sleep(4000 - (Date.now() - lastTotalFailure));
  }

  // Round-robin retry with 429-aware backoff:
  //  • rate-limit windows (429/503): up to 4 quiet rounds with 8s pauses —
  //    spans a full per-minute window so the next open minute is caught.
  //  • network/timeout failures: stop after 2 rounds (grinding won't help).
  const maxRounds = 4;
  const dead = new Set<string>();
  let sawRateLimit = false;
  let sawNetworkFailure = false;
  for (let round = 0; round < maxRounds; round++) {
    for (const provider of providers) {
      if (dead.has(provider.name)) continue;
      try {
        const { text } = await callProvider(provider, opts, startedAt);
        lastWorkingProvider = provider.reportAs;
        lastTotalFailure = null;
        lastSuccessAt = Date.now();
        return {
          text,
          provider: provider.reportAs,
          model: provider.model,
          latencyMs: Date.now() - startedAt,
        };
      } catch (err) {
        const providerErr = err as ProviderError;
        errors.push(err instanceof Error ? err.message : String(err));
        if (providerErr.retryable === false) dead.add(provider.name);
        if (providerErr.rateLimited) sawRateLimit = true;
        else sawNetworkFailure = true;
      }
    }
    if (round < maxRounds - 1 && !(sawNetworkFailure && !sawRateLimit && round >= 1)) {
      await sleep(sawRateLimit ? 8000 : 1500);
    } else {
      break;
    }
  }

  lastTotalFailure = Date.now();
  console.error("[gyansetu:ai] Nemotron call failed:", errors.slice(0, 5).join(" | "));
  throw new NemotronUnavailableError(
    `All Nemotron providers failed: ${errors.slice(0, 2).join(" | ")}`,
    classifyFailure(errors, sawRateLimit),
  );
}

/**
 * Streaming Nemotron call — reads server-sent events and reports deltas as
 * they arrive so the UI can render progressively instead of waiting.
 */
export async function callNemotronStream(
  opts: NemotronCallOptions,
  onDelta: (text: string) => void,
): Promise<NemotronResult> {
  const cfg = getNemotronConfig();
  const startedAt = Date.now();
  const errors: string[] = [];
  const providers = buildProviders(cfg);

  if (providers.length === 0) {
    throw new NemotronUnavailableError(
      "NVIDIA/OpenRouter API keys are missing — Nemotron is not configured.",
      "config",
    );
  }
  if (lastTotalFailure && Date.now() - lastTotalFailure < 6000) {
    await sleep(6000 - (Date.now() - lastTotalFailure));
  }

  let sawRateLimit = false;
  for (const provider of providers) {
    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: provider.buildHeaders(provider.key),
        body: JSON.stringify(provider.buildBody({ ...opts, stream: true })),
        signal: AbortSignal.timeout(opts.timeoutMs ?? 45_000),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        if (res.status === 429 && /per-day|free-models/.test(detail)) {
          // daily cap — try the next provider immediately
        } else if (res.status === 429) {
          sawRateLimit = true;
        }
        errors.push(`[${provider.name}] HTTP ${res.status}`);
        continue;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string | null } }>;
            };
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              text += delta;
              onDelta(delta);
            }
          } catch {
            /* partial SSE frame — ignore */
          }
        }
      }

      if (text.trim()) {
        lastWorkingProvider = provider.reportAs;
        lastTotalFailure = null;
        lastSuccessAt = Date.now();
        return {
          text,
          provider: provider.reportAs,
          model: provider.model,
          latencyMs: Date.now() - startedAt,
        };
      }
      errors.push(`[${provider.name}] empty stream`);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  lastTotalFailure = Date.now();
  console.error("[gyansetu:ai] stream failed:", errors.slice(0, 5).join(" | "));
  throw new NemotronUnavailableError(
    `All Nemotron providers failed: ${errors.slice(0, 2).join(" | ")}`,
    classifyFailure(errors, sawRateLimit),
  );
}

/** Robust JSON extraction from model output (handles fences, prose around JSON). */
export function extractJson<T>(text: string): T | null {
  let candidate = text.trim();
  const fence = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) candidate = fence[1].trim();

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch {
    // Tolerate trailing commas / smart quotes in a second pass.
    try {
      const cleaned = candidate
        .slice(start, end + 1)
        .replace(/,(\s*[}\]])/g, "$1")
        .replace(/[\u201c\u201d]/g, '"');
      return JSON.parse(cleaned) as T;
    } catch {
      return null;
    }
  }
}
