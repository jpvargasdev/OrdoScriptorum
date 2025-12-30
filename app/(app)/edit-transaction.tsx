import TransactionForm from "@/components/ui/TransactionForm";
import {
	useGetAccounts,
	useGetCategories,
	useGetTransactionsByID,
	useUpdateTransaction,
	useDeleteTransaction,
} from "@/hooks/apiHooks";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Modal,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function EditTransaction() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const textColor = useThemeColor({}, "textPrimary");

	const {
		data: transaction,
		execute: getTransaction,
		loading: loadingTransaction,
	} = useGetTransactionsByID();
	const {
		execute: updateTransaction,
		loading: updateLoading,
		error: updateError,
	} = useUpdateTransaction();
	const { execute: deleteTransaction, loading: deleteLoading } =
		useDeleteTransaction();
	const { data: categories } = useGetCategories();
	const { data: accounts } = useGetAccounts();

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		if (id) {
			getTransaction({ id, force: true });
		}
	}, [id]);

	// Transform transaction data to form format
	const initialData = useMemo(() => {
		if (!transaction) {
			return undefined;
		}

		const t = transaction;
		const accountName =
			accounts?.find((a) => a.id === t.account_id)?.name || "";
		const relatedAccountName =
			accounts?.find((a) => a.id === t.related_account_id)?.name || "";
		const categoryName =
			categories?.find((c) => c.id === t.category_id)?.name || "Category";

		return {
			amount: Math.abs(t.amount).toFixed(2),
			description: t.description,
			category: categoryName,
			date: new Date(t.date * 1000),
			currency: t.currency,
			type: t.transaction_type,
			account: accountName,
			transferAccount: relatedAccountName,
		};
	}, [transaction, accounts, categories]);

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
			if (!id) return;

			const transactionData: Partial<Transaction> & { id: number } = {
				id: parseInt(id, 10),
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
				transactionData.related_account_id = accounts?.find(
					(a) => a.name === data.transferAccount,
				)?.id;
			}

			try {
				await updateTransaction({ id, data: transactionData });
				router.back();
			} catch (error) {
				console.error("Error updating transaction:", error);
			}
		},
		[id, categories, accounts, updateTransaction],
	);

	const handleDeletePress = useCallback(() => {
		setShowDeleteModal(true);
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		if (!id) return;

		try {
			await deleteTransaction({ id });
			setShowDeleteModal(false);
			router.back();
		} catch (error) {
			console.error("Error deleting transaction:", error);
		}
	}, [id, deleteTransaction]);

	const handleCancelDelete = useCallback(() => {
		setShowDeleteModal(false);
	}, []);

	if (loadingTransaction || !initialData) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<ThemedText style={styles.loadingText}>
					Loading transaction...
				</ThemedText>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Custom Header with Back Button and Title */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<IconSymbol name="chevron.left" size={24} color={textColor} />
				</TouchableOpacity>
				<ThemedText type="subtitle" style={styles.headerTitle}>
					Edit Transaction
				</ThemedText>
				<TouchableOpacity
					onPress={handleDeletePress}
					style={styles.deleteHeaderButton}
					disabled={deleteLoading}
				>
					{deleteLoading ? (
						<ActivityIndicator size="small" color="red" />
					) : (
						<IconSymbol name="trash" size={24} color="red" />
					)}
				</TouchableOpacity>
			</View>

			{updateError && (
				<View style={styles.errorBanner}>
					<ThemedText style={styles.errorBannerText}>
						Failed to update transaction. Please try again.
					</ThemedText>
				</View>
			)}

			<TransactionForm
				mode="edit"
				initialData={initialData}
				categories={categories}
				accounts={accounts}
				loading={updateLoading}
				onSubmit={handleSubmit}
				showHeader={false}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				visible={showDeleteModal}
				animationType="fade"
				transparent
				onRequestClose={handleCancelDelete}
			>
				<View style={styles.modalOverlay}>
					<BlurView style={styles.modalContainer} intensity={80} tint="default">
						<ThemedText type="subtitle" style={styles.modalTitle}>
							Delete Transaction
						</ThemedText>
						<ThemedText style={styles.modalMessage}>
							Are you sure you want to delete this transaction? This action
							cannot be undone.
						</ThemedText>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={handleCancelDelete}
								disabled={deleteLoading}
							>
								<ThemedText type="defaultSemiBold">Cancel</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.deleteButton]}
								onPress={handleConfirmDelete}
								disabled={deleteLoading}
							>
								{deleteLoading ? (
									<ActivityIndicator size="small" color="white" />
								) : (
									<ThemedText
										type="defaultSemiBold"
										style={styles.deleteButtonText}
									>
										Delete
									</ThemedText>
								)}
							</TouchableOpacity>
						</View>
					</BlurView>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: 12,
	},
	backButton: {
		padding: 8,
		width: 44,
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
	},
	deleteHeaderButton: {
		padding: 8,
		width: 44,
		alignItems: "center",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 16,
	},
	errorBanner: {
		backgroundColor: "#ffebee",
		padding: 12,
		marginHorizontal: 16,
		marginTop: 8,
		borderRadius: 8,
	},
	errorBannerText: {
		color: "#c62828",
		textAlign: "center",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContainer: {
		margin: 20,
		padding: 24,
		borderRadius: 20,
		overflow: "hidden",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.light.border,
		width: "85%",
	},
	modalTitle: {
		textAlign: "center",
		marginBottom: 12,
	},
	modalMessage: {
		textAlign: "center",
		marginBottom: 24,
		opacity: 0.8,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	modalButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#e0e0e0",
	},
	deleteButton: {
		backgroundColor: "#c62828",
	},
	deleteButtonText: {
		color: "white",
	},
});
