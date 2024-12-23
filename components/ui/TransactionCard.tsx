import { StyleSheet, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "../ThemedText";

export function TransactionCard({
	transaction,
	accounts = [],
}: { transaction: Transaction; accounts: Account[] | null }) {
	const account = accounts?.find((a) => a.id === transaction.account_id);
	const iconName =
		transaction.transaction_type === "Transfer"
			? "arrow.left.arrow.right"
			: transaction.amount > 0
				? "arrow.right"
				: "arrow.left";
	const iconColor =
		transaction.transaction_type === "Transfer"
			? "blue"
			: transaction.amount > 0
				? "green"
				: "red";
	return (
		<TouchableOpacity style={styles.container}>
			<View style={styles.icon}>
				<IconSymbol size={28} color={iconColor} name={iconName} />
			</View>
			<View style={styles.description}>
				<ThemedText type="defaultSemiBold">
					{transaction.description}
				</ThemedText>
				<ThemedText type="default">
					{transaction.main_category} / {transaction.subcategory}
				</ThemedText>
				<ThemedText type="default">
					{new Date(transaction.date * 1000).toDateString()}
				</ThemedText>
			</View>
			<View style={styles.amount}>
				<ThemedText type="defaultSemiBold">
					{transaction.amount} {transaction.currency}
				</ThemedText>
				<ThemedText type="default">{account?.name}</ThemedText>
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
		borderColor: "#cecece",
		marginVertical: 0,
		paddingVertical: 8,
	},
	icon: {
		justifyContent: "center",
		alignItems: "center",
		width: 60,
	},
	description: {
		flex: 1,
	},
	amount: {
		justifyContent: "center",
		alignItems: "flex-end",
	},
});
