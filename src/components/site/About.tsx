import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type HseRow = {
  id: string;
  title: string | null;
  body: string | null;
};
const About = () => {
  const [hseContent, setHseContent] = useState<HseRow[] | null>(null);
  const [hseError, setHseError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("hse_content")
        .select("id, title, body")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) {
        setHseError(error.message);
        setHseContent([]);
      } else {
        setHseContent(data ?? []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome to EPS Projects Pvt. Ltd.
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1554021279-722f30a555be?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxlbGVjdHJpY2FsJTIwY29udHJvbCUyMHBhbmVsc3xlbnwwfHx8fDE3NjcwMDk2Mjd8MA&ixlib=rb-4.1.0&q=85"
                alt="Control Panel"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed text-lg">
                <strong>EPS Projects Pvt. Ltd.</strong> is a leading Electrical &amp; Instrumentation Project Solutions company providing integrated engineering, supply, installation, testing, commissioning, and automation services for industrial and clean-energy projects across India.
              </p>
              <p className="text-slate-300 leading-relaxed text-lg">
                Established in 2021, the company serves a wide range of industries including Co-generation Power Plants, Captive Power Plants, Distilleries, Ethanol Plants, Sugar Plants, Steel Plants, Cement Plants, Oil &amp; Gas, Infrastructure, Hydro Power, and Pollution Control Systems. With a strong focus on quality, safety, and operational excellence, EPS Projects delivers solutions that improve plant efficiency, reliability, and long-term performance.
              </p>
              <p className="text-slate-300 leading-relaxed text-lg">
                Under the leadership of <strong>Mr. Digvijay Tanwar</strong>, who brings more than two decades of industry experience, EPS Projects has built a reputation for dependable execution, technical expertise, and customer-focused project delivery. By combining modern engineering practices with practical field experience, the company continues to support industrial growth through efficient, cost-effective, and sustainable engineering solutions.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16 bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Our Wide Scope of Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Electrical and Instrumentation Project Design & Engineering",
              "Instrumentation, Control & Automation, PLC, DCS and SCADA Solutions",
              "Safety Instrumented System Design & Implementation",
              "Functional Safety Management Consulting",
              "Construction Services",
              "Low Voltage Electrical",
            ].map((service) => (
              <div key={service} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-xl p-8 text-white border border-zinc-800">
          <h3 className="text-2xl font-bold mb-4">Our Expertise</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            EPS Projects specializes in the integration of products &amp; services primarily towards <strong className="text-cyan-400">Clean Energy plants</strong> like Co-generation Power Plants, Captive Power Plants, Distilleries, Ethanol Plants, Spent wash based Incineration, Waste heat recovery units, Pollution control units etc., achieving clean energy &amp; high efficiency modern generation units.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="border-t-4 border-cyan-400 hover:shadow-xl transition-shadow bg-zinc-900 border-zinc-800">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center">
                  <Target className="text-cyan-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Our Mission</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Our mission is to constantly deliver high-quality services that satisfy the needs and expectations of our customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-green-400 hover:shadow-xl transition-shadow bg-zinc-900 border-zinc-800">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center">
                  <Eye className="text-green-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Our Vision</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Continue to be focused, committed, and challenging to deliver excellence and scale in services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-orange-400 hover:shadow-xl transition-shadow bg-zinc-900 border-zinc-800">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center">
                  <Shield className="text-orange-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Quality &amp; Safety</h3>
              {hseContent === null ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-orange-400" size={24} />
                </div>
              ) : hseError ? (
                <p className="text-slate-300 text-center leading-relaxed">
                  Unable to load quality &amp; safety content at the moment. Please try again later.
                </p>
              ) : hseContent.length === 0 ? (
                <p className="text-slate-300 text-center leading-relaxed">No quality &amp; safety content available.</p>
              ) : (
                <div className="space-y-4">
                  {hseContent.map((item) => (
                    <div key={item.id}>
                      {item.title && (
                        <h4 className="text-white font-semibold mb-2 text-center">{item.title}</h4>
                      )}
                      <p className="text-slate-300 text-center leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
