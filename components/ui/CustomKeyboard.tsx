import React from "react";
import {
	View,
	StyleSheet,
	TextStyle,
	Dimensions,
	TouchableHighlight,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";

const { height } = Dimensions.get("window");

const CustomKeyboard = ({
	onKeyPress,
	onSubmit,
}: { onKeyPress: (key: string) => void; onSubmit: () => void }) => {
	const keys = [
		["7", "8", "9"], // Row 1
		["4", "5", "6"], // Row 2
		["1", "2", "3"], // Row 3
		[".", "0", "delete"], // Row 4
	];

	const renderKey = (key: string, index: number) => {
		let keyStyle: Record<string, any> = styles.key;
		let textStyle: TextStyle = styles.keyText;

		// Apply different styles for special keys
		if (key === "delete") keyStyle = [styles.key, styles.deleteKey];
		if (key === "check") keyStyle = [styles.key, styles.checkKey];

		return (
			<TouchableHighlight
				underlayColor="rgba(0, 0, 0, 0.1)"
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
				) : key === "check" ? (
					<IconSymbol name="checkmark" color="white" size={32} />
				) : (
					<ThemedText style={textStyle}>{key}</ThemedText>
				)}
			</TouchableHighlight>
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginHorizontal: 24,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	keyContainer: {
		flexDirection: "column",
		flex: 1,
	},
	key: {
		flex: 1, // Default flex for all keys
		height: height / 3 / 4,
		alignItems: "center",
		justifyContent: "center",
	},
	keyText: {
		fontSize: 30,
		opacity: 0.8
	},
	deleteKey: {
	},
	checkKey: {
		flex: 1, // Default flex for all keys
		marginVertical: 0,
		marginHorizontal: 4,
		borderRadius: 15,
		backgroundColor: 'black',
		alignItems: "center",
		justifyContent: "center",
	},
});

export default CustomKeyboard;
