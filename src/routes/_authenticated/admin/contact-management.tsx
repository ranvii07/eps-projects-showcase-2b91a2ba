import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

const STATUS_OPTIONS = ["new", "in_progress", "resolved", "spam", "archived"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400",
  in_progress: "bg-amber-500/10 text-amber-400",
  resolved: "bg-emerald-500/10 text-emerald-400",
  spam: "bg-red-500/10 text-red-400",
  archived: "bg-zinc-700/40 text-zinc-400",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

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
  const [viewing, setViewing] = useState<SubmissionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubmissionRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id,name,email,phone,company,subject,message,status,source,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setRows((data as SubmissionRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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
    if (viewing?.id === row.id) setViewing({ ...viewing, status: next });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    toast.success("Enquiry deleted");
    setRows((prev) => prev.filter((r) => r.id !== target.id));
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Management</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading
              ? "Loading…"
              : `${count} enquir${count === 1 ? "y" : "ies"}`}
          </p>
        </div>
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
            {!loading && rows.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  No enquiries yet.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-white font-medium">{r.name}</TableCell>
                <TableCell className="text-slate-300">{r.company ?? "—"}</TableCell>
                <TableCell className="text-slate-300">
                  <a
                    href={`mailto:${r.email}`}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
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
                        (STATUS_STYLES[r.status] ?? "text-slate-200")
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
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => setDeleteTarget(r)}
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
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Status
                </div>
                <Select
                  value={viewing.status}
                  onValueChange={(v) => handleStatusChange(viewing, v)}
                  disabled={updatingId === viewing.id}
                >
                  <SelectTrigger
                    className={
                      "h-9 w-[180px] border-zinc-700 bg-zinc-950 text-sm font-medium " +
                      (STATUS_STYLES[viewing.status] ?? "text-slate-200")
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
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Message
                </div>
                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 text-sm text-slate-200 whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete the enquiry from{" "}
              <span className="text-slate-200">{deleteTarget?.name}</span>. This cannot
              be undone.
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
