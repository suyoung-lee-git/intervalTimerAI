import { create } from "zustand";
import { TimerPhase } from "../services/timer";

interface TimerState {
  running: boolean;
  phase: TimerPhase;
  remainingSecs: number;
  currentSet: number;
  totalSets: number;
  completed: boolean;
  stopFn: (() => void) | null;
  setRunning: (running: boolean) => void;
  setTick: (tick: {
    phase: TimerPhase;
    remainingSecs: number;
    currentSet: number;
    totalSets: number;
  }) => void;
  setStopFn: (fn: (() => void) | null) => void;
  setCompleted: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  running: false,
  phase: "idle",
  remainingSecs: 0,
  currentSet: 1,
  totalSets: 1,
  completed: false,
  stopFn: null,

  setRunning: (running) => set({ running }),
  setTick: (tick) => set(tick),
  setStopFn: (fn) => set({ stopFn: fn }),
  setCompleted: () => set({ completed: true, running: false }),
  reset: () =>
    set({
      running: false,
      phase: "idle",
      remainingSecs: 0,
      currentSet: 1,
      completed: false,
      stopFn: null,
    }),
}));
