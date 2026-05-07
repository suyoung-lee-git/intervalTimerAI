import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useRecommendStore } from "../stores/recommendStore";
import { FitnessLevel, WorkoutType } from "../types/interval";

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
    router.push("/timer");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>운동 종류</Text>
      <TextInput
        style={styles.input}
        value={workoutType}
        onChangeText={(v) => setWorkoutType(v as WorkoutType)}
        placeholder="HIIT, tabata, cardio ..."
      />

      <Text style={styles.label}>체력 수준</Text>
      <TextInput
        style={styles.input}
        value={fitnessLevel}
        onChangeText={(v) => setFitnessLevel(v as FitnessLevel)}
        placeholder="beginner / intermediate / advanced"
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 4 },
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
