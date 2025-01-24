import { StyleSheet } from "react-native";

import { ThemedView } from "./ThemedView";
import type { ReactNode } from "react";
import { CommonColors } from "@/constants/Colors";


export function Card(props: { children: ReactNode; style: object }) {
	return (
		<ThemedView style={{ ...styles.container, ...props.style }}>
			{props.children}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		shadowColor: CommonColors.black,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 1.4,
		elevation: 5,
	},
});
