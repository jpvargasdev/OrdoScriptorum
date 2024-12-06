import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";

export function Header({ budget }: { budget?: BudgetSummary }) {
	if (!budget) return;
	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<View style={styles.balance}>
					<ThemedText type="subtitle">Your Balance</ThemedText>
					<ThemedText type="title">{budget.net_balance} SEK</ThemedText>
				</View>

				<View style={styles.budgets}>
					<View style={styles.headerTable}>
						<ThemedText type="defaultSemiBold" style={styles.headerTitle}>
							Budget
						</ThemedText>
						<ThemedText type="defaultSemiBold" style={styles.headerTitle}>
							Balance
						</ThemedText>
						<ThemedText type="defaultSemiBold" style={styles.headerTitle}>
							Expenses
						</ThemedText>
						<ThemedText type="defaultSemiBold" style={styles.headerTitle}>
							%
						</ThemedText>
					</View>
					<TouchableOpacity style={styles.budgetItem}>
						<ThemedText type="default" style={styles.topic}>
							{" "}
							Needs{" "}
						</ThemedText>
						<ThemedText type="default" style={styles.budgetText}>
							{budget.needs_budget - budget.needs_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.amount}>
							-{budget.needs_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.percentageText}>
							{budget.needs_percentage} %
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity style={styles.budgetItem}>
						<ThemedText type="default" style={styles.topic}>
							{" "}
							Wants{" "}
						</ThemedText>
						<ThemedText type="default" style={styles.budgetText}>
							{budget.wants_budget - budget.wants_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.amount}>
							-{budget.wants_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.percentageText}>
							{budget.wants_percentage} %
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ ...styles.budgetItem, borderBottomWidth: 0 }}
					>
						<ThemedText type="default" style={styles.topic}>
							{" "}
							Savings{" "}
						</ThemedText>
						<ThemedText type="default" style={styles.budgetText}>
							{budget.savings_budget - budget.savings_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.amount}>
							-{budget.savings_amount} SEK
						</ThemedText>
						<ThemedText type="default" style={styles.percentageText}>
							{budget.savings_percentage} %
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	innerContainer: {},
	balance: {
		justifyContent: "center",
		alignItems: "flex-start",
	},
	budgets: {
		borderRadius: 4,
		height: 150,
		marginVertical: 12,
	},
	amount: {
		color: "red",
		flex: 1,
		textAlign: "center",
		alignSelf: "center",
	},
	topic: {
		flex: 1,
		textAlign: "center",
	},
	budgetText: {
		flex: 1.2,
		textAlign: "center",
		alignSelf: "center",
	},
	percentageText: {
		flex: 1,
		textAlign: "center",
		alignSelf: "center",
	},
	budgetItem: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#cecece",
	},
	headerTable: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#cecece",
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
	},
});
