// ─────────────────────────────────────────────────────────────────────────────
// Upload Studio API — teachers publish content (text / PDF / txt file / link /
// generated worksheet / flashcards). Students see it in My Class and Nemotron
// converts it into their language on view.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { teacherContent } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { getLesson } from "@/lib/curriculum";
import { isLanguageCode } from "@/lib/languages";
import { runStudio } from "@/lib/ai/orchestrator";
import { StudioSchema } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const teacherView = req.cookies.get("gyansetu-role")?.value === "teacher";
    const requestedStudentLanguage = req.cookies.get("gyansetu-student-lang")?.value;
    const rows = await db
      .select({
        id: teacherContent.id,
        title: teacherContent.title,
        kind: teacherContent.kind,
        lessonSlug: teacherContent.lessonSlug,
        author: teacherContent.author,
        content: teacherContent.content,
        payload: teacherContent.payload,
        createdAt: teacherContent.createdAt,
      })
      .from(teacherContent)
      .orderBy(desc(teacherContent.id))
      .limit(30);

    return Response.json({
      ok: true,
      items: rows.map((r) => ({
        id: String(r.id),
        title: teacherView
          ? r.title
          : requestedStudentLanguage && r.payload?.studentVersionLanguage === requestedStudentLanguage
            ? String((r.payload.studentVersion as Record<string, unknown> | undefined)?.title ?? r.payload.title ?? "")
            : "",
        kind: r.kind,
        lessonSlug: r.lessonSlug,
        author: teacherView ? r.author : "",
        content: teacherView ? r.content ?? "" : "",
        payload: teacherView
          ? r.payload ?? {}
          : requestedStudentLanguage && r.payload?.studentVersionLanguage === requestedStudentLanguage
            ? r.payload ?? {}
            : { studentVersionLanguage: r.payload?.studentVersionLanguage },
        createdAt: r.createdAt,
        excerpt: teacherView
          ? (r.content ?? r.title).slice(0, 160)
          : requestedStudentLanguage && r.payload?.studentVersionLanguage === requestedStudentLanguage
            ? String((r.payload.studentVersion as Record<string, unknown> | undefined)?.summary ?? r.payload.title ?? "")
            : "",
      })),
    });
  } catch (e) {
    console.error("[gyansetu:studio] list error:", e);
    return Response.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const action = String(form.get("action") ?? "");
    const title = String(form.get("title") ?? "").trim().slice(0, 300);
    const kind = String(form.get("kind") ?? "text").slice(0, 40);
    const lessonSlug = String(form.get("lessonSlug") ?? "").slice(0, 80) || null;
    const author = String(form.get("author") ?? "शिक्षक").slice(0, 80);
    const sourceLanguage = String(form.get("sourceLanguage") ?? "");
    if (!title) {
      return Response.json({ ok: false, error: "TITLE_REQUIRED" }, { status: 400 });
    }

    let content = String(form.get("text") ?? "").trim().slice(0, 14000);

    // ── Link: fetch server-side and extract readable text ──
    if (kind === "link") {
      const url = String(form.get("url") ?? "").trim();
      if (!/^https?:\/\//i.test(url)) {
        return Response.json({ ok: false, error: "BAD_URL" }, { status: 400 });
      }
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        const raw = await res.text();
        content = stripHtml(raw).slice(0, 14000);
      } catch {
        return Response.json({ ok: false, error: "LINK_UNREADABLE" }, { status: 422 });
      }
    }

    // ── File: txt/md read directly, PDF parsed server-side ──
    if (kind === "file") {
      const file = form.get("file") as File | null;
      if (!file) {
        return Response.json({ ok: false, error: "FILE_REQUIRED" }, { status: 400 });
      }
      if (file.size > 8 * 1024 * 1024) {
        return Response.json({ ok: false, error: "FILE_TOO_LARGE" }, { status: 413 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const name = file.name.toLowerCase();
      if (name.endsWith(".pdf")) {
        try {
          const mod = (await import("pdf-parse")) as unknown as { default?: unknown; parse?: unknown };
          const fn = (mod.default ?? mod.parse) as ((buf: Buffer) => Promise<{ text?: string }>);
          const parsed = await fn(bytes);
          content = String(parsed.text ?? "").replace(/\s+/g, " ").slice(0, 14000);
        } catch (e) {
          console.error("[gyansetu:studio] pdf parse failed:", e);
          return Response.json({ ok: false, error: "PDF_UNREADABLE" }, { status: 422 });
        }
      } else {
        content = bytes.toString("utf-8").slice(0, 14000);
      }
    }

    // ── Published worksheet / flashcards payloads ──
    let payload: Record<string, unknown> = {};
    const payloadRaw = String(form.get("payload") ?? "");
    if (payloadRaw) {
      try {
        payload = JSON.parse(payloadRaw) as Record<string, unknown>;
      } catch {
        /* ignore */
      }
    }
    if (isLanguageCode(sourceLanguage)) payload.sourceLanguage = sourceLanguage;

    if (action === "preview") {
      const studentLanguage = String(form.get("studentLanguage") ?? "");
      if (!isLanguageCode(studentLanguage)) {
        return Response.json({ ok: false, error: "STUDENT_LANGUAGE_REQUIRED" }, { status: 400 });
      }
      if (!content.trim()) {
        return Response.json({ ok: false, error: "SOURCE_EMPTY" }, { status: 422 });
      }
      try {
        const preview = await runStudio({
          contentId: `teacher-preview-${Date.now()}`,
          content,
          title,
          kind,
          language: studentLanguage,
          teacherLanguage: isLanguageCode(sourceLanguage) ? sourceLanguage : undefined,
        });
        return Response.json({ ok: true, preview });
      } catch (e) {
        console.error("[gyansetu:studio] preview generation failed:", e);
        return Response.json({ ok: false, error: "AI_PREVIEW_FAILED" }, { status: 502 });
      }
    }

    if (action !== "publish") {
      return Response.json({ ok: false, error: "EXPLICIT_PUBLISH_REQUIRED" }, { status: 400 });
    }

    if (kind === "text" || kind === "file" || kind === "link") {
      const studentLanguage = String(form.get("studentLanguage") ?? "");
      if (!isLanguageCode(studentLanguage) || payload.studentVersionLanguage !== studentLanguage) {
        return Response.json({ ok: false, error: "STUDENT_VERSION_REQUIRED" }, { status: 400 });
      }
      const candidate = payload.studentVersion;
      const parsedPreview = StudioSchema.safeParse(candidate);
      if (!parsedPreview.success) {
        return Response.json({ ok: false, error: "STUDENT_VERSION_INVALID" }, { status: 400 });
      }
      if (!content.trim()) {
        return Response.json({ ok: false, error: "SOURCE_EMPTY" }, { status: 422 });
      }
      const previewMeta = candidate && typeof candidate === "object" ? candidate as Record<string, unknown> : {};
      payload.studentVersion = {
        ...parsedPreview.data,
        engine: previewMeta.engine === "nemotron" ? "nemotron" : "local",
        provider: previewMeta.provider === "nvidia" || previewMeta.provider === "openrouter" ? previewMeta.provider : "none",
        model: typeof previewMeta.model === "string" ? previewMeta.model.slice(0, 120) : "unknown",
        mode: previewMeta.mode === "online" ? "online" : "offline",
        latencyMs: typeof previewMeta.latencyMs === "number" && Number.isFinite(previewMeta.latencyMs)
          ? Math.max(0, Math.min(120_000, previewMeta.latencyMs))
          : 0,
      };
    }

    if (kind === "worksheet" || kind === "flashcards") {
      const studentLanguage = String(form.get("studentLanguage") ?? "");
      if (!isLanguageCode(studentLanguage)) {
        return Response.json({ ok: false, error: "STUDENT_LANGUAGE_REQUIRED" }, { status: 400 });
      }
      payload.studentVersionLanguage = studentLanguage;
      content = content || title;
    }

    const lesson = lessonSlug ? getLesson(lessonSlug) : undefined;
    void lesson;

    const rows = await db
      .insert(teacherContent)
      .values({
        title,
        kind,
        lessonSlug,
        author,
        content,
        payload,
      })
      .returning({ id: teacherContent.id });

    return Response.json({ ok: true, id: rows[0]?.id ?? null });
  } catch (e) {
    console.error("[gyansetu:studio] create error:", e);
    return Response.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
