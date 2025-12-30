import React from "react";
import {
	View,
	StyleSheet,
	Modal,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

interface DeleteCategoryModalProps {
	visible: boolean;
	categoryName: string;
	transactionCount: number;
	loading?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function DeleteCategoryModal({
	visible,
	categoryName,
	transactionCount,
	loading = false,
	onClose,
	onConfirm,
}: DeleteCategoryModalProps) {
	const canDelete = transactionCount === 0;

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<BlurView style={styles.container} intensity={80} tint="default">
					<View style={styles.iconContainer}>
						<IconSymbol
							name={canDelete ? "trash.fill" : "exclamationmark.triangle.fill"}
							size={40}
							color={canDelete ? Colors.light.danger : Colors.light.warning}
						/>
					</View>

					<ThemedText type="subtitle" style={styles.title}>
						{canDelete ? "Delete Subcategory" : "Cannot Delete"}
					</ThemedText>

					{canDelete ? (
						<ThemedText style={styles.message}>
							Are you sure you want to delete the subcategory "{categoryName}"?
							This action cannot be undone.
						</ThemedText>
					) : (
						<ThemedText style={styles.message}>
							You cannot delete "{categoryName}" because it has{" "}
							<ThemedText style={styles.highlight}>
								{transactionCount}{" "}
								{transactionCount === 1
									? "associated transaction"
									: "associated transactions"}
							</ThemedText>
							. You must first move or delete those transactions.
						</ThemedText>
					)}

					<View style={styles.buttons}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={onClose}
							disabled={loading}
						>
							<ThemedText type="defaultSemiBold">
								{canDelete ? "Cancel" : "Got it"}
							</ThemedText>
						</TouchableOpacity>

						{canDelete && (
							<TouchableOpacity
								style={[
									styles.button,
									styles.deleteButton,
									loading && styles.buttonDisabled,
								]}
								onPress={onConfirm}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator size="small" color="white" />
								) : (
									<ThemedText
										type="defaultSemiBold"
										style={styles.deleteButtonText}
									>
										Delete
									</ThemedText>
								)}
							</TouchableOpacity>
						)}
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
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	container: {
		margin: 20,
		padding: 24,
		borderRadius: 20,
		overflow: "hidden",
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.light.border,
		width: "85%",
		maxWidth: 360,
	},
	iconContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		textAlign: "center",
		marginBottom: 12,
	},
	message: {
		textAlign: "center",
		marginBottom: 24,
		opacity: 0.8,
		lineHeight: 22,
	},
	highlight: {
		fontWeight: "600",
		color: Colors.light.warning,
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 12,
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
	deleteButton: {
		backgroundColor: Colors.light.danger,
	},
	deleteButtonText: {
		color: "white",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
});
