// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ai/health — the REAL AI health system.
// Checks: keys exist → endpoint reachable → model correct → request
// authenticates → response parses. The UI renders exactly this state.
// ─────────────────────────────────────────────────────────────────────────────
import { getAiStatus } from "@/lib/ai/orchestrator";
import {
  DEFAULT_NEMOTRON_MODEL,
  getNemotronConfig,
  getNvidiaKeys,
  getOpenRouterKeys,
  NVIDIA_MODEL_SLUG,
} from "@/lib/ai/nemotron-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = getNemotronConfig();
  const openRouterKeys = getOpenRouterKeys().length;
  const nvidiaKeys = getNvidiaKeys().length;
  const configured = cfg.configured;

  let status: {
    provider: string;
    model: string;
    available: boolean;
    mode: "nemotron" | "offline" | "fallback";
    latencyMs: number;
    configured: boolean;
    reason: string;
  };

  if (!configured) {
    status = {
      provider: "NVIDIA",
      model: NVIDIA_MODEL_SLUG,
      available: false,
      mode: "offline",
      latencyMs: 0,
      configured: false,
      reason: "no_api_key",
    };
  } else {
    try {
      const s = await getAiStatus({});
      status = {
        provider: s.provider === "nvidia" ? "NVIDIA" : "OPENROUTER",
        model: s.verified && s.provider === "nvidia" ? NVIDIA_MODEL_SLUG : s.model,
        available: s.verified,
        mode: s.verified ? "nemotron" : "fallback",
        latencyMs: s.latencyMs,
        configured: true,
        reason: s.verified ? "ok" : "verification_failed",
      };
    } catch {
      status = {
        provider: cfg.provider === "openrouter" ? "OPENROUTER" : "NVIDIA",
        model: cfg.model || DEFAULT_NEMOTRON_MODEL,
        available: false,
        mode: "fallback",
        latencyMs: 0,
        configured: true,
        reason: "health_check_failed",
      };
    }
  }

  return Response.json({
    ...status,
    keys: { openRouter: openRouterKeys, nvidia: nvidiaKeys }, // counts only — never the keys
  });
}
