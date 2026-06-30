import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, ImageIcon } from "lucide-react";
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

const BUCKET = "client-images";

type ClientRow = {
  id: string;
  name: string;
  industry: string | null;
  logo_url: string | null;
  sort_order: number;
  published: boolean;
};

type FormState = {
  name: string;
  industry: string;
  logo_url: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  name: "",
  industry: "",
  logo_url: "",
  sort_order: "0",
  published: false,
};

export const Route = createFileRoute("/_authenticated/admin/clients")({
  component: AdminClientsPage,
});

function rowToForm(r: ClientRow): FormState {
  return {
    name: r.name ?? "",
    industry: r.industry ?? "",
    logo_url: r.logo_url ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
  };
}

function formToPayload(f: FormState) {
  return {
    name: f.name.trim(),
    industry: f.industry.trim() || null,
    logo_url: f.logo_url.trim() || null,
    sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : 0,
    published: f.published,
  };
}

function SignedImage({ path, className }: { path: string | null; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setUrl(null);
    if (!path) return;
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 10)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);
  if (!path)
    return (
      <div className={`flex items-center justify-center bg-zinc-800 text-zinc-600 ${className ?? ""}`}>
        <ImageIcon className="h-4 w-4" />
      </div>
    );
  if (!url)
    return (
      <div className={`flex items-center justify-center bg-zinc-800 ${className ?? ""}`}>
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
      </div>
    );
  return <img src={url} alt="" className={`object-contain ${className ?? ""}`} />;
}

function AdminClientsPage() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClientRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClientRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("id,name,industry,logo_url,sort_order,published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setRows((data as ClientRow[]) ?? []);
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
  const openEdit = (r: ClientRow) => {
    setEditing(r);
    setForm(rowToForm(r));
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `clients/${crypto.randomUUID()}.${ext}`;
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
    if (form.logo_url && form.logo_url !== path) {
      await supabase.storage.from(BUCKET).remove([form.logo_url]);
    }
    setForm((f) => ({ ...f, logo_url: path }));
    toast.success("Logo uploaded");
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("clients").update(payload).eq("id", editing.id)
      : await supabase.from("clients").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    toast.success(editing ? "Client updated" : "Client created");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("clients").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    if (target.logo_url) {
      await supabase.storage.from(BUCKET).remove([target.logo_url]);
    }
    toast.success("Client deleted");
    await load();
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading…" : `${count} client${count === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400 w-20">Logo</TableHead>
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Industry</TableHead>
              <TableHead className="text-slate-400 text-right">Order</TableHead>
              <TableHead className="text-slate-400">Published</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                  No clients yet. Click "New Client" to add one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell>
                  <SignedImage path={r.logo_url} className="h-12 w-16 rounded bg-zinc-950 p-1" />
                </TableCell>
                <TableCell className="text-white font-medium">{r.name}</TableCell>
                <TableCell className="text-slate-300">{r.industry ?? "—"}</TableCell>
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
            <DialogTitle>{editing ? "Edit Client" : "New Client"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update client details." : "Add a new client to the showcase."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
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
              <Label>Client Logo</Label>
              <div className="flex items-center gap-4">
                <SignedImage
                  path={form.logo_url || null}
                  className="h-20 w-28 rounded border border-zinc-800 bg-zinc-950 p-2"
                />
                <div className="flex-1 space-y-2">
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
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
                      {form.logo_url ? "Replace Logo" : "Upload Logo"}
                    </span>
                  </label>
                  {form.logo_url && (
                    <p className="text-xs text-slate-500 break-all font-mono">{form.logo_url}</p>
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
              {editing ? "Save Changes" : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteTarget?.name}" and its uploaded logo. This cannot be undone.
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
