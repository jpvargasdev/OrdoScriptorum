import { ThemedText } from "@/components/ThemedText";
import { useDeleteAllData } from "@/hooks/apiHooks";
import { useUserDefaultsStore } from "@/state/user";
import React from "react";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
	View,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/components/SessionProvider";

const SettingsScreen = () => {
	const { signOut } = useSession();
	const { execute } = useDeleteAllData();
	const { setStartDay, setEndDay, startDayOfMonth, endDayOfMonth } =
		useUserDefaultsStore();

	const onDeleteAllData = async () => {
		try {
			await execute();
			Alert.alert("All data deleted successfully!");
			signOut();
		} catch (error) {
			console.error("Error deleting all data:", error);
		}
	};

	const handleDeleteAllData = () => {
		Alert.alert(
			"Delete All Data",
			"Are you sure you want to delete all data? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: onDeleteAllData },
			],
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Settings Title */}
			<ThemedText type="title">Settings</ThemedText>

			{/* User settings */}
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.section}>
					<ThemedText type="subtitle">Budget:</ThemedText>

					<View style={styles.inputContainer}>
						<ThemedText type="default">Start Day of Month:</ThemedText>
						<TextInput
							style={styles.input}
							value={startDayOfMonth.toString()}
							onChangeText={(text) => setStartDay(Number(text))}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText type="default">End Day of Month:</ThemedText>
						<TextInput
							style={styles.input}
							value={endDayOfMonth.toString()}
							onChangeText={(text) => setEndDay(Number(text))}
							keyboardType="numeric"
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>

			{/* Logout Button */}
			<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
				<Text style={styles.logoutButtonText}>Logout</Text>
			</TouchableOpacity>

			{/* Delete All Data Button */}
			<TouchableOpacity
				style={styles.deleteButton}
				onPress={handleDeleteAllData}
			>
				<Text style={styles.deleteButtonText}>Delete All Data</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
	input: {
		width: "30%",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: 'gray',
		fontSize: 16,
		padding: 4,
		textAlign: "center",
	},
	inputContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 10,
		marginLeft: 16,
	},
	header: {
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: 'gray',
	},
	section: {
		marginVertical: 20,
	},
	option: {
		backgroundColor: 'white',
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	optionText: {
		fontSize: 16,
		color: 'gray',
	},
	logoutButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: "bold",
	},
	logoutButton: {
		backgroundColor: 'black',
		padding: 5,
		alignItems: "center",
	},
	deleteButton: {
		backgroundColor: 'black',
		padding: 5,
		alignItems: "center",
		marginTop: 5,
	},
	deleteButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: "bold",
	},
});
