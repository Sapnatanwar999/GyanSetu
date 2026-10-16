"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Magic Classroom / Live Meet — Zoom-style bidirectional classroom with
// CROSS-VIEW CAMERA:
//
//   👩‍🏫 Teacher tile  → shows the STUDENT's camera (what the teacher sees)
//                      + small self-view (teacher's own camera).
//   🧑‍🎓 Student tile   → shows the TEACHER's camera (what the student sees)
//                      + small self-view (student's own camera).
//
// Each side can pick its own camera device (🎥). Voice/text runs both ways:
// Teacher speaks Hindi → Nemotron → student hears mother tongue (text + TTS);
// Student speaks mother tongue → Nemotron → teacher hears Hindi (text + TTS).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, type RefObject } from "react";
import { useInterfaceLanguage, useLangs, useMode } from "@/components/providers";
import { runAiOp } from "@/lib/api";
import type { TranslateResult } from "@/lib/ai/types";
import { getLanguage, LANGUAGE_LIST, type LanguageCode } from "@/lib/languages";
import { makeT } from "@/lib/i18n";
import { Badge, Button, Card, EngineBadge, FriendlyError, Select } from "@/components/ui";
import { AwardChip } from "@/components/gamification";
import { recordBridge } from "@/lib/gamification";
import {
  isSpeechRecognitionSupported,
  isTtsSupported,
  speak,
  startSpeechInput,
  stopSpeaking,
} from "@/components/speech";
import { useLocalized } from "@/lib/pageLocalize";

