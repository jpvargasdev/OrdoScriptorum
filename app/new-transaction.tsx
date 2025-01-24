import { ThemedText } from "@/components/ThemedText";
import CurrencySelect from "@/components/ui/CurrencySelect";
import CustomKeyboard from "@/components/ui/CustomKeyboard";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import TransactionSelector from "@/components/ui/TransactionSelector";
import { CommonColors } from "@/constants/Colors";
import {
	useCreateTransaction,
	useCreateTransfer,
	useGetAccounts,
	useGetCategories,
} from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useCallback, useState, useEffect } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransaction() {
	const { execute: executeTransaction } = useCreateTransaction();
	const { execute: executeTransfer } = useCreateTransfer();
	const { data: categories } = useGetCategories();
	const { data: accounts } = useGetAccounts();

	const [showKeyboard, setShowKeyboard] = useState(true);
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("Category");
	const [date, setDate] = useState(new Date());
	const [description, setDescription] = useState("");
	const [type, setType] = useState("Expense");
	const [currency, setCurrency] = useState("SEK");
	const [account, setAccount] = useState<string>("Account");

	// New state for the destination account in case of Transfer
	const [transferAccount, setTransferAccount] = useState<string>(
		accounts && accounts[0] ? accounts[0].name : "",
	);

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
			setShowKeyboard(false);
		});
		const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
			setShowKeyboard(true);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const handleKeyPress = (key: string) => {
		if (key === "delete") {
			setAmount(amount.slice(0, -1));
		} else {
			setAmount(amount + key);
		}
	};

	const onSubmit = useCallback(async () => {
		// basic validation
		if (!amount || !date || !description || !currency || !account || !type) {
			alert("All fields are required");
			return;
		}

		// Build the transaction object
		const transaction: Omit<
			Transaction,
			| "id"
			| "amount_in_base_currency"
			| "exchange_rate"
			| "main_category"
			| "subcategory"
		> = {
			amount: type === "Expense" ? -parseFloat(amount) : parseFloat(amount),
			date: Math.floor(date.getTime() / 1000),
			description,
			currency,
			category_id: categories?.find((c) => c.name === category)?.id,
			transaction_type: type,
			account_id: accounts?.find((a) => a.name === account)?.id,
		};

		// If user selected "Transfer," add related_account_id
		if (type === "Transfer") {
			const destAccountId = accounts?.find(
				(a) => a.name === transferAccount,
			)?.id;
			if (!destAccountId) {
				alert("Please select a valid account to transfer to.");
				return;
			}
			transaction.related_account_id = destAccountId;
		}

		try {
			if (type === "Transfer") {
				await executeTransfer({ data: transaction });
			} else {
				await executeTransaction({ data: transaction });
			}
		} catch (error) {
			console.log(error);
			alert("Error adding transaction");
			return;
		} finally {
			router.back();
		}
	}, [
		amount,
		category,
		date,
		description,
		type,
		currency,
		account,
		transferAccount,
		accounts,
		categories,
		executeTransaction,
		executeTransfer,
	]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.chip} />
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.form}>
					<View style={styles.header}>
						{/* From Account */}
						<Select
							iconName="wallet.pass"
							placeholder={
								accounts && accounts[0] ? accounts[0].name : "Account"
							}
							items={accounts?.map((a) => a.name) || []}
							onSelect={setAccount}
							value={account}
							style={{
								boxStyle: {
									...styles.select,
									backgroundColor: CommonColors.blue,
								},
							}}
						/>
						{/* Category */}
						<Select
							iconName="list.bullet"
							placeholder={"Category"}
							items={categories?.map((c) => c.name) || []}
							onSelect={setCategory}
							value={category}
							style={{
								boxStyle: {
									...styles.select,
									backgroundColor: CommonColors.greenaccent,
								},
							}}
						/>
					</View>

					<TransactionSelector
						items={["Expense", "Income", "Transfer", "Savings"]}
						onSelect={setType}
						value={type}
						style={styles.transactionSelector}
					/>

					<View style={styles.amountContainer}>
						<ThemedText type="defaultSemiBold" style={styles.amount}>
							{type === "Expense" && "-"}
							{amount.length > 0 ? amount : "0.0"}
						</ThemedText>
						<CurrencySelect
							onSelect={setCurrency}
							currencies={["SEK", "USD", "EUR", "COP"]}
							currency={currency}
						/>
					</View>

					{/* Destination Account if "Transfer" */}
					{type === "Transfer" && (
						<View style={styles.row}>
							<ThemedText type="defaultSemiBold">To: </ThemedText>
							<Select
								iconName="wallet.pass"
								placeholder={
									accounts && accounts[0] ? accounts[0].name : "Account"
								}
								items={accounts?.map((a) => a.name) || []}
								onSelect={setAccount}
								value={account}
								style={{
									boxStyle: {
										...styles.select,
										backgroundColor: CommonColors.redaccent,
									},
								}}
							/>
						</View>
					)}

					{/* Date */}
					<View style={styles.row}>
						<ThemedText type="defaultSemiBold">Date: </ThemedText>
						<DatePicker
							date={date}
							onChange={setDate}
							style={{
								boxStyle: {
									...styles.select,
									backgroundColor: CommonColors.blue,
								},
							}}
						/>
					</View>

					{/* Description */}
					<View style={styles.row}>
						<TextInput
							style={styles.notesInput}
							placeholder="Add a comment..."
							value={description}
							onChangeText={setDescription}
						/>
					</View>
				</View>
				{/* Custom Keyboard */}
				{showKeyboard && (
					<CustomKeyboard onKeyPress={handleKeyPress} onSubmit={onSubmit} />
				)}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	form: {
		flex: 1,
	},
	button: {
		padding: 15,
		alignItems: "center",
	},
	buttonText: {
		color: CommonColors.white,
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	chip: {
		backgroundColor: CommonColors.grey,
		height: 5,
		width: 30,
		borderRadius: 10,
		marginTop: 5,
		alignSelf: "center",
	},
	keyboardContainer: {
		flex: 1,
		bottom: 0,
	},
	amountContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	currency: {
		fontSize: 20,
		fontWeight: "600",
		marginRight: 10,
	},
	amount: {
		fontSize: 56,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		marginVertical: 4,
	},
	notesInput: {
		fontSize: 24,
		fontWeight: "500",
		marginTop: 10,
		flex: 1,
		color: CommonColors.darkGrey,
		textAlign: "center",
	},
	keyboard: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
	},
	key: {
		width: "33.33%",
		padding: 15,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: CommonColors.grey,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	select: {
		borderBottomWidth: 0,
		flexDirection: "row",
		minWidth: "45%",
		borderRadius: 30,
	},
	title: {
		textAlign: "center",
		marginTop: 20,
	},
	transactionSelector: {
		marginHorizontal: 10,
		marginVertical: 10,
	},
});
