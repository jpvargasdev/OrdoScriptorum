// apiHooks.ts
import { request } from "../state";

/** ---------- CATEGORIES ---------- */
export const useGetCategories = request<Category[]>({
	method: "GET",
	url: "/categories",
});

export const useCreateCategory = request<Category>(
	{ method: "POST", url: "/categories" },
	{
		// On success, refresh the categories list automatically
		onSuccess: () => {
			useGetCategories.getState().execute({ force: true });
		},
	},
);

/** ---------- ACCOUNTS ---------- */
export const useGetAccounts = request<Account[]>({
	method: "GET",
	url: "/accounts",
});

export const useCreateAccount = request<Account>(
	{ method: "POST", url: "/accounts" },
	{
		onSuccess: () => {
			useGetAccounts.getState().execute({ force: true });
			useGetBudgetSummary.getState().execute({ force: true });
		},
	},
);

export const useDeleteAccount = request<null>(
	{ method: "DELETE", url: "/accounts" },
	{
		onSuccess: () => {
			useGetAccounts.getState().execute({ force: true });
			useGetBudgetSummary.getState().execute({ force: true });
		},
	},
);

/** ---------- TRANSACTIONS ---------- */
export const useGetTransactions = request<Transaction[]>({
	method: "GET",
	url: "/transactions",
});

export const useCreateTransaction = request<Transaction>(
	{ method: "POST", url: "/transactions" },
	{
		onSuccess: () => {
			useGetTransactions.getState().execute({ force: true });
			useGetBudgetSummary.getState().execute({ force: true });
		},
	},
);

export const useDeleteTransaction = request<null>(
	{ method: "DELETE", url: "/transactions" },
	{
		onSuccess: () => {
			useGetTransactions.getState().execute({ force: true });
			useGetBudgetSummary.getState().execute({ force: true });
		},
	},
);

// Example custom endpoints for "expenses", "incomes", "savings", etc.
export const useGetExpenses = request<Transaction[]>({
	method: "GET",
	url: "/transactions/expenses",
});

export const useGetIncomes = request<Transaction[]>({
	method: "GET",
	url: "/transactions/incomes",
});

export const useGetSavings = request<Transaction[]>({
	method: "GET",
	url: "/transactions/savings",
});

export const useGetTransactionsByPeriod = request<Transaction[]>({
	method: "GET",
	url: "/transactions/period",
});

export const useGetTransactionsMonthly = request<Transaction[]>({
	method: "GET",
	url: "/transactions/monthly",
});

export const useGetTransactionsByAccount = request<Transaction[]>({
	method: "GET",
	url: "/transactions/account",
});

/** ---------- BUDGET SUMMARY ---------- */
export const useGetBudgetSummary = request<BudgetSummary>({
	method: "GET",
	url: "/budget/summary",
});

/** ---------- TRANSFERS ---------- */
export const useGetTransfers = request<Transaction[]>({
	method: "GET",
	url: "/transfers",
});

export const useCreateTransfer = request<Transaction>(
	{ method: "POST", url: "/transfers" },
	{
		onSuccess: () => {
			useGetTransfers.getState().execute({ force: true });
			useGetBudgetSummary.getState().execute({ force: true });
		},
	},
);

/** ---------- RESET DATA ---------- */
export const useDeleteAllData = request<null>({
	method: "POST",
	url: "/reset",
});
