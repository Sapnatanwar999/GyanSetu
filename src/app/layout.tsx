import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import AppShell from "@/components/app-shell";
import { getLanguage, isLanguageCode } from "@/lib/languages";

export const metadata: Metadata = {
  title: "GyanSetu ज्ञानसेतु — AI-Powered Vernacular Pedagogy (SIH 26042)",
  description:
    "One Classroom. Many Mother Tongues. One Learning Bridge. Nemotron-powered mother-tongue primary education for Jharkhand PALASH MTB-MLE.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GyanSetu",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("gyansetu-role")?.value;
  const selectedLanguage = cookieStore.get(
    role === "teacher" ? "gyansetu-teacher-lang" : "gyansetu-student-lang",
  )?.value;
  const htmlLang = isLanguageCode(selectedLanguage)
    ? getLanguage(selectedLanguage).htmlLang
    : getLanguage("sat").htmlLang;

  return (
    <html lang={htmlLang}>
      <body className="bg-slate-100 text-slate-900 antialiased">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
