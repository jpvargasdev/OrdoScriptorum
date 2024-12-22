import { StyleSheet, FlatList, View } from "react-native";

import { useAxios } from "@/hooks/useAxios";
import { getTransactions, getTransactionsMonthly } from "@/api";
import { Transaction } from "@/components/ui/Transaction";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router } from "expo-router";

export default function TransactionsScreen() {
	const { data: transactions, reload, loaded } = useAxios(getTransactions);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedText type="title">Transactions</ThemedText>
			<FlatList
				data={transactions}
				keyExtractor={(item) => `${item.id}`}
				renderItem={({ item }) => <Transaction transaction={item} />}
				style={styles.transactions}
				ListEmptyComponent={
					<ThemedText type="default">No transactions</ThemedText>
				}
				refreshing={!loaded}
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
