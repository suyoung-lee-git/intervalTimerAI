import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "인터벌 타이머 AI" }} />
      <Stack.Screen name="plan" options={{ title: "추천 결과" }} />
      <Stack.Screen name="timer" options={{ title: "타이머" }} />
    </Stack>
  );
}
