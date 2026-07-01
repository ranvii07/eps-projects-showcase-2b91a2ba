import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
};

const FAQ = () => {
  const [faqs, setFaqs] = useState<FaqRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("id, question, answer")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setFaqs([]);
      } else {
        setFaqs(data ?? []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {faqs === null ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <p className="text-center text-slate-500 py-12">
            Unable to load FAQs at the moment. Please try again later.
          </p>
        ) : faqs.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No FAQs available.</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
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
        )}
      </div>
    </section>
  );
};

export default FAQ;
