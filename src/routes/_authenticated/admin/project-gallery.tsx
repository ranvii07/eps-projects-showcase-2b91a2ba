import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SITE_URL } from "@/lib/site";

// Same bucket as the Projects manager (lesson 16 already opened anon read on it);
// gallery photographs live under their own path prefix.
const BUCKET = "project-images";
const PATH_PREFIX = "gallery";

const ALL_PROJECTS = "all";

type ProjectOption = {
  id: string;
  name: string;
  preview_token: string;
  preview_enabled: boolean;
};

type ImageRow = {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  location: string | null;
  category: string | null;
  sort_order: number;
  published: boolean;
  is_cover: boolean;
  visibility: string;
};

type FormState = {
  project_id: string;
  image_url: string;
  caption: string;
  location: string;
  category: string;
  sort_order: string;
  published: boolean;
  is_cover: boolean;
  visibility: string;
};

const emptyForm: FormState = {
  project_id: "",
  image_url: "",
  caption: "",
  location: "",
  category: "",
  sort_order: "0",
  published: false,
  is_cover: false,
  visibility: "public",
};

const sortOrderField = z
  .string()
  .trim()
  .refine((v) => /^\d+$/.test(v) && Number(v) <= 100000, "Whole number between 0 and 100000");

const imageSchema = z.object({
  project_id: z.string().uuid("Select a project"),
  image_url: z.string().trim().min(1, "Upload an image"),
  caption: z.string().trim().max(500, "Max 500 characters"),
  location: z.string().trim().max(200, "Max 200 characters"),
  category: z.string().trim().max(100, "Max 100 characters"),
  visibility: z.enum(["public", "private"]),
  sort_order: sortOrderField,
});

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

const fieldError = (msg?: string[]) =>
  msg?.[0] ? <p className="mt-1 text-xs text-red-400">{msg[0]}</p> : null;

export const Route = createFileRoute("/_authenticated/admin/project-gallery")({
  component: AdminProjectGalleryPage,
});

function rowToForm(r: ImageRow): FormState {
  return {
    project_id: r.project_id,
    image_url: r.image_url ?? "",
    caption: r.caption ?? "",
    location: r.location ?? "",
    category: r.category ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
    is_cover: !!r.is_cover,
    visibility: r.visibility ?? "public",
  };
}

function formToPayload(f: FormState) {
  return {
    project_id: f.project_id,
    image_url: f.image_url.trim(),
    caption: f.caption.trim() || null,
    location: f.location.trim() || null,
    category: f.category.trim() || null,
    sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : 0,
    published: f.published,
    is_cover: f.is_cover,
    visibility: f.visibility,
  };
}

function AdminProjectGalleryPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>(ALL_PROJECTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ImageRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ImageRow | null>(null);
  const [regenerateTarget, setRegenerateTarget] = useState<ProjectOption | null>(null);
  const [reordering, setReordering] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const load = async () => {
    setLoading(true);
    const [projectsRes, imagesRes] = await Promise.all([
      supabase
        .from("projects")
        .select("id,name,preview_token,preview_enabled")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("project_images")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);
    const error = projectsRes.error ?? imagesRes.error;
    if (error) toast.error("Failed to load", { description: error.message });
    setLoadError(!!error);
    setProjects((projectsRes.data as ProjectOption[]) ?? []);
    setRows((imagesRes.data as ImageRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—";

  // Rows are grouped by project and ordered within the group, so the "All
  // projects" view reads as a series of galleries rather than an interleaved list.
  const filtered = useMemo(() => {
    const scoped =
      projectFilter === ALL_PROJECTS ? rows : rows.filter((r) => r.project_id === projectFilter);
    const order = new Map(projects.map((p, i) => [p.id, i]));
    return [...scoped].sort(
      (a, b) =>
        (order.get(a.project_id) ?? 0) - (order.get(b.project_id) ?? 0) ||
        a.sort_order - b.sort_order,
    );
  }, [rows, projects, projectFilter]);

  // Move buttons are bounded by position within the image's OWN project, not by
  // position in the rendered list — the two differ in the "All projects" view.
  const edges = useMemo(() => {
    const map = new Map<string, { first: boolean; last: boolean }>();
    for (const project of new Set(rows.map((r) => r.project_id))) {
      const siblings = rows
        .filter((r) => r.project_id === project)
        .sort((a, b) => a.sort_order - b.sort_order);
      siblings.forEach((r, i) =>
        map.set(r.id, { first: i === 0, last: i === siblings.length - 1 }),
      );
    }
    return map;
  }, [rows]);

  // The preview link belongs to a single project, so it is only offered when the
  // list is scoped to one.
  const selectedProject =
    projectFilter === ALL_PROJECTS ? null : (projects.find((p) => p.id === projectFilter) ?? null);

  const previewUrl = (token: string) => `${SITE_URL}/projects/gallery?preview=${token}`;

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      // Pre-fill the project being viewed, and park the new image at the end.
      project_id: projectFilter === ALL_PROJECTS ? "" : projectFilter,
      sort_order: String(filtered.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1),
    });
    setErrors({});
    setPendingUpload(null);
    setDialogOpen(true);
  };

  const openEdit = (r: ImageRow) => {
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
    const path = `${PATH_PREFIX}/${crypto.randomUUID()}.${ext}`;
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

  // Clears whichever image currently holds the cover flag for a project. Returns
  // false (and toasts) on failure so callers can abort before claiming the flag.
  const clearCover = async (projectId: string) => {
    const { error } = await supabase
      .from("project_images")
      .update({ is_cover: false })
      .eq("project_id", projectId)
      .eq("is_cover", true);
    if (error) {
      toast.error("Could not update the cover image", { description: error.message });
      return false;
    }
    return true;
  };

  // One-click cover toggle from the list, so setting a cover does not require
  // opening the edit dialog.
  const toggleCover = async (row: ImageRow) => {
    const next = !row.is_cover;
    setSavingCover(true);
    if (next && !(await clearCover(row.project_id))) {
      setSavingCover(false);
      return;
    }
    const { error } = await supabase
      .from("project_images")
      .update({ is_cover: next })
      .eq("id", row.id);
    setSavingCover(false);
    if (error) {
      toast.error("Could not update the cover image", { description: error.message });
      return;
    }
    toast.success(next ? "Cover image set" : "Cover image cleared");
    await load();
  };

  const handleSave = async () => {
    const parsed = imageSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSaving(true);
    // Only one cover per project (partial unique index), so the project's previous
    // cover has to be cleared before this row claims it. Clearing the row being
    // edited too is harmless — the update below sets it straight back.
    if (form.is_cover) {
      const cleared = await clearCover(form.project_id);
      if (!cleared) {
        setSaving(false);
        return;
      }
    }
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("project_images").update(payload).eq("id", editing.id)
      : await supabase.from("project_images").insert(payload);
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
    toast.success(editing ? "Image updated" : "Image added");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("project_images").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    if (target.image_url) {
      await supabase.storage.from(BUCKET).remove([target.image_url]);
    }
    toast.success("Image deleted");
    await load();
  };

  // Reordering swaps sort_order with the adjacent image of the SAME project, so
  // ordering stays meaningful however the list is filtered.
  const move = async (row: ImageRow, direction: -1 | 1) => {
    const siblings = rows
      .filter((r) => r.project_id === row.project_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = siblings.findIndex((r) => r.id === row.id);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return;

    // Swap the two positions, then renumber the gallery 0..n-1. Renumbering rather
    // than trading the two sort_order values also repairs a gallery whose rows
    // share a value — e.g. several images left at the default 0, where a plain
    // swap would be a no-op.
    const reordered = [...siblings];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    setReordering(true);
    const results = await Promise.all(
      reordered
        .map((r, i) => ({ r, i }))
        .filter(({ r, i }) => r.sort_order !== i)
        .map(({ r, i }) =>
          supabase.from("project_images").update({ sort_order: i }).eq("id", r.id),
        ),
    );
    setReordering(false);
    const failed = results.find((res) => res.error);
    if (failed?.error) {
      toast.error("Reorder failed", { description: failed.error.message });
    }
    await load();
  };

  const setPreviewEnabled = async (project: ProjectOption, enabled: boolean) => {
    const { error } = await supabase
      .from("projects")
      .update({ preview_enabled: enabled })
      .eq("id", project.id);
    if (error) {
      toast.error("Could not update preview link", { description: error.message });
      return;
    }
    toast.success(enabled ? "Preview link enabled" : "Preview link disabled");
    await load();
  };

  const handleRegenerate = async () => {
    if (!regenerateTarget) return;
    const target = regenerateTarget;
    setRegenerateTarget(null);
    const { error } = await supabase
      .from("projects")
      .update({ preview_token: crypto.randomUUID() })
      .eq("id", target.id);
    if (error) {
      toast.error("Could not regenerate link", { description: error.message });
      return;
    }
    toast.success("New preview link generated", {
      description: "Previously shared links no longer work.",
    });
    await load();
  };

  const copyPreviewLink = async (project: ProjectOption) => {
    try {
      await navigator.clipboard.writeText(previewUrl(project.preview_token));
      toast.success("Preview link copied");
    } catch {
      toast.error("Could not copy — select and copy the link manually");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Gallery</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading
              ? "Loading…"
              : `${filtered.length} image${filtered.length === 1 ? "" : "s"}${
                  projectFilter === ALL_PROJECTS ? " across all projects" : ""
                }`}
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={projects.length === 0}
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Image
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger
            className="h-9 w-full sm:w-[280px] border-zinc-800 bg-zinc-900 text-sm text-slate-200"
            aria-label="Filter by project"
          >
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            <SelectItem value={ALL_PROJECTS}>All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProject && (
        <Card className="bg-zinc-900 border-zinc-800 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-medium">Private preview link</h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                When enabled, anyone with this link sees every published image of{" "}
                <span className="text-slate-300">{selectedProject.name}</span> — including images
                marked Private Preview — without signing in. Leave it off unless you are actively
                sharing it.
              </p>
            </div>
            <Switch
              checked={selectedProject.preview_enabled}
              onCheckedChange={(v) => setPreviewEnabled(selectedProject, v)}
              aria-label="Enable private preview link"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-[240px] break-all rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-slate-400">
              {previewUrl(selectedProject.preview_token)}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyPreviewLink(selectedProject)}
              className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRegenerateTarget(selectedProject)}
              className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              Regenerate
            </Button>
          </div>
        </Card>
      )}

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400 w-20">Image</TableHead>
              <TableHead className="text-slate-400">Project</TableHead>
              <TableHead className="text-slate-400">Cover</TableHead>
              <TableHead className="text-slate-400">Caption</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400">Location</TableHead>
              <TableHead className="text-slate-400">Visibility</TableHead>
              <TableHead className="text-slate-400">Published</TableHead>
              <TableHead className="text-slate-400 text-right">Order</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={10} className="text-center text-slate-500 py-10">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Loading images…
                </TableCell>
              </TableRow>
            )}
            {!loading && loadError && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={10} className="text-center text-slate-500 py-10">
                  <p className="mb-3">Couldn't load the project gallery.</p>
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
            {!loading && !loadError && projects.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={10} className="text-center text-slate-500 py-10">
                  Add a project under Projects first — every image is attached to one.
                </TableCell>
              </TableRow>
            )}
            {!loading && !loadError && projects.length > 0 && filtered.length === 0 && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={10} className="text-center text-slate-500 py-10">
                  {rows.length === 0
                    ? 'No gallery images yet. Click "New Image" to add one.'
                    : "This project has no gallery images yet."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell>
                  <SignedImage
                    bucket={BUCKET}
                    path={r.image_url}
                    className="h-12 w-16 rounded"
                    fit="object-cover"
                  />
                </TableCell>
                <TableCell className="text-white font-medium">
                  {projectName(r.project_id)}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => toggleCover(r)}
                    disabled={savingCover}
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-60"
                    aria-label={r.is_cover ? "Clear cover image" : "Set as cover image"}
                    aria-pressed={r.is_cover}
                  >
                    <Star
                      className={
                        "h-3.5 w-3.5 " +
                        (r.is_cover ? "fill-cyan-400 text-cyan-400" : "text-zinc-500")
                      }
                    />
                    <span className={r.is_cover ? "text-cyan-400" : "text-zinc-500"}>
                      {r.is_cover ? "Cover" : "Set"}
                    </span>
                  </button>
                </TableCell>
                <TableCell className="text-slate-300 max-w-xs truncate">
                  {r.caption ?? "—"}
                </TableCell>
                <TableCell className="text-slate-300">{r.category ?? "—"}</TableCell>
                <TableCell className="text-slate-300">{r.location ?? "—"}</TableCell>
                <TableCell>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                      (r.visibility === "public"
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-amber-500/10 text-amber-400")
                    }
                  >
                    {r.visibility === "public" ? "Public" : "Private Preview"}
                  </span>
                </TableCell>
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
                <TableCell className="text-slate-300 text-right">{r.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                      onClick={() => move(r, -1)}
                      disabled={reordering || (edges.get(r.id)?.first ?? true)}
                      aria-label="Move image up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                      onClick={() => move(r, 1)}
                      disabled={reordering || (edges.get(r.id)?.last ?? true)}
                      aria-label="Move image down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                      onClick={() => openEdit(r)}
                      aria-label="Edit image"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => setDeleteTarget(r)}
                      aria-label="Delete image"
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
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Gallery Image" : "New Gallery Image"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update this site photograph." : "Attach a site photograph to a project."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="project_id">Project *</Label>
              <Select
                value={form.project_id}
                onValueChange={(v) => setForm({ ...form, project_id: v })}
              >
                <SelectTrigger
                  id="project_id"
                  className="bg-zinc-950 border-zinc-700 text-slate-200"
                >
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.project_id)}
            </div>

            <div className="grid gap-2">
              <Label>Photograph *</Label>
              <div className="flex items-center gap-4">
                <SignedImage
                  bucket={BUCKET}
                  path={form.image_url || null}
                  className="h-20 w-28 rounded border border-zinc-800"
                  fit="object-cover"
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
                </div>
              </div>
              {fieldError(errors.image_url)}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={2}
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="bg-zinc-950 border-zinc-700"
              />
              {fieldError(errors.caption)}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
                {fieldError(errors.location)}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Erection, Panel"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
                {fieldError(errors.category)}
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
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={form.visibility}
                onValueChange={(v) => setForm({ ...form, visibility: v })}
              >
                <SelectTrigger
                  id="visibility"
                  className="bg-zinc-950 border-zinc-700 text-slate-200"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="public">Public — visible on the website</SelectItem>
                  <SelectItem value="private">Private Preview — link only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">
                Private Preview images never appear on the public gallery. They are shown only
                through this project's preview link, and only while that link is enabled.
              </p>
              {fieldError(errors.visibility)}
            </div>

            <div className="flex items-center justify-between rounded-md border border-zinc-800 px-4 py-3">
              <div>
                <Label htmlFor="is_cover" className="text-white">
                  Cover image
                </Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Used as this project's gallery thumbnail. Setting it replaces the project's
                  current cover; the image still appears in the gallery.
                </p>
              </div>
              <Switch
                id="is_cover"
                checked={form.is_cover}
                onCheckedChange={(v) => setForm({ ...form, is_cover: v })}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-zinc-800 px-4 py-3">
              <div>
                <Label htmlFor="published" className="text-white">
                  Published
                </Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drafts are hidden everywhere — including from the preview link.
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
              {editing ? "Save Changes" : "Add Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gallery image?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete this image from{" "}
              {deleteTarget ? projectName(deleteTarget.project_id) : ""} and remove the uploaded
              file. This cannot be undone.
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

      <AlertDialog open={!!regenerateTarget} onOpenChange={(o) => !o && setRegenerateTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate preview link?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              A new link will be generated for "{regenerateTarget?.name}". Any link shared
              previously will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-slate-200 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegenerate}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
