import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTimerStore } from "../stores/timerStore";
import { useRecommendStore } from "../stores/recommendStore";
import { startTimer } from "../services/timer";
import CircularGauge from "../components/CircularGauge";

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

  const progress =
    phaseTotalSecs > 0 ? (phaseTotalSecs - remainingSecs) / phaseTotalSecs : 0;
  const phaseLabel = completed ? "완료!" : phase === "work" ? "운동" : "휴식";
  const phaseColor = phase === "work" ? styles.work : styles.rest;

  return (
    <View style={styles.container}>
      <Text style={styles.plan}>
        {plan.workSecs}초 운동 / {plan.restSecs}초 휴식 × {plan.sets}세트
      </Text>
      <Text style={styles.rationale}>{plan.rationale}</Text>

      <View style={styles.gaugeWrapper}>
        <CircularGauge progress={completed ? 1 : progress} phase={phase} />
        <View style={styles.gaugeCenter}>
          <Text style={[styles.phase, phaseColor]}>{phaseLabel}</Text>
          <Text style={styles.time}>{remainingSecs}</Text>
          <Text style={styles.sets}>
            {currentSet} / {plan.sets}
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
  plan: { fontSize: 15, color: "#666", marginBottom: 4 },
  rationale: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
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
  phase: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  work: { color: "#FF3B30" },
  rest: { color: "#34C759" },
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
