import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";

const sections = [
  {
    heading: "Introduction",
    body:
      'EPS Projects Pvt. Ltd. ("we", "us", or "our") is committed to protecting the privacy of visitors to our website. This Privacy Policy explains how we collect, use, and safeguard information when you interact with our website and services.',
  },
  {
    heading: "Information We Collect",
    body:
      "We may collect information you voluntarily provide through enquiry or contact forms, such as your name, email address, phone number, and project details. We may also collect non-identifying technical information such as browser type and pages visited.",
  },
  {
    heading: "How We Use Information",
    body:
      "Information submitted through our website is used solely to respond to your enquiries, provide requested information, and improve our services. We do not sell or rent your personal information to third parties.",
  },
  {
    heading: "Data Security",
    body:
      "We implement reasonable technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    heading: "Contact Us",
    body:
      "If you have any questions about this Privacy Policy, please contact us at info@epsprojects.in or call +91 98107-31116.",
  },
];

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageHead({
      title: "Privacy Policy",
      description:
        "Read the Privacy Policy of EPS Projects Pvt. Ltd. to understand how we collect, use, and protect your information.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div data-testid="privacy-page" className="bg-zinc-950 min-h-screen">
      <PageHeader title="Privacy Policy" subtitle="How we collect, use, and protect your information." />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-sm mb-10">Last updated: June 2026</p>
          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={section.heading} data-testid={`privacy-section-${index}`}>
                <h2 className="text-2xl font-bold text-white mb-3">{section.heading}</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
