import { StyleSheet, FlatList } from "react-native";

import { TransactionCard } from "@/components/ui/TransactionCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router, useLocalSearchParams } from "expo-router";
import {
	useGetAccounts,
	useGetTransactionsByMainCategory,
} from "@/hooks/apiHooks";
import { useEffect } from "react";
import { useUserDefaultsStore } from "@/state/user";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ThemedText } from "@/components/ThemedText";

export default function TransactionsByScreen() {
	const { id } = useLocalSearchParams();
	const { startDayOfMonth, endDayOfMonth } = useUserDefaultsStore();
	const {
		data: transactions,
		execute: getTransactions,
		reload,
		loading,
	} = useGetTransactionsByMainCategory();
	const { data: accounts } = useGetAccounts();

	useEffect(() => {
		getTransactions({
			id: id,
			force: true,
			query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
		});
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScreenHeader title={`${id} Transactions`} />
			<FlatList
				data={transactions?.reverse()}
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
});
