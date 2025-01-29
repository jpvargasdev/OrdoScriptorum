import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { CommonColors } from "@/constants/Colors";

export function FloatingButton({ onPress }: { onPress?: () => void }) {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<IconSymbol name="plus" size={30} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		right: 20,
		bottom: 120,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: CommonColors.red,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},
});
