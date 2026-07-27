"use strict";

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

const CONFIG = Object.freeze({
  port: Number(process.env.PORT || 3000),
  timezone: process.env.TIMEZONE || "Asia/Hong_Kong",
  gameId: process.env.GAME_ID || "storellet-snake",
  campaignId: process.env.CAMPAIGN_ID || "wing-nin-snake-uat",
  maxDailyAttempts: Number(process.env.MAX_DAILY_ATTEMPTS || 3),
  freeDailyAttempts: Number(process.env.FREE_DAILY_ATTEMPTS || 1),
  pointsPerExtraAttempt: Number(process.env.POINTS_PER_EXTRA_ATTEMPT || 10),
  jsonLimit: process.env.JSON_LIMIT || "256kb",
  maximumScore: 99999,
  maximumDurationMs: 1300000,
  idempotencyTtlMs: 24 * 60 * 60 * 1000
});

const CLIENT_RULES = Object.freeze({
  initialSnakeMoveMs: 160,
  snakeAutoAcceleration: true,
  speedScoreStep: 10,
  speedReductionMs: 7,
  minimumSnakeMoveMs: 75,
  blueMonsterMoveMs: 160,
  redMonsterMoveMs: 2000,
  foodLifetimeMs: 12000,
  treasureCheckMs: 15000,
  maxGameDurationMs: 1200000,
  supportsTouchControls: true,
  supportsPauseResume: true
});

app.use(cors({origin: true, credentials: false}));
app.use(express.json({limit: CONFIG.jsonLimit}));

const sessions = new Map();
const attemptsByUserDate = new Map();
const idempotencyResponses = new Map();

const rewardTiers = Object.freeze([
  {minScore: 15, maxScore: 29, rewardCode: "WN_50_2", couponTemplateCode: "TO_BE_CONFIRMED", message: "達到 15 分：消費滿 $50 減 $2 現金優惠券"},
  {minScore: 30, maxScore: 49, rewardCode: "WN_50_3", couponTemplateCode: "TO_BE_CONFIRMED", message: "達到 30 分：消費滿 $50 減 $3 現金優惠券"},
  {minScore: 50, maxScore: null, rewardCode: "WN_50_5", couponTemplateCode: "TO_BE_CONFIRMED", message: "達到 50 分：消費滿 $50 減 $5 現金優惠券"}
]);

function nowIso() { return new Date().toISOString(); }

function dateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.timezone, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getAttemptKey(userId, day = dateKey()) { return `${userId}:${day}`; }

function selectReward(score) {
  const tier = rewardTiers.find(item => score >= item.minScore && (item.maxScore === null || score <= item.maxScore));
  if (!tier) return {eligible: false, status: "NOT_ELIGIBLE", rewardCode: null, couponTemplateCode: null, message: "未達到 15 分優惠券門檻。"};
  return {...tier, eligible: true, status: "PENDING_ISSUANCE", validDaysAfterIssue: 7, expectedIssueWithinBusinessDays: 2};
}

function requireFields(body, fields) {
  return fields.filter(field => body[field] === undefined || body[field] === null || body[field] === "");
}

function idempotencyScope(req, key) {
  const userId = String(req.body?.userId || "anonymous");
  return `${req.method}:${req.route?.path || req.path}:${userId}:${key}`;
}

function purgeExpiredIdempotencyEntries(now = Date.now()) {
  for (const [key, value] of idempotencyResponses) {
    if (value.expiresAt <= now) idempotencyResponses.delete(key);
  }
}

function sendIdempotent(req, res, createResponse) {
  const key = req.get("Idempotency-Key");
  purgeExpiredIdempotencyEntries();
  const scopedKey = key ? idempotencyScope(req, key) : null;
  if (scopedKey && idempotencyResponses.has(scopedKey)) {
    const cached = idempotencyResponses.get(scopedKey);
    return res.status(cached.status).json(cached.body);
  }
  const result = createResponse();
  if (scopedKey) {
    idempotencyResponses.set(scopedKey, {
      status: result.status, body: result.body, expiresAt: Date.now() + CONFIG.idempotencyTtlMs
    });
  }
  return res.status(result.status).json(result.body);
}

