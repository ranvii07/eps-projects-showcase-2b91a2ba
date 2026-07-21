import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import About from "@/components/site/About";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About Us",
      description:
        "Established in 2021 and led by Mr. Digvijay Tanwar, EPS Projects Pvt. Ltd. provides integrated Electrical & Instrumentation engineering, supply, installation, testing, commissioning, and automation services across India.",
      path: "/about",
    }),
  component: () => (
    <div data-testid="about-page" className="pt-20">
      <h1 className="sr-only">About EPS Projects Pvt. Ltd.</h1>
      <About />
    </div>
  ),
});
