import { Card, CardContent } from "@/components/ui/card";

type Reason = {
  image: string;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    image: "/images/why-choose-us/modern-industrial-unit.svg",
    title: "Modern Industrial Units",
    description:
      "Establishment of advanced, highly-efficient industrial systems using the latest technology and engineering practices.",
  },
  {
    image: "/images/why-choose-us/automation-control-panel.svg",
    title: "Automation-First Approach",
    description:
      "Advanced automation for higher accuracy & control of the process — achieving efficient, reliable production output.",
  },
  {
    image: "/images/why-choose-us/integrated-epc-cost.svg",
    title: "Lower Project Costs",
    description:
      "A single, integrated partner for procurement and execution removes the overheads and coordination gaps of fragmented multi-vendor approaches.",
  },
  {
    image: "/images/why-choose-us/plant-efficiency-gauge.svg",
    title: "Higher Plant Efficiency",
    description:
      "Superior electrical design, precise instrumentation, and quality commissioning that deliver dependable, efficient plant performance.",
  },
  {
    image: "/images/why-choose-us/fast-track-execution.svg",
    title: "Fast-Track Execution",
    description:
      "Unconventional construction methods with prefab panels — fast execution, minimal rework, maximum quality.",
  },
  {
    image: "/images/why-choose-us/customer-first-handover.svg",
    title: "Customer-First Delivery",
    description:
      "We deliver time & cost benefits to customers through our engineering & execution capabilities — every project, every time.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
            return (
              <Card
                key={reason.title}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-zinc-900 border border-zinc-800"
              >
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 bg-cyan-100 group-hover:bg-cyan-600">
                      <img
                        src={reason.image}
                        alt=""
                        aria-hidden="true"
                        width={36}
                        height={36}
                        loading="lazy"
                        className="w-9 h-9 transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                    {reason.title}
                  </h3>
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
