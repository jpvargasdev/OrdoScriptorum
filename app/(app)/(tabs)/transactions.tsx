import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router } from "expo-router";
import {
  useGetAccounts,
  useGetTransactions,
  useGetIncomes,
  useGetTransactionsByMainCategory,
  useGetTransfers,
} from "@/hooks/apiHooks";
import { useUserDefaultsStore } from "@/state/user";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import TransactionsList from "@/components/ui/TransactionsList";
import { ThemedView } from "@/components/ThemedView";
import TransactionFilter, {
  TransactionFilterType,
} from "@/components/ui/TransactionFilter";

export default function TransactionsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<TransactionFilterType>("All");
  const previousFilter = useRef<TransactionFilterType>("All");
  const { startDayOfMonth, endDayOfMonth } = useUserDefaultsStore();

  const {
    data: allTransactions,
    execute: getAllTransactions,
    loading: loadingAll,
    error: errorAll,
  } = useGetTransactions();

  const {
    data: incomes,
    execute: getIncomes,
    loading: loadingIncomes,
    error: errorIncomes,
  } = useGetIncomes();

  const {
    data: categoryTransactions,
    execute: getByCategory,
    loading: loadingCategory,
    error: errorCategory,
  } = useGetTransactionsByMainCategory();

  const {
    data: transfers,
    execute: getTransfers,
    loading: loadingTransfers,
    error: errorTransfers,
  } = useGetTransfers();

  const { data: accounts } = useGetAccounts();

  // Fetch data based on selected filter
  useEffect(() => {
    // Avoid refetching if filter hasn't changed
    if (previousFilter.current === selectedFilter) return;
    previousFilter.current = selectedFilter;

    switch (selectedFilter) {
      case "All":
        getAllTransactions({ force: true });
        break;
      case "Incomes":
        getIncomes({ force: true });
        break;
      case "Savings":
        getByCategory({
          id: "Savings",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Needs":
        getByCategory({
          id: "Needs",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Wants":
        getByCategory({
          id: "Wants",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Transfers":
        getTransfers({ force: true });
        break;
    }
  }, [selectedFilter]);

  // Initial load
  useEffect(() => {
    getAllTransactions();
  }, []);

  // Get transactions based on selected filter
  const filteredTransactions = useMemo(() => {
    switch (selectedFilter) {
      case "All":
        return allTransactions;
      case "Incomes":
        return incomes;
      case "Savings":
      case "Needs":
      case "Wants":
        return categoryTransactions;
      case "Transfers":
        return transfers;
      default:
        return allTransactions;
    }
  }, [
    selectedFilter,
    allTransactions,
    incomes,
    categoryTransactions,
    transfers,
  ]);

  // Determine loading state
  const loading = useMemo(() => {
    switch (selectedFilter) {
      case "All":
        return loadingAll;
      case "Incomes":
        return loadingIncomes;
      case "Savings":
      case "Needs":
      case "Wants":
        return loadingCategory;
      case "Transfers":
        return loadingTransfers;
      default:
        return loadingAll;
    }
  }, [
    selectedFilter,
    loadingAll,
    loadingIncomes,
    loadingCategory,
    loadingTransfers,
  ]);

  // Determine error state
  const hasError = useMemo(() => {
    switch (selectedFilter) {
      case "All":
        return errorAll;
      case "Incomes":
        return errorIncomes;
      case "Savings":
      case "Needs":
      case "Wants":
        return errorCategory;
      case "Transfers":
        return errorTransfers;
      default:
        return errorAll;
    }
  }, [selectedFilter, errorAll, errorIncomes, errorCategory, errorTransfers]);

  const onRefresh = useCallback(() => {
    switch (selectedFilter) {
      case "All":
        getAllTransactions({ force: true });
        break;
      case "Incomes":
        getIncomes({ force: true });
        break;
      case "Savings":
        getByCategory({
          id: "Savings",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Needs":
        getByCategory({
          id: "Needs",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Wants":
        getByCategory({
          id: "Wants",
          force: true,
          query: { start_day: startDayOfMonth, end_day: endDayOfMonth },
        });
        break;
      case "Transfers":
        getTransfers({ force: true });
        break;
    }
  }, [
    selectedFilter,
    getAllTransactions,
    getIncomes,
    getByCategory,
    getTransfers,
  ]);

  const handleFilterChange = useCallback((filter: TransactionFilterType) => {
    setSelectedFilter(filter);
  }, []);

  const getEmptyMessage = useCallback(() => {
    switch (selectedFilter) {
      case "All":
        return "No transactions";
      case "Incomes":
        return "No income transactions";
      case "Needs":
        return "No essential expenses (Needs)";
      case "Wants":
        return "No discretionary expenses (Wants)";
      case "Savings":
        return "No savings transactions";
      case "Transfers":
        return "No transfers";
      default:
        return "No transactions";
    }
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Transactions</ThemedText>

        <TransactionFilter
          selected={selectedFilter}
          onSelect={handleFilterChange}
        />

        {hasError ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Failed to load transactions
            </ThemedText>
            <ThemedText style={styles.retryText} onPress={onRefresh}>
              Tap to retry
            </ThemedText>
          </View>
        ) : (
          <TransactionsList
            transactions={filteredTransactions}
            accounts={accounts}
            loading={loading}
            onRefresh={onRefresh}
            emptyMessage={getEmptyMessage()}
          />
        )}
      </ThemedView>
      <FloatingButton onPress={() => router.navigate("../new-transaction")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  transactions: {
    flex: 1,
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  retryText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
