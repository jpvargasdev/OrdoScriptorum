import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import Section from "./Section";
import { HorizontalBarChart } from "./HorizontalChart";
import { ThemedText } from "../ThemedText";
import { View, StyleSheet } from "react-native";

interface ChartData {
	net_worth: number;
	net_balance: number;
	income: {
		totalIncome: number;
		totalExpenses: number;
		percentage: number;
	};
	needs: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	};
	wants: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	};
	savings: {
		totalBudget: number;
		currentSpent: number;
		spentPercentage: number;
	};
}

function getIncomePercentage(total_income: number, total_expenses: number) {
	if (Math.abs(total_expenses) <= 0) {
		return 0;
	}

  if (Math.abs(total_income) <= 0) {
    return 0;
  }

	const percentage = (total_expenses / total_income) * 100;
	return Math.abs(percentage);
}

function getChartData(budget: BudgetSummary | null): ChartData | null {
	if (!budget) {
		return null;
	}
	const net_percentage = getIncomePercentage(
		budget.total_income,
		budget.total_expenses,
	);
	const chartData = {
		net_worth: budget.net_worth,
		net_balance: budget.net_balance,
		income: {
			totalIncome: budget.total_income,
			totalExpenses: budget.total_expenses,
			percentage: net_percentage,
		},
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
	const data = getChartData(budget);

	return (
		<ThemedView lightColor={backgroundColor} darkColor={backgroundColor}>
			<Section text="Net Worth" isOpen>
				<View style={styles.netWorth}>
					<ThemedText type="small">Net Worth: {data?.net_worth} SEK</ThemedText>
					<ThemedText type="small">
						Net Balance: {data?.net_balance} SEK
					</ThemedText>
				</View>
			</Section>
			<Section text="Budget Summary">
				{data && (
					<HorizontalBarChart
						totalBudget={data.income.totalIncome}
						currentSpent={data.income.totalExpenses || 0}
						spentPercentage={data.income.percentage}
						title="Total Income"
					/>
				)}
			</Section>
			<Section text="Needs 50%">
				{data?.needs && (
					<HorizontalBarChart
						totalBudget={data.needs.totalBudget}
						currentSpent={data.needs.currentSpent}
						spentPercentage={data.needs.spentPercentage}
					/>
				)}
			</Section>
			<Section text="Wants 30%">
				{data?.wants && (
					<HorizontalBarChart
						totalBudget={data.wants.totalBudget}
						currentSpent={data.wants.currentSpent}
						spentPercentage={data.wants.spentPercentage}
					/>
				)}
			</Section>
			<Section text="Savings 20%">
				{data?.savings && (
					<HorizontalBarChart
						totalBudget={data.savings.totalBudget}
						currentSpent={data.savings.currentSpent}
						spentPercentage={data.savings.spentPercentage}
					/>
				)}
			</Section>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	netWorth: {
		padding: 8,
	},
});
