import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useRecommendStore } from "../stores/recommendStore";
import { FitnessLevel, WorkoutType } from "../types/interval";

const WORKOUT_TYPES: { value: WorkoutType; label: string }[] = [
  { value: "HIIT", label: "HIIT" },
  { value: "tabata", label: "타바타" },
  { value: "circuit", label: "서킷" },
  { value: "strength", label: "근력" },
  { value: "cardio", label: "유산소" },
  { value: "custom", label: "커스텀" },
];

const FITNESS_LEVELS: { value: FitnessLevel; label: string }[] = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { fetchRecommendation, loading } = useRecommendStore();

  const [workoutType, setWorkoutType] = useState<WorkoutType>("HIIT");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("intermediate");
  const [goalMinutes, setGoalMinutes] = useState("20");
  const [goal, setGoal] = useState("");

  const handleRecommend = async () => {
    if (!goal.trim()) {
      Alert.alert("알림", "운동 목표를 입력해주세요.");
      return;
    }
    await fetchRecommendation({
      workoutType,
      fitnessLevel,
      goalMinutes: Number(goalMinutes),
      goal,
    });
    router.push("/plan");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>운동 종류</Text>
      <View style={styles.chipRow}>
        {WORKOUT_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, workoutType === item.value && styles.chipActive]}
            onPress={() => setWorkoutType(item.value)}
          >
            <Text style={[styles.chipText, workoutType === item.value && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>체력 수준</Text>
      <View style={styles.chipRow}>
        {FITNESS_LEVELS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, styles.chipWide, fitnessLevel === item.value && styles.chipActive]}
            onPress={() => setFitnessLevel(item.value)}
          >
            <Text style={[styles.chipText, fitnessLevel === item.value && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>목표 시간 (분)</Text>
      <TextInput
        style={styles.input}
        value={goalMinutes}
        onChangeText={setGoalMinutes}
        keyboardType="numeric"
        placeholder="20"
      />

      <Text style={styles.label}>오늘의 운동 목표</Text>
      <TextInput
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
        placeholder="예: 체지방 감량, 근지구력 향상..."
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRecommend}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>AI 추천 받기</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", paddingBottom: 48 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 20, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipWide: { flex: 1, alignItems: "center" },
  chipActive: { borderColor: "#007AFF", backgroundColor: "#007AFF" },
  chipText: { fontSize: 14, color: "#444" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
