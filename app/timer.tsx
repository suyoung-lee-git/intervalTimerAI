import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { useTimerStore } from "../stores/timerStore";
import { useRecommendStore } from "../stores/recommendStore";
import { startTimer, TimerPhase } from "../services/timer";
import CircularGauge from "../components/CircularGauge";

function vibrate(pulses: number) {
  for (let i = 0; i < pulses; i++) {
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), i * 120);
  }
}

const REST_MESSAGES = [
  "잘 하고 있어요! 잠깐 숨을 고르세요 💪",
  "훌륭해요! 다음 세트도 파이팅! 🔥",
  "최고예요! 몸이 회복되고 있어요 ⚡",
  "대단해요! 조금만 더 힘내세요! 🎯",
  "완벽해요! 이 페이스 유지하세요! 🏆",
];

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m > 0 && s > 0) return `${m}분 ${s}초`;
  if (m > 0) return `${m}분`;
  return `${s}초`;
}

export default function TimerScreen() {
  const router = useRouter();
  const { plan, soundOption } = useRecommendStore();
  const prevPhaseRef = useRef<TimerPhase>("idle");
  const soundOptionRef = useRef(soundOption);
  useEffect(() => { soundOptionRef.current = soundOption; }, [soundOption]);
  const {
    phase,
    remainingSecs,
    phaseTotalSecs,
    currentSet,
    completed,
    stopFn,
    setTick,
    setStopFn,
    setCompleted,
    setRunning,
    reset,
  } = useTimerStore();

  useEffect(() => {
    if (!plan) return;
    reset();
    const stop = startTimer(
      plan.warmupSecs,
      plan.workSecs,
      plan.restSecs,
      plan.sets,
      plan.cooldownSecs,
      (tick) => {
        setTick(tick);
        if (tick.remainingSecs === 0) {
          vibrate(tick.phase === "rest" ? 4 : 8);
        }
        if (tick.phase !== prevPhaseRef.current) {
          prevPhaseRef.current = tick.phase;
          if (soundOptionRef.current !== "none" && plan) {
            const ex = plan.exercises[(tick.currentSet - 1) % plan.exercises.length];
            const title =
              tick.phase === "warmup" ? "준비운동" :
              tick.phase === "work"   ? `${ex.name} ${ex.reps}` :
              tick.phase === "rest"   ? "휴식" :
              tick.phase === "cooldown" ? "정리운동" : "";
            const body =
              tick.phase === "warmup" ? plan.warmup :
              tick.phase === "work"   ? ex.tips :
              tick.phase === "rest"   ? REST_MESSAGES[(tick.currentSet - 1) % REST_MESSAGES.length] :
              tick.phase === "cooldown" ? plan.cooldown : "";
            if (soundOptionRef.current === "beep") {
              Speech.speak("삐", { language: "ko-KR", rate: 3.0, pitch: 2.0 });
            } else {
              Speech.stop();
              const text = body ? `${title}. ${body}` : title;
              Speech.speak(text, { language: "ko-KR" });
            }
          }
        }
      },
      () => {
        setCompleted();
        vibrate(12);
        if (soundOptionRef.current === "beep") {
          Speech.speak("삐", { language: "ko-KR", rate: 3.0, pitch: 2.0 });
        } else if (soundOptionRef.current === "tts") {
          Speech.stop();
          Speech.speak("운동 완료. 수고하셨습니다!", { language: "ko-KR" });
        }
      }
    );
    setStopFn(stop);
    setRunning(true);
    vibrate(12);
    return () => { stop(); Speech.stop(); };
  }, [plan, reset, setTick, setStopFn, setCompleted, setRunning]);

  const handleStop = () => {
    stopFn?.();
    reset();
    router.back();
  };

  if (!plan) return null;

  const progress =
    phaseTotalSecs > 0 ? (phaseTotalSecs - remainingSecs) / phaseTotalSecs : 0;

  const currentExercise =
    plan.exercises[(currentSet - 1) % plan.exercises.length];

  const phaseColor =
    phase === "work"
      ? styles.work
      : phase === "rest"
      ? styles.rest
      : phase === "warmup"
      ? styles.warmup
      : phase === "cooldown"
      ? styles.cooldown
      : styles.rest;

  const phaseDescription =
    phase === "warmup"
      ? plan.warmup
      : phase === "cooldown"
      ? plan.cooldown
      : phase === "work"
      ? currentExercise.tips
      : REST_MESSAGES[(currentSet - 1) % REST_MESSAGES.length];

  const subText =
    phase === "warmup"
      ? formatDuration(plan.warmupSecs)
      : phase === "cooldown"
      ? formatDuration(plan.cooldownSecs)
      : `${plan.workSecs}초 운동 / ${plan.restSecs}초 휴식 × ${plan.sets}세트`;

  const gaugeLabel =
    completed ? "완료!" : phase === "work" ? "운동" : phase === "rest" ? "휴식" : phase === "warmup" ? "준비" : "정리";

  return (
    <View style={styles.container}>
      {/* 타이틀 영역 */}
      {phase === "work" ? (
        <View style={styles.titleRow}>
          <Text style={[styles.phaseTitle, phaseColor]}>{currentExercise.name}</Text>
          <Text style={[styles.reps, phaseColor]}>{currentExercise.reps}</Text>
        </View>
      ) : (
        <Text style={[styles.phaseTitle, phaseColor]}>
          {phase === "warmup" ? "준비운동" : phase === "cooldown" ? "정리운동" : "휴식"}
        </Text>
      )}

      <Text style={styles.phaseDesc}>{phaseDescription}</Text>
      <Text style={styles.workoutConfig}>{subText}</Text>

      <View style={styles.gaugeWrapper}>
        <CircularGauge progress={completed ? 1 : progress} phase={phase} />
        <View style={styles.gaugeCenter}>
          <Text style={[styles.gaugeLabel, phaseColor]}>{gaugeLabel}</Text>
          <Text style={styles.time}>{remainingSecs}</Text>
          <Text style={styles.sets}>
            {phase === "work" || phase === "rest"
              ? `${currentSet} / ${plan.sets}`
              : ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
        <Text style={styles.stopText}>중단</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  reps: {
    fontSize: 16,
    fontWeight: "600",
  },
  phaseDesc: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  workoutConfig: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 32,
  },
  gaugeWrapper: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  gaugeCenter: {
    position: "absolute",
    alignItems: "center",
  },
  gaugeLabel: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  work: { color: "#FF3B30" },
  rest: { color: "#34C759" },
  warmup: { color: "#FFCC00" },
  cooldown: { color: "#5AC8FA" },
  time: { fontSize: 72, fontWeight: "800", color: "#1C1C1E", lineHeight: 80 },
  sets: { fontSize: 16, color: "#888", marginTop: 4 },
  stopButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  stopText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
