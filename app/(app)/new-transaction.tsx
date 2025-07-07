import { ThemedText } from "@/components/ThemedText";
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
import React, { useCallback, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function NewTransaction() {
	const { execute: executeTransaction } = useCreateTransaction();
	const { execute: executeTransfer } = useCreateTransfer();
	const { data: categories } = useGetCategories();
	const { data: accounts } = useGetAccounts();

	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("Category");
	const [date, setDate] = useState(new Date());
	const [description, setDescription] = useState("");
	const [showNumPad, setShowNumpad] = useState(true);
	const [type, setType] = useState("Expense");
	const [currency, setCurrency] = useState("SEK");
	const [account, setAccount] = useState<string>(
		accounts && accounts[0] ? accounts[0].name : "",
	);

	// New state for the destination account in case of Transfer
	const [transferAccount, setTransferAccount] = useState<string>(
		accounts && accounts[0] ? accounts[0].name : "",
	);

	// add keyboard listener to hide numpad
	Keyboard.addListener("keyboardWillHide", () => {
		setShowNumpad(true);
	});

	// add keyboard listener to show numpad
	Keyboard.addListener("keyboardWillShow", () => {
		setShowNumpad(false);
	});

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
						<TouchableOpacity onPress={onSubmit} style={styles.button}>
							<ThemedText type="defaultSemiBold">Save</ThemedText>
						</TouchableOpacity>
					</View>

					<View style={styles.rowWithBorder}>
						<View style={styles.row}>
							<Select
								showIcon={false}
								iconName="building.2"
								placeholder={
									accounts && accounts[1] ? accounts[1].name : "Account"
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
										accounts && accounts[0] ? accounts[0].name : "Account"
									}
									items={accounts?.map((a) => a.name) || []}
									onSelect={setTransferAccount}
									value={transferAccount}
									style={{
										boxStyle: styles.select,
									}}
								/>
							)}
							{/* Right arrow icon */}
							<IconSymbol name="arrow.right" size={12} color="gray" />
							{/* Category */}
							<Select
								showIcon={false}
								iconName="list.bullet.indent"
								placeholder={"Category"}
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
						<CustomKeyboard onKeyPress={handleKeyPress} onSubmit={onSubmit} />
					)}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	form: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		alignSelf: "center",
		backgroundColor: "#dfdfdf",
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginRight: 8,
		borderRadius: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	chip: {
		backgroundColor: "gray",
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
		flex: 1,
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
	keyboard: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
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
