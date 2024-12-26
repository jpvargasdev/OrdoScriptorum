import type React from "react";
import { useState } from "react";
import {
	View,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Modal,
	TextStyle,
	ViewStyle,
} from "react-native";
import { IconSymbol } from "./IconSymbol";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { SFSymbol } from "expo-symbols";

interface SelectProps {
	iconName?: SFSymbol;
	placeholder: string;
	items: string[];
	onSelect: (item: string) => void;
	style?: {
		textStyle?: TextStyle;
		boxStyle?: ViewStyle;
	};
	value?: string;
}

const Select: React.FC<SelectProps> = ({
	iconName,
	items,
	onSelect,
	placeholder,
	style: { textStyle, boxStyle } = {},
	value,
}) => {
	const [selectedItem, setSelectedItem] = useState<string | null>(
		value || null,
	);
	const [modalVisible, setModalVisible] = useState(false);

	const handleSelect = (item: string) => {
		setSelectedItem(item);
		setModalVisible(false);
		onSelect(item);
	};

	return (
		<View>
			{/* Selector visible */}
			<TouchableOpacity
				style={{ ...styles.selectBox, ...boxStyle }}
				onPress={() => setModalVisible(true)}
			>
				{iconName && <IconSymbol name={iconName} size={16} color="#000" />}
				<ThemedText
					style={{ ...styles.selectText, ...textStyle }}
					type="defaultSemiBold"
				>
					{selectedItem || placeholder}
				</ThemedText>
				<IconSymbol name="chevron.down" size={14} color="#333" />
			</TouchableOpacity>

			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<ThemedView style={styles.modalOverlay}>
					<ThemedView style={styles.modalContainer}>
						<FlatList
							data={items}
							keyExtractor={(item, index) => `${item}-${index}`}
							renderItem={({ item, index }) => {
								const noBorderBottom =
									index === items.length - 1 ? { borderBottomWidth: 0 } : {};
								return (
									<TouchableOpacity
										style={{ ...styles.item, ...noBorderBottom }}
										onPress={() => handleSelect(item)}
									>
										<ThemedText style={styles.itemText}>{item}</ThemedText>
									</TouchableOpacity>
								);
							}}
						/>
					</ThemedView>
				</ThemedView>
			</Modal>
		</View>
	);
};

export default Select;

const styles = StyleSheet.create({
	selectBox: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: "#ccc",
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
	selectText: {
		fontSize: 16,
		color: "#333",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContainer: {
		margin: 20,
		backgroundColor: "#fff",
		maxHeight: "50%",
	},
	item: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	itemText: {
		fontSize: 16,
		color: "#333",
	},
});
