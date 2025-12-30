import { ThemedText } from "@/components/ThemedText";
import CustomKeyboard from "@/components/ui/CustomKeyboard";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import TransactionSelector from "@/components/ui/TransactionSelector";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
	ActivityIndicator,
} from "react-native";

interface TransactionFormProps {
	mode: "create" | "edit";
	initialData?: {
		amount: string;
		description: string;
		category: string;
		date: Date;
		currency: string;
		type: string;
		account: string;
		transferAccount: string;
	};
	categories: Category[] | null;
	accounts: Account[] | null;
	loading: boolean;
	onSubmit: (data: {
		amount: string;
		description: string;
		category: string;
		date: Date;
		currency: string;
		type: string;
		account: string;
		transferAccount: string;
	}) => void;
	onDelete?: () => void;
	deleteLoading?: boolean;
	showHeader?: boolean;
}

export default function TransactionForm({
	mode,
	initialData,
	categories,
	accounts,
	loading,
	onSubmit,
	onDelete,
	deleteLoading,
	showHeader = true,
}: TransactionFormProps) {
	const [amount, setAmount] = useState(initialData?.amount || "");
	const [category, setCategory] = useState(initialData?.category || "Category");
	const [date, setDate] = useState(initialData?.date || new Date());
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [showNumPad, setShowNumpad] = useState(true);
	const [type, setType] = useState(initialData?.type || "Expense");
	const [currency, setCurrency] = useState(initialData?.currency || "SEK");
	const [account, setAccount] = useState<string>(
		initialData?.account || (accounts && accounts[0] ? accounts[0].name : ""),
	);
	const [transferAccount, setTransferAccount] = useState<string>(
		initialData?.transferAccount ||
			(accounts && accounts[1] ? accounts[1].name : ""),
	);
	const [validationError, setValidationError] = useState<string | null>(null);

	// Update state when initialData changes (for edit mode)
	useEffect(() => {
		if (initialData) {
			setAmount(initialData.amount);
			setCategory(initialData.category);
			setDate(initialData.date);
			setDescription(initialData.description);
			setCurrency(initialData.currency);
			setType(initialData.type);
			setAccount(initialData.account);
			setTransferAccount(initialData.transferAccount);
		}
	}, [initialData]);

	// Set default account when accounts load
	useEffect(() => {
		if (accounts && accounts.length > 0 && !initialData) {
			if (!account) setAccount(accounts[0].name);
			if (!transferAccount && accounts.length > 1)
				setTransferAccount(accounts[1].name);
		}
	}, [accounts, initialData]);

	// Keyboard listeners
	useEffect(() => {
		const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
			setShowNumpad(true);
		});
		const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
			setShowNumpad(false);
		});

		return () => {
			hideSubscription.remove();
			showSubscription.remove();
		};
	}, []);

	const handleKeyPress = (key: string) => {
		if (key === "delete") {
			setAmount(amount.slice(0, -1));
		} else {
			setAmount(amount + key);
		}
	};

	const validate = useCallback((): boolean => {
		setValidationError(null);

		if (!amount || parseFloat(amount) === 0) {
			setValidationError("Amount is required");
			return false;
		}

		if (!description.trim()) {
			setValidationError("Description is required");
			return false;
		}

		if (!account) {
			setValidationError("Account is required");
			return false;
		}

		if (type === "Transfer") {
			if (!transferAccount) {
				setValidationError("Destination account is required for transfers");
				return false;
			}
			if (account === transferAccount) {
				setValidationError(
					"Source and destination accounts cannot be the same",
				);
				return false;
			}
		}

		return true;
	}, [amount, description, account, type, transferAccount]);

	const handleSubmit = useCallback(() => {
		if (!validate()) return;

		onSubmit({
			amount,
			description,
			category,
			date,
			currency,
			type,
			account,
			transferAccount,
		});
	}, [
		amount,
		description,
		category,
		date,
		currency,
		type,
		account,
		transferAccount,
		validate,
		onSubmit,
	]);

	const title = mode === "create" ? "New Transaction" : "Edit Transaction";
	const submitButtonText = mode === "create" ? "Save" : "Save";

	return (
		<>
			{showHeader && (
				<View style={styles.header}>
					<ThemedText type="title">{title}</ThemedText>
					{mode === "edit" && onDelete && (
						<TouchableOpacity
							onPress={onDelete}
							style={styles.deleteButton}
							disabled={deleteLoading}
						>
							{deleteLoading ? (
								<ActivityIndicator size="small" color="red" />
							) : (
								<IconSymbol name="trash" size={24} color="red" />
							)}
						</TouchableOpacity>
					)}
				</View>
			)}

			<TransactionSelector
				items={["Expense", "Income", "Transfer"]}
				onSelect={setType}
				value={type}
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.OS === "ios" ? "padding" : undefined}
				>
					{validationError && (
						<View style={styles.errorContainer}>
							<ThemedText style={styles.errorText}>
								{validationError}
							</ThemedText>
						</View>
					)}

					<View style={styles.amountContainer}>
						<ThemedText type="defaultSemiBold" style={styles.amount}>
							{type === "Expense" && "-"}
							{amount.length > 0 ? amount : "0.0"}
						</ThemedText>
						<Select
							showIcon
							placeholder="SEK"
							onSelect={setCurrency}
							items={["SEK", "USD", "EUR", "COP"]}
							value={currency}
							style={{ boxStyle: styles.currencySelector }}
						/>
					</View>

					<View style={styles.row}>
						<DatePicker date={date} onChange={setDate} />
						<TextInput
							style={styles.notesInput}
							placeholder="Add Note"
							value={description}
							onChangeText={setDescription}
							multiline
						/>
						<TouchableOpacity
							onPress={handleSubmit}
							style={[styles.button, loading && styles.buttonDisabled]}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator size="small" color="#000" />
							) : (
								<ThemedText type="defaultSemiBold">
									{submitButtonText}
								</ThemedText>
							)}
						</TouchableOpacity>
					</View>

					<View style={styles.rowWithBorder}>
						<View style={styles.row}>
							<Select
								showIcon={false}
								iconName="building.2"
								placeholder={
									accounts && accounts[0] ? accounts[0].name : "Account"
								}
								items={accounts?.map((a) => a.name) || []}
								onSelect={setAccount}
								value={account}
								style={{
									boxStyle: styles.select,
								}}
							/>
							{type === "Transfer" && (
								<IconSymbol name="arrow.right" size={12} color="gray" />
							)}
							{type === "Transfer" && (
								<Select
									showIcon={false}
									iconName="building.2"
									placeholder={
										accounts && accounts[1] ? accounts[1].name : "Account"
									}
									items={accounts?.map((a) => a.name) || []}
									onSelect={setTransferAccount}
									value={transferAccount}
									style={{
										boxStyle: styles.select,
									}}
								/>
							)}
							<IconSymbol name="arrow.right" size={12} color="gray" />
							<Select
								showIcon={false}
								iconName="list.bullet.indent"
								placeholder="Category"
								items={categories?.map((c) => c.name) || []}
								onSelect={setCategory}
								value={category}
								style={{
									boxStyle: styles.select,
								}}
							/>
						</View>
					</View>

					{showNumPad && (
						<CustomKeyboard
							onKeyPress={handleKeyPress}
							onSubmit={handleSubmit}
						/>
					)}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 8,
	},
	deleteButton: {
		padding: 8,
	},
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	errorContainer: {
		backgroundColor: "#ffebee",
		padding: 12,
		marginHorizontal: 16,
		borderRadius: 8,
	},
	errorText: {
		color: "#c62828",
		textAlign: "center",
	},
	amountContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
		flex: 1,
	},
	amount: {
		fontSize: 56,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 4,
		flexWrap: "wrap",
	},
	rowWithBorder: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.light.textDisabled,
	},
	notesInput: {
		flex: 1,
		marginLeft: 12,
		fontSize: 16,
	},
	button: {
		alignSelf: "center",
		backgroundColor: "#dfdfdf",
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginRight: 8,
		borderRadius: 10,
		minWidth: 100,
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	select: {
		borderBottomWidth: 0,
		flexDirection: "row",
		borderRadius: 30,
		marginHorizontal: 4,
	},
	currencySelector: {
		borderBottomWidth: 0,
	},
});
