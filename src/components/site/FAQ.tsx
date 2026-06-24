import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does EPS Projects provide?",
    answer:
      "EPS Projects specializes in comprehensive Electrical & Instrumentation engineering services including project design & engineering, PLC/DCS/SCADA solutions, safety instrumented systems, functional safety management consulting, construction services, and low voltage electrical solutions.",
  },
  {
    question: "Which industries do you serve?",
    answer:
      "We serve a wide range of industries including manufacturing, energy & power generation, infrastructure development, distilleries, ethanol plants, co-generation power plants, captive power plants, and various industrial projects focusing on clean energy solutions.",
  },
  {
    question: "What is your project delivery approach?",
    answer:
      "We follow a comprehensive end-to-end project execution approach with meticulous planning, coordination, and on-time delivery. Our process includes initial consultation, design, installation, commissioning, and ongoing support to ensure optimal performance.",
  },
  {
    question: "Are you ISO certified?",
    answer:
      "Yes, EPS Projects maintains ISO certified quality standards and is committed to meeting customer satisfaction and regulatory requirements in quality, environmental protection, workplace safety, and health.",
  },
  {
    question: "What makes EPS Projects different from competitors?",
    answer:
      "With over 20 years of industry experience, we combine technical excellence with competitive pricing, focus on clean energy solutions, and commitment to customer satisfaction. Our expertise in layout, application, and services meets a broad spectrum of client requirements while maintaining the highest professional standards.",
  },
  {
    question: "Do you provide maintenance and support services?",
    answer:
      "Yes, we offer comprehensive maintenance programs including preventive and corrective maintenance, along with long-term technical support to ensure operational excellence and reliability of your electrical and instrumentation systems.",
  },
  {
    question: "How can I request a consultation or quote?",
    answer:
      "You can request a consultation by filling out the contact form on our website, calling us at +91 98107-31116 or +91 93156 17532, or emailing us at dvt@epsprojects.in or info@epsprojects.in. Our team will respond promptly to discuss your project requirements.",
  },
  {
    question: "What is your experience with clean energy projects?",
    answer:
      "EPS Projects has extensive expertise in clean energy integration, including co-generation power plants, captive power plants, distilleries, ethanol plants, spent wash based incineration, waste heat recovery units, and pollution control units, achieving high efficiency modern generation units.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600">
            Find answers to common questions about our services and expertise
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="bg-slate-50 rounded-lg px-6 border border-slate-200"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600 py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
