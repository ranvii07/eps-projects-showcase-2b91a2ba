import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { buildPageHead } from "@/lib/site";
import Hero from "@/components/site/Hero";
import CompanyStats from "@/components/site/CompanyStats";
import Services from "@/components/site/Services";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import FeaturedProjects from "@/components/site/FeaturedProjects";
import ClientsShowcase from "@/components/site/ClientsShowcase";
import Contact from "@/components/site/Contact";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Electrical & Instrumentation Project Solutions",
      description:
        "EPS Projects Pvt. Ltd. delivers integrated Electrical & Instrumentation solutions for industrial and clean-energy projects across India through design, supply, execution, and commissioning.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  return (
    <div data-testid="home-page">
      <Hero />
      <CompanyStats />
      <Services />
      <WhyChooseUs />
      <FeaturedProjects />
      <ClientsShowcase />

      <section className="bg-blue-600 py-16" data-testid="home-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Have a project in mind?
            </h2>
            <p className="text-blue-100 text-lg">
              Let's discuss how EPS Projects can deliver it end-to-end.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate({ to: "/contact" })}
            data-testid="home-cta-contact-btn"
            className="bg-white text-blue-700 hover:bg-slate-100 px-8 py-6 text-lg group"
          >
            Request a Consultation
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
        </div>
      </section>

      <Contact />
    </div>
  );
}