function getOwnedSession(req, res) {
  const session = sessions.get(req.params.sessionId);
  if (!session) { res.status(404).json({code: "SESSION_NOT_FOUND", message: "Game session not found"}); return null; }
  if (session.userId !== String(req.body?.userId || req.query.userId || "")) {
    res.status(403).json({code: "SESSION_USER_MISMATCH", message: "Session does not belong to this user"}); return null;
  }
  return session;
}

app.get("/health", (req, res) => res.json({status: "ok", service: "storellet-snake-api", timestamp: nowIso()}));

app.get("/api/v1/game/config", (req, res) => {
  res.json({
    gameId: CONFIG.gameId, campaignId: CONFIG.campaignId, timezone: CONFIG.timezone,
    attempts: {maxPerDay: CONFIG.maxDailyAttempts, freePerDay: CONFIG.freeDailyAttempts, pointsPerExtraAttempt: CONFIG.pointsPerExtraAttempt},
    rewardTiers, clientRules: CLIENT_RULES
  });
});

app.get("/api/v1/game/users/:userId/status", (req, res) => {
  const userId = String(req.params.userId);
  const day = dateKey();
  const attemptsUsed = attemptsByUserDate.get(getAttemptKey(userId, day)) || 0;
  res.json({userId, date: day, timezone: CONFIG.timezone, attemptsUsed, attemptsRemaining: Math.max(0, CONFIG.maxDailyAttempts - attemptsUsed), nextAttemptPointsCost: attemptsUsed < CONFIG.freeDailyAttempts ? 0 : CONFIG.pointsPerExtraAttempt});
});

app.post("/api/v1/game/sessions/start", (req, res) => {
  const missing = requireFields(req.body || {}, ["userId", "gameId"]);
  if (missing.length) return res.status(400).json({code: "VALIDATION_ERROR", message: `Missing fields: ${missing.join(", ")}`});
  if (req.body.gameId !== CONFIG.gameId) return res.status(400).json({code: "INVALID_GAME_ID", message: "Unsupported gameId"});

  return sendIdempotent(req, res, () => {
    const userId = String(req.body.userId);
    const day = dateKey();
    const attemptKey = getAttemptKey(userId, day);
    const attemptsUsed = attemptsByUserDate.get(attemptKey) || 0;
    if (attemptsUsed >= CONFIG.maxDailyAttempts) return {status: 429, body: {code: "DAILY_ATTEMPT_LIMIT_REACHED", message: "Daily game attempt limit reached", attemptsUsed, attemptsRemaining: 0}};

    const attemptNo = attemptsUsed + 1;
    const pointsCharged = attemptNo <= CONFIG.freeDailyAttempts ? 0 : CONFIG.pointsPerExtraAttempt;
    const sessionId = crypto.randomUUID();
    const startedAt = nowIso();
    attemptsByUserDate.set(attemptKey, attemptNo);
    sessions.set(sessionId, {sessionId, userId, gameId: CONFIG.gameId, campaignId: CONFIG.campaignId, attemptNo, pointsCharged, startedAt, status: "STARTED", totalPausedMs: 0, pausedAt: null, platform: req.body.platform || null, appVersion: req.body.appVersion || null, clientSessionId: req.body.clientSessionId || null});
    return {status: 201, body: {sessionId, gameId: CONFIG.gameId, campaignId: CONFIG.campaignId, startedAt, attemptNo, attemptsRemaining: CONFIG.maxDailyAttempts - attemptNo, isFreeAttempt: pointsCharged === 0, pointsCharged, sessionStatus: "STARTED"}};
  });
});

