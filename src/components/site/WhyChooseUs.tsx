import { Card, CardContent } from "@/components/ui/card";
import { Factory, Cpu, TrendingDown, Gauge, Zap, Handshake, type LucideIcon } from "lucide-react";

type Reason = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: keyof typeof colorMap;
};

const colorMap = {
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
  green: "bg-green-100 text-green-600 group-hover:bg-green-600",
  emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600",
  orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600",
  purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600",
  cyan: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600",
} as const;

const reasons: Reason[] = [
  {
    icon: Factory,
    title: "Modern Industrial Units",
    description:
      "Establishment of advanced, highly-efficient industrial systems using the latest technology and engineering practices.",
    color: "blue",
  },
  {
    icon: Cpu,
    title: "Automation-First Approach",
    description:
      "Advanced automation for higher accuracy & control of the process — achieving efficient, reliable production output.",
    color: "purple",
  },
  {
    icon: TrendingDown,
    title: "Lower Project Costs",
    description:
      "A single, integrated partner for procurement and execution removes the overheads and coordination gaps of fragmented multi-vendor approaches.",
    color: "emerald",
  },
  {
    icon: Gauge,
    title: "Higher Plant Efficiency",
    description:
      "Superior electrical design, precise instrumentation, and quality commissioning that deliver dependable, efficient plant performance.",
    color: "green",
  },
  {
    icon: Zap,
    title: "Fast-Track Execution",
    description:
      "Unconventional construction methods with prefab panels — fast execution, minimal rework, maximum quality.",
    color: "orange",
  },
  {
    icon: Handshake,
    title: "Customer-First Delivery",
    description:
      "We deliver time & cost benefits to customers through our engineering & execution capabilities — every project, every time.",
    color: "cyan",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Industrial Clients Choose EPS Projects
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Beyond what we deliver, here's why industrial clients choose EPS Projects — one
            accountable partner combining modern engineering, automation-first execution, and a
            customer-first commitment on every project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <Card
                key={reason.title}
                className="group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 bg-zinc-900 border border-zinc-800"
              >
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${colorMap[reason.color]}`}
                    >
                      <Icon className="group-hover:text-white transition-colors" size={36} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{reason.title}</h3>
                  <p className="text-slate-300 text-center leading-relaxed">{reason.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
