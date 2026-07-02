// Lightweight, privacy-respecting usage analytics.
//
// We deliberately store nothing that identifies a visitor or a document:
// no document text, no IP addresses, no session/user IDs -- just aggregate
// counters (how many analyses ran, which document types, how long they
// were, how often we errored or rate-limited, how feedback broke down).
//
// PERSISTENCE: on Vercel, /api/analyze, /api/feedback, and /api/stats each
// run as their own isolated serverless function -- they do NOT share
// process memory with each other, even though they're all files in the
// same /api folder. A plain in-memory counter written in analyze.js is
// invisible to stats.js. So this module talks to Redis via the Vercel
// KV / Upstash REST API when it's configured, and falls back to an
// in-memory counter (useful for local `vercel dev`, or if you haven't set
// up storage yet) when it isn't. recordEvent()/getStats() are the only
// two functions the rest of the app calls, so which backend is active is
// invisible to analyze.js, feedback.js, and stats.js.
//
// TO ENABLE PERSISTENCE: in your Vercel project, go to Storage -> Create
// Database -> KV (this provisions an Upstash Redis instance and wires it
// up automatically). Once connected, Vercel sets KV_REST_API_URL and
// KV_REST_API_TOKEN as environment variables for you -- no code changes,
// no extra npm install, just redeploy. If you connect an Upstash database
// directly instead of through Vercel's KV integration, it will set
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN instead, which this
// module also checks for.

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_ENABLED = Boolean(REDIS_URL && REDIS_TOKEN);

const KEY_PREFIX = "clearclause:stats:";
const COUNTER_KEYS = {
  totalRequests: KEY_PREFIX + "totalRequests",
  completedAnalyses: KEY_PREFIX + "completedAnalyses",
  notDocumentCount: KEY_PREFIX + "notDocumentCount",
  errors: KEY_PREFIX + "errors",
  rateLimitHits: KEY_PREFIX + "rateLimitHits",
  totalDocumentLength: KEY_PREFIX + "totalDocumentLength",
  feedbackYes: KEY_PREFIX + "feedbackYes",
  feedbackNo: KEY_PREFIX + "feedbackNo",
  windowStartedAt: KEY_PREFIX + "windowStartedAt",
};
const DOC_TYPES_HASH_KEY = KEY_PREFIX + "docTypes";

// Runs a batch of Redis commands in one HTTP round-trip via Upstash's
// REST pipeline endpoint. Each command is an array like ["INCR", "key"].
async function redisPipeline(commands) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    throw new Error(`Redis pipeline failed: ${res.status} ${await res.text()}`);
  }
  return res.json(); // array of { result } | { error }, one per command
}

async function ensureWindowStarted() {
  // SET ... NX only writes if the key doesn't already exist, so this is
  // safe to call on every event without overwriting the real start time.
  await redisPipeline([["SET", COUNTER_KEYS.windowStartedAt, String(Date.now()), "NX"]]);
}

async function recordEventRedis(event, payload) {
  switch (event) {
    case "request":
      await redisPipeline([["INCR", COUNTER_KEYS.totalRequests]]);
      break;
    case "rate_limited":
      await redisPipeline([["INCR", COUNTER_KEYS.rateLimitHits]]);
      break;
    case "error":
      await redisPipeline([["INCR", COUNTER_KEYS.errors]]);
      break;
    case "not_document":
      await redisPipeline([["INCR", COUNTER_KEYS.notDocumentCount]]);
      break;
    case "feedback":
      if (payload.value === "yes") {
        await redisPipeline([["INCR", COUNTER_KEYS.feedbackYes]]);
      } else if (payload.value === "no") {
        await redisPipeline([["INCR", COUNTER_KEYS.feedbackNo]]);
      }
      break;
    case "completed": {
      const type = String(payload.documentType || "Unlabeled").trim().slice(0, 60) || "Unlabeled";
      const commands = [["INCR", COUNTER_KEYS.completedAnalyses], ["HINCRBY", DOC_TYPES_HASH_KEY, type, 1]];
      if (typeof payload.documentLength === "number") {
        commands.push(["INCRBY", COUNTER_KEYS.totalDocumentLength, payload.documentLength]);
      }
      await redisPipeline(commands);
      break;
    }
    default:
      break;
  }
  await ensureWindowStarted();
}

