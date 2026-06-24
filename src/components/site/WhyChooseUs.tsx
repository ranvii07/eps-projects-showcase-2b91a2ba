import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Leaf, DollarSign, Clock, Shield, type LucideIcon } from "lucide-react";

type Reason = { icon: LucideIcon; title: string; description: string; color: keyof typeof colorMap };

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
    icon: Award,
    title: "Proven Industrial Experience",
    description:
      "Our team has successfully executed projects across power, sugar, distillery, ethanol, steel, cement, infrastructure, oil & gas, and hydro power sectors, enabling us to understand the unique challenges of each industry.",
    color: "blue",
  },
  {
    icon: Clock,
    title: "Integrated Project Delivery",
    description:
      "From engineering and procurement to installation, commissioning, and support, we provide a complete project execution model that simplifies coordination and improves project outcomes.",
    color: "purple",
  },
  {
    icon: Leaf,
    title: "Pan-India Presence",
    description:
      "With projects executed across multiple states and an international project in Nepal, EPS Projects has demonstrated its ability to successfully deliver solutions across diverse geographic and operational environments.",
    color: "emerald",
  },
  {
    icon: Shield,
    title: "Quality, Safety & Compliance",
    description:
      "Safety and quality are embedded in every stage of our work. Our commitment to Health, Safety & Environment (HSE) practices ensures reliable execution, regulatory compliance, and protection of people, assets, and the environment.",
    color: "green",
  },
  {
    icon: Users,
    title: "Customer-Centric Approach",
    description:
      "We focus on building long-term relationships by understanding client requirements, delivering practical solutions, and providing dependable support even after project completion.",
    color: "cyan",
  },
  {
    icon: DollarSign,
    title: "Innovation & Operational Excellence",
    description:
      "By leveraging modern engineering practices, efficient construction methodologies, and advanced automation technologies, we help clients achieve lower project costs, improved process control, higher efficiency, and better operational reliability.",
    color: "orange",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Delivering Engineering Excellence Through Experience, Innovation, and Execution
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            EPS Projects combines technical expertise, practical field experience, and strong project management capabilities to deliver reliable Electrical &amp; Instrumentation solutions for complex industrial environments.
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
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${colorMap[reason.color]}`}>
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
