import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import Services from "@/components/site/Services";

export const Route = createFileRoute("/services")({
  head: () =>
    buildPageHead({
      title: "Services",
      description:
        "End-to-end Electrical, Instrumentation, and Automation solutions: material supply, design & engineering, installation, testing & commissioning, automation & control systems, and maintenance & after-support.",
      path: "/services",
    }),
  component: () => (
    <div data-testid="services-page" className="pt-20">
      <Services />
    </div>
  ),
});
