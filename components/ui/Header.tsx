import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { useUserDefaultsStore } from "@/state/user";
import { useEffect, useState } from "react";
import { router } from "expo-router";

const money_wings = require("../../assets/images/flying-money.png");

export function Header({ budget }: { budget: BudgetSummary | null }) {
	const [daysLeft, setDaysLeft] = useState(0);
	const { endDayOfMonth, user } = useUserDefaultsStore();

	useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();

    let daysLeft;
    if (currentDay >= endDayOfMonth) {
      // If today is after the end day, calculate for next month
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      nextMonth.setDate(endDayOfMonth);

      // Calculate days difference
      const diffTime = nextMonth.getTime() - today.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
    } else {
      // Regular calculation within the same month
      daysLeft = endDayOfMonth - currentDay;
    }

    setDaysLeft(daysLeft);
  }, [endDayOfMonth]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<ThemedText type="title">
					Hello {user?.display_name?.split(" ")[0]}
				</ThemedText>
				{user?.photo_url && (
					<TouchableOpacity onPress={() => router.navigate("../settings")}>
						<Image source={{ uri: user.photo_url }} style={styles.avatar} />
					</TouchableOpacity>
				)}
			</View>
			<ThemedText type="subtitle">You've already spent</ThemedText>
			<View style={styles.total_expenses}>
				<Image source={money_wings} style={styles.money_wings} />
				<ThemedText type="subtitle" style={styles.amount}>
					{budget?.total_expenses.toLocaleString()}
				</ThemedText>
				<ThemedText type="small" style={styles.currency}>
					{" "}
					SEK
				</ThemedText>
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
	header: {
		flexDirection: "row",
		marginBottom: 8,
		justifyContent: "space-between",
		alignItems: "center",
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
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
});
