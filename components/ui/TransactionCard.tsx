import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "../ThemedText";

export function TransactionCard({
	transaction,
	accounts = [],
}: {
	transaction: Transaction;
	accounts: Account[] | null;
}) {
	const account = accounts?.find((a) => a.id === transaction.account_id);
	const iconName =
		transaction.transaction_type === "Transfer"
			? "arrow.left.arrow.right"
			: transaction.amount > 0
				? "plus"
				: "minus";
	const iconColor =
		transaction.transaction_type === "Transfer"
			? "blue"
			: transaction.amount > 0
				? "green"
				: "red";

	const handlePress = () => {
		router.push(`/edit-transaction?id=${transaction.id}`);
	};

	return (
		<TouchableOpacity style={styles.container} onPress={handlePress}>
			<View style={styles.icon}>
				<IconSymbol size={20} color={iconColor} name={iconName} />
			</View>
			<View style={styles.description}>
				<ThemedText type="defaultSemiBold">
					{transaction.description}
				</ThemedText>
				<ThemedText type="small">
					{transaction.main_category} / {transaction.subcategory}
				</ThemedText>
				<ThemedText type="small">
					{new Date(transaction.date * 1000).toDateString()}
				</ThemedText>
			</View>
			<View style={styles.amount}>
				<ThemedText type="defaultSemiBold">
					{Number(transaction.amount).toFixed(2)} {transaction.currency}
				</ThemedText>
				<ThemedText type="small">{account?.name}</ThemedText>
			</View>
			<View style={styles.chevron}>
				<IconSymbol name="chevron.right" size={16} color="gray" />
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		color: "red",
		justifyContent: "space-between",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "gray",
		paddingVertical: 8,
	},
	icon: {
		justifyContent: "center",
		alignItems: "center",
		width: 45,
	},
	description: {
		flex: 1,
	},
	amount: {
		justifyContent: "center",
		alignItems: "flex-end",
	},
	chevron: {
		justifyContent: "center",
		alignItems: "center",
		width: 30,
	},
});
