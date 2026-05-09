export type TimerPhase = "warmup" | "work" | "rest" | "cooldown" | "idle";

export interface TimerTick {
  phase: TimerPhase;
  remainingSecs: number;
  currentSet: number;
  totalSets: number;
  phaseTotalSecs: number;
}

export function startTimer(
  warmupSecs: number,
  workSecs: number,
  restSecs: number,
  totalSets: number,
  cooldownSecs: number,
  onTick: (tick: TimerTick) => void,
  onComplete: () => void
): () => void {
  let currentSet = 1;
  let phase: TimerPhase = warmupSecs > 0 ? "warmup" : "work";
  let remaining = warmupSecs > 0 ? warmupSecs : workSecs;

  const phaseTotalFor = (p: TimerPhase): number => {
    if (p === "warmup") return warmupSecs;
    if (p === "work") return workSecs;
    if (p === "rest") return restSecs;
    if (p === "cooldown") return cooldownSecs;
    return 0;
  };

  const interval = setInterval(() => {
    onTick({
      phase,
      remainingSecs: remaining,
      currentSet,
      totalSets,
      phaseTotalSecs: phaseTotalFor(phase),
    });

    remaining -= 1;

    if (remaining < 0) {
      if (phase === "warmup") {
        phase = "work";
        remaining = workSecs;
      } else if (phase === "work") {
        phase = "rest";
        remaining = restSecs;
      } else if (phase === "rest") {
        if (currentSet >= totalSets) {
          if (cooldownSecs > 0) {
            phase = "cooldown";
            remaining = cooldownSecs;
          } else {
            clearInterval(interval);
            onComplete();
            return;
          }
        } else {
          currentSet += 1;
          phase = "work";
          remaining = workSecs;
        }
      } else if (phase === "cooldown") {
        clearInterval(interval);
        onComplete();
        return;
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}
