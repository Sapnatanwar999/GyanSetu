"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Whole-page Nemotron localization — RETRY UNTIL SOLVED.
//
// When a tribal language (sat/hoc/mai/unr) is selected, every registered page
// string is translated by Nemotron 3 Ultra in batched calls. If a batch fails
// (free-tier rate limits, network), it is re-queued and retried automatically
// with exponential backoff — the loop keeps going until every string is
// translated. Translations are cached in IndexedDB, so each string is
// translated ONCE per language.
//
// The language bar shows the live queue state (🧠 N बाकी) and a manual
// retry button for demos.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { hashInput } from "@/lib/cache-key";
import type { LanguageCode } from "@/lib/languages";
import { cacheGet, cachePut } from "@/lib/local/store";

export const PGT_EVENT = "gyansetu-page-translated";
export const PGT_QUEUE_EVENT = "gyansetu-pgt-queue";

interface Pending {
  id: string;
  source: string;
}

const queue: Pending[] = [];
const queuedIds = new Set<string>();
let inFlight = false;
let failures = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let activeLang: LanguageCode | null = null;

const keyFor = (lang: LanguageCode, id: string) => `pgtr:${lang}:${id}`;

function notify(): void {
  window.dispatchEvent(
    new CustomEvent(PGT_QUEUE_EVENT, {
      detail: { lang: activeLang, remaining: queue.length, active: inFlight },
    }),
  );
}

function schedule(lang: LanguageCode, delayMs: number): void {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => void flush(lang), delayMs);
}

async function flush(lang: LanguageCode): Promise<void> {
  if (inFlight || !queue.length) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    schedule(lang, 20_000);
    return;
  }
  const batch = queue.splice(0, 12);
  batch.forEach((b) => queuedIds.delete(b.id));
  inFlight = true;
  activeLang = lang;
  notify();
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "localize", payload: { texts: batch.map((b) => b.source), language: lang } }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      data?: { items?: Array<{ i: number; text: string }> };
    };
    if (json.ok && json.data?.items?.length) {
      failures = 0;
      const map = new Map<number, string>(json.data.items.map((it) => [it.i, it.text]));
      const retryBatch: Pending[] = [];
      batch.forEach((item, idx) => {
        const text = map.get(idx);
        if (text && text.trim()) {
          void cachePut(keyFor(lang, item.id), text).catch(() => undefined);
          window.dispatchEvent(new CustomEvent(PGT_EVENT, { detail: { id: item.id, text, lang } }));
        } else {
          retryBatch.push(item);
        }
      });
      if (retryBatch.length) queue.unshift(...retryBatch);
    } else {
      failures++;
      queue.unshift(...batch);
    }
  } catch {
    failures++;
    queue.unshift(...batch);
  } finally {
    inFlight = false;
    notify();
    // LOOP UNTIL SOLVED: keep retrying with growing backoff (max 60s).
    if (queue.length) {
      const delay = Math.min(5000 * Math.pow(1.6, failures), 60_000);
      schedule(lang, delay);
    }
  }
}

function enqueue(lang: LanguageCode, source: string): void {
  const id = hashInput(source.trim().toLowerCase());
  if (queuedIds.has(id)) return;
  queuedIds.add(id);
  queue.push({ id, source });
  activeLang = lang;
  if (!inFlight) schedule(lang, 250);
  notify();
}

/** Manual retry (language-bar button) — resets backoff and flushes now. */
export function retryPageTranslation(lang: LanguageCode): void {
  failures = 0;
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  void flush(lang);
}

/** Live queue state for the language-bar chip. */
export function usePgtStatus(lang: LanguageCode): { remaining: number; active: boolean } {
  const [state, setState] = useState({ remaining: 0, active: false });
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as { lang: LanguageCode | null; remaining: number; active: boolean };
      if (d.lang === lang) setState({ remaining: d.remaining, active: d.active });
    };
    window.addEventListener(PGT_QUEUE_EVENT, handler);
    return () => window.removeEventListener(PGT_QUEUE_EVENT, handler);
  }, [lang]);
  return state;
}

/**
 * useLocalized(source, lang)
 *  - hi/en: source unchanged.
 *  - tribal: shows the pack string immediately, then swaps to the Nemotron
 *    translation once the retry loop completes the batch (cached thereafter).
 */
export function useLocalized(source: string, lang: LanguageCode): string {
  const [text, setText] = useState(source);

  useEffect(() => {
    if (lang === "hi" || lang === "en") {
      setText(source);
      return;
    }
    let alive = true;
    const cleanups: Array<() => void> = [];
    const id = hashInput(source.trim().toLowerCase());
    const key = keyFor(lang, id);

    void (async () => {
      const cached = await cacheGet<string>(key);
      if (cached) {
        if (alive) setText(cached);
        return;
      }
      enqueue(lang, source);
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail as { id: string; text: string; lang: string };
        if (detail.id === id && detail.lang === lang && alive) setText(detail.text);
      };
      window.addEventListener(PGT_EVENT, handler);
      // The listener lives for the component lifetime — the retry loop may
      // deliver the translation minutes later. Cleaned up on unmount.
      cleanups.push(() => window.removeEventListener(PGT_EVENT, handler));
    })();

    return () => {
      alive = false;
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, lang]);

  return text;
}
