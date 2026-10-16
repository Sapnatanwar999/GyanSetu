"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /live — the Live Classroom (Teacher ⟺ Student voice bridge) as its own page.
// ─────────────────────────────────────────────────────────────────────────────
import ClassroomPanel from "@/components/classroom";
import { StatusBadge } from "@/components/app-shell";
import { useInterfaceLanguage } from "@/components/providers";
import { makeT } from "@/lib/i18n";
import { useLocalized } from "@/lib/pageLocalize";

export default function LivePage() {
  const uiLanguage = useInterfaceLanguage();
  const t = makeT(uiLanguage);
  const pageTitle = useLocalized(t("liveMeet"), uiLanguage);
  const pageSub = useLocalized(t("meetBannerText"), uiLanguage);

  return (
    <div className="gs-animate space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-indigo-900">{pageTitle}</h1>
          <p className="text-sm text-slate-500">{pageSub}</p>
        </div>
        <StatusBadge compact />
      </header>
      <div className="mb-2 flex flex-wrap items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
        </span>
        <b className="text-rose-700">{t("meetBanner")}</b>
      </div>
      <ClassroomPanel />
    </div>
  );
}
