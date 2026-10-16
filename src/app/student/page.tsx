"use client";

// ─────────────────────────────────────────────────────────────────────────────
// 🎒 My Class — the personalized STUDENT panel: greeting, level/XP, class
// leaderboard, achievements and the teacher's published content feed.
// Opening a content item runs the Studio pipeline: Teacher → Nemotron →
// Student (simplified lesson in the child's language with step-flow,
// everyday examples and a takeaway).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLangs, useMode, useUser } from "@/components/providers";
import { adaptPublishedContent, fetchClassContent, fetchLeaderboard, type ClassContentItem, type LeaderboardEntry } from "@/lib/api";
import type { StudioResult, WorksheetResult, FlashcardsResult } from "@/lib/ai/types";
import { getLanguage, isLanguageCode } from "@/lib/languages";
import { makeT } from "@/lib/i18n";
import { useLocalized } from "@/lib/pageLocalize";
import { Badge, Button, Card, EngineBadge, FriendlyError, Spinner } from "@/components/ui";
import { AchievementGrid, GyanuBubble, XpCard } from "@/components/gamification";
import { isTtsSupported, speak } from "@/components/speech";

const MEDALS = ["🥇", "🥈", "🥉"];

function StudioViewer({ item, onClose }: { item: ClassContentItem; onClose: () => void }) {
  const { studentLanguage } = useLangs();
  const { mode } = useMode();
  const t = makeT(studentLanguage);
  const langDef = getLanguage(studentLanguage);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [artifactPayload, setArtifactPayload] = useState(item.payload);

  const isArtifact = item.kind === "worksheet" || item.kind === "flashcards";

  const runAi = async () => {
    if (loading) return;
    if (mode !== "online") {
      setError(t("prepareOnlineOnly"));
      return;
    }
    setLoading(true);
    setError("");
    const res = await adaptPublishedContent(item.id, studentLanguage);
    if (res.ok && res.data?.kind === "lesson" && res.data.preview) {
      setResult(res.data.preview);
    } else if (res.ok && res.data?.kind === "artifact" && res.data.payload) {
      setArtifactPayload(res.data.payload);
    } else {
      const key = res.friendly;
      const friendly = key === "ARTIFACT_NOT_TRANSLATABLE" ? t("artifactNotTranslatable")
        : key === "NOT_FOUND" ? t("contentUnavailable")
          : t("errNetwork");
      setError(friendly);
    }
    setLoading(false);
  };

  // Prefer the teacher-reviewed student-language version saved at publish.
  // If a learner changes their language later, generate a fresh adaptation.
  useEffect(() => {
    setResult(null);
    setError("");
    setArtifactPayload(item.payload);
    const savedVersion = item.payload.studentVersion as StudioResult | undefined;
    if (
      savedVersion &&
      item.payload.studentVersionLanguage === studentLanguage &&
      typeof savedVersion.title === "string" &&
      typeof savedVersion.summary === "string"
    ) {
      setResult(savedVersion);
    } else if (isArtifact && item.payload.studentVersionLanguage === studentLanguage && Object.keys(item.payload).length > 1) {
      setArtifactPayload(item.payload);
    } else if (mode === "online") {
      void runAi();
    } else {
      setError(t("prepareOnlineOnly"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, studentLanguage, mode]);

  const kindLabel = item.kind === "worksheet" ? t("worksheets") : item.kind === "flashcards" ? t("flashcards") :
    item.kind === "link" ? t("uploadLink") : item.kind === "file" ? t("uploadFile") : t("uploadText");

  return (
    <Card className="border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white" title={`📢 ${result?.title ?? t("classContent")}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button onClick={onClose} className="text-xs font-semibold text-indigo-600 hover:underline">
          ← {t("backAll")}
        </button>
        <Badge tone="slate">
          {item.kind === "worksheet" ? "📝" : item.kind === "flashcards" ? "🃏" : item.kind === "link" ? "🔗" : item.kind === "file" ? "📎" : "✍️"}{" "}
          {kindLabel}
        </Badge>
      </div>

      {/* ── AI result (Nemotron pedagogy conversion) ── */}
      {loading && (
        <div className="flex flex-col items-center gap-2 py-8">
          <Spinner label={mode === "online" ? `🧠 ${t("thinking")} ${langDef.name}` : "…"} />
        </div>
      )}

      {!loading && error && (
        <div className="space-y-3">
          <FriendlyError message={error} />
          <Button variant="soft" onClick={() => void runAi()}>
            🔄 {t("tryAgain")}
          </Button>
        </div>
      )}

      {!loading && result && (
        <div className="space-y-4">
          <EngineBadge meta={result} />
          <div className="rounded-xl bg-indigo-50/70 p-3">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-indigo-500">{t("explanation")}</p>
            <p className="text-base font-semibold leading-relaxed text-slate-800">{result.summary}</p>
            {isTtsSupported() && (
              <button onClick={() => speak(result.summary, studentLanguage)} className="mt-2 text-[11px] font-semibold text-indigo-500 hover:underline">
                {t("studioListen")}
              </button>
            )}
          </div>

          {result.steps.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-sky-500">{t("studioSteps")}</p>
              <div className="flex flex-col items-start gap-0">
                {result.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-0">
                    <div className="flex flex-col items-center">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-black text-white shadow">
                        {i + 1}
                      </span>
                      {i < result.steps.length - 1 && <span className="h-4 w-0.5 bg-sky-200" />}
                    </div>
                    <span className="ml-3 rounded-xl bg-sky-50/70 px-3 py-2 text-sm font-medium text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.examples.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">{t("studioExamples")}</p>
              <ul className="space-y-1 text-sm text-slate-700">
                {result.examples.map((e, i) => (
                  <li key={i}>🌱 {e}</li>
                ))}
              </ul>
            </div>
          )}

          {result.takeaway && (
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-600">{t("studioTakeaway")}</p>
              <p className="text-sm font-semibold text-slate-800">{result.takeaway}</p>
            </div>
          )}
          {result.followUp && <p className="text-xs font-semibold text-indigo-600">🤔 {result.followUp}</p>}
        </div>
      )}

      {/* ── Published worksheets/flashcards render instantly ── */}
      {!loading && !error && isArtifact && (
        <PublishedArtifact kind={item.kind} payload={artifactPayload} language={studentLanguage} />
      )}
    </Card>
  );
}

function PublishedArtifact({
  kind,
  payload,
  language,
}: {
  kind: string;
  payload: Record<string, unknown>;
  language: string;
}) {
  const t = makeT(isLanguageCode(language) ? language : "hi");
  if (kind === "worksheet") {
    const ws = payload as unknown as Partial<WorksheetResult>;
    return (
      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-800">{ws.title ?? t("worksheets")}</p>
        {ws.questions?.map((q, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-800">
              {i + 1}. {q.question}
            </p>
            {q.options?.length ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {q.options.map((o, oi) => (
                  <span key={oi} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                    {o}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-1.5 border-b border-dotted border-slate-300 pb-3" />
            )}
          </div>
        ))}
      </div>
    );
  }
  const fc = payload as unknown as Partial<FlashcardsResult>;
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-slate-800">{fc.title ?? t("flashcards")}</p>
      {fc.cards?.map((c, i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-3">
          <p className="text-sm font-black text-slate-900">{c.word}</p>
          <p className="text-xs text-slate-600">{c.meaning}</p>
        </div>
      ))}
    </div>
  );
}

function StudentPanel() {
  const { studentLanguage } = useLangs();
  const { name } = useUser();
  const uiLanguage = studentLanguage;
  const t = makeT(uiLanguage);
  const langDef = getLanguage(studentLanguage);

  const [items, setItems] = useState<ClassContentItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [openItem, setOpenItem] = useState<ClassContentItem | null>(null);

  const sub = useLocalized(t("myClassSub"), uiLanguage);

  useEffect(() => {
    void fetchClassContent().then((res) => {
      if (res.ok) setItems(res.data!);
      setLoaded(true);
    });
    void fetchLeaderboard().then((res) => {
      if (res.ok) setBoard(res.data!);
    });
  }, []);

  const myName = name ? name : "";
  const pageTitle = useLocalized(t("myClass"), uiLanguage);

  return (
    <div className="gs-animate space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-indigo-900">{pageTitle}</h1>
          <p className="text-sm text-slate-500">{sub}</p>
        </div>
        {name && <GyanuBubble text={`${t("classGreeting", { name })} ${t("mascotTip")}`} />}
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <XpCard />
          <Card title={t("rewardsTitle")}>
            <AchievementGrid />
          </Card>
        </div>

        <Card title={t("classLeaderboard")} className="lg:col-span-2">
          {board.length === 0 && <GyanuBubble text={t("leaderboardEmpty")} />}
          <div className="space-y-1.5">
            {board.map((e) => {
              const isMe = name && e.name.toLowerCase() === name.toLowerCase();
              return (
                <div
                  key={e.name + e.rank}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                    isMe ? "border-indigo-300 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="w-8 text-center text-lg font-black">
                    {e.rank <= 3 ? MEDALS[e.rank - 1] : `#${e.rank}`}
                  </span>
                  <span className="flex-1 text-sm font-bold text-slate-800">
                    {e.name} {isMe && <Badge tone="indigo">{t("you")}</Badge>}
                  </span>
                  <Badge tone={e.pct >= 80 ? "emerald" : e.pct >= 50 ? "amber" : "rose"}>{e.pct}%</Badge>
                  <span className="text-xs text-slate-400">
                    ⭐ {e.score}/{e.total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title={t("classFeed")}>
        {!loaded && <Spinner label="…" />}
        {loaded && items.length === 0 && <GyanuBubble text={t("classFeedEmpty")} />}
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((it) => {
            const savedVersion = it.payload.studentVersion as Partial<StudioResult> | undefined;
            const inStudentLanguage = it.payload.studentVersionLanguage === studentLanguage;
            const artifactTitle = typeof it.payload.title === "string" ? it.payload.title : "";
            const studentTitle = inStudentLanguage
              ? (savedVersion?.title || (it.kind === "worksheet" || it.kind === "flashcards" ? artifactTitle : ""))
              : "";
            const kindLabel = it.kind === "worksheet" ? t("worksheets") : it.kind === "flashcards" ? t("flashcards") :
              it.kind === "link" ? t("uploadLink") : it.kind === "file" ? t("uploadFile") : t("uploadText");
            return (
              <button
                key={it.id}
                onClick={() => setOpenItem(it)}
                className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-slate-800">
                    {it.kind === "worksheet" ? "📝" : it.kind === "flashcards" ? "🃏" : it.kind === "link" ? "🔗" : it.kind === "file" ? "📎" : "📢"} {studentTitle || t("classContent")}
                  </span>
                  <Badge tone="slate">{kindLabel}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{inStudentLanguage ? (savedVersion?.summary || t("viewContent")) : t("viewContent")}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-emerald-600">
                  {t("viewContent")} → ({langDef.name})
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {openItem && (
        <div className="gs-animate">
          <StudioViewer item={openItem} onClose={() => setOpenItem(null)} />
        </div>
      )}

      <div className="flex flex-wrap gap-2 pb-2">
        <Link href="/learn" className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-bold text-white shadow">
          {t("learn")} →
        </Link>
        <Link href="/ask" className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
          {t("askAi")} →
        </Link>
      </div>
    </div>
  );
}

export default StudentPanel;
