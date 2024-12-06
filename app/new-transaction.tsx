import { addTransaction, getAccounts, getCategories } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import CurrencySelect from "@/components/ui/CurrencySelect";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import { useAxios } from "@/hooks/useAxios";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

export default function Accounts() {
	const { data: categories } = useAxios<Category[]>(getCategories);
	const { data: accounts } = useAxios<Account[]>(getAccounts);

	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("Add a category");
	const [date, setDate] = useState(new Date());
	const [description, setDescription] = useState("");
	const [type, setType] = useState("Expense");
	const [currency, setCurrency] = useState("SEK");
	const [account, setAccount] = useState<string>(accounts && accounts[0] ? accounts[0].name : "");

	const handleKeyPress = (key: string) => {
		if (key === "delete") {
			setAmount(amount.slice(0, -1));
		} else {
			setAmount(amount + key);
		}
	};

	const onSubmit = useCallback(async () => {
		// validate transaction fields
		if (
			!amount ||
			!date ||
			!description ||
			!currency ||
			!account ||
			!type
		) {
			alert("All fields are required");
			return;
		}

		const transaction: Omit<
			Transaction,
			| "id"
			| "amount_in_base_currency"
			| "exchange_rate"
			| "main_category"
			| "subcategory"
		> = {
			amount: type === "Expense" ? parseFloat(amount) * -1 : parseFloat(amount),
			date: Math.floor(date.getTime() / 1000),
			description,
			currency,
			category_id: categories?.find((c) => c.name === category)?.id,
			transaction_type: type,
			account_id: accounts?.find((a) => a.name === account)?.id,
		};

		try {
			await addTransaction(transaction);
		} catch (error) {
			console.log(error);
			alert("Error adding transaction");
			return;
		} finally {
			router.back();
		}
	}, [amount, category, date, description, type, currency, account]);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			{/* Amount Section */}
			<View style={styles.amountContainer}>
				<ThemedText type="title">
					{type === "Expense" && "-"}
					{amount.length > 0 ? amount : "0.00"}
				</ThemedText>
				<CurrencySelect
					onSelect={setCurrency}
					currencies={["SEK", "USD", "EUR", "COP"]}
					currency={currency}
				/>
			</View>

			{/* Type */}
			<Select
				placeholder={"Transaction type"}
				items={["Expense", "Income", "Transfer", "Savings"]}
				onSelect={setType}
				value={type}
			/>

			{/* Category */}
			<Select
				placeholder={"Category"}
				items={categories?.map((c) => c.name) || []}
				onSelect={setCategory}
				value={category}
			/>

			{/* Account */}
			<Select
				placeholder={accounts && accounts[0] ? accounts[0].name : "Account"}
				items={accounts?.map((a) => a.name) || []}
				onSelect={setAccount}
				value={account}
			/>

			{/* Date */}
			<DatePicker date={date} onChange={setDate} />

			{/* Description */}
			<View style={styles.row}>
				<TextInput
					style={styles.notesInput}
					placeholder="Description"
					value={description}
					onChangeText={setDescription}
				/>
			</View>

			{/* Custom Keyboard */}
			<View style={styles.keyboardContainer}>
				<View style={styles.keyboard}>
					{[
						"1",
						"2",
						"3",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9",
						".",
						"0",
						"delete",
					].map((key) => (
						<TouchableOpacity
							key={key}
							style={styles.key}
							onPress={() => handleKeyPress(key)}
						>
							<ThemedText type="subtitle">
								{key === "delete" ? "⌫" : key}
							</ThemedText>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<TouchableOpacity style={styles.button} onPress={onSubmit}>
				<ThemedText type="subtitle" style={styles.buttonText}>
					Save
				</ThemedText>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#FF4D4D",
		borderRadius: 10,
		padding: 15,
		marginTop: 20,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		padding: 20,
	},
	keyboardContainer: {
		marginVertical: 20,
	},
	header: {
		marginBottom: 10,
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
		fontSize: 36,
		fontWeight: "bold",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 10,
		padding: 15,
		marginVertical: 5,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#333",
	},
	notesInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		color: "#333",
	},
	keyboard: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		backgroundColor: "white",
	},
	key: {
		width: "33.33%",
		padding: 15,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
	},
	keyText: {
		fontSize: 24,
		fontWeight: "bold",
	},
});
