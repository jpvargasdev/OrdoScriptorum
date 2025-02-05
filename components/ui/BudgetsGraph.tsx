import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import React from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import Section from "./Section";
import { HorizontalBarChart } from "./HorizontalChart";

interface ChartData {
	needs: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	};
	wants: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	}
	savings: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	}
}

function getChartData(budget: BudgetSummary | null) : ChartData | null {
	if (!budget) {
		return null;
	}

	const chartData = {
		needs: {
			totalBudget: budget.needs_budget,
			currentSpent: budget.needs_amount,
			spentPercentage: budget.needs_percentage,
		},
		wants: {
			totalBudget: budget.wants_budget,
			currentSpent: budget.wants_amount,
			spentPercentage: budget.wants_percentage,
		},
		savings: {
			totalBudget: budget.savings_budget,
			currentSpent: budget.savings_amount,
			spentPercentage: budget.savings_percentage,
		},
	};

	return chartData;
}

export function BudgetsGraph({ budget }: { budget: BudgetSummary | null }) {
	const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "textSecondary");
	
	const data = getChartData(budget);
	
	return (
		<ThemedView lightColor={backgroundColor} darkColor={backgroundColor}>
			<Section text="Needs" >
				{data?.needs && (
				  <HorizontalBarChart totalBudget={data.needs.totalBudget} currentSpent={data.needs.currentSpent} spentPercentage={data.needs.spentPercentage} />
				)}	
			</Section>
			<Section text="Wants" >
				{data?.wants && (
				  <HorizontalBarChart totalBudget={data.needs.totalBudget} currentSpent={data.needs.currentSpent} spentPercentage={data.needs.spentPercentage} />
				)}
			</Section>
			<Section text="Savings" >
				{data?.savings && (
				  <HorizontalBarChart totalBudget={data.needs.totalBudget} currentSpent={data.needs.currentSpent} spentPercentage={data.needs.spentPercentage} />
				)}
			</Section>
		</ThemedView>
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
});
