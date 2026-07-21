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
  type LucideIcon,
} from "lucide-react";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";

type Industry = { name: string; description: string; Icon: LucideIcon };

const INDUSTRIES: Industry[] = [
  {
    name: "Cement Industry",
    description: "Full E&I for raw mill, kiln, packing & power systems",
    Icon: Factory,
  },
  {
    name: "Sugar & Distillery",
    description: "Boiler, turbine, ethanol plant automation & instrumentation",
    Icon: FlaskConical,
  },
  {
    name: "Oil & Gas",
    description: "Hazardous area E&I, fire & gas, DCS/SCADA integration",
    Icon: Flame,
  },
  {
    name: "Infrastructure",
    description: "Substations, transmission lines, lighting & ELV systems",
    Icon: TowerControl,
  },
  {
    name: "Steel Industry",
    description: "MCC, VFD drives, power distribution & HT/LT systems",
    Icon: Cog,
  },
  {
    name: "Petrochemical",
    description: "Process control, analyzer systems, safety instrumentation",
    Icon: Beaker,
  },
  {
    name: "Hydro Power",
    description: "Control & protection systems for hydro turbine generators",
    Icon: Waves,
  },
  {
    name: "Co-gen / Captive Power",
    description: "Complete E&I for co-gen, WHR and captive power plants",
    Icon: Zap,
  },
];

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
  return (
    <div data-testid="industries-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Industries We Serve"
        subtitle="We provide Electrical design & build services across Oil & Gas, Chemical, Cement, Steel, Power Generation, Process Manufacturing and Renewable Energy industries throughout India."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.Icon;
              return (
                <Card
                  key={industry.name}
                  className="group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 border-t-4 border-cyan-400 hover:-translate-y-2 bg-zinc-900 border-zinc-800"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-400 transition-colors">
                      <Icon
                        className="text-cyan-400 group-hover:text-black transition-colors"
                        size={32}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{industry.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4 leading-relaxed">{industry.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Sectors We Serve</h2>
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
