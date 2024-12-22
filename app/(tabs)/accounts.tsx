import { getAccounts } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useAxios } from "@/hooks/useAxios";
import { router } from "expo-router";
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountsScreen() {
  const { data } = useAxios<Account[]>(getAccounts)

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">Accounts</ThemedText>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <ThemedText type="defaultSemiBold" style={styles.cell}>Name</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.cell}>Type</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.cell}>Currency</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.cell}>Balance</ThemedText>
      </View>

      {/* Table Rows */}
      <ScrollView style={styles.tableBody}>
        {data?.map((item, index) => (
          <TouchableOpacity
            onPress={() =>
              router.navigate({ pathname: "/account", params: { id: item.id } })
            }
            key={index}
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF" },
            ]}
          >
            <ThemedText type="default" style={styles.cell}>{item.name}</ThemedText>
            <ThemedText type="default" style={styles.cell}>{item.type}</ThemedText>
            <ThemedText type="default" style={styles.cell}>{item.currency}</ThemedText>
            <ThemedText type="default" style={styles.cell}>{item.balance}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <FloatingButton onPress={() => router.navigate("../new-account")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#E9E9E9",
    paddingVertical: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
  },
  tableBody: {
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

