import React, { useMemo } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import Section from "./Section";
import { HorizontalBarChart } from "./HorizontalChart";
import { ThemedText } from "../ThemedText";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useUserDefaultsStore } from "@/state/user";

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

/**
 * Calculate the percentage of the budget period that has elapsed.
 * Takes into account custom start/end days of the budget period.
 */
function calculateTimeProgress(startDay: number, endDay: number): number {
	const today = new Date();
	const currentDay = today.getDate();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();

	// Calculate period start and end dates
	let periodStart: Date;
	let periodEnd: Date;

	if (startDay > endDay) {
		// Period spans two months (e.g., 25th to 24th)
		if (currentDay >= startDay) {
			// We're in the first part of the period (current month)
			periodStart = new Date(currentYear, currentMonth, startDay);
			// End is next month
			const nextMonth = currentMonth + 1;
			periodEnd = new Date(currentYear, nextMonth, endDay);
		} else {
			// We're in the second part of the period (started last month)
			const prevMonth = currentMonth - 1;
			periodStart = new Date(currentYear, prevMonth, startDay);
			periodEnd = new Date(currentYear, currentMonth, endDay);
		}
	} else {
		// Period is within the same month (e.g., 1st to 30th)
		if (currentDay >= startDay && currentDay <= endDay) {
			periodStart = new Date(currentYear, currentMonth, startDay);
			periodEnd = new Date(currentYear, currentMonth, endDay);
		} else if (currentDay < startDay) {
			// Period hasn't started yet this month, use last month
			const prevMonth = currentMonth - 1;
			periodStart = new Date(currentYear, prevMonth, startDay);
			periodEnd = new Date(currentYear, prevMonth, endDay);
		} else {
			// Period ended this month, use this month's period
			periodStart = new Date(currentYear, currentMonth, startDay);
			periodEnd = new Date(currentYear, currentMonth, endDay);
		}
	}

	// Calculate total days in period
	const totalMs = periodEnd.getTime() - periodStart.getTime();
	const totalDays = totalMs / (1000 * 60 * 60 * 24);

	// Calculate elapsed days
	const elapsedMs = today.getTime() - periodStart.getTime();
	const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

	// Calculate percentage (capped between 0 and 100)
	const percentage = (elapsedDays / totalDays) * 100;
	return Math.max(0, Math.min(100, percentage));
}

// Navigation handlers
function navigateToAllTransactions() {
	router.push("/(app)/(tabs)/transactions");
}

function navigateToCategory(category: string) {
	router.push({
		pathname: "/(app)/transactions-by",
		params: { id: category },
	});
}

export function BudgetsGraph({ budget }: { budget: BudgetSummary | null }) {
	const backgroundColor = useThemeColor({}, "background");
	const { startDayOfMonth, endDayOfMonth } = useUserDefaultsStore();
	const data = getChartData(budget);

	// Calculate time progress for the current budget period
	const timeProgress = useMemo(() => {
		return calculateTimeProgress(startDayOfMonth, endDayOfMonth);
	}, [startDayOfMonth, endDayOfMonth]);

	return (
		<ThemedView lightColor={backgroundColor} darkColor={backgroundColor}>
			<Section text="Net Worth" isOpen>
				<View style={styles.netWorth}>
					<ThemedText type="small">
						Net Worth: {Number(data?.net_worth).toFixed(2)} SEK
					</ThemedText>
					<ThemedText type="small">
						Net Balance: {Number(data?.net_balance).toFixed(2)} SEK
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
						timeProgress={timeProgress}
						onPress={navigateToAllTransactions}
					/>
				)}
			</Section>
			<Section text="Needs 50%">
				{data?.needs && (
					<HorizontalBarChart
						totalBudget={data.needs.totalBudget}
						currentSpent={data.needs.currentSpent}
						spentPercentage={data.needs.spentPercentage}
						timeProgress={timeProgress}
						onPress={() => navigateToCategory("Needs")}
					/>
				)}
			</Section>
			<Section text="Wants 30%">
				{data?.wants && (
					<HorizontalBarChart
						totalBudget={data.wants.totalBudget}
						currentSpent={data.wants.currentSpent}
						spentPercentage={data.wants.spentPercentage}
						timeProgress={timeProgress}
						onPress={() => navigateToCategory("Wants")}
					/>
				)}
			</Section>
			<Section text="Savings 20%">
				{data?.savings && (
					<HorizontalBarChart
						totalBudget={data.savings.totalBudget}
						currentSpent={data.savings.currentSpent}
						spentPercentage={data.savings.spentPercentage}
						timeProgress={timeProgress}
						onPress={() => navigateToCategory("Savings")}
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
