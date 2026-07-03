// Shared Supabase REST helper for the "real" tables in this project --
// waitlist signups, contact messages, feedback-form submissions.
//
// This is a deliberately different concern from api/_stats.js:
//   - _stats.js tracks anonymous, aggregate-only counters (no names, no
//     emails, nothing tied to a person) and is fine falling back to an
//     in-memory counter if no database is configured -- losing a page-view
//     tally on a cold start is a non-event.
//   - This module backs actual opt-in submissions with a name/email
//     attached, meant to become a real userbase you can act on (reply to,
//     export, follow up with). Silently losing one of these to an
//     in-memory fallback would mean losing a real person who tried to
//     reach you, so there is NO in-memory fallback here -- if Supabase
//     isn't configured, submission endpoints fail loudly (503) instead of
//     pretending to succeed.
//
// Setup: same two env vars as api/_stats.js's Supabase path --
//   SUPABASE_URL = <your Supabase project URL>
//   SUPABASE_SERVICE_ROLE_KEY = <your Supabase service_role secret key>
// (If you've already set these up for aggregate stats, this reuses them --
// nothing new to configure beyond running the table-creation SQL once.)

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

function headers(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Inserts one row. Throws on failure -- callers should catch and return a
// clean 500 to the client rather than leaking Supabase's raw error body
// (same lesson as the Gemini error-message fix in api/analyze.js).
export async function insertRow(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`Supabase insert into ${table} failed: ${res.status} ${await res.text()}`);
  }
}
