import { FlatList, StyleSheet } from "react-native";
import { TransactionCard } from "./TransactionCard";
import { ThemedText } from "../ThemedText";

export default function TransactionsList({
	transactions,
	accounts,
	loading,
	onDeleteTransaction,
	onRefresh,
	ListHeaderComponent, // <-- Nueva prop
}: {
	transactions: Transaction[] | null;
	accounts: Account[] | null;
	loading: boolean;
	onDeleteTransaction?: (transaction: Transaction) => void;
	onRefresh?: () => void;
	ListHeaderComponent?: React.ReactElement; // <-- Tipo para el header
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
			// Esto permite que el Header haga scroll con la lista
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={
				<ThemedText type="default">No transactions</ThemedText>
			}
			refreshing={loading}
			onRefresh={onRefresh}
			// Agregamos esto para que el scroll se sienta bien al final
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
