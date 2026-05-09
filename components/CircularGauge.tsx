import Svg, { Circle } from "react-native-svg";
import { View } from "react-native";
import { TimerPhase } from "../services/timer";

interface Props {
  progress: number; // 0~1 (0 = empty, 1 = full)
  phase: TimerPhase;
  size?: number;
}

const RADIUS = 90;
const STROKE = 12;
const CENTER = RADIUS + STROKE;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PHASE_COLOR: Record<TimerPhase, string> = {
  work: "#FF3B30",
  rest: "#34C759",
  idle: "#C7C7CC",
};

export default function CircularGauge({ progress, phase, size = 220 }: Props) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, progress)));
  const color = PHASE_COLOR[phase];
  const viewBoxSize = (RADIUS + STROKE) * 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* 배경 원 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#E5E5EA"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* 진행 원 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>
    </View>
  );
}
