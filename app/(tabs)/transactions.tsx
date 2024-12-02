import { StyleSheet, FlatList, View } from "react-native";

import { useAxios } from "@/hooks/useAxios";
import { getTransactions, getTransactionsMonthly } from "@/api";
import { Transaction } from "@/components/ui/Transaction";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router } from "expo-router";
import { useState } from "react";

export default function TabTwoScreen() {
	const { data: transactions } = useAxios(getTransactions);

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<View style={styles.sectionTitle}>
					<ThemedText type="title">Transactions</ThemedText>
				</View>
			</View>
			<FlatList
				data={transactions}
				keyExtractor={(item) => `${item.id}`}
				renderItem={({ item }) => <Transaction transaction={item} />}
				style={styles.transactions}
			/>
			<FloatingButton onPress={() => router.navigate("../new-transaction")} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 24,
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
