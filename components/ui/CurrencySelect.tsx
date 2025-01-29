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
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";
import { CommonColors } from "@/constants/Colors";

interface CurrencySelectProps {
	currency: string;
	currencies: string[]; // Lista de monedas (ISO 4217 códigos como 'USD', 'EUR', 'SEK')
	onSelect: (currency: string) => void; // Callback para manejar la moneda seleccionada
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
	currency,
	currencies,
	onSelect,
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
		currency,
	);
	const [modalVisible, setModalVisible] = useState(false);

	const handleSelect = (currency: string) => {
		setSelectedCurrency(currency); // Actualiza la moneda seleccionada
		setModalVisible(false); // Cierra el modal
		onSelect(currency); // Llama al callback
	};

	return (
		<View>
			{/* Selector visible */}
			<TouchableOpacity
				style={styles.selectBox}
				onPress={() => setModalVisible(true)}
			>
				<ThemedText type="defaultSemiBold">
					{selectedCurrency || "Select Currency"}
				</ThemedText>
				<IconSymbol name="chevron.down" size={16} color={CommonColors.black} />
			</TouchableOpacity>

			{/* Modal con la lista de monedas */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<FlatList
							data={currencies}
							keyExtractor={(item, index) => `${item}-${index}`}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.item}
									onPress={() => handleSelect(item)}
								>
									<Text style={styles.itemText}>{item}</Text>
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default CurrencySelect;

const styles = StyleSheet.create({
	selectBox: {
		marginLeft: 8,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	selectText: {},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: CommonColors.opacity_85_black,
	},
	modalContainer: {
		margin: 20,
		backgroundColor: CommonColors.white,
		padding: 15,
		maxHeight: "50%",
	},
	item: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: CommonColors.grey,
	},
	itemText: {
		fontSize: 16,
		color: CommonColors.darkGrey,
	},
});
