import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2, Loader2, Eye, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { STATUS_OPTIONS, statusLabel, statusStyle } from "@/lib/contact-status";

type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: string;
  source: string | null;
  created_at: string;
  updated_at: string;
};

type HistoryRow = {
  id: string;
  from_status: string | null;
  to_status: string;
  note: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const Route = createFileRoute("/_authenticated/admin/contact-management")({
  component: AdminContactManagementPage,
});

function AdminContactManagementPage() {
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [viewing, setViewing] = useState<SubmissionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubmissionRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id,name,email,phone,company,subject,message,status,source,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setLoadError(!!error);
    setRows((data as SubmissionRow[]) ?? []);
    setLoading(false);
  };

  const loadHistory = async (submissionId: string) => {
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("contact_status_history")
      .select("id,from_status,to_status,note,created_at,profiles(full_name,email)")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load history", { description: error.message });
    setHistory((data ?? []) as unknown as HistoryRow[]);
    setHistoryLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (viewing) loadHistory(viewing.id);
    else setHistory([]);
  }, [viewing?.id]);

  const handleStatusChange = async (row: SubmissionRow, next: string) => {
    if (next === row.status) return;
    setUpdatingId(row.id);
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: next })
      .eq("id", row.id);
    setUpdatingId(null);
    if (error) {
      toast.error("Status update failed", { description: error.message });
      return;
    }
    toast.success("Status updated");
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
    if (viewing?.id === row.id) {
      setViewing({ ...viewing, status: next });
      loadHistory(row.id);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("contact_submissions").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    toast.success("Enquiry deleted");
    setRows((prev) => prev.filter((r) => r.id !== target.id));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);
  const filtering = search.trim() !== "" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Management</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading
              ? "Loading…"
              : `${filtered.length}${filtering ? ` of ${rows.length}` : ""} enquir${
                  rows.length === 1 ? "y" : "ies"
                }`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          aria-label="Search enquiries by name"
          className="bg-zinc-900 border-zinc-800 w-full sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="h-9 w-[180px] border-zinc-800 bg-zinc-900 text-sm text-slate-200"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Company</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Phone</TableHead>
              <TableHead className="text-slate-400">Subject</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Created</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Loading enquiries…
                </TableCell>
              </TableRow>
            )}
            {!loading && loadError && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  <p className="mb-3">Couldn't load enquiries.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={load}
                    className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {!loading && !loadError && rows.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  No enquiries yet.
                </TableCell>
              </TableRow>
            )}
            {!loading && !loadError && rows.length > 0 && filtered.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  No enquiries match your search or filter.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-white font-medium">{r.name}</TableCell>
                <TableCell className="text-slate-300">{r.company ?? "—"}</TableCell>
                <TableCell className="text-slate-300">
                  <a href={`mailto:${r.email}`} className="text-cyan-400 hover:text-cyan-300">
                    {r.email}
                  </a>
                </TableCell>
                <TableCell className="text-slate-300">{r.phone ?? "—"}</TableCell>
                <TableCell className="text-slate-300 max-w-xs">
                  <div className="truncate" title={r.subject ?? ""}>
                    {r.subject ?? "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={r.status}
                    onValueChange={(v) => handleStatusChange(r, v)}
                    disabled={updatingId === r.id}
                  >
                    <SelectTrigger
                      className={
                        "h-8 w-[140px] border-zinc-700 bg-zinc-950 text-xs font-medium " +
                        statusStyle(r.status)
                      }
                    >
                      <SelectValue>{statusLabel(r.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-slate-400 text-xs whitespace-nowrap">
                  {formatDate(r.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                      onClick={() => setViewing(r)}
                      aria-label={`View enquiry from ${r.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => setDeleteTarget(r)}
                      aria-label={`Delete enquiry from ${r.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              {viewing && formatDate(viewing.created_at)}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" value={viewing.name} />
                <Field label="Company" value={viewing.company ?? "—"} />
                <Field
                  label="Email"
                  value={
                    <a
                      href={`mailto:${viewing.email}`}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {viewing.email}
                    </a>
                  }
                />
                <Field label="Phone" value={viewing.phone ?? "—"} />
                <Field label="Subject" value={viewing.subject ?? "—"} />
                <Field label="Source" value={viewing.source ?? "—"} />
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Status</div>
                <Select
                  value={viewing.status}
                  onValueChange={(v) => handleStatusChange(viewing, v)}
                  disabled={updatingId === viewing.id}
                >
                  <SelectTrigger
                    className={
                      "h-9 w-[180px] border-zinc-700 bg-zinc-950 text-sm font-medium " +
                      statusStyle(viewing.status)
                    }
                  >
                    <SelectValue>{statusLabel(viewing.status)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Message</div>
                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 text-sm text-slate-200 whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Status History
                </div>
                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 text-sm">
                  {historyLoading ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading history…
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-slate-500">No status changes yet.</div>
                  ) : (
                    <ol className="space-y-3">
                      {history.map((h) => (
                        <li key={h.id} className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={
                                "rounded px-2 py-0.5 text-xs font-medium " +
                                statusStyle(h.from_status ?? "")
                              }
                            >
                              {h.from_status ? statusLabel(h.from_status) : "—"}
                            </span>
                            <span className="text-slate-500">→</span>
                            <span
                              className={
                                "rounded px-2 py-0.5 text-xs font-medium " +
                                statusStyle(h.to_status)
                              }
                            >
                              {statusLabel(h.to_status)}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatDate(h.created_at)} ·{" "}
                            {h.profiles?.full_name || h.profiles?.email || "System"}
                          </div>
                          {h.note && <div className="text-xs text-slate-300">{h.note}</div>}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete the enquiry from{" "}
              <span className="text-slate-200">{deleteTarget?.name}</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-slate-200 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</div>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  );
}
