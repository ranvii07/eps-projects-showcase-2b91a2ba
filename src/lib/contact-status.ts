export const STATUS_OPTIONS = ["new", "in_progress", "resolved", "spam", "archived"] as const;

export type ContactStatus = (typeof STATUS_OPTIONS)[number];

export const STATUS_STYLES: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400",
  in_progress: "bg-amber-500/10 text-amber-400",
  resolved: "bg-emerald-500/10 text-emerald-400",
  spam: "bg-red-500/10 text-red-400",
  archived: "bg-zinc-700/40 text-zinc-400",
};

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusStyle(s: string) {
  return STATUS_STYLES[s] ?? "text-slate-200";
}
