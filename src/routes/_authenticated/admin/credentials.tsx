import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
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
import { Card } from "@/components/ui/card";

const BUCKET = "documents";

type CredentialRow = {
  id: string;
  kind: string;
  label: string | null;
  value: string | null;
  document_url: string | null;
  issued_on: string | null;
  expires_on: string | null;
  sort_order: number;
  published: boolean;
};

type FormState = {
  kind: string;
  label: string;
  value: string;
  document_url: string;
  issued_on: string;
  expires_on: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  kind: "",
  label: "",
  value: "",
  document_url: "",
  issued_on: "",
  expires_on: "",
  sort_order: "0",
  published: false,
};

export const Route = createFileRoute("/_authenticated/admin/credentials")({
  component: AdminCredentialsPage,
});

function rowToForm(r: CredentialRow): FormState {
  return {
    kind: r.kind ?? "",
    label: r.label ?? "",
    value: r.value ?? "",
    document_url: r.document_url ?? "",
    issued_on: r.issued_on ?? "",
    expires_on: r.expires_on ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
  };
}

function formToPayload(f: FormState) {
  return {
    kind: f.kind.trim(),
    label: f.label.trim() || null,
    value: f.value.trim() || null,
    document_url: f.document_url.trim() || null,
    issued_on: f.issued_on || null,
    expires_on: f.expires_on || null,
    sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : 0,
    published: f.published,
  };
}

async function openSignedUrl(path: string) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    toast.error("Could not open document", { description: error?.message });
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

function AdminCredentialsPage() {
  const [rows, setRows] = useState<CredentialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CredentialRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CredentialRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("company_credentials")
      .select("id,kind,label,value,document_url,issued_on,expires_on,sort_order,published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setRows((data as CredentialRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };
  const openEdit = (r: CredentialRow) => {
    setEditing(r);
    setForm(rowToForm(r));
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `credentials/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    setUploading(false);
    if (error) {
      toast.error("Upload failed", { description: error.message });
      return;
    }
    if (form.document_url && form.document_url !== path) {
      await supabase.storage.from(BUCKET).remove([form.document_url]);
    }
    setForm((f) => ({ ...f, document_url: path }));
    toast.success("Document uploaded");
  };

  const handleSave = async () => {
    if (!form.kind.trim()) {
      toast.error("Kind is required");
      return;
    }
    setSaving(true);
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("company_credentials").update(payload).eq("id", editing.id)
      : await supabase.from("company_credentials").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    toast.success(editing ? "Credential updated" : "Credential created");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("company_credentials").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    if (target.document_url) {
      await supabase.storage.from(BUCKET).remove([target.document_url]);
    }
    toast.success("Credential deleted");
    await load();
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Credentials</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading…" : `${count} credential${count === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Credential
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Kind</TableHead>
              <TableHead className="text-slate-400">Label</TableHead>
              <TableHead className="text-slate-400">Value</TableHead>
              <TableHead className="text-slate-400">Issued</TableHead>
              <TableHead className="text-slate-400">Expires</TableHead>
              <TableHead className="text-slate-400">Document</TableHead>
              <TableHead className="text-slate-400 text-right">Order</TableHead>
              <TableHead className="text-slate-400">Published</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={9} className="text-center text-slate-500 py-10">
                  No credentials yet. Click "New Credential" to add one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-white font-medium">{r.kind}</TableCell>
                <TableCell className="text-slate-300">{r.label ?? "—"}</TableCell>
                <TableCell className="text-slate-300 font-mono text-xs">{r.value ?? "—"}</TableCell>
                <TableCell className="text-slate-300">{r.issued_on ?? "—"}</TableCell>
                <TableCell className="text-slate-300">{r.expires_on ?? "—"}</TableCell>
                <TableCell>
                  {r.document_url ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-cyan-400 hover:bg-zinc-800 h-7"
                      onClick={() => openSignedUrl(r.document_url!)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  ) : (
                    <span className="text-zinc-600 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-300 text-right">{r.sort_order}</TableCell>
                <TableCell>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                      (r.published
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-700/40 text-zinc-400")
                    }
                  >
                    {r.published ? "Live" : "Draft"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Credential" : "New Credential"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update credential details." : "Add a new company credential."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="kind">Kind *</Label>
                <Input
                  id="kind"
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value })}
                  placeholder="certification, license, registration…"
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Certificate number, registration ID…"
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issued_on">Issued On</Label>
                <Input
                  id="issued_on"
                  type="date"
                  value={form.issued_on}
                  onChange={(e) => setForm({ ...form, issued_on: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires_on">Expires On</Label>
                <Input
                  id="expires_on"
                  type="date"
                  value={form.expires_on}
                  onChange={(e) => setForm({ ...form, expires_on: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Document</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-20 w-20 rounded border border-zinc-800 bg-zinc-950 text-zinc-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex">
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                          e.target.value = "";
                        }}
                      />
                      <span
                        className={
                          "inline-flex items-center gap-2 cursor-pointer rounded-md border border-zinc-700 px-3 py-2 text-sm text-slate-200 hover:bg-zinc-800 " +
                          (uploading ? "opacity-60 pointer-events-none" : "")
                        }
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {form.document_url ? "Replace Document" : "Upload Document"}
                      </span>
                    </label>
                    {form.document_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        className="border-zinc-700 text-cyan-400 hover:bg-zinc-800"
                        onClick={() => openSignedUrl(form.document_url)}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    )}
                  </div>
                  {form.document_url && (
                    <p className="text-xs text-slate-500 break-all font-mono">{form.document_url}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-zinc-800 px-4 py-3">
              <div>
                <Label htmlFor="published" className="text-white">
                  Published
                </Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visible on the public website when enabled.
                </p>
              </div>
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Create Credential"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete credential?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteTarget?.kind}{deleteTarget?.label ? ` — ${deleteTarget.label}` : ""}" and its uploaded document. This cannot be undone.
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
