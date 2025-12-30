import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TransactionCard } from "@/components/ui/TransactionCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useGetAccounts, useGetTransactionsByAccount } from "@/hooks/apiHooks";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

	const mAccount = accounts?.find((a) => a.id === id) as Account;

	React.useEffect(() => {
		getTransactions({ id: id });
	}, [id]);

	if (!mAccount) {
		return (
			<SafeAreaView style={styles.container}>
				<ScreenHeader title="Account" />
				<ThemedView style={styles.notFound}>
					<ThemedText>Account not found</ThemedText>
				</ThemedView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScreenHeader title={mAccount.name} />

			<ThemedView style={styles.content}>
				<View style={styles.header}>
					<ThemedText type="defaultSemiBold">
						Account Type: {mAccount.type}
					</ThemedText>
					<ThemedText type="defaultSemiBold">
						Balance: {mAccount.balance} {mAccount.currency}
					</ThemedText>
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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	notFound: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	innerContainer: {
		flex: 1,
		marginTop: 24,
	},
	transactions: {
		flex: 1,
	},
	header: {
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingTop: 8,
	},
});
