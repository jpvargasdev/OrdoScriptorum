import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import CategoryItem from "@/components/ui/CategoryItem";
import { Colors } from "@/constants/Colors";

interface CategorySectionProps {
	mainCategory: string;
	categories: Category[];
	transactionCounts: Record<number, number>;
	onAddCategory: () => void;
	onEditCategory: (category: Category) => void;
	onDeleteCategory: (category: Category) => void;
}

export default function CategorySection({
	mainCategory,
	categories,
	transactionCounts,
	onAddCategory,
	onEditCategory,
	onDeleteCategory,
}: CategorySectionProps) {
	const getCategoryColor = (mainCat: string): string => {
		switch (mainCat) {
			case "Needs":
				return Colors.light.blue;
			case "Wants":
				return Colors.light.pink;
			case "Savings":
				return Colors.light.green;
			default:
				return Colors.light.textSecondary;
		}
	};

	const getCategoryIcon = (mainCat: string): string => {
		switch (mainCat) {
			case "Needs":
				return "house.fill";
			case "Wants":
				return "heart.fill";
			case "Savings":
				return "banknote.fill";
			default:
				return "folder.fill";
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: getCategoryColor(mainCategory) + "20" },
						]}
					>
						<IconSymbol
							name={getCategoryIcon(mainCategory) as any}
							size={20}
							color={getCategoryColor(mainCategory)}
						/>
					</View>
					<ThemedText type="subtitle" style={styles.title}>
						{mainCategory}
					</ThemedText>
					<ThemedText style={styles.count}>({categories.length})</ThemedText>
				</View>
				<TouchableOpacity
					style={styles.addButton}
					onPress={onAddCategory}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<IconSymbol
						name="plus.circle.fill"
						size={24}
						color={Colors.light.buttonBackground}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.categoriesList}>
				{categories.length === 0 ? (
					<View style={styles.emptyState}>
						<ThemedText style={styles.emptyText}>
							No subcategories yet. Tap + to add one.
						</ThemedText>
					</View>
				) : (
					categories.map((category) => (
						<CategoryItem
							key={category.id}
							category={category}
							transactionCount={transactionCounts[category.id] || 0}
							onEdit={() => onEditCategory(category)}
							onDelete={() => onDeleteCategory(category)}
						/>
					))
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 18,
	},
	count: {
		fontSize: 14,
		color: Colors.light.textSecondary,
	},
	addButton: {
		padding: 4,
	},
	categoriesList: {
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		marginHorizontal: 16,
		overflow: "hidden",
	},
	emptyState: {
		padding: 24,
		alignItems: "center",
	},
	emptyText: {
		color: Colors.light.textSecondary,
		textAlign: "center",
	},
});
