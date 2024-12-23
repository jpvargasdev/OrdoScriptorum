import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TransactionCard } from "@/components/ui/TransactionCard";
import { useGetAccounts, useGetTransactionsByAccount } from "@/hooks/apiHooks";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function Account() {
	const { id } = useLocalSearchParams();
	if (id === undefined) {
		return (
			<ThemedView>
				<ThemedText>Account not found</ThemedText>
			</ThemedView>
		);
	}

	const { data: accounts } = useGetAccounts();
	const { data: transactions, execute: getTransactions } =
		useGetTransactionsByAccount();

	const mAccount = accounts?.find((a) => a.id === Number(id)) as Account;

	React.useEffect(() => {
		getTransactions({ id: Number(id) });
	}, [id]);

	if (!mAccount) {
		return (
			<ThemedView>
				<ThemedText>Account not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<ThemedText type="title">{mAccount.name}</ThemedText>
				<View>
					<ThemedText type="defaultSemiBold">
						Account Type: {mAccount.type}
					</ThemedText>
					<ThemedText type="defaultSemiBold">
						Balance: {mAccount.balance} {mAccount.currency}
					</ThemedText>
				</View>
			</View>

			<View style={styles.innerContainer}>
				<ThemedText type="subtitle">Transactions</ThemedText>
				<FlatList
					data={transactions}
					keyExtractor={(item) => `${item.id}`}
					renderItem={({ item }) => (
						<TransactionCard transaction={item} accounts={accounts} />
					)}
					ListEmptyComponent={() => (
						<ThemedText type="default">No transactions</ThemedText>
					)}
				/>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
	},
	innerContainer: {
		marginTop: 24,
	},
	transactions: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
