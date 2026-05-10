import Constants from "expo-constants";
import { IntervalPlan, WorkoutContext } from "../types/interval";

const API_URL =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  "http://localhost:3000";

export async function getIntervalRecommendation(
  context: WorkoutContext
): Promise<IntervalPlan> {
  const res = await fetch(`${API_URL}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`서버 오류 ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<IntervalPlan>;
}
