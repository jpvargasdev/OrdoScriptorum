import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Rect, Line } from "react-native-svg";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";

interface BarChartProps {
	totalBudget: number;
	currentSpent: number;
	spentPercentage: number;
	title?: string;
	timeProgress?: number; // 0-100, percentage of budget period elapsed
	onPress?: () => void;
	showTimeMarker?: boolean;
}

/**
 * Get the color based on the spent percentage relative to budget
 * - Green/Blue: < 80%
 * - Orange: 80-100%
 * - Red: > 100%
 */
function getStatusColor(spentPercentage: number): string {
	if (spentPercentage >= 100) {
		return Colors.light.danger; // Red - over budget
	} else if (spentPercentage >= 80) {
		return Colors.light.warning; // Orange - approaching limit
	}
	return Colors.light.blue; // Blue/Green - healthy
}

/**
 * Get text color for the "Spent" label based on percentage
 */
function getSpentTextColor(spentPercentage: number): string {
	if (spentPercentage >= 100) {
		return Colors.light.danger;
	} else if (spentPercentage >= 80) {
		return Colors.light.warning;
	}
	return Colors.light.textSecondary;
}

/**
 * Get text color for the "Left" label based on remaining amount
 */
function getLeftTextColor(leftAmount: number): string {
	if (leftAmount < 0) {
		return Colors.light.danger;
	}
	return Colors.light.textSecondary;
}

export function HorizontalBarChart({
	title = "Total Budget",
	totalBudget,
	currentSpent,
	spentPercentage,
	timeProgress,
	onPress,
	showTimeMarker = true,
}: BarChartProps) {
	const backgroundColor = useThemeColor({}, "border");

	const barColor = getStatusColor(spentPercentage);
	const spentTextColor = getSpentTextColor(spentPercentage);
	const leftAmount = totalBudget - currentSpent;
	const leftTextColor = getLeftTextColor(leftAmount);

	// Cap the visual percentage at 100% for the bar, but show actual percentage in text
	const visualPercentage = Math.min(spentPercentage, 100);

	// Determine if budget is not set
	const hasBudget = totalBudget > 0;

	const content = (
		<View style={styles.container}>
			<ThemedText type="small" style={styles.label}>
				{title}: {hasBudget ? `${totalBudget.toFixed(2)} SEK` : "No budget set"}
			</ThemedText>

			<View style={styles.barContainer}>
				<Svg height="30" width="100%">
					{/* Background bar */}
					<Rect
						x="0"
						y="5"
						width="100%"
						height="20"
						rx="10"
						fill={backgroundColor}
					/>

					{/* Filled bar - only show if there's a budget */}
					{hasBudget && (
						<Rect
							x="0"
							y="5"
							width={`${visualPercentage}%`}
							height="20"
							rx="10"
							fill={barColor}
						/>
					)}

					{/* Time progress marker */}
					{showTimeMarker &&
						timeProgress !== undefined &&
						timeProgress > 0 &&
						hasBudget && (
							<Line
								x1={`${Math.min(timeProgress, 100)}%`}
								y1="2"
								x2={`${Math.min(timeProgress, 100)}%`}
								y2="28"
								stroke={Colors.light.textPrimary}
								strokeWidth="2"
								strokeDasharray="4,2"
							/>
						)}
				</Svg>

				{/* Time progress indicator label */}
				{showTimeMarker &&
					timeProgress !== undefined &&
					timeProgress > 0 &&
					hasBudget && (
						<View
							style={[
								styles.timeMarkerLabel,
								{
									left: `${Math.min(Math.max(timeProgress - 5, 0), 90)}%`,
								},
							]}
						>
							<ThemedText style={styles.timeMarkerText}>
								{timeProgress.toFixed(0)}%
							</ThemedText>
						</View>
					)}
			</View>

			{hasBudget ? (
				<View style={styles.statsRow}>
					<ThemedText
						type="small"
						style={[styles.label, { color: spentTextColor }]}
					>
						Spent: {currentSpent.toFixed(2)} ({spentPercentage.toFixed(1)}%)
					</ThemedText>

					<ThemedText
						type="small"
						style={[styles.label, { color: leftTextColor }]}
					>
						Left: {leftAmount.toFixed(2)} ({(100 - spentPercentage).toFixed(1)}
						%)
					</ThemedText>
				</View>
			) : (
				<ThemedText type="small" style={styles.noBudgetText}>
					Set a budget to track your spending
				</ThemedText>
			)}
		</View>
	);

	if (onPress) {
		return (
			<TouchableOpacity onPress={onPress} activeOpacity={0.7}>
				{content}
			</TouchableOpacity>
		);
	}

	return content;
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		paddingHorizontal: 16,
	},
	barContainer: {
		position: "relative",
	},
	label: {
		textAlign: "center",
		marginBottom: 4,
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	timeMarkerLabel: {
		position: "absolute",
		top: -14,
	},
	timeMarkerText: {
		fontSize: 9,
		color: Colors.light.textSecondary,
	},
	noBudgetText: {
		textAlign: "center",
		color: Colors.light.textDisabled,
		fontStyle: "italic",
	},
});
