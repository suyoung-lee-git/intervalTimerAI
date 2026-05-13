import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const FEATURES = [
  { icon: "🤖", text: "AI 맞춤 추천" },
  { icon: "⏱️", text: "인터벌 타이머" },
  { icon: "🎙️", text: "음성 가이드" },
];

export default function IntroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>KBDS AI Hackathon</Text>
      </View>

      <Text style={styles.title}>Interval Timer AI</Text>
      <Text style={styles.subtitle}>AI가 당신의 운동을{"\n"}설계해드립니다</Text>

      <View style={styles.featureList}>
        {FEATURES.map((f) => (
          <View key={f.text} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>들어가기</Text>
      </TouchableOpacity>

      <View style={styles.teamSection}>
        <Text style={styles.teamName}>Team IMP</Text>
        <Text style={styles.teamMembers}>임길재 · 정태진 · 이수영 · 송희원</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  badge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  badgeText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 40,
  },
  featureList: {
    gap: 12,
    width: "100%",
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  featureIcon: { fontSize: 22 },
  featureText: { fontSize: 16, color: "#333", fontWeight: "500" },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginBottom: 48,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  teamSection: {
    alignItems: "center",
    gap: 4,
  },
  teamName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1,
  },
  teamMembers: {
    fontSize: 13,
    color: "#bbb",
  },
});