app.post("/api/v1/game/sessions/:sessionId/pause", (req, res) => {
  const session = getOwnedSession(req, res);
  if (!session) return;
  return sendIdempotent(req, res, () => {
    if (session.status === "FINISHED") return {status: 409, body: {code: "SESSION_ALREADY_FINISHED", message: "Finished sessions cannot be paused"}};
    if (session.status === "PAUSED") return {status: 200, body: {sessionId: session.sessionId, sessionStatus: "PAUSED", pausedAt: session.pausedAt, totalPausedMs: session.totalPausedMs}};
    session.status = "PAUSED"; session.pausedAt = nowIso();
    return {status: 200, body: {sessionId: session.sessionId, sessionStatus: "PAUSED", pausedAt: session.pausedAt, totalPausedMs: session.totalPausedMs}};
  });
});

app.post("/api/v1/game/sessions/:sessionId/resume", (req, res) => {
  const session = getOwnedSession(req, res);
  if (!session) return;
  return sendIdempotent(req, res, () => {
    if (session.status === "FINISHED") return {status: 409, body: {code: "SESSION_ALREADY_FINISHED", message: "Finished sessions cannot be resumed"}};
    if (session.status === "STARTED") return {status: 200, body: {sessionId: session.sessionId, sessionStatus: "STARTED", resumedAt: nowIso(), totalPausedMs: session.totalPausedMs}};
    const resumedAt = new Date();
    session.totalPausedMs += Math.max(0, resumedAt.getTime() - new Date(session.pausedAt).getTime());
    session.status = "STARTED"; session.pausedAt = null;
    return {status: 200, body: {sessionId: session.sessionId, sessionStatus: "STARTED", resumedAt: resumedAt.toISOString(), totalPausedMs: session.totalPausedMs}};
  });
});

app.post("/api/v1/game/sessions/:sessionId/finish", (req, res) => {
  const missing = requireFields(req.body || {}, ["userId", "score", "durationMs", "endReason"]);
  if (missing.length) return res.status(400).json({code: "VALIDATION_ERROR", message: `Missing fields: ${missing.join(", ")}`});
  const session = getOwnedSession(req, res);
  if (!session) return;

  return sendIdempotent(req, res, () => {
    if (session.status === "FINISHED") return {status: 200, body: session.finishResponse};
    const score = Number(req.body.score);
    const durationMs = Number(req.body.durationMs);
    if (!Number.isInteger(score) || score < 0 || score > CONFIG.maximumScore) return {status: 400, body: {code: "INVALID_SCORE", message: `score must be an integer between 0 and ${CONFIG.maximumScore}`}};
    if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > CONFIG.maximumDurationMs) return {status: 400, body: {code: "INVALID_DURATION", message: "durationMs is outside the accepted range"}};

    if (session.status === "PAUSED" && session.pausedAt) {
      session.totalPausedMs += Math.max(0, Date.now() - new Date(session.pausedAt).getTime());
      session.pausedAt = null;
    }
    const finishedAt = nowIso();
    const reward = selectReward(score);
    const response = {sessionId: session.sessionId, sessionStatus: "FINISHED", userId: session.userId, score, durationMs, totalPausedMs: session.totalPausedMs, endReason: String(req.body.endReason), startedAt: session.startedAt, finishedAt, reward, serverValidation: {accepted: true, mode: "MOCK_ONLY", warning: "Production must validate authenticated user, points deduction and anti-cheat signals server-side."}};
    Object.assign(session, {status: "FINISHED", score, durationMs, endReason: response.endReason, finishedAt, reward, finishResponse: response});
    return {status: 200, body: response};
  });
});

app.get("/api/v1/game/sessions/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({code: "SESSION_NOT_FOUND", message: "Game session not found"});
  res.json(session);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({code: "INTERNAL_ERROR", message: "Unexpected server error"});
});

app.listen(CONFIG.port, () => {
  console.log(`Storellet Snake API running at http://localhost:${CONFIG.port}`);
  console.log(`API base: http://localhost:${CONFIG.port}/api/v1`);
});
