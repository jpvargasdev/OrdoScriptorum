import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useGetAccounts } from "@/hooks/apiHooks";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountsScreen() {
	const {
		data: accounts,
		execute: fetchAccounts,
		reload: reloadAccounts,
		loading,
	} = useGetAccounts();

	useEffect(() => {
		fetchAccounts();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedText type="title">Accounts</ThemedText>

			{/* Table Header */}
			<ThemedView style={styles.headerRow}>
				<ThemedText type="defaultSemiBold" style={styles.cell}>
					Name
				</ThemedText>
				<ThemedText type="defaultSemiBold" style={styles.cell}>
					Type
				</ThemedText>
				<ThemedText type="defaultSemiBold" style={styles.cell}>
					Currency
				</ThemedText>
				<ThemedText type="defaultSemiBold" style={styles.cell}>
					Balance
				</ThemedText>
			</ThemedView>

			{/* Table Rows */}
			<FlatList
				style={styles.tableBody}
				data={accounts}
				keyExtractor={(item) => item.id.toString()}
				onRefresh={reloadAccounts}
				refreshing={loading}
				ListEmptyComponent={<ThemedText type="default">No accounts</ThemedText>}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.row}
						onPress={() =>
							router.navigate({ pathname: "/account", params: { id: item.id } })
						}
					>
						<ThemedText type="defaultSemiBold" style={styles.cell}>
							{item.name}
						</ThemedText>
						<ThemedText type="default" style={styles.cell}>
							{item.type}
						</ThemedText>
						<ThemedText type="default" style={styles.cell}>
							{item.currency}
						</ThemedText>
						<ThemedText type="defaultSemiBold" style={styles.cell}>
							{item.balance}
						</ThemedText>
					</TouchableOpacity>
				)}
			/>

			{/* Add Button */}
			<FloatingButton onPress={() => router.navigate("../new-account")} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
	headerRow: {
		flexDirection: "row",
		paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
	},
	row: {
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	cell: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	headerText: {
		fontWeight: "bold",
		color: "gray",
	},
	tableBody: {
	},
});
