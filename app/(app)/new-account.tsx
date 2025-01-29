import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CurrencySelect from "@/components/ui/CurrencySelect";
import Select from "@/components/ui/Select";
import { useCreateAccount } from "@/hooks/apiHooks";
import { router } from "expo-router";
import { CommonColors } from "@/constants/Colors";
import React, { useCallback, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accounts() {
	const { execute } = useCreateAccount();

	const [name, setName] = useState("");
	const [balance, setBalance] = useState("");
	const [currency, setCurrency] = useState("SEK");
	const [type, setType] = useState("Cash");

	const onSubmit = useCallback(async () => {
		const account: Omit<Account, "id"> = {
			balance: balance.length > 0 ? parseFloat(balance) : 0,
			currency,
			name,
			type,
		};

		// validate account fields
		if (!account.name || !account.currency || !account.type) {
			alert("Please fill in all fields");
			return;
		}

		try {
			await execute({ data: account });
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
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				{/* Amount Section */}
				<View style={styles.amountContainer}>
					<ThemedText type="title">
						<ThemedText type="subtitle">Balance: </ThemedText>
						{balance.length > 0 ? balance : "0.00"}
					</ThemedText>
					<CurrencySelect
						onSelect={setCurrency}
						currencies={["SEK", "USD", "EUR", "COP"]}
						currency={currency}
					/>
				</View>
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
						"Checking Account",
						"Savings Account",
						"Credit Card",
						"Debit Card",
						"Investment Account",
						"Loan",
						"Mortgage",
						"Student Loan",
						"Personal Loan",
						"Business Loan",
						"Other",
					]}
					onSelect={setType}
					value={type}
				/>

				{/* Custom Keyboard */}
				<View style={styles.keyboardContainer}>
					<ThemedView style={styles.keyboard}>
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
					</ThemedView>
					<TouchableOpacity style={styles.button} onPress={onSubmit}>
						<ThemedText type="subtitle" style={styles.buttonText}>
							Save
						</ThemedText>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: CommonColors.salmonRed,
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
	},
	keyboardContainer: {
		position: "absolute",
		bottom: 0,
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
		padding: 15,
		marginVertical: 5,
		borderBottomWidth: 1,
		borderColor: CommonColors.grey,
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: CommonColors.darkGrey,
	},
	notesInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		color: CommonColors.darkGrey,
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
	keyText: {
		fontSize: 24,
		fontWeight: "bold",
	},
	expenseBg: {
		backgroundColor: CommonColors.white,
	},
	incomeBg: {
		backgroundColor: CommonColors.white,
	},
	transactionBg: {
		backgroundColor: CommonColors.white,
	},
	savingsBg: {
		backgroundColor: CommonColors.white,
	},
});
