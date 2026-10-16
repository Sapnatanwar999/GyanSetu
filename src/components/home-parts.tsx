"use client";

// Small status-badge component for the Home page (kept here to avoid a
// circular import between app-shell and ui).
import { Badge } from "@/components/ui";
import type { AiStatus } from "@/components/providers";

export function StatusBadgeMark({
  ok,
  mode,
  status,
}: {
  ok: boolean;
  mode: "online" | "offline";
  status: AiStatus;
}) {
  if (mode === "offline") {
    return <Badge tone="slate">📴 Offline learning mode</Badge>;
  }
  if (!status.configured) {
    return <Badge tone="rose">⚠ Nemotron configuration required</Badge>;
  }
  if (!status.verified) {
    return <Badge tone="amber">⚠ Nemotron temporarily unavailable</Badge>;
  }
  return (
    <Badge tone="indigo">
      🤖 Nemotron AI · Online
      {status.latencyMs > 0 ? ` • ${(status.latencyMs / 1000).toFixed(1)}s` : ""}
    </Badge>
  );
}
