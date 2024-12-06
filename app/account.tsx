import { getAccounts, getTransactionsByAccount } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Transaction } from "@/components/ui/Transaction";
import { useAxios } from "@/hooks/useAxios";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

export default function Account() {
    const { id } = useLocalSearchParams();

    if (id === undefined) {
        return (
            <ThemedView>
                <ThemedText>Account not found</ThemedText>
            </ThemedView>
        );
    }

    const { data: accounts } = useAxios<Account[]>(getAccounts);
    // @ts-ignore
    const { data: transactions, loaded, reload } = useAxios<Transaction[], number>(getTransactionsByAccount, Number(id));

    const mAccount = accounts?.find((a) => a.id === Number(id)) as Account;

    if (!mAccount) {
        return (
            <ThemedView>
                <ThemedText>Account not found</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">{mAccount.name}</ThemedText>
                <View>
                    <ThemedText type="defaultSemiBold">Account Type: {mAccount.type}</ThemedText>
                    <ThemedText type="defaultSemiBold">Balance: {mAccount.balance} {mAccount.currency}</ThemedText>
                </View>
            </View>

            <View style={styles.innerContainer}>
                <ThemedText type="subtitle">Transactions</ThemedText>
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => <Transaction transaction={item} accounts={accounts} />}
                    ListEmptyComponent={() => (
                        <ThemedText type="default">No transactions</ThemedText>
                    )}
                    refreshing={!loaded}
                    onRefresh={reload}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    innerContainer: {
        marginTop: 24,
    },
    transactions: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});