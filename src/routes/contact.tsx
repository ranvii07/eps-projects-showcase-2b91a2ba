import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import Contact from "@/components/site/Contact";
import FAQ from "@/components/site/FAQ";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact",
      description:
        "Get in touch with EPS Projects Pvt. Ltd. for Electrical & Instrumentation project enquiries. Call +91 98107-31116 or email info@epsprojects.in.",
      path: "/contact",
    }),
  component: () => (
    <div data-testid="contact-page" className="pt-20">
      <h1 className="sr-only">Contact EPS Projects</h1>
      <Contact />
      <FAQ />
    </div>
  ),
});
