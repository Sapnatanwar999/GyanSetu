import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { teacherContent } from "@/db/schema";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";
import { runLocalize, runStudio } from "@/lib/ai/orchestrator";
import { StudioSchema } from "@/lib/ai/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RequestSchema = z.object({
  contentId: z.string().regex(/^\d{1,12}$/),
  language: z.custom<LanguageCode>(isLanguageCode),
});

type PathPart = string | number;
type TextPath = PathPart[];
const ARTIFACT_TEXT_FIELDS = new Set([
  "title", "question", "options", "answer", "explanation", "concept", "word", "meaning", "example", "learningObjective",
]);

function collectStrings(value: unknown, path: TextPath, field: string, texts: string[], paths: TextPath[]) {
  if (typeof value === "string") {
    if (ARTIFACT_TEXT_FIELDS.has(field) && value.trim()) {
      texts.push(value);
      paths.push(path);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, [...path, index], field, texts, paths));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => collectStrings(child, [...path, key], key, texts, paths));
  }
}

function setAtPath(root: Record<string, unknown>, path: TextPath, value: string) {
  let current: unknown = root;
  for (const part of path.slice(0, -1)) {
    current = typeof part === "number"
      ? (current as unknown[])[part]
      : (current as Record<string, unknown>)[part];
  }
  const last = path[path.length - 1];
  if (last === undefined) return;
  if (typeof last === "number") (current as unknown[])[last] = value;
  else (current as Record<string, unknown>)[last] = value;
}

export async function POST(req: Request) {
  try {
    const input = RequestSchema.parse(await req.json());
    const rows = await db
      .select()
      .from(teacherContent)
      .where(eq(teacherContent.id, Number(input.contentId)))
      .limit(1);
    const item = rows[0];
    if (!item) return Response.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const payload = (item.payload ?? {}) as Record<string, unknown>;
    if (item.kind === "worksheet" || item.kind === "flashcards") {
      if (payload.studentVersionLanguage === input.language) {
        return Response.json({ ok: true, kind: "artifact", payload });
      }

      const texts: string[] = [];
      const paths: TextPath[] = [];
      collectStrings(payload, [], "", texts, paths);
      if (!texts.length || texts.some((text) => text.length > 300)) {
        return Response.json({ ok: false, error: "ARTIFACT_NOT_TRANSLATABLE" }, { status: 422 });
      }
      const localized = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
      const translated = Array<boolean>(texts.length).fill(false);
      for (let start = 0; start < texts.length; start += 20) {
        const batch = texts.slice(start, start + 20);
        const result = await runLocalize({ texts: batch, language: input.language });
        for (const entry of result.items) {
          const path = paths[start + entry.i];
          if (path && entry.text.trim()) {
            setAtPath(localized, path, entry.text);
            translated[start + entry.i] = true;
          }
        }
      }
      if (translated.some((done) => !done)) {
        return Response.json({ ok: false, error: "ARTIFACT_TRANSLATION_INCOMPLETE" }, { status: 502 });
      }
      localized.studentVersionLanguage = input.language;
      return Response.json({ ok: true, kind: "artifact", payload: localized });
    }

    const storedVersion = payload.studentVersion as unknown;
    if (payload.studentVersionLanguage === input.language) {
      const parsed = StudioSchema.safeParse(storedVersion);
      if (parsed.success) {
        return Response.json({ ok: true, kind: "lesson", preview: storedVersion });
      }
    }

    const preview = await runStudio({
      contentId: String(item.id),
      content: String(item.content ?? ""),
      title: item.title,
      kind: item.kind,
      language: input.language,
      teacherLanguage: isLanguageCode(payload.sourceLanguage) ? payload.sourceLanguage : undefined,
    });
    return Response.json({ ok: true, kind: "lesson", preview });
  } catch (error) {
    console.error("[gyansetu:studio] student adaptation failed:", error);
    return Response.json({ ok: false, error: "ADAPTATION_FAILED" }, { status: 502 });
  }
}
