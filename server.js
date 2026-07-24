"use strict";

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const TIMEZONE = process.env.TIMEZONE || "Asia/Hong_Kong";
const GAME_ID = process.env.GAME_ID || "storellet-snake";
const CAMPAIGN_ID = process.env.CAMPAIGN_ID || "wing-nin-snake-uat";
const MAX_DAILY_ATTEMPTS = Number(process.env.MAX_DAILY_ATTEMPTS || 3);
const FREE_DAILY_ATTEMPTS = Number(process.env.FREE_DAILY_ATTEMPTS || 1);
const POINTS_PER_EXTRA_ATTEMPT = Number(process.env.POINTS_PER_EXTRA_ATTEMPT || 10);

app.use(cors({origin: true, credentials: false}));
app.use(express.json({limit: "256kb"}));

const sessions = new Map();
const attemptsByUserDate = new Map();
const idempotencyResponses = new Map();

const rewardTiers = Object.freeze([
  {
    minScore: 15,
    maxScore: 29,
    rewardCode: "WN_50_2",
    couponTemplateCode: "TO_BE_CONFIRMED",
    message: "達到 15 分：消費滿 $50 減 $2 現金優惠券"
  },
  {
    minScore: 30,
    maxScore: 49,
    rewardCode: "WN_50_3",
    couponTemplateCode: "TO_BE_CONFIRMED",
    message: "達到 30 分：消費滿 $50 減 $3 現金優惠券"
  },
  {
    minScore: 50,
    maxScore: null,
    rewardCode: "WN_50_5",
    couponTemplateCode: "TO_BE_CONFIRMED",
    message: "達到 50 分：消費滿 $50 減 $5 現金優惠券"
  }
]);

function nowIso() {
  return new Date().toISOString();
}

function dateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getAttemptKey(userId, day = dateKey()) {
  return `${userId}:${day}`;
}

function selectReward(score) {
  const tier = rewardTiers.find(item =>
    score >= item.minScore && (item.maxScore === null || score <= item.maxScore)
  );

  if (!tier) {
    return {
      eligible: false,
      status: "NOT_ELIGIBLE",
      rewardCode: null,
      couponTemplateCode: null,
      message: "未達到 15 分優惠券門檻。"
    };
  }

  return {
    eligible: true,
    status: "PENDING_ISSUANCE",
    rewardCode: tier.rewardCode,
    couponTemplateCode: tier.couponTemplateCode,
    message: tier.message,
    validDaysAfterIssue: 7,
    expectedIssueWithinBusinessDays: 2
  };
}

function requireFields(body, fields) {
  const missing = fields.filter(field => body[field] === undefined || body[field] === null || body[field] === "");
  return missing;
}

function sendIdempotent(req, res, createResponse) {
  const key = req.get("Idempotency-Key");
  if (key && idempotencyResponses.has(key)) {
    return res.status(200).json(idempotencyResponses.get(key));
  }

  const result = createResponse();
  if (key) idempotencyResponses.set(key, result.body);
  return res.status(result.status).json(result.body);
}

app.get("/health", (req, res) => {
  res.json({status: "ok", service: "storellet-snake-api", timestamp: nowIso()});
});

app.get("/api/v1/game/config", (req, res) => {
  res.json({
    gameId: GAME_ID,
    campaignId: CAMPAIGN_ID,
    timezone: TIMEZONE,
    attempts: {
      maxPerDay: MAX_DAILY_ATTEMPTS,
      freePerDay: FREE_DAILY_ATTEMPTS,
      pointsPerExtraAttempt: POINTS_PER_EXTRA_ATTEMPT
    },
    rewardTiers,
    clientRules: {
      initialSnakeMoveMs: 160,
      snakeAutoAcceleration: true,
      minimumSnakeMoveMs: 75,
      blueMonsterMoveMs: 160,
      redMonsterMoveMs: 2000,
      foodLifetimeMs: 12000,
      treasureCheckMs: 15000,
      maxGameDurationMs: 1200000
    }
  });
});

app.get("/api/v1/game/users/:userId/status", (req, res) => {
  const userId = String(req.params.userId);
  const day = dateKey();
  const attemptsUsed = attemptsByUserDate.get(getAttemptKey(userId, day)) || 0;
  res.json({
    userId,
    date: day,
    timezone: TIMEZONE,
    attemptsUsed,
    attemptsRemaining: Math.max(0, MAX_DAILY_ATTEMPTS - attemptsUsed),
    nextAttemptPointsCost: attemptsUsed < FREE_DAILY_ATTEMPTS ? 0 : POINTS_PER_EXTRA_ATTEMPT
  });
});

