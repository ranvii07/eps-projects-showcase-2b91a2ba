import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const INITIAL_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

type FormState = typeof INITIAL_FORM;
type FieldId = keyof FormState;

const FIELDS: Array<{ id: Exclude<FieldId, "message">; label: string; type: string; placeholder: string }> = [
  { id: "name", label: "Full Name *", type: "text", placeholder: "Enter your name" },
  { id: "email", label: "Email Address *", type: "email", placeholder: "your.email@example.com" },
  { id: "phone", label: "Phone Number *", type: "tel", placeholder: "+91 XXXXX XXXXX" },
  { id: "subject", label: "Subject *", type: "text", placeholder: "How can we help you?" },
];

const ContactForm = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    if (!name || !email || !message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: formData.phone.trim() || null,
      subject: formData.subject.trim() || null,
      message,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error("Unable to send message", { description: error.message });
      return;
    }

    toast.success("Message Sent!", {
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    setFormData(INITIAL_FORM);
  };

  return (
    <div className="lg:col-span-2">
      <Card className="shadow-xl">
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-6">
              {FIELDS.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full"
                    data-testid={`contact-input-${field.id}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
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
                data-testid="contact-input-message"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="contact-submit-btn"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Sending...</span>
              ) : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
