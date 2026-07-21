import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
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

type ServiceRow = {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  sort_order: number;
  published: boolean;
};

type FormState = {
  title: string;
  description: string;
  icon_name: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  icon_name: "",
  sort_order: "0",
  published: false,
};

const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Max 200 characters"),
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

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: AdminServicesPage,
});

function rowToForm(r: ServiceRow): FormState {
  return {
    title: r.title ?? "",
    description: r.description ?? "",
    icon_name: r.icon_name ?? "",
    sort_order: String(r.sort_order ?? 0),
    published: !!r.published,
  };
}

function formToPayload(f: FormState) {
  return {
    title: f.title.trim(),
    description: f.description.trim() || null,
    icon_name: f.icon_name.trim() || null,
    sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : 0,
    published: f.published,
  };
}

function AdminServicesPage() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("id,title,description,icon_name,sort_order,published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load", { description: error.message });
    setLoadError(!!error);
    setRows((data as ServiceRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };
  const openEdit = (r: ServiceRow) => {
    setEditing(r);
    setForm(rowToForm(r));
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const parsed = serviceSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSaving(true);
    const payload = formToPayload(form);
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    toast.success(editing ? "Service updated" : "Service created");
    setDialogOpen(false);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from("services").delete().eq("id", target.id);
    if (error) {
      toast.error("Delete failed", { description: error.message });
      return;
    }
    toast.success("Service deleted");
    await load();
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {loading ? "Loading…" : `${count} service${count === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
          <Plus className="h-4 w-4 mr-2" />
          New Service
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
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
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Loading services…
                </TableCell>
              </TableRow>
            )}
            {!loading && loadError && (
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                  <p className="mb-3">Couldn't load services.</p>
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
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                  No services yet. Click "New Service" to add one.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-white font-medium">{r.title}</TableCell>
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
                      aria-label={`Edit service ${r.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => setDeleteTarget(r)}
                      aria-label={`Delete service ${r.title}`}
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
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editing ? "Update service details." : "Add a new service offering."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-zinc-950 border-zinc-700"
              />
              {fieldError(errors.title)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon_name">Icon Name</Label>
                <Input
                  id="icon_name"
                  placeholder="e.g. Zap, Settings"
                  value={form.icon_name}
                  onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                  className="bg-zinc-950 border-zinc-700"
                />
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
              {editing ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{deleteTarget?.title}". This cannot be undone.
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
