import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconSymbol } from "./IconSymbol";

const DatePicker = ({
	date,
	onChange,
}: { date: Date; onChange: (event: any, selectedDate?: Date) => void }) => {
	const [showPicker, setShowPicker] = useState(false); // Estado para mostrar el picker

	const onChangeDate = (event: any, selectedDate?: Date) => {
		setShowPicker(false); // Oculta el picker después de seleccionar
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	const showDatePicker = () => {
		setShowPicker(true);
	};

	return (
		<View style={styles.container}>
			{/* Botón para abrir el date picker */}
			<TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
				<Text style={styles.dateText}>
					{date.toISOString().split("T")[0]} {/* Formato de fecha */}
				</Text>
				<IconSymbol name="calendar" size={20} color="#333" />
			</TouchableOpacity>

			{/* Picker nativo */}
			{showPicker && (
				<DateTimePicker
					value={date}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"} // Diferente UI en iOS y Android
					onChange={onChangeDate}
				/>
			)}
		</View>
	);
};

export default DatePicker;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 5,
	},
	dateButton: {
		padding: 15,
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
		justifyContent: "space-between",
		alignItems: "flex-start",
		width: "100%",
		flexDirection: "row",
	},
	dateText: {
		fontSize: 16,
		color: "#333",
	},
});
