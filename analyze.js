// /api/feedback-submit — stores the detailed feedback FORM from
// feedback.html (name/email/type/rating/message) into a real, queryable
// Supabase table (clearclause_feedback_submissions).
//
// Deliberately a separate endpoint from api/feedback.js: that one records
// anonymous, tap-only signals from the homepage results screen (yes/no,
// reason chips, would-use chips) with no name or email attached, by
// design. This one is an opt-in form where someone deliberately typed
// their name/email/message -- a different privacy posture, so it gets its
// own table and its own endpoint rather than being folded into the
// anonymous counters.
//
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see api/_supabase.js)
// -- fails with a clear 503 if not configured, rather than silently
// discarding someone's feedback.

import { SUPABASE_ENABLED, insertRow } from "./_supabase.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200; // name / email
const MAX_MESSAGE = 5000;
const FEEDBACK_TYPES = new Set(["bug", "feature", "general", "ui-ux"]);

function clean(v, maxLen) {
  return typeof v === "string" ? v.trim().slice(0, maxLen) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!SUPABASE_ENABLED) {
    console.error("[feedback-submit] Supabase not configured -- feedback was NOT saved.");
    return res.status(503).json({
      error: "Feedback storage isn't connected yet. Please email us directly in the meantime.",
    });
  }

  const body = req.body || {};

  // Honeypot -- see feedback.html for the hidden field this checks.
  if (clean(body.website, 1)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, MAX_SHORT);
  const email = clean(body.email, MAX_SHORT);
  const feedbackType = clean(body.feedbackType, 40);
  const message = clean(body.message, MAX_MESSAGE);
  const ratingRaw = parseInt(body.rating, 10);
  const rating = Number.isInteger(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;

  if (!FEEDBACK_TYPES.has(feedbackType)) {
    return res.status(400).json({ error: "Please select a feedback type." });
  }
  if (!message) return res.status(400).json({ error: "Please enter a message." });
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    await insertRow("clearclause_feedback_submissions", {
      name: name || null,
      email: email || null,
      feedback_type: feedbackType,
      rating,
      message,
    });
  } catch (err) {
    console.error("[feedback-submit]", err);
    return res.status(500).json({ error: "Something went wrong submitting your feedback. Please try again." });
  }

  return res.status(200).json({ ok: true });
}
