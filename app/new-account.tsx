import { addAccount } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import Select from "@/components/ui/Select";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

export default function Accounts() {
	const [name, setName] = useState("");
	const [balance, setBalance] = useState("");
	const [currency, setCurrency] = useState("USD");
	const [type, setType] = useState("Expense");

	const onSubmit = useCallback(async () => {
		const account: Omit<Account, "id"> = {
			balance: balance.length > 0 ? parseFloat(balance) : 0,
			currency,
			name,
			type,
		};

		// validate account fields
		if (
			!account.name ||
			!account.currency ||
			!account.type
		) {
			alert("Please fill in all fields");
			return;
		}

		try {
			await addAccount(account);
		} catch (error) {
			console.error("Error adding account", error);
		} finally {
			router.back();
		}
	}, [name, balance, currency, type]);

	const handleKeyPress = (key: string) => {
		if (key === "delete") {
			setBalance(balance.slice(0, -1));
		} else {
			setBalance(balance + key);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			{/* Name */}
			<View style={styles.row}>
				<TextInput
					style={styles.notesInput}
					placeholder="Account Name"
					value={name}
					onChangeText={setName}
				/>
			</View>

			{/* Type */}
			<Select
				placeholder={"Account type"}
				items={[
					"Bank Account",
					"Cash",
					"Credit Card",
					"Savings Account",
					"Debit Card",
				]}
				onSelect={setType}
				value={type}
			/>

			{/* Currency */}
			<Select
				placeholder={"Currency"}
				items={["SEK", "USD", "EUR", "COP"]}
				onSelect={setCurrency}
				value={currency}
			/>

			<View style={styles.row}>
				<ThemedText style={styles.notesInput}>
					{balance.length > 0 ? balance : "Balance"}
				</ThemedText>
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
	expenseBg: {
		backgroundColor: "#fafafa",
	},
	incomeBg: {
		backgroundColor: "#fafafa",
	},
	transactionBg: {
		backgroundColor: "#fafafa",
	},
	savingsBg: {
		backgroundColor: "#fafafa",
	},
});
