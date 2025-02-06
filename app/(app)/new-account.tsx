import { ThemedText } from "@/components/ThemedText";
import CurrencySelect from "@/components/ui/CurrencySelect";
import CustomKeyboard from "@/components/ui/CustomKeyboard";
import Select from "@/components/ui/Select";
import { useCreateAccount } from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
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
			<View style={styles.chip} />
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				{/* Amount Section */}
				<View style={styles.amountContainer}>
					<ThemedText type="default">Balance: </ThemedText>

					<ThemedText type="defaultSemiBold" style={styles.amount}>
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
					<TouchableOpacity onPress={onSubmit} style={styles.button}>
						<ThemedText type="default">Save</ThemedText>
					</TouchableOpacity>
				</View>

				{/* Type */}
				<Select
					showIcon
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
				<CustomKeyboard onKeyPress={handleKeyPress} onSubmit={onSubmit} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		alignSelf: "center",
		backgroundColor: 'lightgray',
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
	},
	chip: {
		backgroundColor: 'gray',
		height: 5,
		width: 30,
		borderRadius: 10,
		marginTop: 5,
		alignSelf: "center",
	},
	keyboardContainer: {
		position: "absolute",
		bottom: 0,
	},
	header: {
		marginBottom: 10,
	},
	amountContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	currency: {
		fontSize: 20,
		fontWeight: "600",
		marginRight: 10,
	},
	amount: {
		fontSize: 56,
		fontWeight: "bold",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 15,
		marginVertical: 5,
		borderBottomWidth: 1,
		borderColor: 'gray',
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: 'gray',
	},
	notesInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		color: 'gray',
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
		borderColor: 'gray',
	},
	keyText: {
		fontSize: 24,
		fontWeight: "bold",
	},
	expenseBg: {
		backgroundColor: 'white',
	},
	incomeBg: {
		backgroundColor: 'white',
	},
	transactionBg: {
		backgroundColor: 'white',
	},
	savingsBg: {
		backgroundColor: 'white',
	},
});
