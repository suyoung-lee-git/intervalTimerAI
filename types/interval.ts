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

export interface Exercise {
  name: string;
  reps: string;
  tips: string;
}

export interface IntervalPlan {
  warmupSecs: number;
  workSecs: number;
  restSecs: number;
  sets: number;
  cooldownSecs: number;
  rationale: string;
  exercises: Exercise[];
  warmup: string;
  cooldown: string;
  estimatedCalories: number;
}
