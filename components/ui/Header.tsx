import { StyleSheet, View } from "react-native";

import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";
import { CommonColors } from "@/constants/Colors";

export function Header({ budget }: { budget: BudgetSummary | null }) {
	if (!budget) return;
	return (
		<View style={styles.container}>
			<Card style={styles.card2}>
				<View style={styles.iconContainer2}>
					<IconSymbol
						name="norwegiankronesign.bank.building"
						color={CommonColors.white}
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
							SEK {budget.net_worth}
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
					<IconSymbol
						name="wallet.bifold"
						color={CommonColors.white}
						size={40}
					/>
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
		backgroundColor: CommonColors.red,
		flexDirection: "row",
		marginBottom: 8,
	},
	card2: {
		backgroundColor: CommonColors.blueMedium,
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
		backgroundColor: CommonColors.darkRed,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	iconContainer2: {
		backgroundColor: CommonColors.darkBlue,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	money: {
		flexDirection: "row",
	},
	space: {
		backgroundColor: CommonColors.darkRed,
		width: "100%",
		height: 4,
	},
	space2: {
		backgroundColor: CommonColors.darkBlue,
		width: "100%",
		height: 4,
	},
	text: {
		padding: 4,
		color: CommonColors.white,
		textAlign: "left",
	},
});
