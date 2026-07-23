import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Gauge,
  HardHat,
  Wrench,
  Settings,
  CheckCircle,
  Cog,
  Zap,
  Cpu,
  Activity,
  Shield,
  Loader2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ServiceRow = {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
};

const iconMap: Record<string, LucideIcon> = {
  settings: Settings,
  cog: Cog,
  hardhat: HardHat,
  "hard-hat": HardHat,
  wrench: Wrench,
  gauge: Gauge,
  checkcircle: CheckCircle,
  "check-circle": CheckCircle,
  zap: Zap,
  cpu: Cpu,
  activity: Activity,
  shield: Shield,
};

const resolveIcon = (name: string | null): LucideIcon => {
  if (!name) return Settings;
  return iconMap[name.trim().toLowerCase()] ?? Settings;
};

const industries = [
  { name: "Mining & Minerals", image: "/images/industries/mining.webp" },
  { name: "Cement Industry", image: "/images/industries/cement.webp" },
  { name: "Sugar & Distillery", image: "/images/industries/sugar.webp" },
  { name: "Co-generation & Power", image: "/images/industries/cogen.webp" },
];

// §7.5-B — hardcoded Material Supply portfolio (three blocks). Shown on /services only.
const materialSupply = [
  {
    title: "Instrumentation",
    items: [
      "Field Instruments & Hardware",
      "Instrument Fittings, Flow Meters",
      "Flow Elements, Valves, Cables",
      "Cable Trays, JBs, Glands",
    ],
  },
  {
    title: "Electrical Packages",
    items: [
      "HT / LT Panels, DBs, Cables, Termination Kits",
      "Cable Trays, Lighting Systems, Hardware",
      "Earthing Protection, Bus Duct",
      "Transformers, DG Sets, Battery Chargers",
    ],
  },
  {
    title: "Sub-Station & Control",
    items: [
      "Substations up to 132 KV Rating",
      "Breaker, Isolator, CT, PT, LA",
      "PLC, DCS, SCADA, EMS, VFDs",
      "UPS, Battery, Charger Systems",
    ],
  },
];

// §7.4 sectors strip (already approved + shipped on /industries via T2.1). Shown on /services only.
const sectors = [
  "Sugar & Distillery",
  "Cement & Steel",
  "Mining",
  "Petrochemical",
  "Infrastructure",
  "Clean Energy",
];

// Renders a service's description. Multi-line (newline-separated) descriptions become a
// bulleted capability list on the detailed /services page; the homepage summary and any
// single-line description render as a paragraph (backward-compatible with existing rows).
function ServiceDescription({
  description,
  detail,
}: {
  description: string | null;
  detail: boolean;
}) {
  const lines = (description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  if (!detail || lines.length === 1) {
    return <p className="text-slate-300 mb-4 leading-relaxed">{lines[0]}</p>;
  }
  return (
    <ul className="mb-4 space-y-2.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2.5 text-slate-300 leading-relaxed">
          <CheckCircle className="mt-1 flex-shrink-0 text-cyan-400" size={16} />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

const Services = ({ variant = "home" }: { variant?: "home" | "detail" }) => {
  const detail = variant === "detail";
  const [services, setServices] = useState<ServiceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, icon_name")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setServices([]);
      } else {
        setServices(data ?? []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="services" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Electrical &amp; Instrumentation Solutions
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            EPS Projects delivers Electrical, Instrumentation, and Automation services across the
            full project lifecycle — from design and engineering through procurement, supply,
            installation, automation, and testing &amp; commissioning.
          </p>
        </div>

        {services === null ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-cyan-400" size={24} />
          </div>
        ) : error ? (
          <p className="text-center text-slate-400 py-12">
            Unable to load services at the moment. Please try again later.
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No services available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon_name);
              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-t-4 border-cyan-400 hover:-translate-y-2 bg-zinc-900 border-zinc-800"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-400 transition-colors">
                      <Icon
                        className="text-cyan-400 group-hover:text-white transition-colors"
                        size={32}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServiceDescription description={service.description} detail={detail} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {detail && (
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
              Material Supply
            </h3>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-10"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {materialSupply.map((block) => (
                <Card key={block.title} className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {block.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-slate-300 leading-relaxed"
                        >
                          <CheckCircle className="mt-1 flex-shrink-0 text-cyan-400" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {detail ? (
          <div className="mt-20 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Industries We Serve</h3>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  {sector}
                </span>
              ))}
            </div>
            <Link
              to="/industries"
              data-testid="services-industries-link"
              className="inline-flex items-center gap-2 font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all industries
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Industries We Serve
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.name}
                  className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="aspect-square">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end">
                      <p className="text-white font-bold text-lg p-4">{industry.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