app.post("/api/v1/game/sessions/start", (req, res) => {
  const missing = requireFields(req.body || {}, ["userId", "gameId"]);
  if (missing.length) {
    return res.status(400).json({code: "VALIDATION_ERROR", message: `Missing fields: ${missing.join(", ")}`});
  }

  if (req.body.gameId !== GAME_ID) {
    return res.status(400).json({code: "INVALID_GAME_ID", message: "Unsupported gameId"});
  }

  return sendIdempotent(req, res, () => {
    const userId = String(req.body.userId);
    const day = dateKey();
    const attemptKey = getAttemptKey(userId, day);
    const attemptsUsed = attemptsByUserDate.get(attemptKey) || 0;

    if (attemptsUsed >= MAX_DAILY_ATTEMPTS) {
      return {
        status: 429,
        body: {
          code: "DAILY_ATTEMPT_LIMIT_REACHED",
          message: "Daily game attempt limit reached",
          attemptsUsed,
          attemptsRemaining: 0
        }
      };
    }

    const attemptNo = attemptsUsed + 1;
    const pointsCharged = attemptNo <= FREE_DAILY_ATTEMPTS ? 0 : POINTS_PER_EXTRA_ATTEMPT;
    const sessionId = crypto.randomUUID();
    const startedAt = nowIso();

    attemptsByUserDate.set(attemptKey, attemptNo);
    sessions.set(sessionId, {
      sessionId,
      userId,
      gameId: GAME_ID,
      campaignId: CAMPAIGN_ID,
      attemptNo,
      pointsCharged,
      startedAt,
      status: "STARTED",
      platform: req.body.platform || null,
      appVersion: req.body.appVersion || null,
      clientSessionId: req.body.clientSessionId || null
    });

    return {
      status: 201,
      body: {
        sessionId,
        gameId: GAME_ID,
        campaignId: CAMPAIGN_ID,
        startedAt,
        attemptNo,
        attemptsRemaining: MAX_DAILY_ATTEMPTS - attemptNo,
        isFreeAttempt: pointsCharged === 0,
        pointsCharged,
        sessionStatus: "STARTED"
      }
    };
  });
});

app.post("/api/v1/game/sessions/:sessionId/finish", (req, res) => {
  const missing = requireFields(req.body || {}, ["userId", "score", "durationMs", "endReason"]);
  if (missing.length) {
    return res.status(400).json({code: "VALIDATION_ERROR", message: `Missing fields: ${missing.join(", ")}`});
  }

  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({code: "SESSION_NOT_FOUND", message: "Game session not found"});
  }
  if (session.userId !== String(req.body.userId)) {
    return res.status(403).json({code: "SESSION_USER_MISMATCH", message: "Session does not belong to this user"});
  }

  return sendIdempotent(req, res, () => {
    if (session.status === "FINISHED") {
      return {status: 200, body: session.finishResponse};
    }

    const score = Number(req.body.score);
    const durationMs = Number(req.body.durationMs);
    if (!Number.isInteger(score) || score < 0 || score > 99999) {
      return {status: 400, body: {code: "INVALID_SCORE", message: "score must be an integer between 0 and 99999"}};
    }
    if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 1300000) {
      return {status: 400, body: {code: "INVALID_DURATION", message: "durationMs is outside the accepted range"}};
    }

    const finishedAt = nowIso();
    const reward = selectReward(score);
    const response = {
      sessionId: session.sessionId,
      sessionStatus: "FINISHED",
      userId: session.userId,
      score,
      durationMs,
      endReason: String(req.body.endReason),
      startedAt: session.startedAt,
      finishedAt,
      reward,
      serverValidation: {
        accepted: true,
        mode: "MOCK_ONLY",
        warning: "Production must validate authenticated user, points deduction and anti-cheat signals server-side."
      }
    };

    session.status = "FINISHED";
    session.score = score;
    session.durationMs = durationMs;
    session.endReason = response.endReason;
    session.finishedAt = finishedAt;
    session.reward = reward;
    session.finishResponse = response;

    return {status: 200, body: response};
  });
});

app.get("/api/v1/game/sessions/:sessionId", (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({code: "SESSION_NOT_FOUND", message: "Game session not found"});
  }
  res.json(session);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({code: "INTERNAL_ERROR", message: "Unexpected server error"});
});

app.listen(PORT, () => {
  console.log(`Storellet Snake API running at http://localhost:${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api/v1`);
});
