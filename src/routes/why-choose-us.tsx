import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import WhyChooseUs from "@/components/site/WhyChooseUs";

export const Route = createFileRoute("/why-choose-us")({
  head: () =>
    buildPageHead({
      title: "Why Choose Us",
      description:
        "EPS Projects combines proven industrial experience, integrated project delivery, pan-India presence, and a strong commitment to quality, safety, and operational excellence.",
      path: "/why-choose-us",
    }),
  component: () => (
    <div data-testid="why-choose-us-page" className="pt-20">
      <WhyChooseUs />
    </div>
  ),
});
