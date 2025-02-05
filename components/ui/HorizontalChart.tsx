import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface BarChartProps {
  totalBudget: number;
  currentSpent: number;
  spentPercentage: number;
}

export function HorizontalBarChart({ totalBudget, currentSpent, spentPercentage }: BarChartProps) {
  const backgroundColor = useThemeColor({}, "border");
  const accendColor = useThemeColor({}, "blue");
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Budget: ${totalBudget.toFixed(2)}</Text>

      <Svg height="30" width="100%">
        <Rect x="0" y="5" width="100%" height="20" rx="10" fill={backgroundColor} />
        <Rect x="0" y="5" width={`${spentPercentage}%`} height="20" rx="10" fill={accendColor} />
      </Svg>

      <Text style={styles.label}>
        Spent: ${currentSpent.toFixed(2)} ({spentPercentage.toFixed(1)}%)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
});