// ── Camera hook (produces TWO video surfaces: main view + self PiP) ─────────
function useCamera(): {
  mainVideoRef: RefObject<HTMLVideoElement | null>;
  selfVideoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  error: boolean;
  devices: MediaDeviceInfo[];
  deviceId: string;
  toggle: () => void;
  choose: (deviceId: string) => void;
} {
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const selfVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");

  const refreshDevices = () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then((list) => setDevices(list.filter((d) => d.kind === "videoinput")))
      .catch(() => undefined);
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setEnabled(false);
    setError(false);
  };

  const start = (chosenId?: string) => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(true);
      return;
    }
    const constraints: MediaStreamConstraints = {
      video: chosenId ? { deviceId: { exact: chosenId } } : true,
      audio: false,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream;
        setEnabled(true);
        setError(false);
        refreshDevices();
      })
      .catch(() => {
        setError(true);
        setEnabled(false);
      });
  };

  const toggle = () => {
    if (streamRef.current) stop();
    else start(deviceId || undefined);
  };

  const choose = (chosen: string) => {
    setDeviceId(chosen);
    if (streamRef.current) {
      stop();
      start(chosen);
    }
  };

  // Attach the stream to BOTH surfaces (main + PiP) whenever it changes.
  useEffect(() => {
    if (enabled && streamRef.current) {
      if (mainVideoRef.current) mainVideoRef.current.srcObject = streamRef.current;
      if (selfVideoRef.current) selfVideoRef.current.srcObject = streamRef.current;
    }
  }, [enabled]);

  useEffect(() => {
    refreshDevices();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { mainVideoRef, selfVideoRef, enabled, error, devices, deviceId, toggle, choose };
}

// ── Zoom-style participant tile (remote camera as main view + self PiP) ─────
function ParticipantTile({
  icon,
  name,
  sub,
  remoteCam, // the OTHER participant's camera — main view
  selfCam, // THIS participant's camera — PiP + controls
  camLabel,
  micListening,
  micLabel,
  onMic,
  text,
  setText,
  onSend,
  sendDisabled,
  sendLabel,
  placeholder,
  t,
}: {
  icon: string;
  name: string;
  sub: string;
  remoteCam: ReturnType<typeof useCamera>;
  selfCam: ReturnType<typeof useCamera>;
  camLabel: string;
  micListening: boolean;
  micLabel: string;
  onMic: () => void;
  text: string;
  setText: (v: string) => void;
  onSend: () => void;
  sendDisabled: boolean;
  sendLabel: string;
  placeholder: string;
  t: (k: Parameters<ReturnType<typeof makeT>>[0]) => string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      {/* Video area: REMOTE camera (who this participant is watching) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        {remoteCam.enabled ? (
          <video ref={remoteCam.mainVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
            <span className="text-5xl">{icon}</span>
            <span className="text-xs">{remoteCam.error ? "🎥 —" : "🎥 off"}</span>
          </div>
        )}

        {/* Self PiP (bottom-left) */}
        {selfCam.enabled && (
          <video
            ref={selfCam.selfVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-12 left-2 h-20 w-28 rounded-lg border border-white/40 object-cover shadow-lg"
          />
        )}

        {/* Name bar */}
        <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
          {icon} {name}
        </div>
        {micListening && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-bold text-white gs-mic-live">
            🎤
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute inset-x-0 bottom-2 flex flex-wrap justify-center gap-2 px-2">
          <button
            onClick={onMic}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold shadow ${
              micListening ? "bg-rose-600 text-white" : "bg-white/90 text-slate-800 hover:bg-white"
            }`}
          >
            {micListening ? "⏹️" : "🎤"} {micLabel}
          </button>
          <button
            onClick={selfCam.toggle}
            className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow hover:bg-white"
          >
            {selfCam.enabled ? "📷 ✓" : camLabel}
          </button>
          {selfCam.devices.length > 1 && (
            <select
              value={selfCam.deviceId}
              onChange={(e) => selfCam.choose(e.target.value)}
              title={t("camSelect")}
              className="rounded-full bg-white/90 px-2 py-1.5 text-[11px] font-bold text-slate-800 shadow"
            >
              <option value="">🎥 {t("camSelect")}</option>
              {selfCam.devices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  🎥 Camera {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Text input */}
      <div className="flex gap-2 border-t border-slate-700 p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-sky-500"
        />
        <button
          onClick={onSend}
          disabled={sendDisabled}
          className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-40"
        >
          {sendLabel}
        </button>
      </div>
      <p className="px-3 pb-2 text-[10px] text-slate-400">{sub}</p>
    </div>
  );
}

interface LogEntry {
  id: number;
  from: "teacher" | "student";
  original: string;
  translated: string;
  fromLang: string;
  toLang: string;
  meta?: TranslateResult;
}

export default function ClassroomPanel() {
  const { mode } = useMode();
  const { teacherLanguage, setTeacherLanguage, studentLanguage, setStudentLanguage } = useLangs();
  const uiLanguage = useInterfaceLanguage();
  const t = makeT(uiLanguage);

  const teacherCam = useCamera();
  const studentCam = useCamera();

  const [log, setLog] = useState<LogEntry[]>([]);
  const [teacherText, setTeacherText] = useState("");
  const [studentText, setStudentText] = useState("");
  const [listening, setListening] = useState<null | "teacher" | "student">(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [award, setAward] = useState(0);
  const [awardNonce, setAwardNonce] = useState(0);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const teacherDef = getLanguage(teacherLanguage);
  const studentDef = getLanguage(studentLanguage);
  const pageHint = useLocalized(t("meetBannerText"), uiLanguage);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const pushEntry = (from: "teacher" | "student", original: string, translated: string, meta?: TranslateResult) => {
    setLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        from,
        original,
        translated,
        fromLang: from === "teacher" ? teacherDef.name : studentDef.name,
        toLang: from === "teacher" ? studentDef.name : teacherDef.name,
        meta,
      },
    ]);
  };

  const translateAndLog = async (from: "teacher" | "student", text: string): Promise<TranslateResult | null> => {
    const payload =
      from === "teacher"
        ? { text, teacherLanguage, studentLanguage }
        : { text, teacherLanguage: studentLanguage, studentLanguage: teacherLanguage };
    const res = await runAiOp<TranslateResult>("translate", payload, mode);
    if (res.ok && res.data) {
      const target = from === "teacher" ? studentLanguage : teacherLanguage;
      pushEntry(from, text, res.data.translation, res.data);
      if (autoSpeak && isTtsSupported()) speak(res.data.translation, target);
      const gained = recordBridge();
      setAward(gained);
      setAwardNonce((n) => n + 1);
      return res.data;
    }
    setError(res.friendly ?? "Translation failed. Please try again.");
    return null;
  };

  const sendFromTeacher = async () => {
    const txt = teacherText.trim();
    if (!txt || busy) return;
    setBusy(true);
    setTeacherText("");
    await translateAndLog("teacher", txt);
    setBusy(false);
  };

  const sendFromStudent = async () => {
    const txt = studentText.trim();
    if (!txt || busy) return;
    setBusy(true);
    setStudentText("");
    await translateAndLog("student", txt);
    setBusy(false);
  };

  const toggleMic = (side: "teacher" | "student") => {
    if (listening) {
      recRef.current?.stop();
      recRef.current = null;
      setListening(null);
      return;
    }
    if (!isSpeechRecognitionSupported()) {
      setError(t("classMicFail"));
      return;
    }
    const lang = side === "teacher" ? teacherLanguage : studentLanguage;
    const handle = startSpeechInput(
      lang,
      (text) => {
        setListening(null);
        recRef.current = null;
        void (async () => {
          setBusy(true);
          await translateAndLog(side, text);
          setBusy(false);
        })();
      },
      () => {
        setListening(null);
        recRef.current = null;
      },
    );
    if (!handle) {
      setError(t("classMicStartFail"));
      return;
    }
    recRef.current = handle;
    setListening(side);
  };

  const micLabel = (side: "teacher" | "student") => (side === "teacher" ? teacherDef.name : studentDef.name);

  return (
    <div className="space-y-4">
      {/* Zoom-style meeting shell */}
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-3 shadow-xl sm:p-4">
        {/* Top bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
            </span>
            <span className="text-sm font-black text-white">{t("meetBanner")}</span>
            <Badge tone="slate" className="border-white/20 bg-white/10 text-white">
              {mode === "online" ? "🧠 Nemotron bridge" : "📴 Offline bridge"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
              {t("autoSpeak")}
            </label>
            <a href="/teacher" className="rounded-full bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-700">
              {t("leaveCall")}
            </a>
          </div>
        </div>

        {/* Two tiles — cross-view cameras */}
        <div className="grid gap-3 lg:grid-cols-2">
          {/* Teacher tile: main = STUDENT's camera, PiP = teacher's own */}
          <ParticipantTile
            icon="👩‍🏫"
            name={t("teacher")}
            sub={`${t("teacherLang")}: ${teacherDef.name} → ${t("hears")} ${studentDef.name}`}
            remoteCam={studentCam}
            selfCam={teacherCam}
            camLabel={t("camOff")}
            micListening={listening === "teacher"}
            micLabel={micLabel("teacher")}
            onMic={() => toggleMic("teacher")}
            text={teacherText}
            setText={setTeacherText}
            onSend={() => void sendFromTeacher()}
            sendDisabled={busy || !teacherText.trim()}
            sendLabel={t("sendClass")}
            placeholder={`${teacherDef.name} में लिखो या बोलो…`}
            t={t}
          />
          {/* Student tile: main = TEACHER's camera, PiP = student's own */}
          <ParticipantTile
            icon="🧑‍🎓"
            name={t("classStudent")}
            sub={`${t("studentLang")}: ${studentDef.name} → ${t("hears")} ${teacherDef.name}`}
            remoteCam={teacherCam}
            selfCam={studentCam}
            camLabel={t("camOff")}
            micListening={listening === "student"}
            micLabel={micLabel("student")}
            onMic={() => toggleMic("student")}
            text={studentText}
            setText={setStudentText}
            onSend={() => void sendFromStudent()}
            sendDisabled={busy || !studentText.trim()}
            sendLabel={t("sendClass")}
            placeholder={`${studentDef.name} में लिखो या बोलो…`}
            t={t}
          />
        </div>

        {/* Language selectors + status */}
        <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
          <Select
            compact
            value={teacherLanguage}
            onChange={(v) => setTeacherLanguage(v as LanguageCode)}
            options={LANGUAGE_LIST.map((l) => ({ value: l.code, label: l.nativeName }))}
            label={`👩‍🏫 ${t("teacherLang")}`}
          />
          <Select
            compact
            value={studentLanguage}
            onChange={(v) => setStudentLanguage(v as LanguageCode)}
            options={LANGUAGE_LIST.map((l) => ({ value: l.code, label: l.nativeName }))}
            label={`🧑‍🎓 ${t("studentLang")}`}
          />
          {award > 0 && <AwardChip key={awardNonce} xp={award} />}
          {busy && <span className="text-[11px] font-semibold text-sky-400">🧠 Nemotron अनुवाद कर रहा है…</span>}
          <span className="text-[10px] text-slate-500">{pageHint}</span>
        </div>
      </div>

      {error && (
        <div className="gs-no-print">
          <FriendlyError message={error} />
        </div>
      )}

      {/* Conversation log */}
      <Card title={t("conversationLog")} subtitle={t("meetBannerText")}>
        <div ref={logRef} className="max-h-72 space-y-2 overflow-y-auto">
          {log.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">
              💬 {t("classEmpty", { lang: studentDef.name })} — दोनों तरफ़ से बात करो: शिक्षक ↔ विद्यार्थी।
            </p>
          )}
          {log.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-xl border p-3 ${
                entry.from === "teacher" ? "border-amber-200 bg-amber-50/60" : "border-indigo-200 bg-indigo-50/60"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={entry.from === "teacher" ? "amber" : "indigo"}>
                  {entry.from === "teacher" ? `👩‍🏫 ${t("teacherSays")}` : `🧑‍🎓 ${t("studentSays")}`}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  {entry.fromLang} → {entry.toLang}
                </span>
                {entry.meta && <EngineBadge meta={entry.meta} />}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">“{entry.original}”</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{entry.translated}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
