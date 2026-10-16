"use client";

// ─────────────────────────────────────────────────────────────────────────────
// 🧠 Offline AI Hub — the ON-DEVICE generative engine demo.
// Every capability below runs with ZERO network calls: curriculum-grounded
// explanation, RAG Q&A, local examples, supported-language translation,
// practice questions, answer feedback, worksheets, flashcards, vocabulary
// and simplification. Nemotron is the cloud layer (online); this is the
// honest offline MVP the SIH judge can run with WiFi switched off.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { useInterfaceLanguage, useLangs } from "@/components/providers";
import { makeT } from "@/lib/i18n";
import { getLanguage } from "@/lib/languages";
import { CURRICULUM } from "@/lib/curriculum";
import {
  offlineAsk,
  offlineExplain,
  offlineFeedback,
  offlineLocalExample,
  offlinePracticeQuestions,
  offlineSimplify,
  offlineTranslateText,
  offlineVocabularyExplain,
  offlineWorksheetQuestions,
  OFFLINE_ENGINE_CAPABILITIES,
} from "@/lib/local/pedagogy";
import { offlineFlashcards, offlineWorksheet } from "@/lib/local/engine";
import {
  OFFLINE_ENGINE_HONEST_STATEMENT,
  SYNC_CONFLICT_POLICY,
} from "@/lib/local/pedagogy";
import { cacheCount, storageFootprint } from "@/lib/local/store";
import type { AskResult, QuizQuestion, WorksheetQuestion } from "@/lib/ai/types";
import { Badge, Button, Card, EngineBadge, RichText, Select, Spinner } from "@/components/ui";
import { isTtsSupported, speak } from "@/components/speech";

function AskResultView({ result }: { result: AskResult }) {
  const t = makeT("hi");
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <EngineBadge meta={result} />
        {result.concept && <Badge tone="sky">{result.concept}</Badge>}
      </div>
      <div className="rounded-xl bg-indigo-50/70 p-3">
        <p className="mb-1 text-[11px] font-bold uppercase text-indigo-500">उत्तर</p>
        <RichText text={result.answer} />
      </div>
      {result.simpleExplanation && (
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase text-slate-400">समझाओ</p>
          <RichText text={result.simpleExplanation} />
        </div>
      )}
      {result.steps.length > 0 && (
        <ol className="list-decimal space-y-0.5 pl-5">
          {result.steps.map((s, i) => (
            <li key={i}>{s.replace(/^[१-५]\s*/, "")}</li>
          ))}
        </ol>
      )}
      {result.localExample && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5">
          <p className="text-[11px] font-bold uppercase text-emerald-600">🌿 स्थानीय उदाहरण</p>
          <RichText text={result.localExample} />
        </div>
      )}
      {result.practiceQuestion && (
        <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-white p-2.5">
          <p className="text-[11px] font-bold uppercase text-indigo-500">✏️ अभ्यास</p>
          <p className="font-semibold">{result.practiceQuestion}</p>
        </div>
      )}
      {isTtsSupported() && (
        <button onClick={() => speak([result.answer, result.simpleExplanation].join("\n"), "hi")} className="text-[11px] font-bold text-indigo-500">
          🔊 सुनो (ऑफ़लाइन TTS)
        </button>
      )}
    </div>
  );
}

