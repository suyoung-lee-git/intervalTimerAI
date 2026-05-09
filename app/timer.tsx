import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTimerStore } from "../stores/timerStore";
import { useRecommendStore } from "../stores/recommendStore";
import { startTimer } from "../services/timer";
import CircularGauge from "../components/CircularGauge";

function vibratePhaseEnd() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 120);
  setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 240);
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
  const { plan } = useRecommendStore();
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
          vibratePhaseEnd();
        }
      },
      () => {
        setCompleted();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    );
    setStopFn(stop);
    setRunning(true);
    return () => stop();
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
