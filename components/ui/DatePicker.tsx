import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
	ViewStyle,
	TextStyle,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconSymbol } from "./IconSymbol";
import { ThemedText } from "../ThemedText";

const DatePicker = ({
	date,
	onChange,
	style: { boxStyle, textStyle } = {},
}: {
	date: Date;
	onChange: (event: any, selectedDate?: Date) => void;
	style?: { boxStyle?: ViewStyle; textStyle?: TextStyle };
}) => {
	const [showPicker, setShowPicker] = useState(false); // Estado para mostrar el picker

	const onChangeDate = (_: any, selectedDate?: Date) => {
		setShowPicker(false); // Oculta el picker después de seleccionar
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	return (
		<View style={{ ...styles.container, ...boxStyle }}>
			{/* Botón para abrir el date picker */}
			<TouchableOpacity
				style={{ ...styles.selectBox, ...boxStyle }}
				onPress={() => setShowPicker(true)}
			>
				<IconSymbol name="calendar" size={16} color={'gray'} />
				<ThemedText
					style={{ ...styles.selectText, ...textStyle }}
					type="defaultSemiBold"
				>
					{date.toDateString()}
				</ThemedText>
				<IconSymbol
					name="chevron.down"
					size={16}
					color={'gray'}
				/>
			</TouchableOpacity>

			{/* Picker nativo */}
			{showPicker && (
				<DateTimePicker
					value={date}
					mode="date"
					display={"default"} // Diferente UI en iOS y Android
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
	},
	selectBox: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: 'gray',
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
	selectText: {
		fontSize: 16,
		color: 'gray',
		marginHorizontal: 4,
	},
});
