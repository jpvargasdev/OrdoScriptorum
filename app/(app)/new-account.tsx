import { ThemedText } from "@/components/ThemedText";
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
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accounts() {
	const { execute } = useCreateAccount();

	const [name, setName] = useState("");
	const [balance, setBalance] = useState("");
	const [currency, setCurrency] = useState("SEK");
	const [showNumPad, setShowNumpad] = useState(true);
	const [type, setType] = useState("Select account type");

	// add keyboard listener to hide numpad
	Keyboard.addListener("keyboardWillHide", () => {
		setShowNumpad(true);
	});

	// add keyboard listener to show numpad
	Keyboard.addListener("keyboardWillShow", () => {
		setShowNumpad(false);
	});

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
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
						<Select
							showIcon
							placeholder="SEK"
							onSelect={setCurrency}
							items={["SEK", "USD", "EUR", "COP"]}
							value={currency}
							style={{ boxStyle: styles.currencySelector }}
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
						style={{ boxStyle: styles.selectBox }}
					/>

					{/* Custom Keyboard */}
					{showNumPad && (
						<CustomKeyboard onKeyPress={handleKeyPress} onSubmit={onSubmit} />
					)}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		alignSelf: "center",
		backgroundColor: "lightgray",
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
	},
	currency: {
		borderBottomWidth: 0,
	},
	keyboardContainer: {
		position: "absolute",
		bottom: 0,
	},
	amountContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	currencySelector: {
		borderBottomWidth: 0,
	},
	amount: {
		fontSize: 56,
		fontWeight: "bold",
	},
	selectBox: {
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 15,
		marginVertical: 5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "gray",
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "gray",
	},
	notesInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		color: "gray",
	},
});
