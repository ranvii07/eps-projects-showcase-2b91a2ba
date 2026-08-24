import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { statusLabel, statusStyle } from "@/lib/contact-status";

// Content tables that expose a `published` boolean (verified vs types.ts). Each
// card shows published/total and links to its manager.
type ContentTable = "projects" | "clients" | "services" | "hse_content" | "company_credentials";

const contentSections: {
  table: ContentTable;
  title: string;
  description: string;
  url: string;
}[] = [
  {
    table: "projects",
    title: "Projects",
    description: "Manage project showcase entries.",
    url: "/admin/projects",
  },
  {
    table: "clients",
    title: "Clients",
    description: "Manage client logos and listings.",
    url: "/admin/clients",
  },
  {
    table: "services",
    title: "Services",
    description: "Manage service offerings.",
    url: "/admin/services",
  },
  {
    table: "hse_content",
    title: "HSE Content",
    description: "Manage HSE / safety content.",
    url: "/admin/hse",
  },
  {
    table: "company_credentials",
    title: "Credentials",
    description: "Manage CIN, GST, ISO, MSME details.",
    url: "/admin/credentials",
  },
];

type Counts = { total: number; published: number };
type RecentSubmission = { id: string; name: string; status: string; created_at: string };

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

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [counts, setCounts] = useState<Record<ContentTable, Counts> | null>(null);
  const [recent, setRecent] = useState<RecentSubmission[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      // All dashboard reads run in parallel. Count queries use head:true +
      // count:'exact' — no rows fetched, just the count.
      const [countEntries, recentRes] = await Promise.all([
        Promise.all(
          contentSections.map(async ({ table }) => {
            const [totalRes, publishedRes] = await Promise.all([
              supabase.from(table).select("*", { count: "exact", head: true }),
              supabase
                .from(table)
                .select("*", { count: "exact", head: true })
                .eq("published", true),
            ]);
            if (totalRes.error) throw totalRes.error;
            if (publishedRes.error) throw publishedRes.error;
            return [
              table,
              { total: totalRes.count ?? 0, published: publishedRes.count ?? 0 },
            ] as const;
          }),
        ),
        supabase
          .from("contact_submissions")
          .select("id,name,status,created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (recentRes.error) throw recentRes.error;
      if (!active) return;
      setCounts(Object.fromEntries(countEntries) as Record<ContentTable, Counts>);
      setRecent((recentRes.data as RecentSubmission[]) ?? []);
    })().catch((error: unknown) => {
      if (!active) return;
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.error("Failed to load dashboard", { description: message });
      setCounts((c) => c ?? ({} as Record<ContentTable, Counts>));
      setRecent((r) => r ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome to EPS CMS</h1>
        <p className="text-slate-400 mt-1">Manage your website content from one place.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentSections.map((section) => {
          const c = counts?.[section.table];
          return (
            <Link key={section.table} to={section.url} className="block">
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {counts === null ? (
                    <Skeleton className="h-9 w-24 bg-zinc-800" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white">
                        {c?.published ?? 0}
                        <span className="text-xl text-slate-500"> / {c?.total ?? 0}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">published / total</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-white text-lg">Recent Enquiries</CardTitle>
            <CardDescription className="text-slate-400">
              The 5 most recent contact submissions.
            </CardDescription>
          </div>
          <Link
            to="/admin/contact-management"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recent === null ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full bg-zinc-800" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-slate-400">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(r.created_at)}</p>
                  </div>
                  <span
                    className={"rounded px-2 py-0.5 text-xs font-medium " + statusStyle(r.status)}
                  >
                    {statusLabel(r.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
