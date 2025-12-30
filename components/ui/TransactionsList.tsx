import { FlatList, StyleSheet } from "react-native";
import { TransactionCard } from "./TransactionCard";
import { ThemedText } from "../ThemedText";

export default function TransactionsList({
	transactions,
	accounts,
	loading,
	onRefresh,
	ListHeaderComponent,
}: {
	transactions: Transaction[] | null;
	accounts: Account[] | null;
	loading: boolean;
	onRefresh?: () => void;
	ListHeaderComponent?: React.ReactElement;
}) {
	return (
		<FlatList
			data={transactions}
			keyExtractor={(item) => `${item.id}`}
			renderItem={({ item }) => (
				<TransactionCard transaction={item} accounts={accounts} />
			)}
			style={styles.transactions}
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={
				<ThemedText type="default">No transactions</ThemedText>
			}
			refreshing={loading}
			onRefresh={onRefresh}
			contentContainerStyle={styles.contentContainer}
		/>
	);
}

const styles = StyleSheet.create({
	transactions: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 20,
	},
});
