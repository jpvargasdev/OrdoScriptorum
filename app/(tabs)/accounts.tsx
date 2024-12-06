import { getAccounts } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { AccountCard } from "@/components/ui/AccountCard";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { useAxios } from "@/hooks/useAxios";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransaction() {
    const { data: accounts, reload, loaded } = useAxios<Account[]>(getAccounts);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedText type="title">Accounts</ThemedText>
            <FlatList
                keyExtractor={(item) => `${item.id}`}
                data={accounts}
                renderItem={({ item }) => <AccountCard account={item} />}
                ListEmptyComponent={() => (
                    <ThemedText type="default">No accounts</ThemedText>
                )}
                refreshing={!loaded}
                onRefresh={reload}
            />
            <FloatingButton onPress={() => router.navigate("../new-account")} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
