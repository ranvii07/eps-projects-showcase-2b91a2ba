import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558054665-fbe00cd7d920?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwY29udHJvbCUyMHBhbmVsc3xlbnwwfHx8fDE3NjcwMDk2Mjd8MA&ixlib=rb-4.1.0&q=85"
          alt="Industrial Control Room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Engineering Excellence in{" "}
            <span className="text-cyan-400">Electrical &amp; Instrumentation</span>{" "}
            Solutions
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
            Integrated Electrical &amp; Instrumentation solutions for industrial and clean-energy projects across India, delivered through design, supply, execution, and commissioning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              "ISO Certified Quality Standards",
              "20+ Years of Industry Experience",
              "Clean Energy Focus",
              "Turnkey Project Solutions",
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => navigate({ to: "/services" })}
              data-testid="hero-explore-services-btn"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
            >
              Explore Our Services
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/contact" })}
              data-testid="hero-consultation-btn"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg"
            >
              Request Consultation
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
