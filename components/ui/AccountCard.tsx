import { StyleSheet, TouchableOpacity } from "react-native";

import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";

export function AccountCard({ account }: { account: Account }) {
	return (
		<TouchableOpacity onPress={() => router.navigate({ pathname: '/account', params: { id: account.id } })}>
			<Card style={styles.container}>
				<ThemedText style={styles.accountName} type="subtitle">
					{account.name}
				</ThemedText>
				<ThemedText style={styles.accountBalance} type="defaultSemiBold">
					{account.type}
				</ThemedText>
				<ThemedText style={styles.accountBalance} type="defaultSemiBold">
					{account.balance} {account.currency}
				</ThemedText>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 8,
		borderRadius: 4,
		minWidth: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	accountName: {
		margin: 8,
		fontSize: 16,
	},
	accountType: {
		textAlign: "left",
		fontSize: 14,
	},
	accountBalance: {
		textAlign: "left",
		fontSize: 14,
		marginBottom: 8,
	},
});
