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
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

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

	const handleNavigateToCategories = () => {
		router.push("/categories");
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
						<ThemedText type="defaultSemiBold">Start Day of Month:</ThemedText>
						<TextInput
							style={styles.input}
							value={startDayOfMonth.toString()}
							onChangeText={(text) => setStartDay(Number(text))}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText type="defaultSemiBold">End Day of Month:</ThemedText>
						<TextInput
							style={styles.input}
							value={endDayOfMonth.toString()}
							onChangeText={(text) => setEndDay(Number(text))}
							keyboardType="numeric"
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>

			{/* Data Management Section */}
			<View style={styles.section}>
				<ThemedText type="subtitle">Data Management:</ThemedText>

				<TouchableOpacity
					style={styles.menuOption}
					onPress={handleNavigateToCategories}
				>
					<View style={styles.menuOptionLeft}>
						<IconSymbol
							name="folder.fill"
							size={20}
							color={Colors.light.textSecondary}
						/>
						<ThemedText type="defaultSemiBold">Categories</ThemedText>
					</View>
					<IconSymbol
						name="chevron.right"
						size={16}
						color={Colors.light.textSecondary}
					/>
				</TouchableOpacity>
			</View>

			{/* Account Section */}
			<View style={styles.section}>
				<ThemedText type="subtitle">Account:</ThemedText>

				<TouchableOpacity style={styles.menuOption} onPress={signOut}>
					<View style={styles.menuOptionLeft}>
						<IconSymbol
							name="rectangle.portrait.and.arrow.right"
							size={20}
							color={Colors.light.textSecondary}
						/>
						<ThemedText type="defaultSemiBold">Logout</ThemedText>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuOption}
					onPress={handleDeleteAllData}
				>
					<View style={styles.menuOptionLeft}>
						<IconSymbol
							name="trash.fill"
							size={20}
							color={Colors.light.danger}
						/>
						<ThemedText type="defaultSemiBold" style={styles.dangerText}>
							Delete All Data
						</ThemedText>
					</View>
				</TouchableOpacity>
			</View>
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
		borderColor: "gray",
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
		color: "gray",
	},
	section: {
		marginVertical: 20,
	},
	menuOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Colors.light.background,
		padding: 16,
		marginTop: 12,
		borderRadius: 12,
	},
	menuOptionLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	dangerText: {
		color: Colors.light.danger,
	},
	option: {
		backgroundColor: "white",
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	optionText: {
		fontSize: 16,
		color: "gray",
	},
});
