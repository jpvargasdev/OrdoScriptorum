import { StyleSheet, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { useUserDefaultsStore } from "@/state/user";
import { useEffect, useState } from "react";

const money_wings = require("../../assets/images/flying-money.png");

export function Header({ budget }: { budget: BudgetSummary | null }) {
	const [daysLeft, setDaysLeft] = useState(0);
	const {endDayOfMonth} = useUserDefaultsStore();

	useEffect(() => {
		// Get current day of month
		const today = new Date();
		const currentDay = today.getDate();
		// Get number of days left substracting endDayOfMonth minus currentDay
		const daysLeft = endDayOfMonth - currentDay;
		setDaysLeft(daysLeft);
	}, [endDayOfMonth]);

	return (
		<View style={styles.container}>
			<ThemedText type="subtitle">You've already spent</ThemedText>
			<View style={styles.total_expenses}>
				<Image source={money_wings} style={styles.money_wings} />
				<ThemedText type="subtitle" style={styles.amount}>{budget?.total_expenses.toLocaleString()}</ThemedText>
				<ThemedText type="small" style={styles.currency}> SEK</ThemedText>
			</View>
			<ThemedText type="small">
				and there's still {daysLeft} days left until payday
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 8,
		padding: 8,
	},
	total_expenses: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginTop: 8,
	},
	money_wings: {
		width: 28,
		height: 28,
		marginRight: 8,
	},
	amount: {
		fontWeight: "bold",
	},
	currency: {
		fontWeight: "700",
	}
});