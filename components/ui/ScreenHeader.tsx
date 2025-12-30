import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

interface ScreenHeaderProps {
	title: string;
	showBackButton?: boolean;
	onBackPress?: () => void;
	rightElement?: React.ReactNode;
}

export function ScreenHeader({
	title,
	showBackButton = true,
	onBackPress,
	rightElement,
}: ScreenHeaderProps) {
	const handleBackPress = () => {
		if (onBackPress) {
			onBackPress();
		} else {
			router.back();
		}
	};

	return (
		<View style={styles.header}>
			{showBackButton ? (
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<IconSymbol
						name="chevron.left"
						size={24}
						color={Colors.light.textPrimary}
					/>
				</TouchableOpacity>
			) : (
				<View style={styles.placeholder} />
			)}

			<ThemedText type="subtitle" style={styles.headerTitle}>
				{title}
			</ThemedText>

			{rightElement ? (
				<View style={styles.rightElement}>{rightElement}</View>
			) : (
				<View style={styles.placeholder} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: 12,
	},
	backButton: {
		padding: 8,
		width: 44,
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
	},
	placeholder: {
		width: 44,
	},
	rightElement: {
		width: 44,
		alignItems: "center",
	},
});
