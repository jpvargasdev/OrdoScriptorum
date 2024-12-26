import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";

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
						<ThemedText
							style={[styles.buttonText, isSelected && styles.selectedText]}
						>
							{item}
						</ThemedText>
						{isSelected && <View style={styles.selector} />}
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
		borderRadius: 8,
	},
	button: {
		flex: 1, // Buttons take equal space
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedButton: {},
	buttonText: {
		fontSize: 16,
	},
	selectedText: {
		fontWeight: "bold",
	},
	selector: {
		marginTop: 4,
		height: 3,
		width: "50%",
		borderRadius: 8,
		backgroundColor: "#F9D6D2",
	},
});

export default TransactionSelector;
