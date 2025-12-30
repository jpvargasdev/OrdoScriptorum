import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import CategorySection from "@/components/ui/CategorySection";
import CategoryFormModal from "@/components/ui/CategoryFormModal";
import DeleteCategoryModal from "@/components/ui/DeleteCategoryModal";
import {
	useGetCategories,
	useCreateCategory,
	useUpdateCategory,
	useDeleteCategory,
	useGetTransactions,
} from "@/hooks/apiHooks";
import { Colors } from "@/constants/Colors";

const MAIN_CATEGORIES = ["Needs", "Wants", "Savings"];

export default function CategoriesScreen() {
	// API hooks
	const {
		data: categories,
		loading: loadingCategories,
		execute: fetchCategories,
	} = useGetCategories();
	const { data: transactions } = useGetTransactions();
	const { execute: createCategory, loading: createLoading } =
		useCreateCategory();
	const { execute: updateCategory, loading: updateLoading } =
		useUpdateCategory();
	const { execute: deleteCategory, loading: deleteLoading } =
		useDeleteCategory();

	// UI state
	const [refreshing, setRefreshing] = useState(false);
	const [formModalVisible, setFormModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [formMode, setFormMode] = useState<"create" | "edit">("create");
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [preselectedMainCategory, setPreselectedMainCategory] =
		useState("Needs");

	// Fetch data on mount
	useEffect(() => {
		fetchCategories({ force: true });
	}, []);

	// Group categories by main_category
	const categoriesByMain = useMemo(() => {
		const grouped: Record<string, Category[]> = {
			Needs: [],
			Wants: [],
			Savings: [],
		};

		if (categories) {
			categories.forEach((cat) => {
				if (grouped[cat.main_category]) {
					grouped[cat.main_category].push(cat);
				}
			});
		}

		// Sort each group alphabetically
		Object.keys(grouped).forEach((key) => {
			grouped[key].sort((a, b) => a.name.localeCompare(b.name));
		});

		return grouped;
	}, [categories]);

	// Count transactions per category
	const transactionCounts = useMemo(() => {
		const counts: Record<number, number> = {};

		if (transactions && categories) {
			categories.forEach((cat) => {
				counts[cat.id] = transactions.filter(
					(t) => t.category_id === cat.id,
				).length;
			});
		}

		return counts;
	}, [transactions, categories]);

	// Refresh handler
	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchCategories({ force: true });
		setRefreshing(false);
	}, [fetchCategories]);

	// Add category handler
	const handleAddCategory = useCallback((mainCategory: string) => {
		setFormMode("create");
		setSelectedCategory(null);
		setPreselectedMainCategory(mainCategory);
		setFormModalVisible(true);
	}, []);

	// Edit category handler
	const handleEditCategory = useCallback((category: Category) => {
		setFormMode("edit");
		setSelectedCategory(category);
		setPreselectedMainCategory(category.main_category);
		setFormModalVisible(true);
	}, []);

	// Delete category handler
	const handleDeleteCategory = useCallback((category: Category) => {
		setSelectedCategory(category);
		setDeleteModalVisible(true);
	}, []);

	// Form submit handler
	const handleFormSubmit = useCallback(
		async (name: string, mainCategory: string) => {
			try {
				if (formMode === "create") {
					await createCategory({
						data: {
							name,
							main_category: mainCategory,
						},
					});
				} else if (selectedCategory) {
					await updateCategory({
						id: selectedCategory.id.toString(),
						data: {
							id: selectedCategory.id,
							name,
							main_category: mainCategory,
						},
					});
				}
				setFormModalVisible(false);
				setSelectedCategory(null);
			} catch (error) {
				console.error("Error saving category:", error);
			}
		},
		[formMode, selectedCategory, createCategory, updateCategory],
	);

	// Delete confirm handler
	const handleDeleteConfirm = useCallback(async () => {
		if (!selectedCategory) return;

		try {
			await deleteCategory({ id: selectedCategory.id.toString() });
			setDeleteModalVisible(false);
			setSelectedCategory(null);
		} catch (error) {
			console.error("Error deleting category:", error);
		}
	}, [selectedCategory, deleteCategory]);

	// Close modals
	const handleCloseFormModal = useCallback(() => {
		setFormModalVisible(false);
		setSelectedCategory(null);
	}, []);

	const handleCloseDeleteModal = useCallback(() => {
		setDeleteModalVisible(false);
		setSelectedCategory(null);
	}, []);

	// Loading state
	if (loadingCategories && !categories) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<ThemedText style={styles.loadingText}>
					Loading categories...
				</ThemedText>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScreenHeader title="Categories" />

			{/* Content */}
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
			>
				{MAIN_CATEGORIES.map((mainCategory) => (
					<CategorySection
						key={mainCategory}
						mainCategory={mainCategory}
						categories={categoriesByMain[mainCategory] || []}
						transactionCounts={transactionCounts}
						onAddCategory={() => handleAddCategory(mainCategory)}
						onEditCategory={handleEditCategory}
						onDeleteCategory={handleDeleteCategory}
					/>
				))}
			</ScrollView>

			{/* Create/Edit Modal */}
			<CategoryFormModal
				visible={formModalVisible}
				mode={formMode}
				initialName={selectedCategory?.name || ""}
				initialMainCategory={
					selectedCategory?.main_category || preselectedMainCategory
				}
				mainCategories={MAIN_CATEGORIES}
				allCategories={categories || []}
				editingCategoryId={selectedCategory?.id}
				loading={createLoading || updateLoading}
				onClose={handleCloseFormModal}
				onSubmit={handleFormSubmit}
			/>

			{/* Delete Confirmation Modal */}
			<DeleteCategoryModal
				visible={deleteModalVisible}
				categoryName={selectedCategory?.name || ""}
				transactionCount={
					selectedCategory ? transactionCounts[selectedCategory.id] || 0 : 0
				}
				loading={deleteLoading}
				onClose={handleCloseDeleteModal}
				onConfirm={handleDeleteConfirm}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 16,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 32,
	},
});
