// /api/contact — stores contact messages from contact.html into a real,
// queryable Supabase table (clearclause_contact_messages) instead of a
// third-party form service. Requires SUPABASE_URL +
// SUPABASE_SERVICE_ROLE_KEY (see api/_supabase.js) -- fails with a clear
// 503 if not configured, rather than silently discarding a message.

import { SUPABASE_ENABLED, insertRow } from "./_supabase.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200; // name / email / subject
const MAX_MESSAGE = 5000;

function clean(v, maxLen) {
  return typeof v === "string" ? v.trim().slice(0, maxLen) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!SUPABASE_ENABLED) {
    console.error("[contact] Supabase not configured -- message was NOT saved.");
    return res.status(503).json({
      error: "The contact form isn't connected to storage yet. Please email us directly in the meantime.",
    });
  }

  const body = req.body || {};

  // Honeypot -- see contact.html for the hidden field this checks.
  if (clean(body.website, 1)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, MAX_SHORT);
  const email = clean(body.email, MAX_SHORT);
  const subject = clean(body.subject, MAX_SHORT);
  const message = clean(body.message, MAX_MESSAGE);

  if (!name) return res.status(400).json({ error: "Please enter your name." });
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!subject) return res.status(400).json({ error: "Please enter a subject." });
  if (!message) return res.status(400).json({ error: "Please enter a message." });

  try {
    await insertRow("clearclause_contact_messages", {
      name,
      email,
      subject,
      message,
    });
  } catch (err) {
    console.error("[contact]", err);
    return res.status(500).json({ error: "Something went wrong sending your message. Please try again." });
  }

  return res.status(200).json({ ok: true });
}
