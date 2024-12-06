import type React from "react";
import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Modal,
} from "react-native";
import { IconSymbol } from "./IconSymbol";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface SelectProps {
	placeholder: string;
	items: string[]; // Lista de items para mostrar
	onSelect: (item: string) => void; // Callback para manejar el ítem seleccionado
	style?: object;
	value?: string;
}

const Select: React.FC<SelectProps> = ({
	items,
	onSelect,
	placeholder,
	style,
	value,
}) => {
	const [selectedItem, setSelectedItem] = useState<string | null>(
		value || null,
	);
	const [modalVisible, setModalVisible] = useState(false);

	const handleSelect = (item: string) => {
		setSelectedItem(item); // Actualiza el ítem seleccionado
		setModalVisible(false); // Cierra el modal
		onSelect(item); // Llama al callback
	};

	return (
		<View>
			{/* Selector visible */}
			<TouchableOpacity
				style={styles.selectBox}
				onPress={() => setModalVisible(true)}
			>
				<ThemedText style={{ ...styles.selectText, ...style }}>
					{selectedItem || placeholder}
				</ThemedText>
				<IconSymbol name="chevron.down" size={20} color="#333" />
			</TouchableOpacity>

			{/* Modal con la lista de ítems */}
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
		padding: 15,
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginVertical: 5,
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
