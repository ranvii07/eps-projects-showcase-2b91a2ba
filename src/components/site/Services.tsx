import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, HardHat, Wrench, Settings, CheckCircle, type LucideIcon } from "lucide-react";

type Service = { icon: LucideIcon; title: string; description: string; features: string[] };

const services: Service[] = [
  {
    icon: Settings,
    title: "Material Supply",
    description:
      "Supply of Electrical, Instrumentation, and Automation products for new plant construction, expansion projects, and modernization requirements. We ensure timely delivery of quality products sourced from trusted manufacturers and industry partners.",
    features: [],
  },
  {
    icon: HardHat,
    title: "Design & Engineering",
    description:
      "Engineering solutions covering electrical systems, substations, switchyards, instrumentation systems, automation architecture, PLC/DCS integration, and project design optimization. Our engineering approach focuses on safety, reliability, efficiency, and cost-effectiveness.",
    features: [],
  },
  {
    icon: Wrench,
    title: "Installation, Testing & Commissioning",
    description:
      "Comprehensive field execution services including erection, installation, cable laying, termination, testing, commissioning, system integration, and performance validation. Our experienced teams ensure smooth project execution while maintaining the highest standards of safety and quality.",
    features: [],
  },
  {
    icon: Gauge,
    title: "Automation & Control Systems",
    description:
      "Design, implementation, and integration of PLC, DCS, SCADA, and industrial automation solutions that improve process control, operational efficiency, and plant reliability.",
    features: [],
  },
  {
    icon: CheckCircle,
    title: "Maintenance & After-Support",
    description:
      "Dedicated technical support, troubleshooting, system optimization, and virtual assistance to help clients maintain uninterrupted operations and maximize equipment performance.",
    features: [],
  },
];

const industries = [
  { name: "Manufacturing", image: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxlbGVjdHJpY2FsJTIwY29udHJvbCUyMHBhbmVsc3xlbnwwfHx8fDE3NjcwMDk2Mjd8MA&ixlib=rb-4.1.0&q=85" },
  { name: "Energy & Power", image: "https://images.unsplash.com/photo-1554050546-c125a25df013?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxwb3dlciUyMHBsYW50JTIwaW5zdHJ1bWVudGF0aW9ufGVufDB8fHx8MTc2NzAwOTYzM3ww&ixlib=rb-4.1.0&q=85" },
  { name: "Infrastructure", image: "https://images.unsplash.com/photo-1760789149696-30ce2d28b331?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxpbmR1c3RyaWFsJTIwZWxlY3RyaWNhbCUyMGVxdWlwbWVudHxlbnwwfHx8fDE3NjcwMDk2NDF8MA&ixlib=rb-4.1.0&q=85" },
  { name: "Industrial Projects", image: "https://images.pexels.com/photos/19521860/pexels-photo-19521860.jpeg" },
];

const Services = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
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
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={`${service.title}-${idx}`} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-400 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
