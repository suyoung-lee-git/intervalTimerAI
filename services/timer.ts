export type TimerPhase = "work" | "rest" | "idle";

export interface TimerTick {
  phase: TimerPhase;
  remainingSecs: number;
  currentSet: number;
  totalSets: number;
}

export function startTimer(
  workSecs: number,
  restSecs: number,
  totalSets: number,
  onTick: (tick: TimerTick) => void,
  onComplete: () => void
): () => void {
  let currentSet = 1;
  let phase: TimerPhase = "work";
  let remaining = workSecs;

  const interval = setInterval(() => {
    onTick({ phase, remainingSecs: remaining, currentSet, totalSets });

    remaining -= 1;

    if (remaining < 0) {
      if (phase === "work") {
        phase = "rest";
        remaining = restSecs;
      } else {
        if (currentSet >= totalSets) {
          clearInterval(interval);
          onComplete();
          return;
        }
        currentSet += 1;
        phase = "work";
        remaining = workSecs;
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}
