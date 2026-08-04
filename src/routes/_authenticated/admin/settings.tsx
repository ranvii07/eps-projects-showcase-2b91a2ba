import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

// Site Settings — the boolean feature toggles in public.site_settings
// (migration 20260803010000). Deliberately generic: the page renders whatever
// rows exist, using each row's own label and description, so a future toggle is
// a single INSERT with no change here. Nothing is created or deleted from the
// CMS, because a toggle only means something if code reads its key.
type SettingRow = {
  key: string;
  enabled: boolean;
  label: string;
  description: string | null;
  sort_order: number;
};

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  // Keyed by setting key so two toggles can be in flight without fighting over
  // one shared "saving" flag.
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("key,enabled,label,description,sort_order")
      .order("sort_order", { ascending: true })
      .order("key", { ascending: true });
    setLoadError(!!error);
    setRows((data as SettingRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (row: SettingRow, next: boolean) => {
    setSaving((s) => ({ ...s, [row.key]: true }));
    // Optimistic, so the switch doesn't lag behind the pointer; reverted below
    // if the write is rejected (e.g. the session lost its staff role).
    setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, enabled: next } : r)));
    const { error } = await supabase
      .from("site_settings")
      .update({ enabled: next })
      .eq("key", row.key);
    setSaving((s) => ({ ...s, [row.key]: false }));
    if (error) {
      setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, enabled: !next } : r)));
      toast.error("Could not save the setting", { description: error.message });
      return;
    }
    toast.success(`${row.label} ${next ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading
              ? "Loading…"
              : `${rows.length} setting${rows.length === 1 ? "" : "s"} — changes take effect on the public site immediately`}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={load}
          disabled={loading}
          className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 divide-y divide-zinc-800 p-0 overflow-hidden">
        {loading && (
          <div className="text-center text-slate-500 py-10">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Loading settings…
          </div>
        )}

        {!loading && loadError && (
          <div className="text-center text-slate-500 py-10">
            <p className="mb-3">Couldn't load site settings.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={load}
              className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {!loading && !loadError && rows.length === 0 && (
          <div className="text-center text-slate-500 py-10">No site settings are defined.</div>
        )}

        {!loading &&
          !loadError &&
          rows.map((row) => (
            <div
              key={row.key}
              className="flex items-start justify-between gap-6 p-5"
              data-testid={`site-setting-${row.key}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-white font-medium">{row.label}</h2>
                  <span className="font-mono text-xs text-cyan-400 bg-zinc-950 px-2 py-1 rounded">
                    {row.key}
                  </span>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                      (row.enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-700/40 text-zinc-400")
                    }
                  >
                    {row.enabled ? "On" : "Off"}
                  </span>
                </div>
                {row.description && (
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">{row.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 pt-1">
                {saving[row.key] && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                <Switch
                  checked={row.enabled}
                  disabled={!!saving[row.key]}
                  onCheckedChange={(next) => void toggle(row, next)}
                  aria-label={row.label}
                />
              </div>
            </div>
          ))}
      </Card>
    </div>
  );
}
