// Worker-side handler for POST /api/contact (wired in src/server.ts).
// Stores the enquiry in Supabase, then emails a notification to the business
// inbox through the Cloudflare `send_email` binding declared in wrangler.jsonc.
// The row is the source of truth (it shows in the CMS under Contact
// Management), so a failed notification never fails the submission.

import { contactSchema, type ContactInput } from "./contact-schema";

const NOTIFY_TO = "info@epsprojects.in";
const NOTIFY_FROM = { email: "website@epsprojects.com", name: "EPS Projects Website" };

type SendEmailBinding = {
  send(message: {
    to: string;
    from: { email: string; name: string };
    replyTo?: string;
    subject: string;
    text: string;
  }): Promise<unknown>;
};

export type ContactEnv = { CONTACT_NOTIFY?: SendEmailBinding };
type WaitUntil = { waitUntil?: (promise: Promise<unknown>) => void };

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function storeSubmission(input: ContactInput): Promise<boolean> {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("[contact] Missing Supabase URL or publishable key");
    return false;
  }

  // Same anonymous insert the browser used to make; RLS still decides.
  const response = await fetch(`${url}/rest/v1/contact_submissions`, {
    method: "POST",
    headers: { apikey: key, "content-type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      company: input.company || null,
      subject: input.subject || null,
      message: input.message,
      source: "website",
    }),
  });
  if (!response.ok) {
    console.error("[contact] Insert failed", response.status, await response.text());
    return false;
  }
  return true;
}

async function sendNotification(env: ContactEnv, input: ContactInput): Promise<void> {
  if (!env.CONTACT_NOTIFY) {
    console.warn("[contact] CONTACT_NOTIFY binding missing; notification skipped");
    return;
  }
  const subject = oneLine(input.subject) || "Website enquiry";
  await env.CONTACT_NOTIFY.send({
    to: NOTIFY_TO,
    from: NOTIFY_FROM,
    replyTo: input.email,
    subject: oneLine(`New enquiry: ${subject} (${input.name})`).slice(0, 200),
    text: [
      "New enquiry from the contact form on www.epsprojects.com",
      "",
      `Name:    ${input.name}`,
      `Email:   ${input.email}`,
      `Phone:   ${input.phone || "-"}`,
      `Company: ${input.company || "-"}`,
      `Subject: ${input.subject || "-"}`,
      "",
      "Message:",
      input.message,
      "",
      "Reply to this email to answer the sender directly.",
      "All enquiries are also listed in the CMS: https://www.epsprojects.com/admin/contact-management",
    ].join("\n"),
  });
}

export async function handleContactSubmission(
  request: Request,
  env: ContactEnv,
  ctx: WaitUntil | undefined,
): Promise<Response> {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405, { Allow: "POST" });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  const honeypot = (body as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim()) return json({ ok: true }, 200);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Invalid submission" }, 400);

  if (!(await storeSubmission(parsed.data))) return json({ error: "Unable to save" }, 502);

  const notification = sendNotification(env, parsed.data).catch((error) =>
    console.error("[contact] Notification failed", error),
  );
  if (ctx?.waitUntil) ctx.waitUntil(notification);
  else await notification;

  return json({ ok: true }, 200);
}
