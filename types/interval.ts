export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export type WorkoutType =
  | "HIIT"
  | "tabata"
  | "circuit"
  | "strength"
  | "cardio"
  | "custom";

export interface WorkoutContext {
  workoutType: WorkoutType;
  fitnessLevel: FitnessLevel;
  goalMinutes: number;
  goal: string;
}

export interface IntervalPlan {
  workSecs: number;
  restSecs: number;
  sets: number;
  rationale: string;
}
