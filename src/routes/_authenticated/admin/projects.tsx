import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, ImageIcon } from "lucide-react";
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

const BUCKET = "project-images";

type ProjectRow = {
  id: string;
  name: string;
  client: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
  project_value: number | null;
  completion_date: string | null;
  sort_order: number;
  published: boolean;
};

type FormState = {
  name: string;
  client: string;
  industry: string;
  location: string;
  description: string;
  image_url: string;
  status: string;
  project_value: string;
  completion_date: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  name: "",
  client: "",
  industry: "",
  location: "",
  description: "",
  image_url: "",
  status: "",
  project_value: "",
  completion_date: "",
  sort_order: "0",
  published: false,
};

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: AdminProjectsPage,
});

function rowToForm(r: ProjectRow): FormState {
  return {
    name: r.name ?? "",
    client: r.client ?? "",
    industry: r.industry ?? "",
    location: r.location ?? "",
    description: r.description ?? "",
    image_url: r.image_url ?? "",
    status: r.status ?? "",
    project_value: r.project_value != null ? String(r.project_value) : "",
    completion_date: r.completion_date ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
  };
}

function formToPayload(f: FormState) {
  return {
    name: f.name.trim(),
    client: f.client.trim() || null,
    industry: f.industry.trim() || null,
    location: f.location.trim() || null,
    description: f.description.trim() || null,
    image_url: f.image_url.trim() || null,
    status: f.status.trim() || null,
    project_value: f.project_value.trim() ? Number(f.project_value) : null,
    completion_date: f.completion_date || null,
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
  return <img src={url} alt="" className={`object-cover ${className ?? ""}`} />;
}

function AdminProjectsPage() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setRows((data as ProjectRow[]) ?? []);
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
  const openEdit = (r: ProjectRow) => {
    setEditing(r);
    setForm(rowToForm(r));
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `projects/${crypto.randomUUID()}.${ext}`;
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
    // Remove previous object if replacing
    if (form.image_url && form.image_url !== path) {
      await supabase.storage.from(BUCKET).remove([form.image_url]);
    }
    setForm((f) => ({ ...f, image_url: path }));
    toast.success("Image uploaded");
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    toast.success(editing ? "Project updated" : "Project created");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("projects").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    if (target.image_url) {
      await supabase.storage.from(BUCKET).remove([target.image_url]);
    }
    toast.success("Project deleted");
    await load();
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading…" : `${count} project${count === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400 w-20">Image</TableHead>
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Client</TableHead>
              <TableHead className="text-slate-400">Industry</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Order</TableHead>
              <TableHead className="text-slate-400">Published</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && rows.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  No projects yet. Click "New Project" to add one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell>
                  <SignedImage path={r.image_url} className="h-12 w-16 rounded" />
                </TableCell>
                <TableCell className="text-white font-medium">{r.name}</TableCell>
                <TableCell className="text-slate-300">{r.client ?? "—"}</TableCell>
                <TableCell className="text-slate-300">{r.industry ?? "—"}</TableCell>
                <TableCell className="text-slate-300">{r.status ?? "—"}</TableCell>
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
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update project details." : "Add a new project to the showcase."}
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
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  placeholder="e.g. Completed, Ongoing"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project_value">Project Value</Label>
                <Input
                  id="project_value"
                  type="number"
                  step="0.01"
                  value={form.project_value}
                  onChange={(e) => setForm({ ...form, project_value: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completion_date">Completion Date</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={form.completion_date}
                  onChange={(e) => setForm({ ...form, completion_date: e.target.value })}
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
              <Label>Project Image</Label>
              <div className="flex items-center gap-4">
                <SignedImage path={form.image_url || null} className="h-20 w-28 rounded border border-zinc-800" />
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
                      {form.image_url ? "Replace Image" : "Upload Image"}
                    </span>
                  </label>
                  {form.image_url && (
                    <p className="text-xs text-slate-500 break-all font-mono">{form.image_url}</p>
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
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteTarget?.name}" and its uploaded image. This cannot be undone.
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
