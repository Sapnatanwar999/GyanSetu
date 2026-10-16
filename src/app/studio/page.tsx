"use client";

// ─────────────────────────────────────────────────────────────────────────────
// 📤 Upload Studio — teacher uploads text / PDF / txt file / link.
// Pipeline on publish: Teacher → Nemotron → Student. Students see it in
// 🎒 My Class, where Nemotron converts it into their language with steps,
// examples and a takeaway.
// ─────────────────────────────────────────────────────────────────────────────
import { Suspense, useEffect, useState } from "react";
import { useInterfaceLanguage, useLangs, useMode, useUser } from "@/components/providers";
import { fetchClassContent, getLessons, prepareStudentContent, publishContent } from "@/lib/api";
import { makeT } from "@/lib/i18n";
import { Badge, Button, Card, FriendlyError, Select } from "@/components/ui";
import { GyanuBubble } from "@/components/gamification";
import { useLocalized } from "@/lib/pageLocalize";
import { LANGUAGE_LIST, getLanguage, type LanguageCode } from "@/lib/languages";
import type { StudioResult } from "@/lib/ai/types";

interface LessonRow {
  slug: string;
  titleHi: string;
  class: number;
  subject: string;
}

function StudioPage() {
  const { name, role } = useUser();
  const { teacherLanguage, studentLanguage, setStudentLanguage } = useLangs();
  const { mode } = useMode();
  const uiLanguage = useInterfaceLanguage();
  const t = makeT(uiLanguage);
  const pageTitle = useLocalized(t("studio"), uiLanguage);
  const pageSub = useLocalized(t("studioSub"), uiLanguage);

  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [kind, setKind] = useState<"text" | "file" | "link">("text");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [lessonSlug, setLessonSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<StudioResult | null>(null);
  const [preparedFor, setPreparedFor] = useState("");
  const [recent, setRecent] = useState<Array<{ id: string; title: string; kind: string; createdAt: string }>>([]);

  const sourceKey = JSON.stringify({
    kind, title, text, url, lessonSlug, teacherLanguage, studentLanguage,
    file: file ? `${file.name}:${file.size}:${file.lastModified}` : "",
  });
  const previewIsCurrent = Boolean(preview && preparedFor === sourceKey);

  useEffect(() => {
    void getLessons().then((res) => {
      if (res.ok && Array.isArray(res.data)) setLessons(res.data as LessonRow[]);
    });
    void fetchClassContent().then((res) => {
      if (res.ok) setRecent(res.data!.slice(0, 6));
    });
  }, []);

  const createForm = (action: "preview" | "publish") => {
    const form = new FormData();
    form.set("action", action);
    form.set("title", title);
    form.set("kind", kind);
    form.set("lessonSlug", lessonSlug);
    form.set("author", role === "teacher" && name ? name : t("teacherRole"));
    form.set("sourceLanguage", teacherLanguage);
    form.set("studentLanguage", studentLanguage);
    if (kind === "text") form.set("text", text);
    if (kind === "link") form.set("url", url);
    if (kind === "file" && file) form.set("file", file);
    return form;
  };

  const validateSource = () => {
    if (!title.trim() || busy) return false;
    if (kind === "text" && !text.trim()) {
      setError(t("emptyMaterial"));
      return false;
    }
    if (kind === "link" && !url.trim()) {
      setError(t("pasteLinkFirst"));
      return false;
    }
    if (kind === "file" && !file) {
      setError(t("chooseFileFirst"));
      return false;
    }
    return true;
  };

  const previewErrorText = (code?: string) => {
    if (code === "PDF_UNREADABLE") return t("pdfUnreadable");
    if (code === "LINK_UNREADABLE") return t("linkUnreadable");
    if (code === "FILE_TOO_LARGE") return t("fileTooLarge");
    if (code === "SOURCE_EMPTY") return t("sourceEmpty");
    if (code === "AI_PREVIEW_FAILED") return t("errNetwork");
    return t("uploadFail");
  };

  const prepare = async () => {
    if (!validateSource()) return;
    if (mode !== "online") {
      setError(t("prepareOnlineOnly"));
      return;
    }
    setBusy(true);
    setError("");
    setNote("");
    const res = await prepareStudentContent(createForm("preview"));
    if (res.ok && res.data) {
      setPreview(res.data.preview);
      setPreparedFor(sourceKey);
    } else {
      setError(previewErrorText(res.friendly));
    }
    setBusy(false);
  };

  const publish = async () => {
    if (!validateSource()) return;
    if (!previewIsCurrent || !preview) {
      setError(t("prepareBeforePublish"));
      return;
    }
    setBusy(true);
    setError("");
    setNote("");
    const form = createForm("publish");
    form.set("payload", JSON.stringify({
      sourceLanguage: teacherLanguage,
      studentVersionLanguage: studentLanguage,
      studentVersion: preview,
    }));
    const res = await publishContent(form);
    if (res.ok) {
      setNote(t("uploadSuccess"));
      setTitle("");
      setText("");
      setUrl("");
      setFile(null);
      setPreview(null);
      setPreparedFor("");
      void fetchClassContent().then((r) => {
        if (r.ok) setRecent(r.data!.slice(0, 6));
      });
    } else {
      setError(res.friendly ?? t("uploadFail"));
    }
    setBusy(false);
  };

  const kindLabel = (k: string) =>
    k === "worksheet" ? `📝 ${t("worksheets")}` : k === "flashcards" ? `🃏 ${t("flashcards")}` :
      k === "link" ? `🔗 ${t("uploadLink")}` : k === "file" ? `📎 ${t("uploadFile")}` : `✍️ ${t("uploadText")}`;

  return (
    <div className="gs-animate mx-auto max-w-4xl space-y-4">
      <header>
        <h1 className="text-2xl font-black text-indigo-900">{pageTitle}</h1>
        <p className="text-sm text-slate-500">{pageSub}</p>
      </header>

      <Card title={t("uploadTitle")} subtitle={t("uploadSub")} className="border-indigo-100">
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-56 flex-1">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t("uploadTitleLabel")}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("uploadTitleLabel")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <Select
              compact
              value={kind}
              onChange={(v) => setKind(v as "text" | "file" | "link")}
              options={[
                { value: "text", label: t("uploadText") },
                { value: "file", label: t("uploadFile") },
                { value: "link", label: t("uploadLink") },
              ]}
              label={t("uploadKind")}
            />
            <Select
              compact
              value={lessonSlug}
              onChange={setLessonSlug}
              options={[
                { value: "", label: t("allSubjects") },
                ...lessons.map((l) => ({ value: l.slug, label: `${l.titleHi} (${l.class})` })),
              ]}
              label={t("uploadLesson")}
            />
            <Select
              compact
              value={studentLanguage}
              onChange={(value) => setStudentLanguage(value as LanguageCode)}
              options={LANGUAGE_LIST.map((language) => ({ value: language.code, label: language.nativeName }))}
              label={t("studentLang")}
            />
          </div>

          {kind === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={t("uploadTextarea")}
              className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500"
            />
          )}
          {kind === "link" && (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("uploadUrlPh")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          )}
          {kind === "file" && (
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/40">
              <span className="text-2xl">📎</span>
              <p className="mt-1 font-semibold">{file ? file.name : t("uploadFileHint")}</p>
              <input
                type="file"
                accept=".txt,.md,.pdf,text/plain,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="soft" onClick={() => void prepare()} disabled={busy || !title.trim() || mode !== "online"}>
              {busy ? "…" : t("prepareStudentVersion")}
            </Button>
            <Button onClick={() => void publish()} disabled={busy || !title.trim() || !previewIsCurrent}>
              {busy ? "…" : t("uploadPublish")}
            </Button>
            {mode === "offline" && <span className="text-xs text-amber-700">{t("prepareOnlineOnly")}</span>}
            {previewIsCurrent && <span className="text-xs font-semibold text-emerald-700">{t("studentVersionPrepared")} — {getLanguage(studentLanguage).nativeName}</span>}
            {note && <span className="text-xs font-semibold text-emerald-700">{note}</span>}
          </div>
          <p className="text-[11px] text-slate-400">{t("uploadNote")}</p>
        </div>
      </Card>

      {previewIsCurrent && preview && (
        <Card title={t("studentVersionPreview")} subtitle={getLanguage(studentLanguage).nativeName} className="border-emerald-100">
          <div className="space-y-3">
            <h2 className="text-lg font-black text-emerald-900">{preview.title}</h2>
            <p className="rounded-xl bg-indigo-50/70 p-3 text-sm font-semibold leading-relaxed text-slate-800">{preview.summary}</p>
            {preview.steps.length > 0 && <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">{preview.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>}
            {preview.examples.length > 0 && <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">{preview.examples.map((example, index) => <li key={index}>{example}</li>)}</ul>}
            {preview.takeaway && <p className="rounded-lg bg-amber-50 p-2 text-sm font-semibold">{preview.takeaway}</p>}
            {preview.followUp && <p className="text-sm text-indigo-700">{preview.followUp}</p>}
          </div>
        </Card>
      )}

      {error && <FriendlyError message={error} />}

      <Card title={t("recentPublished")} subtitle={t("classFeed")}>
        {recent.length === 0 && <GyanuBubble text={t("classFeedEmpty")} />}
        <div className="mt-2 space-y-2">
          {recent.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3">
              <div className="min-w-40 flex-1">
                <p className="text-sm font-bold text-slate-800">{r.title}</p>
                <p className="text-[11px] text-slate-400">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              <Badge tone="indigo">{kindLabel(r.kind)}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function StudioPageWrapper() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">…</p>}>
      <StudioPage />
    </Suspense>
  );
}
