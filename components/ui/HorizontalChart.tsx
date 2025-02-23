import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { ThemedText } from "../ThemedText";

interface BarChartProps {
	totalBudget: number;
	currentSpent: number;
	spentPercentage: number;
	title?: string;
}

export function HorizontalBarChart({
	title = "Total Budget",
	totalBudget,
	currentSpent,
	spentPercentage,
}: BarChartProps) {
	const backgroundColor = useThemeColor({}, "border");
	const accendColor = useThemeColor({}, "blue");

	return (
		<View style={styles.container}>
			<ThemedText type="small" style={styles.label}>
				{title}: {totalBudget.toFixed(2)} SEK
			</ThemedText>

			<Svg height="30" width="100%">
				<Rect
					x="0"
					y="5"
					width="100%"
					height="20"
					rx="10"
					fill={backgroundColor}
				/>
				<Rect
					x="0"
					y="5"
					width={`${spentPercentage}%`}
					height="20"
					rx="10"
					fill={accendColor}
				/>
			</Svg>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="small" style={styles.label}>
          Spent: {currentSpent.toFixed(2)} ({spentPercentage.toFixed(1)}%) SEK
        </ThemedText>

        <ThemedText type="small" style={styles.label}>
          Money Left: {(totalBudget - currentSpent).toFixed(2)} SEK
        </ThemedText>
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		paddingHorizontal: 16,
	},
	label: {
		textAlign: "center",
		marginBottom: 4,
	},
});
