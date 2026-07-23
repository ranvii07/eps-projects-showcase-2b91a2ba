import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import SignedImage from "@/components/site/SignedImage";
import { UPLOAD_ACCEPT, validateUploadFile } from "@/lib/upload";

const BUCKET = "industry-images";

type IndustryRow = {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

type FormState = {
  name: string;
  description: string;
  icon_name: string;
  image_url: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  icon_name: "",
  image_url: "",
  sort_order: "0",
  published: false,
};

const industrySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Max 200 characters"),
  icon_name: z.string().trim().max(100, "Max 100 characters"),
  description: z.string().trim().max(5000, "Max 5000 characters"),
  sort_order: z
    .string()
    .trim()
    .refine((v) => /^\d+$/.test(v) && Number(v) <= 100000, "Whole number between 0 and 100000"),
});

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

const fieldError = (msg?: string[]) =>
  msg?.[0] ? <p className="mt-1 text-xs text-red-400">{msg[0]}</p> : null;

export const Route = createFileRoute("/_authenticated/admin/industries")({
  component: AdminIndustriesPage,
});

function rowToForm(r: IndustryRow): FormState {
  return {
    name: r.name ?? "",
    description: r.description ?? "",
    icon_name: r.icon_name ?? "",
    image_url: r.image_url ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
  };
}

function formToPayload(f: FormState) {
  return {
    name: f.name.trim(),
    description: f.description.trim() || null,
    icon_name: f.icon_name.trim() || null,
    image_url: f.image_url.trim() || null,
    sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : 0,
    published: f.published,
  };
}

function AdminIndustriesPage() {
  const [rows, setRows] = useState<IndustryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IndustryRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IndustryRow | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("industries")
      .select("id,name,description,icon_name,image_url,sort_order,published")
      // Deliberately ascending created_at (the other managers use descending) and
      // an id tiebreaker, so this table renders rows in the exact order the public
      // /industries page does. See the matching comment in routes/industries.tsx.
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    if (error) toast.error("Failed to load", { description: error.message });
    setLoadError(!!error);
    setRows((data as IndustryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setPendingUpload(null);
    setDialogOpen(true);
  };
  const openEdit = (r: IndustryRow) => {
    setEditing(r);
    setForm(rowToForm(r));
    setErrors({});
    setPendingUpload(null);
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    const validationError = validateUploadFile(file, "image");
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `industries/${crypto.randomUUID()}.${ext}`;
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
    // Discard a prior upload from this unsaved session; never touch the saved
    // object — the one it replaces is removed on save (storage hygiene, T7.5).
    if (pendingUpload && pendingUpload !== path) {
      await supabase.storage.from(BUCKET).remove([pendingUpload]);
    }
    setPendingUpload(path);
    setForm((f) => ({ ...f, image_url: path }));
    toast.success("Image uploaded");
  };

  const closeDialog = () => {
    // Discard an uploaded-but-unsaved object so it does not orphan in storage.
    if (pendingUpload) {
      void supabase.storage.from(BUCKET).remove([pendingUpload]);
      setPendingUpload(null);
    }
    setDialogOpen(false);
  };

  const handleSave = async () => {
    const parsed = industrySchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("industries").update(payload).eq("id", editing.id)
      : await supabase.from("industries").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    // Save committed: remove the object this upload replaced (if it changed),
    // then clear the pending marker so closing the dialog keeps the saved file.
    const savedImage = form.image_url.trim() || null;
    if (editing && editing.image_url && editing.image_url !== savedImage) {
      await supabase.storage.from(BUCKET).remove([editing.image_url]);
    }
    setPendingUpload(null);
    toast.success(editing ? "Industry updated" : "Industry created");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("industries").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    if (target.image_url) {
      await supabase.storage.from(BUCKET).remove([target.image_url]);
    }
    toast.success("Industry deleted");
    await load();
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Industries</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading…" : `${count} industr${count === 1 ? "y" : "ies"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Industry
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400 w-20">Image</TableHead>
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Description</TableHead>
              <TableHead className="text-slate-400">Icon Name</TableHead>
              <TableHead className="text-slate-400 text-right">Order</TableHead>
              <TableHead className="text-slate-400">Published</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Loading industries…
                </TableCell>
              </TableRow>
            )}
            {!loading && loadError && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                  <p className="mb-3">Couldn't load industries.</p>
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
                <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                  No industries yet. Click "New Industry" to add one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell>
                  <SignedImage
                    bucket={BUCKET}
                    path={r.image_url}
                    className="h-12 w-16 rounded bg-zinc-950 p-1"
                    fit="object-contain"
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{r.name}</TableCell>
                <TableCell className="text-slate-300 max-w-sm truncate">
                  {r.description ?? "—"}
                </TableCell>
                <TableCell className="text-slate-300">
                  {r.icon_name ? (
                    <span className="font-mono text-xs text-cyan-400 bg-zinc-950 px-2 py-1 rounded">
                      {r.icon_name}
                    </span>
                  ) : (
                    "—"
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
                      aria-label={`Edit industry ${r.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => setDeleteTarget(r)}
                      aria-label={`Delete industry ${r.name}`}
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

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Industry" : "New Industry"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update industry details." : "Add a new industry to the Industries page."}
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
              {fieldError(errors.name)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon_name">Icon Name</Label>
                <Input
                  id="icon_name"
                  placeholder="e.g. factory, flame"
                  value={form.icon_name}
                  onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
                <p className="text-xs text-slate-500">
                  Shown on the card. factory, flask-conical, flame, tower-control, cog, beaker,
                  waves, zap.
                </p>
                {fieldError(errors.icon_name)}
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
                {fieldError(errors.sort_order)}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-zinc-950 border-zinc-700"
              />
              {fieldError(errors.description)}
            </div>

            <div className="grid gap-2">
              <Label>Industry Image</Label>
              <div className="flex items-center gap-4">
                <SignedImage
                  bucket={BUCKET}
                  path={form.image_url || null}
                  className="h-20 w-28 rounded border border-zinc-800 bg-zinc-950 p-2"
                  fit="object-contain"
                />
                <div className="flex-1 space-y-2">
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept={UPLOAD_ACCEPT.image}
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
                      {form.image_url ? "Replace Image" : "Upload Image"}
                    </span>
                  </label>
                  {form.image_url && (
                    <p className="text-xs text-slate-500 break-all font-mono">{form.image_url}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Stored for future use — the public Industries page currently renders the icon,
                    not this image.
                  </p>
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
              onClick={closeDialog}
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
              {editing ? "Save Changes" : "Create Industry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete industry?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteTarget?.name}" and its uploaded image. This
              cannot be undone.
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
