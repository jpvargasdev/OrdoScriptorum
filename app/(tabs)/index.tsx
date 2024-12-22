import {
	StyleSheet,
	FlatList,
	View,
	RefreshControl,
	ScrollView,
} from "react-native";

import React from "react";
import { getBudgetSummary, getAccounts, getTransactionsMonthly } from "@/api";
import { useAxios } from "@/hooks/useAxios";
import { Header } from "@/components/ui/Header";
import { AccountCard } from "@/components/ui/AccountCard";
import { ThemedText } from "@/components/ThemedText";
import { Transaction } from "@/components/ui/Transaction";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { BudgetsGraph } from "@/components/ui/BudgetsGraph";

export default function HomeScreen() {
	const { data: budget } = useAxios<BudgetSummary>(getBudgetSummary);
	const {
		data: accounts,
		reload: reloadAccounts,
		loaded: loadedAccounts,
	} = useAxios<Account[]>(getAccounts);
	const {
		data: transactions,
		reload,
		loaded,
	} = useAxios<Transaction[]>(getTransactionsMonthly);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{ flex: 1 }}>
				<Header budget={budget} />
				<BudgetsGraph budget={budget} />

				{/* <View style={styles.accounts}> */}
				{/* 	<View style={styles.sectionTitle}> */}
				{/* 		<ThemedText type="subtitle">Accounts</ThemedText> */}
				{/* 		<Link href="/accounts"> */}
				{/* 			<ThemedText style={styles.link} type="link"> */}
				{/* 				See All */}
				{/* 			</ThemedText> */}
				{/* 		</Link> */}
				{/* 	</View> */}
				{/* 	<FlatList */}
				{/* 		keyExtractor={(item) => `${item.id}`} */}
				{/* 		data={accounts} */}
				{/* 		horizontal */}
				{/* 		renderItem={({ item }) => <AccountCard account={item} />} */}
				{/* 		ListEmptyComponent={() => ( */}
				{/* 			<View style={styles.defaultContainer}> */}
				{/* 				<ThemedText type="default">No accounts</ThemedText> */}
				{/* 			</View> */}
				{/* 		)} */}
				{/* 		onRefresh={reloadAccounts} */}
				{/* 		refreshing={!loadedAccounts} */}
				{/* 	/> */}
				{/* </View> */}

				{/* <View style={{ flex: 1 }}> */}
				{/* 	<View style={styles.sectionTitle}> */}
				{/* 		<ThemedText type="subtitle">Last transactions</ThemedText> */}
				{/* 		<Link href="/transactions"> */}
				{/* 			<ThemedText style={styles.link} type="link"> */}
				{/* 				See All */}
				{/* 			</ThemedText> */}
				{/* 		</Link> */}
				{/* 	</View> */}
				{/* 	<FlatList */}
				{/* 		keyExtractor={(item) => `${item.id}`} */}
				{/* 		data={transactions} */}
				{/* 		renderItem={({ item }) => ( */}
				{/* 			<Transaction transaction={item} accounts={accounts} /> */}
				{/* 		)} */}
				{/* 		ListEmptyComponent={() => ( */}
				{/* 			<View style={styles.defaultContainer}> */}
				{/* 				<ThemedText type="default">No transactions</ThemedText> */}
				{/* 			</View> */}
				{/* 		)} */}
				{/* 		onRefresh={reload} */}
				{/* 		refreshing={!loaded} */}
				{/* 	/> */}
				{/* </View> */}
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
