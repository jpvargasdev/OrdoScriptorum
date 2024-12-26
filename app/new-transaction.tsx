import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CurrencySelect from "@/components/ui/CurrencySelect";
import CustomKeyboard from "@/components/ui/CustomKeyboard";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import TransactionSelector from "@/components/ui/TransactionSelector";
import {
	useCreateTransaction,
	useCreateTransfer,
	useGetAccounts,
	useGetCategories,
} from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransaction() {
	const { execute: executeTransaction } = useCreateTransaction();
	const { execute: executeTransfer } = useCreateTransfer();
	const { data: categories } = useGetCategories();
	const { data: accounts } = useGetAccounts();

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
								boxStyle: { ...styles.select, backgroundColor: "#c6def1" },
								textStyle: { fontSize: 14 },
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
								boxStyle: { ...styles.select, backgroundColor: "#C9e4d3" },
								textStyle: { fontSize: 14 },
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

					{/*
					 * Destination Account if "Transfer"
					 */}
					{type === "Transfer" && (
						<Select
							placeholder={"Transfer To Account"}
							items={accounts?.map((a) => a.name) || []}
							onSelect={setTransferAccount}
							value={transferAccount}
						/>
					)}

					{/* Date */}
					<DatePicker date={date} onChange={setDate} />

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
				<CustomKeyboard onKeyPress={handleKeyPress} onSubmit={onSubmit} />
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
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	chip: {
		backgroundColor: "#bbb",
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
		padding: 15,
		marginVertical: 5,
	},
	notesInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		color: "#333",
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
		borderColor: "#ccc",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	select: {
		borderBottomWidth: 0,
		flexDirection: "row",
		minWidth: "40%",
		borderRadius: 30,
	},
	title: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 14,
	},
	transactionSelector: {
		marginHorizontal: 10,
	},
});
