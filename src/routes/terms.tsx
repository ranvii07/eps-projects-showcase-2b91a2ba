import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";

const sections = [
  {
    heading: "Acceptance of Terms",
    body: "By accessing and using the EPS Projects Pvt. Ltd. website, you accept and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.",
  },
  {
    heading: "Use of Website",
    body: "The content on this website is provided for general information about our Electrical & Instrumentation services. You agree to use the website lawfully and not to misuse, disrupt, or attempt to gain unauthorized access to any part of it.",
  },
  {
    heading: "Intellectual Property",
    body: "All content, including text, graphics, logos, and images on this website, is the property of EPS Projects Pvt. Ltd. and is protected by applicable intellectual property laws. It may not be reproduced without prior written consent.",
  },
  {
    heading: "Limitation of Liability",
    body: "While we strive to keep the information on this website accurate and up to date, EPS Projects Pvt. Ltd. makes no warranties regarding completeness or accuracy and is not liable for any loss arising from the use of this website.",
  },
  {
    heading: "Contact Us",
    body: "For any questions regarding these Terms & Conditions, please contact us at info@epsprojects.in or call +91 98107-31116.",
  },
];

export const Route = createFileRoute("/terms")({
  head: () =>
    buildPageHead({
      title: "Terms & Conditions",
      description:
        "Review the Terms & Conditions for using the EPS Projects Pvt. Ltd. website and services.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div data-testid="terms-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Terms & Conditions"
        subtitle="The terms governing your use of this website."
      />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-sm mb-10">Last updated: June 2026</p>
          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={section.heading} data-testid={`terms-section-${index}`}>
                <h2 className="text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
