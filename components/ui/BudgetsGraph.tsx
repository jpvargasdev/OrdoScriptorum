import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import React from "react";

function getChartData(budget: BudgetSummary) {
	const { needs_percentage } = budget;
	const { wants_percentage } = budget;
	const { savings_percentage } = budget;

	const pieData = {
		needs: [
			// Needs
			{
				value: needs_percentage,
				text: `${needs_percentage.toFixed(2)}%`,
				color: "#79D2DE", // Light Blue for Needs Spent
			},
			{
				value: (100 - needs_percentage),
				text: `${(100 - needs_percentage).toFixed(2)}%`,
				color: "#FFABAB", // Light Red for Needs Remaining
			},
		],
		wants: [
			// Wants
			{
				value: wants_percentage,
				text: `${wants_percentage.toFixed(2)}%`,
				color: "#ED6665", // Bright Red for Wants Spent
			},
			{
				value: 100 - wants_percentage,
				text: `${(100 - wants_percentage).toFixed(2)}%`,
				color: "#FFC107", // Yellow for Wants Remaining
			},
		],
		savings: [
			// Savings
			{
				value: savings_percentage,
				text: `${savings_percentage.toFixed(2)}%`,
				color: "#4CAF50", // Green for Savings Spent
			},
			{
				value: 100 - savings_percentage,
				text: `${(100 - savings_percentage).toFixed(2)}%`,
				color: "#8BC34A", // Light Green for Savings Remaining
			},
		],
	};

	return pieData;
}

export function BudgetsGraph({ budget }: { budget: BudgetSummary | null }) {
	if (!budget) return;
	const data = React.useMemo(() => getChartData(budget), [budget]);
	return (
		<View>
			<ThemedText type="title" style={styles.subtitle}>
				Budgets:
			</ThemedText>
			<View style={styles.barContainer}>
				<ThemedText type="subtitle">Wants</ThemedText>
				<View style={styles.budgetContainer}>
					<View>
						<ThemedText type="defaultSemiBold">Available budget:</ThemedText>
						<ThemedText>{budget.wants_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">Spent:</ThemedText>
						<ThemedText type="default">-{budget.wants_amount} SEK</ThemedText>
					</View>
					<PieChart
						data={data.wants}
						showText
            textColor="black"
            radius={50}
            textSize={20}
					/>
				</View>
			</View>
			<View style={styles.barContainer}>
				<ThemedText type="subtitle">Needs</ThemedText>
				<View style={styles.budgetContainer}>
					<View>
						<ThemedText type="defaultSemiBold">Available budget:</ThemedText>
						<ThemedText>{budget.needs_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">Spent:</ThemedText>
						<ThemedText type="default">-{budget.needs_amount} SEK</ThemedText>
					</View>
					<PieChart
						data={data.needs}
						showText
            textColor="black"
            radius={50}
            textSize={20}
					/>
				</View>
			</View>
			<View style={styles.barContainer}>
				<ThemedText type="subtitle">Savings</ThemedText>
				<View style={styles.budgetContainer}>
					<View>
						<ThemedText type="defaultSemiBold">Available budget:</ThemedText>
						<ThemedText>{budget.savings_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">Spent:</ThemedText>
						<ThemedText type="default">-{budget.savings_amount} SEK</ThemedText>
					</View>
					<PieChart
						data={data.savings}
						showText
            textColor="black"
            radius={50}
            textSize={20}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	barContainer: {
		flexDirection: "column",
		width: "100%",
		marginVertical: 4,
	},
	subtitle: {
		marginVertical: 8,
	},
	budgetContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	labelTextStyle: {},
});