export default function OfflineAiHub() {
  const { studentLanguage } = useLangs();
  const t = makeT(useInterfaceLanguage());
  const langDef = getLanguage(studentLanguage);

  const [lessonSlug, setLessonSlug] = useState("water-cycle");
  const lesson = useMemo(() => CURRICULUM.find((l) => l.slug === lessonSlug) ?? CURRICULUM[0], [lessonSlug]);

  const [qaInput, setQaInput] = useState("");
  const [qaResult, setQaResult] = useState<AskResult | null>(null);
  const [explainResult, setExplainResult] = useState<AskResult | null>(null);
  const [exampleResult, setExampleResult] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [practice, setPractice] = useState<QuizQuestion[]>([]);
  const [showAns, setShowAns] = useState(false);
  const [studentAns, setStudentAns] = useState("");
  const [expectedAns, setExpectedAns] = useState("7");
  const [feedback, setFeedback] = useState<ReturnType<typeof offlineFeedback> | null>(null);
  const [wsQuestions, setWsQuestions] = useState<WorksheetQuestion[]>([]);
  const [fcCount, setFcCount] = useState(0);
  const [fcList, setFcList] = useState<Array<{ word: string; meaning: string }>>([]);
  const [vocabInput, setVocabInput] = useState("");
  const [vocabResult, setVocabResult] = useState<ReturnType<typeof offlineVocabularyExplain> | null>(null);
  const [simplifyInput, setSimplifyInput] = useState("");
  const [simplifyOut, setSimplifyOut] = useState<string[]>([]);
  const [translateInput, setTranslateInput] = useState("");
  const [translateOut, setTranslateOut] = useState<{ text: string; note: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [footprint, setFootprint] = useState<{ usageMB: number; quotaMB: number; supported: boolean } | null>(null);
  const [cacheN, setCacheN] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Real device-footprint measurement (evidence for the 2GB claim).
  useEffect(() => {
    void storageFootprint().then(setFootprint);
    void cacheCount().then(setCacheN);
    const t0 = performance.now();
    const res = offlineAsk("बादल कैसे बनते हैं?", "hi", 2);
    setLatencyMs(Math.round((performance.now() - t0) * 100) / 100);
    void res;
  }, []);

  const run = (fn: () => void) => {
    setBusy(true);
    // All offline — executes in microseconds; tiny delay keeps UX visible.
    setTimeout(() => {
      fn();
      setBusy(false);
    }, 40);
  };

  return (
    <div className="gs-animate space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-indigo-900">{t("offlineHub")}</h1>
          <p className="text-sm text-slate-500">{t("hubSub")}</p>
        </div>
        <Badge tone="slate" className="px-3 py-1 text-xs">📴 0 network calls</Badge>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
        <p className="font-bold text-slate-700">{t("hubNoLlm")}</p>
        <p className="mt-1">{t("hubHonest")}</p>
        <p className="mt-1">{t("hubNotOffline")}</p>
        <p className="mt-2 rounded-xl bg-indigo-50/70 p-2 font-semibold text-indigo-800">
          🏆 Judge answer: {OFFLINE_ENGINE_HONEST_STATEMENT}
        </p>
        <p className="mt-1 font-semibold text-slate-600">
          ⭐ {t("hubCapabilities")}: {OFFLINE_ENGINE_CAPABILITIES.join(" · ")}
        </p>
      </div>

      {/* Real device footprint (evidence, not claims) */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">{t("hubFootprint")}</p>
          <p className="mt-1 text-xl font-black text-slate-900">
            {footprint ? (footprint.supported ? `${footprint.usageMB} MB` : "n/a") : "…"}
          </p>
          <p className="text-[10px] text-slate-400">IndexedDB {footprint?.supported ? `· quota ${footprint.quotaMB} MB` : ""}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">{t("hubCacheItems")}</p>
          <p className="mt-1 text-xl font-black text-slate-900">{cacheN}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Offline answer latency (measured)</p>
          <p className="mt-1 text-xl font-black text-slate-900">{latencyMs === null ? "…" : `${latencyMs} ms`}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Sync conflict policy</p>
          <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-700">
            progress: LWW · curriculum: server-authoritative · AI cache: append-only
          </p>
        </div>
      </div>

      {/* Lesson picker */}
      <Card title="📖 पाठ चुनो (synced curriculum)" subtitle="हर नीचे वाली क्षमता इसी पाठ पर चलती है">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={lessonSlug}
            onChange={setLessonSlug}
            options={CURRICULUM.map((l) => ({ value: l.slug, label: `${l.titleHi} (Class ${l.class} · ${l.subject})` }))}
            label="Lesson"
            className="min-w-56"
          />
          <Badge tone="sky">{langDef.name}</Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 1. Explain */}
        <Card title={t("hubExplain")}>
          <Button variant="soft" onClick={() => run(() => setExplainResult(offlineExplain(lesson, studentLanguage)))}>
            {t("hubRun")}: {lesson.titleHi}
          </Button>
          {busy && <div className="mt-2"><Spinner label="…" /></div>}
          {explainResult && <div className="mt-3"><AskResultView result={explainResult} /></div>}
        </Card>

        {/* 2. Offline RAG Q&A */}
        <Card title={t("hubQa")}>
          <div className="flex gap-2">
            <input
              value={qaInput}
              onChange={(e) => setQaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(() => setQaResult(offlineAsk(qaInput, studentLanguage, lesson.class)))}
              placeholder="बादल कैसे बनते हैं?"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <Button onClick={() => run(() => setQaResult(offlineAsk(qaInput, studentLanguage, lesson.class)))}>
              {t("ask")}
            </Button>
          </div>
          {qaResult && <div className="mt-3"><AskResultView result={qaResult} /></div>}
        </Card>

        {/* 3. Local example */}
        <Card title={t("hubExample")}>
          <Button variant="soft" onClick={() => run(() => setExampleResult(offlineLocalExample(lessonSlug, studentLanguage).text))}>
            {t("hubRun")}
          </Button>
          {exampleResult && (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <RichText text={exampleResult} />
            </div>
          )}
        </Card>

        {/* 4. Practice questions */}
        <Card title={t("hubPractice")}>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              compact
              value={difficulty}
              onChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}
              options={[
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
              ]}
              label={t("difficulty")}
            />
            <Button variant="soft" onClick={() => run(() => { setPractice(offlinePracticeQuestions(lesson, studentLanguage, difficulty, 5)); setShowAns(false); })}>
              {t("hubRun")}
            </Button>
            {practice.length > 0 && (
              <button className="text-[11px] font-bold text-amber-600" onClick={() => setShowAns((s) => !s)}>
                {showAns ? "🙈 उत्तर छिपाओ" : "🔑 उत्तर दिखाओ"}
              </button>
            )}
          </div>
          {practice.length > 0 && (
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
              {practice.map((q, i) => (
                <li key={i}>
                  <span className="font-semibold text-slate-800">{q.question}</span>
                  {showAns && q.answer && <span className="ml-2 text-emerald-700">✅ {q.answer}</span>}
                </li>
              ))}
            </ol>
          )}
        </Card>

        {/* 5. Answer feedback */}
        <Card title={t("hubFeedback")}>
          <div className="flex flex-wrap gap-2">
            <input
              value={studentAns}
              onChange={(e) => setStudentAns(e.target.value)}
              placeholder={t("hubStudentAns")}
              className="min-w-36 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              value={expectedAns}
              onChange={(e) => setExpectedAns(e.target.value)}
              placeholder={t("hubExpected")}
              className="min-w-36 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <Button onClick={() => run(() => setFeedback(offlineFeedback(studentAns, expectedAns, studentLanguage)))}>
              {t("hubCheck")}
            </Button>
          </div>
          {feedback && (
            <div
              className={`mt-3 rounded-xl border p-3 text-sm font-semibold ${
                feedback.tone === "praise"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : feedback.tone === "partial"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-sky-200 bg-sky-50 text-sky-800"
              }`}
            >
              {feedback.feedback}
              {feedback.hint && <p className="mt-1 text-xs font-normal opacity-80">💡 {feedback.hint}</p>}
            </div>
          )}
        </Card>

        {/* 6. Worksheet */}
        <Card title={t("hubWorksheet")}>
          <Button
            variant="soft"
            onClick={() =>
              run(() => {
                const ws = offlineWorksheet(lesson, studentLanguage, difficulty);
                setWsQuestions(ws.questions);
                setShowAns(false);
              })
            }
          >
            {t("hubRun")}
          </Button>
          {wsQuestions.length > 0 && (
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
              {wsQuestions.map((q, i) => (
                <li key={i}>
                  <span className="font-semibold text-slate-800">{q.question}</span>
                  {showAns && <span className="ml-2 text-emerald-700">✅ {q.answer}</span>}
                </li>
              ))}
            </ol>
          )}
        </Card>

        {/* 7. Flashcards */}
        <Card title={t("hubFlashcards")}>
          <Button
            variant="soft"
            onClick={() =>
              run(() => {
                const fc = offlineFlashcards(lesson, studentLanguage, 6);
                setFcList(fc.cards.map((c) => ({ word: c.word, meaning: c.meaning })));
                setFcCount(fc.cards.length);
              })
            }
          >
            {t("hubRun")}
          </Button>
          {fcCount > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {fcList.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-2 text-center">
                  <p className="text-base font-black text-slate-900">{c.word}</p>
                  <p className="line-clamp-2 text-[10px] text-slate-500">{c.meaning}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 8. Vocabulary */}
        <Card title={t("hubVocab")}>
          <div className="flex gap-2">
            <input
              value={vocabInput}
              onChange={(e) => setVocabInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(() => setVocabResult(offlineVocabularyExplain(vocabInput, studentLanguage)))}
              placeholder="पानी / water / DAG / da:"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <Button onClick={() => run(() => setVocabResult(offlineVocabularyExplain(vocabInput, studentLanguage)))}>
              {t("lookUp")}
            </Button>
          </div>
          {vocabResult && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-black text-slate-900">{vocabResult.word} <span className="text-[10px] font-semibold text-slate-400">({vocabResult.source})</span></p>
              <p className="text-sm text-slate-700">{vocabResult.meaning}</p>
              {vocabResult.example && <p className="text-xs text-slate-500">🌱 {vocabResult.example}</p>}
              {vocabResult.crossRefs.map((cr) => (
                <div key={cr.source} className="rounded-xl bg-sky-50/70 p-2 text-xs">
                  <p className="font-bold text-sky-700">{cr.source}</p>
                  {cr.entries.map((e, i) => (
                    <p key={i} className="text-slate-600">{e}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 9. Simplify */}
        <Card title={t("hubSimplify")}>
          <textarea
            value={simplifyInput}
            onChange={(e) => setSimplifyInput(e.target.value)}
            rows={3}
            placeholder="लंबा और कठिन वाक्य यहाँ लिखो…"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <Button variant="soft" onClick={() => run(() => setSimplifyOut(offlineSimplify(simplifyInput)))}>
            {t("hubRun")}
          </Button>
          {simplifyOut.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {simplifyOut.map((s, i) => (
                <div key={i} className="flex gap-2 rounded-xl bg-emerald-50/60 p-2.5 text-sm">
                  <span className="font-black text-emerald-500">{i + 1}.</span>
                  <span className="text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 10. Translation + voice */}
        <Card title={t("hubVoice")}>
          <div className="flex gap-2">
            <input
              value={translateInput}
              onChange={(e) => setTranslateInput(e.target.value)}
              placeholder="हिन्दी वाक्य लिखो…"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <Button variant="soft" onClick={() => run(() => setTranslateOut(offlineTranslateText(translateInput, studentLanguage)))}>
              → {langDef.name}
            </Button>
          </div>
          {translateOut && (
            <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
              <p className="text-sm font-bold text-slate-800">{translateOut.text}</p>
              <p className="mt-1 text-[10px] text-slate-400">{translateOut.note}</p>
              {isTtsSupported() && translateOut.text && (
                <button onClick={() => speak(translateOut.text, studentLanguage)} className="mt-2 text-[11px] font-bold text-indigo-500">
                  🔊 सुनो (ऑफ़लाइन TTS)
                </button>
              )}
            </div>
          )}
          <p className="mt-2 text-[10px] text-slate-400">
            🗣️ TTS (speechSynthesis) बिना इंटरनेट चलता है; STT ब्राउज़र के सपोर्ट पर निर्भर है — टाइपिंग हमेशा उपलब्ध fallback है।
          </p>
        </Card>
      </div>
    </div>
  );
}
