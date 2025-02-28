import { StyleSheet, ScrollView } from "react-native";

import React, { useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import {
	useGetAccounts,
	useGetBudgetSummary,
	useGetCategories,
	useGetTransactions,
} from "@/hooks/apiHooks";
import { useUserDefaultsStore } from "@/state/user";
import { ThemedText } from "@/components/ThemedText";
import { BudgetsGraph } from "@/components/ui/BudgetsGraph";
import TransactionsList from "@/components/ui/TransactionsList";

export default function HomeScreen() {
	const { data: budget, execute: fetchBudgetSummary } = useGetBudgetSummary();
	const { data: accounts, execute: fetchAccounts } = useGetAccounts();
	const {
		data: transactions,
		execute: fetchTransactions,
		loading,
	} = useGetTransactions();
	const { startDayOfMonth, endDayOfMonth } = useUserDefaultsStore();
	const { execute: fetchCategories } = useGetCategories();

	useEffect(() => {
		fetchBudgetSummary({
			query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
		});
		fetchCategories({
			force: true,
		});
		fetchAccounts({
			force: true,
		});
		fetchTransactions({
			force: true,
		});
	}, []);

	return (
		<SafeAreaView style={{ ...styles.container, paddingBottom: 46 }}>
			<ScrollView style={styles.innerContainer}>
				<Header budget={budget} />
				<BudgetsGraph budget={budget} />
				<ThemedText style={styles.titleTransactions} type="subtitle">
					Latest transactions
				</ThemedText>
				<TransactionsList
					accounts={accounts}
					transactions={transactions}
					loading={loading}
				/>
			</ScrollView>
			<FloatingButton onPress={() => router.navigate("./new-transaction")} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	innerContainer: {
		flex: 1,
	},
	titleTransactions: {
		marginTop: 16,
		paddingHorizontal: 8,
	},
});
