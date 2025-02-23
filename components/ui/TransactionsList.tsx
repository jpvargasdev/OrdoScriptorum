import { FlatList, StyleSheet } from "react-native";
import { TransactionCard } from "./TransactionCard";
import { ThemedText } from "../ThemedText";

export default function TransactionsList({
	transactions,
	accounts,
	loading,
	onDeleteTransaction,
}: {
	transactions: Transaction[] | null;
	accounts: Account[] | null;
	loading: boolean;
	onDeleteTransaction?: (transaction: Transaction) => void;
}) {
	return (
		<FlatList
			data={transactions}
			keyExtractor={(item) => `${item.id}`}
			renderItem={({ item }) => (
				<TransactionCard
					transaction={item}
					accounts={accounts}
					onDeleteTransaction={onDeleteTransaction}
				/>
			)}
			style={styles.transactions}
			ListEmptyComponent={
				<ThemedText type="default">No transactions</ThemedText>
			}
			refreshing={loading}
		/>
	);
}

const styles = StyleSheet.create({
	transactions: {
		flex: 1,
	},
});
