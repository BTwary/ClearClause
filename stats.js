// /api/track — records funnel events between "page loaded" and "analysis
// requested": which sample document (if any) someone clicked, and whether
// they clicked "Explain my contract" with valid-looking input.
//
// Event names and sample-document types are allowlisted here rather than
// trusted from the client, so this endpoint can't be used to write
// arbitrary keys into the stats store. No IP, cookie, or other identifier
// is read or stored -- see api/_stats.js for exactly what's tracked.

import { recordEvent } from "./_stats.js";

const ALLOWED_EVENTS = new Set(["sample_clicked", "analysis_started"]);
const ALLOWED_SAMPLE_TYPES = new Set(["lease", "freelance", "tos"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { event, sampleType } = req.body || {};

  if (!ALLOWED_EVENTS.has(event)) {
    return res.status(400).json({ error: "Unknown event." });
  }

  const payload = {};
  if (event === "sample_clicked") {
    payload.sampleType = ALLOWED_SAMPLE_TYPES.has(sampleType) ? sampleType : "other";
  }

  await recordEvent(event, payload);
  return res.status(204).end();
}
