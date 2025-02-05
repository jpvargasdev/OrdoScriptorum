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
} from "@/hooks/apiHooks";
import { useUserDefaultsStore } from "@/state/user";
import { ThemedText } from "@/components/ThemedText";
import { BudgetsGraph } from "@/components/ui/BudgetsGraph";

export default function HomeScreen() {
	const { data: budget, execute: fetchBudgetSummary } = useGetBudgetSummary();
	const { execute: fetchAccounts } = useGetAccounts();
	const { startDayOfMonth, endDayOfMonth, user } = useUserDefaultsStore();
	const { execute: fetchCategories } = useGetCategories();

	useEffect(() => {
		fetchBudgetSummary({
			query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
		});
		fetchCategories();
		fetchAccounts();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedText type="title" style={styles.title}>Hello {user?.display_name?.split(" ")[0]}</ThemedText>
			<Header budget={budget} />
			<BudgetsGraph budget={budget} />
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
	title: {
		padding: 8,
	}
});
