import type React from "react";
import { useState } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Modal,
	TextStyle,
	ViewStyle,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "./IconSymbol";
import { ThemedText } from "../ThemedText";
import { SFSymbol } from "expo-symbols";
import { BlurView } from "expo-blur";
import { Colors } from "../../constants/Colors";

interface SelectProps {
	showIcon: boolean;
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
	showIcon,
	iconName,
	items,
	onSelect,
	placeholder,
	style: { textStyle, boxStyle } = {},
	value,
}) => {
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	const handleSelect = (item: string | null) => {
		setSelectedItem(item);
		setModalVisible(false);
		onSelect(item || "");
	};

	const showIconStyle = showIcon ? {} : { marginLeft: 5 };

	return (
		<View>
			{/* Selector visible */}
			<TouchableOpacity
				style={{ ...styles.selectBox, ...boxStyle }}
				onPress={() => {
          setModalVisible(true)
          if (items && items.length > 0 && !selectedItem) {
            setSelectedItem(items[0])
          }
        }}
			>
				{iconName && (
					<IconSymbol name={iconName} size={16} color={'black'} />
				)}
				<ThemedText
					style={{ ...styles.selectText, ...textStyle, ...showIconStyle }}
					type="defaultSemiBold"
				>
					{selectedItem || placeholder}
				</ThemedText>
				{showIcon && (
					<IconSymbol
						name="chevron.down"
						size={16}
						color={'gray'}
					/>
				)}
			</TouchableOpacity>

			<Modal
				visible={modalVisible}
				animationType="slide"
        transparent
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<BlurView style={styles.modalContainer} intensity={80} tint="default">
            <View style={styles.buttonContainer}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
              <Button title="Select" onPress={() => handleSelect(selectedItem)} />
            </View>
            <Picker
              selectedValue={selectedItem}
              placeholder="Select an Item"
              onValueChange={(itemValue: string) =>
                setSelectedItem(itemValue)
              }>
              {items.map((item, index) => (
                <Picker.Item label={item} value={item} key={index} />
              ))}
            </Picker>					
          </BlurView>
				</View>
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
		borderColor: 'gray',
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
	selectText: {
		fontSize: 16,
		color: 'gray',
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
	},
	modalContainer: {
		margin: 20,
		backgroundColor: 'transparent',
		maxHeight: "50%",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.border
	},
	item: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
	},
	itemText: {
		fontSize: 16,
		color: 'gray',
	},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  }
});
