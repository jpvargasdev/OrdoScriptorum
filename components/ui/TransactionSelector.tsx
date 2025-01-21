import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { CommonColors } from "@/constants/Colors";


const TransactionSelector = ({
	items,
	onSelect,
	value,
	style,
}: {
	items: string[];
	onSelect: (item: string) => void;
	value: string;
	style?: ViewStyle;
}) => {
	return (
		<View style={{ ...styles.container, ...style }}>
			{items.map((item, index) => {
				const isSelected = value === item; // Check if this item is selected
				return (
					<TouchableOpacity
						key={index}
						style={[styles.button, isSelected && styles.selectedButton]}
						onPress={() => onSelect(item)}
					>
						<ThemedText style={isSelected && styles.selectedText}>
							{item}
						</ThemedText>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 30,
		backgroundColor: CommonColors.grey,
		padding: 4,
	},
	button: {
		flex: 1, // Buttons take equal space
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedButton: {
		backgroundColor: CommonColors.black,
		borderRadius: 30,
	},
	selectedText: {
		fontWeight: "bold",
		color: CommonColors.white,
	},
});

export default TransactionSelector;
