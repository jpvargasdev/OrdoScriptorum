import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import Section from "./Section";
import { HorizontalBarChart } from "./HorizontalChart";

interface ChartData {
	net_worth: number;
	net_balance: number;
	net_percentage: number;
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

function getChartData(budget: BudgetSummary | null): ChartData | null {
	if (!budget) {
		return null;
	}

	const chartData = {
		net_worth: budget.net_worth,
		net_balance: budget.net_balance,
		net_percentage: Math.min((budget.net_worth / budget.net_balance) * 100, 100),
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
			<Section text="Budget Summary" >
				{data && (
					<HorizontalBarChart totalBudget={data.net_worth} currentSpent={data.net_balance || 0} spentPercentage={data.net_percentage} title="Net Worth" />
				)}
			</Section>
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