async function getStatsRedis() {
  const [
    totalRequestsRes,
    completedAnalysesRes,
    notDocumentCountRes,
    errorsRes,
    rateLimitHitsRes,
    totalDocumentLengthRes,
    feedbackYesRes,
    feedbackNoRes,
    windowStartedAtRes,
    docTypesRes,
  ] = await redisPipeline([
    ["GET", COUNTER_KEYS.totalRequests],
    ["GET", COUNTER_KEYS.completedAnalyses],
    ["GET", COUNTER_KEYS.notDocumentCount],
    ["GET", COUNTER_KEYS.errors],
    ["GET", COUNTER_KEYS.rateLimitHits],
    ["GET", COUNTER_KEYS.totalDocumentLength],
    ["GET", COUNTER_KEYS.feedbackYes],
    ["GET", COUNTER_KEYS.feedbackNo],
    ["GET", COUNTER_KEYS.windowStartedAt],
    ["HGETALL", DOC_TYPES_HASH_KEY],
  ]);

  const toInt = (r) => parseInt(r?.result, 10) || 0;

  const docTypesFlat = docTypesRes?.result || []; // Upstash returns HGETALL as a flat [field, value, field, value, ...] array
  const documentTypeCounts = {};
  for (let i = 0; i < docTypesFlat.length; i += 2) {
    documentTypeCounts[docTypesFlat[i]] = parseInt(docTypesFlat[i + 1], 10) || 0;
  }

  return buildStatsPayload({
    totalRequests: toInt(totalRequestsRes),
    completedAnalyses: toInt(completedAnalysesRes),
    notDocumentCount: toInt(notDocumentCountRes),
    errors: toInt(errorsRes),
    rateLimitHits: toInt(rateLimitHitsRes),
    totalDocumentLength: toInt(totalDocumentLengthRes),
    feedbackYes: toInt(feedbackYesRes),
    feedbackNo: toInt(feedbackNoRes),
    windowStartedAt: windowStartedAtRes?.result ? parseInt(windowStartedAtRes.result, 10) : Date.now(),
    documentTypeCounts,
  });
}

// ---- In-memory fallback (used for local dev, or if Redis isn't configured yet) ----

const memoryStats = {
  totalRequests: 0,
  completedAnalyses: 0,
  notDocumentCount: 0,
  errors: 0,
  rateLimitHits: 0,
  totalDocumentLength: 0,
  documentTypeCounts: Object.create(null),
  feedbackYes: 0,
  feedbackNo: 0,
  windowStartedAt: Date.now(),
};

function recordEventMemory(event, payload) {
  switch (event) {
    case "request":
      memoryStats.totalRequests++;
      break;
    case "rate_limited":
      memoryStats.rateLimitHits++;
      break;
    case "error":
      memoryStats.errors++;
      break;
    case "not_document":
      memoryStats.notDocumentCount++;
      break;
    case "feedback":
      if (payload.value === "yes") memoryStats.feedbackYes++;
      else if (payload.value === "no") memoryStats.feedbackNo++;
      break;
    case "completed": {
      memoryStats.completedAnalyses++;
      if (typeof payload.documentLength === "number") {
        memoryStats.totalDocumentLength += payload.documentLength;
      }
      const type = String(payload.documentType || "Unlabeled").trim().slice(0, 60) || "Unlabeled";
      memoryStats.documentTypeCounts[type] = (memoryStats.documentTypeCounts[type] || 0) + 1;
      break;
    }
    default:
      break;
  }
}

function getStatsMemory() {
  return buildStatsPayload({ ...memoryStats });
}

// ---- Shared response shaping ----

function buildStatsPayload({
  totalRequests,
  completedAnalyses,
  notDocumentCount,
  errors,
  rateLimitHits,
  totalDocumentLength,
  documentTypeCounts,
  feedbackYes,
  feedbackNo,
  windowStartedAt,
}) {
  const topDocumentTypes = Object.entries(documentTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([type, count]) => ({ type, count }));

  const rate = (n) => (totalRequests ? +(n / totalRequests).toFixed(3) : null);
  const totalFeedback = feedbackYes + feedbackNo;

  return {
    persistence: REDIS_ENABLED ? "redis" : "in-memory",
    windowStartedAt: new Date(windowStartedAt).toISOString(),
    totalRequests,
    completedAnalyses,
    notDocumentCount,
    errors,
    rateLimitHits,
    completionRate: rate(completedAnalyses),
    errorRate: rate(errors),
    rateLimitHitRate: rate(rateLimitHits),
    averageDocumentLength: completedAnalyses
      ? Math.round(totalDocumentLength / completedAnalyses)
      : null,
    topDocumentTypes,
    feedbackYes,
    feedbackNo,
    totalFeedback,
    satisfactionRate: totalFeedback ? +(feedbackYes / totalFeedback).toFixed(3) : null,
    note: REDIS_ENABLED
      ? "Backed by Redis (Vercel KV / Upstash) — durable across requests and cold starts."
      : "No KV_REST_API_URL/TOKEN found, so this is falling back to in-memory, per-instance counters — they reset on cold start and won't stay in sync across serverless instances. Set up Vercel KV (Storage → Create Database → KV) to make these durable. See the comment at the top of api/_stats.js.",
  };
}

// ---- Public API ----

export async function recordEvent(event, payload = {}) {
  if (REDIS_ENABLED) {
    try {
      await recordEventRedis(event, payload);
      return;
    } catch (err) {
      console.error("[stats] Redis write failed, falling back to in-memory for this event:", err.message || err);
      // fall through to in-memory so a transient Redis hiccup never breaks analyze/feedback requests
    }
  }
  recordEventMemory(event, payload);
}

export async function getStats() {
  if (REDIS_ENABLED) {
    try {
      return await getStatsRedis();
    } catch (err) {
      console.error("[stats] Redis read failed, falling back to in-memory:", err.message || err);
    }
  }
  return getStatsMemory();
}
