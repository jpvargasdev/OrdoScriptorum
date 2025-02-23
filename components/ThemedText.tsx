import { Text, type TextProps, StyleSheet, TextStyle } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?:
		| "default"
		| "title"
		| "defaultSemiBold"
		| "subtitle"
		| "link"
		| "small";
};

export function ThemedText({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	const color = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"textPrimary",
	);

	return (
		<Text
			style={[
				{ color: color as TextStyle["color"] },
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
	},
	defaultSemiBold: {
		fontSize: 16,
		fontWeight: "600",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	small: {
		fontSize: 12,
		opacity: 0.8,
	},
	link: {
		fontSize: 16,
		color: "#0a7ea4",
	},
});
