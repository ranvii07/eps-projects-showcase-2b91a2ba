import { z } from "zod";

// Shared by the contact form (client-side field errors) and the /api/contact
// handler in the worker (authoritative check before anything is stored).
export const contactSchema = z.object({
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

export type ContactInput = z.infer<typeof contactSchema>;
