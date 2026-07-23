import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Factory,
  FlaskConical,
  Flame,
  TowerControl,
  Cog,
  Beaker,
  Waves,
  Zap,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";

type IndustryRow = {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
};

// Mirrors the iconMap convention in components/site/Services.tsx. Keys are the
// kebab-case icon_name values seeded by 20260721000000_industries_cms.sql; both
// kebab- and squashed-case spellings are accepted so a CMS editor typing either
// "TowerControl" or "tower-control" resolves to the same icon.
const iconMap: Record<string, LucideIcon> = {
  factory: Factory,
  flaskconical: FlaskConical,
  "flask-conical": FlaskConical,
  flame: Flame,
  towercontrol: TowerControl,
  "tower-control": TowerControl,
  cog: Cog,
  beaker: Beaker,
  waves: Waves,
  zap: Zap,
};

const resolveIcon = (name: string | null): LucideIcon => {
  if (!name) return Factory;
  return iconMap[name.trim().toLowerCase()] ?? Factory;
};

const SECTORS = [
  "Sugar & Distillery",
  "Cement & Steel",
  "Mining",
  "Petrochemical",
  "Infrastructure",
  "Clean Energy",
];

export const Route = createFileRoute("/industries")({
  head: () =>
    buildPageHead({
      title: "Industries",
      description:
        "EPS Projects delivers end-to-end Electrical & Instrumentation solutions across cement, sugar & distillery, oil & gas, steel, petrochemical, hydro power, infrastructure, and co-gen / captive power sectors throughout India.",
      path: "/industries",
    }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const [industries, setIndustries] = useState<IndustryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("industries")
        .select("id, name, description, icon_name")
        .eq("published", true)
        // Fully deterministic: sort_order is CMS-editable and not unique, and the
        // seeded rows share one created_at (a transaction's now() is constant), so
        // id is the final tiebreaker. Matches the admin manager's ordering, so the
        // CMS table always previews the live order.
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setIndustries([]);
      } else {
        setIndustries(data ?? []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div data-testid="industries-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Industries We Serve"
        subtitle="We provide Electrical design & build services across Oil & Gas, Chemical, Cement, Steel, Power Generation, Process Manufacturing and Renewable Energy industries throughout India."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {industries === null ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-cyan-400" size={24} />
            </div>
          ) : error ? (
            <p className="text-center text-slate-400 py-12">
              Unable to load industries at the moment. Please try again later.
            </p>
          ) : industries.length === 0 ? (
            <p className="text-center text-slate-400 py-12">No industries available.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry) => {
                const Icon = resolveIcon(industry.icon_name);
                return (
                  <Card
                    key={industry.id}
                    className="group hover:shadow-2xl transition-all duration-300 border-t-4 border-cyan-400 hover:-translate-y-2 bg-zinc-900 border-zinc-800"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-400 transition-colors">
                        <Icon
                          className="text-cyan-400 group-hover:text-white transition-colors"
                          size={32}
                        />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">{industry.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4 leading-relaxed">{industry.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Sectors We Serve</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <div className="flex flex-wrap justify-center gap-3">
              {SECTORS.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
