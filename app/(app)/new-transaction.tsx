import TransactionForm from "@/components/ui/TransactionForm";
import {
	useCreateTransaction,
	useCreateTransfer,
	useGetAccounts,
	useGetCategories,
} from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransaction() {
	const { execute: executeTransaction, loading: transactionLoading } =
		useCreateTransaction();
	const { execute: executeTransfer, loading: transferLoading } =
		useCreateTransfer();
	const { data: categories } = useGetCategories();
	const { data: accounts } = useGetAccounts();

	const loading = transactionLoading || transferLoading;

	const handleSubmit = useCallback(
		async (data: {
			amount: string;
			description: string;
			category: string;
			date: Date;
			currency: string;
			type: string;
			account: string;
			transferAccount: string;
		}) => {
			const transaction: Omit<
				Transaction,
				| "id"
				| "amount_in_base_currency"
				| "exchange_rate"
				| "main_category"
				| "subcategory"
			> = {
				amount:
					data.type === "Expense"
						? -parseFloat(data.amount)
						: parseFloat(data.amount),
				date: Math.floor(data.date.getTime() / 1000),
				description: data.description,
				currency: data.currency,
				category_id: categories?.find((c) => c.name === data.category)?.id,
				transaction_type: data.type,
				account_id: accounts?.find((a) => a.name === data.account)?.id,
			};

			if (data.type === "Transfer") {
				const destAccountId = accounts?.find(
					(a) => a.name === data.transferAccount,
				)?.id;
				if (!destAccountId) {
					alert("Please select a valid account to transfer to.");
					return;
				}
				transaction.related_account_id = destAccountId;
			}

			try {
				if (data.type === "Transfer") {
					await executeTransfer({ data: transaction });
				} else {
					await executeTransaction({ data: transaction });
				}
				router.back();
			} catch (error) {
				console.error("Error adding transaction:", error);
				alert("Error adding transaction");
			}
		},
		[categories, accounts, executeTransaction, executeTransfer],
	);

	return (
		<SafeAreaView style={styles.container}>
			<TransactionForm
				mode="create"
				categories={categories}
				accounts={accounts}
				loading={loading}
				onSubmit={handleSubmit}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
