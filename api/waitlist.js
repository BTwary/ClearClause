// /api/waitlist — stores waitlist signups from waitlist.html into a real,
// queryable Supabase table (clearclause_waitlist) instead of a third-party
// form service. Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to be
// set (see api/_supabase.js) -- fails with a clear 503 if not configured,
// rather than silently discarding a signup.

import { SUPABASE_ENABLED, insertRow } from "./_supabase.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200; // name / email / company / job title
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
    console.error("[waitlist] Supabase not configured -- signup was NOT saved.");
    return res.status(503).json({
      error: "The waitlist isn't connected to storage yet. Please email us directly in the meantime.",
    });
  }

  const body = req.body || {};

  // Honeypot: a hidden field real users never fill in (see waitlist.html).
  // Bots that blindly fill every input trip this; humans never see it.
  if (clean(body.website, 1)) {
    return res.status(200).json({ ok: true }); // pretend success, drop silently
  }

  const fullName = clean(body.fullName, MAX_SHORT);
  const workEmail = clean(body.workEmail, MAX_SHORT);
  const company = clean(body.company, MAX_SHORT);
  const jobTitle = clean(body.jobTitle, MAX_SHORT);
  const useCase = clean(body.useCase, MAX_SHORT);
  const message = clean(body.message, MAX_MESSAGE);

  if (!fullName) return res.status(400).json({ error: "Please enter your full name." });
  if (!workEmail || !EMAIL_RE.test(workEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    await insertRow("clearclause_waitlist", {
      full_name: fullName,
      work_email: workEmail,
      company: company || null,
      job_title: jobTitle || null,
      use_case: useCase || null,
      message: message || null,
    });
  } catch (err) {
    console.error("[waitlist]", err);
    return res.status(500).json({ error: "Something went wrong saving your signup. Please try again." });
  }

  return res.status(200).json({ ok: true });
}
