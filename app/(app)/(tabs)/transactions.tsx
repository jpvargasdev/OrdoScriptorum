import { StyleSheet, Alert } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router } from "expo-router";
import {
	useDeleteTransaction,
	useGetAccounts,
	useGetTransactions,
} from "@/hooks/apiHooks";
import { useEffect, useCallback } from "react";
import TransactionsList from "@/components/ui/TransactionsList";
import { ThemedView } from "@/components/ThemedView";

export default function TransactionsScreen() {
	const {
		data: transactions,
		execute: getTransactions,
		loading,
	} = useGetTransactions();
	const { execute: deleteTransaction, loading: deleteLoading } =
		useDeleteTransaction();

	const { data: accounts } = useGetAccounts();

	const onDeleteTransaction = useCallback(
		async (transaction: Transaction) => {
      Alert.alert(
        'Alert Title',
        'My Alert Msg',
        [
          {
            text: 'Cancel',
            onPress: () => Alert.alert('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        },
      );},
		[deleteTransaction],
	);

	useEffect(() => {
		getTransactions();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedView style={styles.container}>
				<ThemedText type="title">Transactions</ThemedText>
				<TransactionsList
					transactions={transactions}
					accounts={accounts}
					loading={loading || deleteLoading}
					onDeleteTransaction={onDeleteTransaction}
				/>
			</ThemedView>
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
