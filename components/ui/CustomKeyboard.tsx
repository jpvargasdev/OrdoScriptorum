import React, { useCallback } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextStyle,
	Dimensions,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";

const { height } = Dimensions.get("window");

const CustomKeyboard = ({
	onKeyPress,
	onSubmit,
}: { onKeyPress: (key: string) => void; onSubmit: () => void }) => {
	const keys = [
		["1", "2", "3"], // Row 1
		["4", "5", "6"], // Row 2
		["7", "8", "9"], // Row 3
		["$", "0", "."], // Row 4
	];

	const optionsKeys = [["delete"], ["calendar"], ["check"]];

	const renderKey = (key: string, index: number) => {
		let keyStyle: Record<string, any> = styles.key;
		let textStyle: TextStyle = styles.keyText;

		// Apply different styles for special keys
		if (key === "delete") keyStyle = [styles.key, styles.deleteKey];
		if (key === "calendar") keyStyle = [styles.key, styles.calendarKey];
		if (key === "check") keyStyle = [styles.checkKey];
		if (key === "$") keyStyle = [styles.key, styles.currencyKey];

		const handleKeyPress = useCallback(() => {}, []);

		return (
			<TouchableOpacity
				key={index}
				style={keyStyle}
				onPress={() => {
					if (key === "$" || key === "calendar") {
						return;
					}
					if (key === "check") {
						onSubmit();
						return;
					} else onKeyPress(key);
				}}
				disabled={!key}
			>
				{key === "delete" ? (
					<IconSymbol name="delete.backward" color="black" size={32} />
				) : key === "calendar" ? (
					<IconSymbol name="calendar" color="black" size={32} />
				) : key === "check" ? (
					<IconSymbol name="checkmark" color="white" size={32} />
				) : (
					<ThemedText style={textStyle}>{key}</ThemedText>
				)}
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{/* Main Keyboard Section */}
			<View style={styles.keyContainer}>
				{keys.map((row, rowIndex) => (
					<View key={rowIndex} style={styles.row}>
						{row.map((key, index) => renderKey(key, index))}
					</View>
				))}
			</View>

			{/* Options Section (Delete, Calendar, Check Button) */}
			<View style={styles.keyOptionsContainer}>
				{optionsKeys.map((row, rowIndex) => (
					<View key={rowIndex} style={styles.row}>
						{row.map((key, index) => renderKey(key, index))}
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderRadius: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	keyContainer: {
		flexDirection: "column",
		flex: 0.85,
	},
	keyOptionsContainer: {
		flexDirection: "column",
		flex: 0.3,
	},
	key: {
		flex: 1, // Default flex for all keys
		marginVertical: 0,
		marginHorizontal: 4,
		height: height / 2.7 / 4,
		borderRadius: 15,
		backgroundColor: "#fafafa",
		alignItems: "center",
		justifyContent: "center",
	},
	keyText: {
		fontSize: 32,
	},
	deleteKey: {
		backgroundColor: "#F9D6D2",
	},
	calendarKey: {
		backgroundColor: "#c6def1",
	},
	currencyKey: {
		backgroundColor: "#FFF3CC",
	},
	checkKey: {
		flex: 1, // Default flex for all keys
		marginVertical: 0,
		marginHorizontal: 4,
		height: height / 3 / 2 + 24,
		borderRadius: 15,
		backgroundColor: "black",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default CustomKeyboard;
