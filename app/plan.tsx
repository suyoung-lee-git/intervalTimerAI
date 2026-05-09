import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecommendStore } from "../stores/recommendStore";

export default function PlanScreen() {
  const router = useRouter();
  const { plan } = useRecommendStore();

  if (!plan) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 준비운동 */}
      <Section title="준비운동">
        <Text style={styles.body}>{plan.warmup}</Text>
      </Section>

      {/* 운동 구성 */}
      <Section title="운동 구성">
        <Text style={styles.config}>
          {plan.workSecs}초 운동  /  {plan.restSecs}초 휴식  ×  {plan.sets}세트
        </Text>
        <Text style={styles.rationale}>{plan.rationale}</Text>
      </Section>

      {/* 세트별 운동 목록 */}
      <Section title="운동 목록">
        {plan.exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseRow}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseReps}>{ex.reps}</Text>
            </View>
            <Text style={styles.exerciseTip}>💡 {ex.tips}</Text>
          </View>
        ))}
      </Section>

      {/* 예상 칼로리 */}
      <Section title="예상 칼로리 소모">
        <Text style={styles.calories}>약 {plan.estimatedCalories} kcal</Text>
      </Section>

      {/* 정리운동 */}
      <Section title="정리운동">
        <Text style={styles.body}>{plan.cooldown}</Text>
      </Section>

      {/* 타이머 시작 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/timer")}
      >
        <Text style={styles.buttonText}>타이머 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", paddingBottom: 48 },
  section: {
    marginBottom: 24,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: { fontSize: 15, color: "#333", lineHeight: 22 },
  config: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  rationale: { fontSize: 14, color: "#666", lineHeight: 20 },
  exerciseRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  exerciseName: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
  exerciseReps: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  exerciseTip: { fontSize: 13, color: "#888", lineHeight: 18 },
  calories: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FF9500",
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
