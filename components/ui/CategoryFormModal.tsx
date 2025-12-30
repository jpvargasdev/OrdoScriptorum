import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

interface CategoryFormModalProps {
	visible: boolean;
	mode: "create" | "edit";
	initialName?: string;
	initialMainCategory?: string;
	mainCategories: string[];
	allCategories: Category[];
	editingCategoryId?: number;
	loading?: boolean;
	onClose: () => void;
	onSubmit: (name: string, mainCategory: string) => void;
}

export default function CategoryFormModal({
	visible,
	mode,
	initialName = "",
	initialMainCategory = "Needs",
	mainCategories,
	allCategories,
	editingCategoryId,
	loading = false,
	onClose,
	onSubmit,
}: CategoryFormModalProps) {
	const [name, setName] = useState(initialName);
	const [selectedMainCategory, setSelectedMainCategory] =
		useState(initialMainCategory);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (visible) {
			setName(initialName);
			setSelectedMainCategory(initialMainCategory);
			setError(null);
		}
	}, [visible, initialName, initialMainCategory]);

	// Get existing names for the currently selected main category
	const getExistingNamesForSelectedCategory = useCallback((): string[] => {
		if (!allCategories) return [];
		return allCategories
			.filter(
				(cat) =>
					cat.main_category === selectedMainCategory &&
					(editingCategoryId === undefined || cat.id !== editingCategoryId),
			)
			.map((cat) => cat.name);
	}, [allCategories, selectedMainCategory, editingCategoryId]);

	const validate = (): boolean => {
		setError(null);

		const trimmedName = name.trim();

		if (!trimmedName) {
			setError("Subcategory name is required");
			return false;
		}

		// Check for duplicates within the selected main_category
		const existingNames = getExistingNamesForSelectedCategory();
		const isDuplicate = existingNames.some(
			(existingName) =>
				existingName.toLowerCase() === trimmedName.toLowerCase(),
		);

		if (isDuplicate) {
			setError(
				`A subcategory named "${trimmedName}" already exists in ${selectedMainCategory}`,
			);
			return false;
		}

		return true;
	};

	const handleSubmit = () => {
		if (!validate()) return;
		onSubmit(name.trim(), selectedMainCategory);
	};

	const title = mode === "create" ? "New Subcategory" : "Edit Subcategory";
	const submitText = mode === "create" ? "Create" : "Save";

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<BlurView style={styles.container} intensity={40} tint="default">
					<ThemedText type="subtitle" style={styles.title}>
						{title}
					</ThemedText>

					{error && (
						<View style={styles.errorContainer}>
							<ThemedText type="default" style={styles.errorText}>
								{error}
							</ThemedText>
						</View>
					)}

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Name</ThemedText>
						<TextInput
							style={styles.input}
							value={name}
							onChangeText={setName}
							placeholder="Subcategory name"
							placeholderTextColor="#999"
							autoFocus
							editable={!loading}
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Main Category</ThemedText>
						<View style={styles.mainCategorySelector}>
							{mainCategories.map((cat) => (
								<TouchableOpacity
									key={cat}
									style={[
										styles.mainCategoryButton,
										selectedMainCategory === cat &&
											styles.mainCategoryButtonSelected,
									]}
									onPress={() => setSelectedMainCategory(cat)}
									disabled={loading}
								>
									<ThemedText
										style={[
											styles.mainCategoryButtonText,
											selectedMainCategory === cat &&
												styles.mainCategoryButtonTextSelected,
										]}
									>
										{cat}
									</ThemedText>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View style={styles.buttons}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={onClose}
							disabled={loading}
						>
							<ThemedText type="defaultSemiBold">Cancel</ThemedText>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.button,
								styles.submitButton,
								loading && styles.buttonDisabled,
							]}
							onPress={handleSubmit}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator size="small" color="white" />
							) : (
								<ThemedText
									type="defaultSemiBold"
									style={styles.submitButtonText}
								>
									{submitText}
								</ThemedText>
							)}
						</TouchableOpacity>
					</View>
				</BlurView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
	container: {
		margin: 20,
		padding: 24,
		borderRadius: 20,
		overflow: "hidden",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.light.border,
		width: "90%",
		maxWidth: 400,
	},
	title: {
		textAlign: "center",
		marginBottom: 20,
	},
	errorContainer: {
		backgroundColor: "#ffebee",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	errorText: {
		color: "#c62828",
		textAlign: "center",
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		marginBottom: 8,
		fontWeight: "600",
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.light.border,
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		backgroundColor: Colors.light.inputBackground,
	},
	mainCategorySelector: {
		flexDirection: "row",
		gap: 8,
	},
	mainCategoryButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderRadius: 10,
		backgroundColor: Colors.light.inputBackground,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
	},
	mainCategoryButtonSelected: {
		borderColor: Colors.light.buttonBackground,
		backgroundColor: Colors.light.highlight,
	},
	mainCategoryButtonText: {
		fontSize: 14,
		color: Colors.light.textSecondary,
	},
	mainCategoryButtonTextSelected: {
		fontWeight: "600",
		color: Colors.light.textPrimary,
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		marginTop: 8,
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#e0e0e0",
	},
	submitButton: {
		backgroundColor: Colors.light.buttonBackground,
	},
	submitButtonText: {
		color: "white",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});
