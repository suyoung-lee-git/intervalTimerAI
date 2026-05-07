import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTimerStore } from "../stores/timerStore";
import { useRecommendStore } from "../stores/recommendStore";
import { startTimer } from "../services/timer";

export default function TimerScreen() {
  const router = useRouter();
  const { plan } = useRecommendStore();
  const {
    phase,
    remainingSecs,
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
      plan.workSecs,
      plan.restSecs,
      plan.sets,
      (tick) => {
        setTick(tick);
        if (tick.remainingSecs === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  return (
    <View style={styles.container}>
      <Text style={styles.plan}>
        {plan.workSecs}초 운동 / {plan.restSecs}초 휴식 × {plan.sets}세트
      </Text>
      <Text style={styles.rationale}>{plan.rationale}</Text>

      <Text style={[styles.phase, phase === "work" ? styles.work : styles.rest]}>
        {completed ? "완료!" : phase === "work" ? "운동" : "휴식"}
      </Text>
      <Text style={styles.time}>{remainingSecs}</Text>
      <Text style={styles.sets}>
        {currentSet} / {plan.sets} 세트
      </Text>

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
  plan: { fontSize: 16, color: "#666", marginBottom: 8 },
  rationale: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 48,
  },
  phase: { fontSize: 32, fontWeight: "700", marginBottom: 8 },
  work: { color: "#FF3B30" },
  rest: { color: "#34C759" },
  time: { fontSize: 96, fontWeight: "800", color: "#1C1C1E" },
  sets: { fontSize: 20, color: "#666", marginTop: 16, marginBottom: 48 },
  stopButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  stopText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
