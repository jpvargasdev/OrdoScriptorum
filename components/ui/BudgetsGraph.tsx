import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "../ThemedView";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import React from "react";

const { width } = Dimensions.get("window");

function getChartData(budget: BudgetSummary) {
	const { needs_amount, needs_budget, needs_percentage } = budget;
	const { wants_amount, wants_budget } = budget;
	const { savings_amount, savings_budget } = budget;

	const pieData = {
		needs: [
			// Needs
			{
				value: (needs_amount / needs_budget) * 100,
				text: `${((needs_amount / needs_budget) * 100).toFixed(1)}% Spent`,
				color: "#79D2DE", // Light Blue for Needs Spent
			},
			{
				value: 100 - (needs_amount / needs_budget) * 100,
				text: `${(100 - (needs_amount / needs_budget) * 100).toFixed(1)}% Remaining`,
				color: "#FFABAB", // Light Red for Needs Remaining
			},
		],
		wants: [
			// Wants
			{
				value: (wants_amount / wants_budget) * 100,
				text: `${((wants_amount / wants_budget) * 100).toFixed(1)}% Spent`,
				color: "#ED6665", // Bright Red for Wants Spent
			},
			{
				value: 100 - (wants_amount / wants_budget) * 100,
				text: `${(100 - (wants_amount / wants_budget) * 100).toFixed(1)}% Remaining`,
				color: "#FFC107", // Yellow for Wants Remaining
			},
		],
		savings: [
			// Savings
			{
				value: (savings_amount / savings_budget) * 100,
				text: `${((savings_amount / savings_budget) * 100).toFixed(1)}% Spent`,
				color: "#4CAF50", // Green for Savings Spent
			},
			{
				value: 100 - (savings_amount / savings_budget) * 100,
				text: `${(100 - (savings_amount / savings_budget) * 100).toFixed(1)}% Remaining`,
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
						<ThemedText type="defaultSemiBold">- Available budget:</ThemedText>
						<ThemedText> {budget.wants_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">
							- Spent: {budget.wants_percentage.toFixed(1)}%
						</ThemedText>
						<ThemedText> -{budget.wants_amount} SEK</ThemedText>
					</View>
					<PieChart radius={40} data={data.wants} />
				</View>
			</View>
			<View style={styles.barContainer}>
				<ThemedText type="subtitle">Needs</ThemedText>
				<View style={styles.budgetContainer}>
					<View>
						<ThemedText type="defaultSemiBold">- Available budget:</ThemedText>
						<ThemedText> {budget.needs_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">
							- Spent: {budget.needs_percentage.toFixed(1)}%
						</ThemedText>
						<ThemedText> -{budget.needs_amount} SEK</ThemedText>
					</View>
					<PieChart radius={40} data={data.needs} />
				</View>
			</View>
			<View style={styles.barContainer}>
				<ThemedText type="subtitle">Savings</ThemedText>
				<View style={styles.budgetContainer}>
					<View>
						<ThemedText type="defaultSemiBold">- Available budget:</ThemedText>
						<ThemedText> {budget.savings_budget} SEK</ThemedText>
						<ThemedText type="defaultSemiBold">
							- Spent: {budget.savings_percentage.toFixed(1)}%
						</ThemedText>
						<ThemedText> -{budget.savings_amount} SEK</ThemedText>
					</View>
					<PieChart radius={40} data={data.savings} />
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
