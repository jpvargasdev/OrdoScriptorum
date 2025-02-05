import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";

export function FloatingButton({ onPress }: { onPress?: () => void }) {
	const buttonBackground = useThemeColor({}, 'buttonBackground');
	return (
		<TouchableOpacity style={styles.container(buttonBackground as string)} onPress={onPress}>
			<IconSymbol name="plus" size={25} color="white" />
		</TouchableOpacity>
	);
}

const styles = {
	container: (backgroundColor: string): ViewStyle => ({
		position: "absolute",
		right: 20,
		bottom: 120,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	})
}
