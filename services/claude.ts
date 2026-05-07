import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { IntervalPlan, WorkoutContext } from "../types/interval";

const client = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
});

const SYSTEM_PROMPT = `You are a professional fitness coach specializing in interval training.
Given the user's workout context, recommend an optimal interval timer configuration.

Always respond with a valid JSON object in this exact format:
{
  "workSecs": <number, work interval in seconds>,
  "restSecs": <number, rest interval in seconds>,
  "sets": <number, total number of sets>,
  "rationale": "<brief Korean explanation of why this configuration suits the user>"
}

Base your recommendation on exercise science principles:
- Beginners: longer rest ratios (1:2 work:rest), fewer sets
- Intermediate: balanced ratios (1:1), moderate sets
- Advanced: shorter rest ratios (2:1), more sets
- Tabata: fixed 20s work / 10s rest / 8 sets`;

export async function getIntervalRecommendation(
  context: WorkoutContext
): Promise<IntervalPlan> {
  const response = await client.messages.create({
    model: "anthropic.claude-sonnet-4-6-20250514-v1:0",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: JSON.stringify(context),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as IntervalPlan;
}
