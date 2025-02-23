import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({
	date,
	onChange,
	style: { boxStyle } = {},
}: {
	date: Date;
	onChange: (event: any, selectedDate?: Date) => void;
	style?: { boxStyle?: ViewStyle };
}) => {
	const onChangeDate = (_: any, selectedDate?: Date) => {
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	return (
		<View style={{ ...styles.container, ...boxStyle }}>
			<DateTimePicker
				value={date}
				mode="date"
				display={"default"} // Diferente UI en iOS y Android
				onChange={onChangeDate}
				style={styles.datePicker}
				locale="en-ES"
			/>
		</View>
	);
};

export default DatePicker;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	datePicker: {
		backgroundColor: "transparent",
		borderRadius: 30,
	},
});
