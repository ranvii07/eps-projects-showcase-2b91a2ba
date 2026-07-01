import { useEffect, useState } from "react";
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
  { name: "Manufacturing", image: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxlbGVjdHJpY2FsJTIwY29udHJvbCUyMHBhbmVsc3xlbnwwfHx8fDE3NjcwMDk2Mjd8MA&ixlib=rb-4.1.0&q=85" },
  { name: "Energy & Power", image: "https://images.unsplash.com/photo-1554050546-c125a25df013?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxwb3dlciUyMHBsYW50JTIwaW5zdHJ1bWVudGF0aW9ufGVufDB8fHx8MTc2NzAwOTYzM3ww&ixlib=rb-4.1.0&q=85" },
  { name: "Infrastructure", image: "https://images.unsplash.com/photo-1760789149696-30ce2d28b331?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpbmR1c3RyaWFsJTIwZWxlY3RyaWNhbCUyMGVxdWlwbWVudHxlbnwwfHx8fDE3NjcwMDk2NDF8MA&ixlib=rb-4.1.0&q=85" },
  { name: "Industrial Projects", image: "https://images.pexels.com/photos/19521860/pexels-photo-19521860.jpeg" },
];

const Services = () => {
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
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprehensive Electrical &amp; Instrumentation Solutions
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            EPS Projects provides end-to-end Electrical, Instrumentation, and Automation solutions designed to support industrial facilities throughout their project lifecycle. Our integrated approach enables clients to benefit from a single partner for engineering, procurement, execution, commissioning, and post-project support.
          </p>
        </div>

        {services === null ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
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
                  className="group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 border-t-4 border-cyan-400 hover:-translate-y-2 bg-zinc-900 border-zinc-800"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-400 transition-colors">
                      <Icon className="text-cyan-400 group-hover:text-black transition-colors" size={32} />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end">
                    <p className="text-white font-bold text-lg p-4">{industry.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
