import { StyleSheet, View } from "react-native";

import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";

export function Header({ budget }: { budget: BudgetSummary | null }) {
	if (!budget) return;
	return (
		<View style={styles.container}>
			<Card style={styles.card2}>
				<View style={styles.iconContainer2}>
					<IconSymbol
						name="norwegiankronesign.bank.building"
						color="white"
						size={40}
					/>
				</View>
				<View style={styles.cardInfo}>
					<ThemedText type="defaultSemiBold" style={styles.text}>
						NET WORTH
					</ThemedText>
					<View style={styles.money}>
						<ThemedText type="defaultSemiBold" style={styles.text}>
							{" "}
							SEK {budget.net_balance}
						</ThemedText>
					</View>
					<View style={styles.space2} />
					<View style={styles.money}>
						<ThemedText type="defaultSemiBold" style={styles.text}></ThemedText>
					</View>
				</View>
			</Card>

			<Card style={styles.card1}>
				<View style={styles.iconContainer}>
					<IconSymbol name="wallet.bifold" color="white" size={40} />
				</View>
				<View style={styles.cardInfo}>
					<ThemedText type="defaultSemiBold" style={styles.text}>
						IN + OUT THIS PERIOD
					</ThemedText>
					<View style={styles.money}>
						<ThemedText type="defaultSemiBold" style={styles.text}>
							{" "}
							SEK {budget.net_balance}
						</ThemedText>
					</View>
					<View style={styles.space} />
					<View style={styles.money}>
						<ThemedText type="defaultSemiBold" style={styles.text}>
							SEK {budget.total_income} + -{budget.total_expenses}
						</ThemedText>
					</View>
				</View>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card1: {
		backgroundColor: "#EA4335",
		flexDirection: "row",
		marginBottom: 8,
	},
	card2: {
		backgroundColor: "#4285f4",
		flexDirection: "row",
		marginBottom: 8,
	},
	cardIcon: {
		height: "100%",
	},
	cardInfo: {
		flex: 1,
	},
	iconContainer: {
		backgroundColor: "#A50E0E",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	iconContainer2: {
		backgroundColor: "#174ea6",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	money: {
		flexDirection: "row",
	},
	space: {
		backgroundColor: "#A50E0E",
		width: "100%",
		height: 4,
	},
	space2: {
		backgroundColor: "#174ea6",
		width: "100%",
		height: 4,
	},
	text: {
		padding: 4,
		color: "#fafafa",
		textAlign: "left",
	},
});
