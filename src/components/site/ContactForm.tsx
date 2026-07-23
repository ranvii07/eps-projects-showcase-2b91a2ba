import { useState } from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const INITIAL_FORM = { name: "", email: "", phone: "", company: "", subject: "", message: "" };

type FormState = typeof INITIAL_FORM;
type FieldId = keyof FormState;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Enter a valid email")
    .max(255, "Email is too long"),
  phone: z.string().trim().max(30, "Phone number is too long"),
  company: z.string().trim().max(150, "Company name is too long"),
  subject: z.string().trim().max(200, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

const FIELDS: Array<{
  id: Exclude<FieldId, "message">;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}> = [
  {
    id: "name",
    label: "Full Name *",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
  {
    id: "email",
    label: "Email Address *",
    type: "email",
    placeholder: "your.email@example.com",
    required: true,
  },
  { id: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
  { id: "subject", label: "Subject", type: "text", placeholder: "How can we help you?" },
  { id: "company", label: "Company", type: "text", placeholder: "Your company (optional)" },
];

const ContactForm = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name as FieldId] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (honeypot.trim()) {
      toast.success("Message Sent!", {
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      setFormData(INITIAL_FORM);
      setHoneypot("");
      return;
    }

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<FieldId, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldId | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    const { name, email, phone, company, subject, message } = parsed.data;

    setIsSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject: subject || null,
      message,
      source: "website",
    });
    setIsSubmitting(false);

    if (error) {
      // Don't surface raw PostgREST/RLS error details to the public site.
      toast.error("Unable to send message", {
        description: "Something went wrong. Please try again, or email us directly.",
      });
      return;
    }

    toast.success("Message Sent!", {
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  return (
    <div className="lg:col-span-2">
      <Card className="bg-zinc-900 border-zinc-800 text-foreground shadow-xl">
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-6">
              {FIELDS.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full"
                    aria-invalid={errors[field.id] ? true : undefined}
                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                    data-testid={`contact-input-${field.id}`}
                  />
                  {errors[field.id] && (
                    <p
                      id={`${field.id}-error`}
                      className="mt-1 text-sm text-red-400"
                      data-testid={`contact-error-${field.id}`}
                    >
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Message *
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project requirements..."
                rows={6}
                className="w-full"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                data-testid="contact-input-message"
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="mt-1 text-sm text-red-400"
                  data-testid="contact-error-message"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <Input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="contact-submit-btn"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
