import express from "express";
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const app = express();
app.use(express.json());

// CORS — Expo Go 및 웹 브라우저 허용
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  next();
});
app.options("*", (_req, res) => res.sendStatus(200));

const SYSTEM_PROMPT = `You are a professional fitness coach specializing in interval training.
Given the user's workout context, recommend an optimal interval timer configuration.

Always respond with a valid JSON object in this exact format (no markdown, no code block):
{
  "warmupSecs": <number, warmup duration in seconds>,
  "workSecs": <number, work interval in seconds>,
  "restSecs": <number, rest interval in seconds>,
  "sets": <number, total number of sets>,
  "cooldownSecs": <number, cooldown duration in seconds>,
  "rationale": "<RULE: Korean explanation of WHY this configuration suits the user's goal and fitness level. STRICTLY FORBIDDEN: any digits, any Korean number words (e.g. 초, 분, 세트, 회, 번), any ratios (e.g. 1:1, 2:1). Mention ONLY concepts like intensity, recovery, endurance, suitability — not specific values. The app already shows all numbers separately; duplicating them here will confuse the user and break the UI.>",
  "exercises": [
    { "name": "<운동 이름>", "reps": "<횟수 또는 시간, 예: 10회 또는 45초간>", "tips": "<한국어 동작 팁>" }
  ],
  "warmup": "<RULE: Korean description of warmup movements ONLY — what to do, not how long. STRICTLY FORBIDDEN: any digits or time expressions of any form (초, 분, ~간, ~동안, ~분간, 몇 분, etc.). Only describe body movements and actions.>",
  "cooldown": "<RULE: Korean description of cooldown movements ONLY — what to do, not how long. STRICTLY FORBIDDEN: any digits or time expressions of any form (초, 분, ~간, ~동안, ~분간, 몇 분, etc.). Only describe body movements and actions.>",
  "estimatedCalories": <number, estimated calories burned>
}

Guidelines:
- TOTAL TIME CONSTRAINT (MANDATORY):
  warmupSecs + (workSecs + restSecs) × sets + cooldownSecs = goalMinutes × 60
  Example: goalMinutes=20 → total=1200s. If warmupSecs=180, cooldownSecs=180, sets=8, workSecs=45, restSecs=45:
  180 + (45+45)×8 + 180 = 180 + 720 + 180 = 1080 ✗ → adjust sets or workSecs/restSecs until the sum equals exactly goalMinutes×60.
  You MUST verify the arithmetic before responding.
- exercises: 3-5 exercises appropriate for the workout type and fitness level
- estimatedCalories: estimate based on workout duration, intensity and average body weight (70kg)
- Beginners: longer rest ratios (1:2 work:rest), fewer sets
- Intermediate: balanced ratios (1:1), moderate sets
- Advanced: shorter rest ratios (2:1), more sets
- Tabata: fixed 20s work / 10s rest / 8 sets (adjust warmup/cooldown to fit total time)
- TEXT FIELD NUMBERS FORBIDDEN: rationale, warmup, cooldown MUST NOT contain any digits or unit words (초, 분, 세트, 회, 번). Numbers belong only in numeric fields (warmupSecs, workSecs, etc.).`;

const client =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? new AnthropicBedrock({
        awsRegion: process.env.AWS_REGION ?? "us-east-1",
        awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
        awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      })
    : new AnthropicBedrock({ awsRegion: process.env.AWS_REGION ?? "us-east-1" });

app.post("/api/recommend", async (req, res) => {
  try {
    const context = req.body;
    const response = await client.messages.create({
      model: "anthropic.claude-3-haiku-20240307-v1:0",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(context) }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(cleaned);

    // 준비/정리운동 각각 10% 이내로 고정, 나머지 80%를 본운동으로 채움
    if (context.goalMinutes) {
      const totalSecs = context.goalMinutes * 60;
      const maxEach = Math.floor(totalSecs * 0.1);
      plan.warmupSecs = Math.min(plan.warmupSecs, maxEach);
      const perSet = plan.workSecs + plan.restSecs;
      const mainTarget = totalSecs - plan.warmupSecs - maxEach;
      plan.sets = Math.max(1, Math.round(mainTarget / perSet));
      plan.cooldownSecs = Math.max(0, totalSecs - plan.warmupSecs - plan.sets * perSet);
    }

    // rationale에서 숫자+단위, 비율 패턴 제거
    if (plan.rationale) {
      plan.rationale = plan.rationale
        .replace(/\d+\s*:\s*\d+\s*(비율|운동|휴식)?[가-힣]{0,4}/g, "")
        .replace(/\(\s*\d+\s*:\s*\d+\s*\)/g, "")
        .replace(/\d+\s*(초|분|세트|회)\s*[가-힣]{0,4}/g, "")
        .replace(/,\s*,/g, ",")
        .replace(/\.\s*,/g, ".")
        .replace(/\s{2,}/g, " ")
        .trim();
    }

    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "추천 생성 실패" });
  }
});

app.get("/qr", (_req, res) => res.sendFile(__dirname + "/qr.png"));

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => console.log(`API 서버 실행 중: http://localhost:${PORT}`));
