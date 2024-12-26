import { StyleSheet, FlatList } from "react-native";

import { TransactionCard } from "@/components/ui/TransactionCard";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useGetAccounts, useGetTransactionsByMainCategory } from "@/hooks/apiHooks";
import { useEffect, useLayoutEffect } from "react";
import { useUserDefaultsStore } from "@/state/user";

export default function TransactionsByScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation()
  const { startDayOfMonth, endDayOfMonth } = useUserDefaultsStore();
  const {
    data: transactions,
    execute: getTransactions,
    reload,
    loading,
  } = useGetTransactionsByMainCategory();
  const { data: accounts } = useGetAccounts();

  useEffect(() => {
    getTransactions({ id: id, force: true, query: { start: startDayOfMonth, end: endDayOfMonth } });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id,
    });
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">{id} Transactions</ThemedText>
      <FlatList
        data={transactions?.reverse()}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TransactionCard transaction={item} accounts={accounts} />
        )}
        style={styles.transactions}
        ListEmptyComponent={
          <ThemedText type="default">No transactions</ThemedText>
        }
        refreshing={loading}
        onRefresh={reload}
      />
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
});
