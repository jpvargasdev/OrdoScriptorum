import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";

const TransactionSelector = ({
	items,
	onSelect,
	value,
}: {
	items: string[];
	onSelect: (item: string) => void;
	value: string;
	style?: ViewStyle;
}) => {
	return (
		<BlurView tint="dark" intensity={80} style={styles.container}>
			{items.map((item, index) => {
				const isSelected = value === item; // Check if this item is selected
				return (
					<TouchableOpacity
						key={index}
						style={[styles.button, isSelected && styles.selectedButton]}
						onPress={() => onSelect(item)}
					>
						<ThemedText
							lightColor={Colors.dark.buttonText}
							darkColor={Colors.light.buttonText}
							style={isSelected && styles.selectedText}
						>
							{item}
						</ThemedText>
					</TouchableOpacity>
				);
			})}
		</BlurView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 20,
		margin: 8,
		overflow: "hidden",
		backgroundColor: "transparent",
	},
	button: {
		flex: 1, // Buttons take equal space
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedButton: {
		backgroundColor: "black",
		borderRadius: 30,
	},
	selectedText: {
		color: "white",
	},
});

export default TransactionSelector;
