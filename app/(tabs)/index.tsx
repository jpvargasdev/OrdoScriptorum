import { StyleSheet, ScrollView } from "react-native";

import React, { useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { BudgetsGraph } from "@/components/ui/BudgetsGraph";
import { useGetBudgetSummary, useGetCategories } from "@/hooks/apiHooks";

export default function HomeScreen() {
	const { data: budget, execute: fetchBudgetSummary } = useGetBudgetSummary();
	const { execute: fetchCategories } = useGetCategories();

	useEffect(() => {
		fetchBudgetSummary();
		fetchCategories();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{ flex: 1 }}>
				<Header budget={budget} />
				<BudgetsGraph budget={budget} />
			</ScrollView>

			<FloatingButton onPress={() => router.navigate("./new-transaction")} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 8,
		flex: 1,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		margin: 8,
		justifyContent: "center",
	},
	defaultContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		margin: 8,
	},
	sectionTitle: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	link: {
		color: "gray",
	},
	accounts: {
		marginVertical: 8,
	},
	subtitle: {
		marginVertical: 8,
	},
});
