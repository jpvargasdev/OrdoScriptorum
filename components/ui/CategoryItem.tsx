import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

interface CategoryItemProps {
	category: Category;
	transactionCount: number;
	onEdit: () => void;
	onDelete: () => void;
}

export default function CategoryItem({
	category,
	transactionCount,
	onEdit,
	onDelete,
}: CategoryItemProps) {
	return (
		<View style={styles.container}>
			<View style={styles.info}>
				<ThemedText type="default">{category.name}</ThemedText>
				{transactionCount > 0 && (
					<ThemedText type="small" style={styles.transactionCount}>
						{transactionCount}{" "}
						{transactionCount === 1 ? "transaction" : "transactions"}
					</ThemedText>
				)}
			</View>
			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={onEdit}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<IconSymbol
						name="pencil"
						size={18}
						color={Colors.light.textSecondary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={onDelete}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<IconSymbol name="trash" size={18} color={Colors.light.danger} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: Colors.light.background,
		borderBottomWidth: 1,
		borderBottomColor: Colors.light.border,
	},
	info: {
		flex: 1,
	},
	transactionCount: {
		color: Colors.light.textSecondary,
		marginTop: 2,
	},
	actions: {
		flexDirection: "row",
		gap: 16,
	},
	actionButton: {
		padding: 4,
	},
});
