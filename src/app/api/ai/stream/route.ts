// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/stream — STREAMING Ask AI.
// The server streams real Nemotron tokens to the browser as SSE events so
// the child sees the answer forming immediately, then sends the validated,
// pedagogy-complete structured result. Keys never leave the server.
//
//   event: delta → { t: "partial token text" }
//   event: result → { ...AskResult }
//   event: error → { friendly, code }
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest } from "next/server";
import { z } from "zod";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";
import { prepareAsk, finalizeAsk } from "@/lib/ai/orchestrator";
import {
  callNemotronStream,
  NemotronUnavailableError,
} from "@/lib/ai/nemotron-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const lang = () => z.custom<LanguageCode>(isLanguageCode);

const AskPayloadSchema = z.object({
  question: z.string().min(1).max(1500),
  studentLanguage: lang(),
  teacherLanguage: lang().optional(),
  grade: z.number().int().min(1).max(8).optional(),
  subject: z.string().max(40).optional(),
  lessonId: z.string().max(80).optional(),
});

function friendlyFor(kind: string): string {
  if (kind === "config") return "Nemotron API is not configured.";
  if (kind === "rate_limit") return "AI service is temporarily busy. Please try again.";
  if (kind === "network") return "Nemotron could not be reached. Check your connection.";
  return "Nemotron could not be reached. Check your connection and try again.";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, code: "BAD_REQUEST" }, { status: 400 });
  }
  const parsed = AskPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, code: "BAD_REQUEST" }, { status: 400 });
  }
  const payload = parsed.data;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* client gone */
        }
      };
      try {
        const { opts } = await prepareAsk(payload);
        const res = await callNemotronStream(opts, (t) => send("delta", { t }));
        const result = await finalizeAsk(res.text, payload, res.provider, res.model, res.latencyMs);
        send("result", result);
      } catch (e) {
        if (e instanceof NemotronUnavailableError) {
          console.error("[gyansetu:stream] failed:", e.message, "| kind:", e.kind);
          send("error", { friendly: friendlyFor(e.kind), code: e.kind });
        } else if (e instanceof z.ZodError) {
          send("error", { friendly: "Please check your input and try again.", code: "BAD_REQUEST" });
        } else {
          console.error("[gyansetu:stream] unexpected:", e);
          send("error", { friendly: "Nemotron could not be reached. Check your connection and try again.", code: "AI_ERROR" });
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
