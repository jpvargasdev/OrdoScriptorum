import { StyleSheet, FlatList } from "react-native";

import { TransactionCard } from "@/components/ui/TransactionCard";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router } from "expo-router";
import { useGetAccounts, useGetTransactions } from "@/hooks/apiHooks";
import { useEffect } from "react";

export default function TransactionsScreen() {
	const { data: transactions, execute: getTransactions, reload, loading } = useGetTransactions();
	const { data: accounts } = useGetAccounts();

	useEffect(() => {
		getTransactions();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedText type="title">Transactions</ThemedText>
			<FlatList
				data={transactions}
				keyExtractor={(item) => `${item.id}`}
				renderItem={({ item }) => (
					<TransactionCard transaction={item} accounts={accounts} />
				)}
				style={styles.transactions}
				ListEmptyComponent={
					<ThemedText type="default">No transactions</ThemedText>
				}
				refreshing={loading}
				onRefresh={reload}
			/>
			<FloatingButton onPress={() => router.navigate("../new-transaction")} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
	transactions: {
		flex: 1,
	},
	sectionTitle: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
});
