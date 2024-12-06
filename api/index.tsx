import axios from "axios";

const API_BASE_URL =
	"http://localhost:8080/api/v1"; // Replace with your API's base URL

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getCategories = async (): Promise<Category[]> => {
	try {
		const response = await api.get("/categories");
		return response.data;
	} catch (error) {
		console.error("Error fetching categories", error);
		throw error;
	}
};

export const setNewCategory = async (name: string): Promise<Category> => {
	try {
		const response = await api.post("/categories", { name });
		return response.data;
	} catch (error) {
		console.error("Error creating new category", error);
		throw error;
	}
};

export const getAccounts = async (): Promise<Account[]> => {
	try {
		const response = await api.get("/accounts");
		return response.data;
	} catch (error) {
		console.error("Error adding account", error);
		throw error;
	}
};

export const addAccount = async (
	account: Omit<Account, "id" | "balance">,
): Promise<Account> => {
	try {
		const response = await api.post("/accounts", account);
		return response.data;
	} catch (error) {
		console.error("Error adding account", error);
		throw error;
	}
};

export const deleteAccount = async (id: number): Promise<void> => {
	try {
		await api.delete(`/accounts/${id}`);
	} catch (error) {
		console.error("Error deleting account", error);
		throw error;
	}
};

export const getTransactions = async (params?: {
	type?: string;
	account?: number;
}): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions", { params });
		return response.data;
	} catch (error) {
		console.error("Error fetching transactions", error);
		throw error;
	}
};

export const addTransaction = async (
	transaction: Omit<
		Transaction,
		| "id"
		| "amount_in_base_currency"
		| "exchange_rate"
		| "main_category"
		| "subcategory"
	>,
): Promise<Transaction> => {
	try {
		const response = await api.post("/transactions", transaction);
		return response.data;
	} catch (error) {
		console.error("Error adding transaction", error);
		throw error;
	}
};

export const deleteTransaction = async (id: number): Promise<void> => {
	try {
		await api.delete(`/transactions/${id}`);
	} catch (error) {
		console.error("Error deleting transaction", error);
		throw error;
	}
};

export const getExpenses = async (): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions/expenses");
		return response.data;
	} catch (error) {
		console.error("Error fetching expenses", error);
		throw error;
	}
};

export const getIncomes = async (): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions/incomes");
		return response.data;
	} catch (error) {
		console.error("Error fetching incomes", error);
		throw error;
	}
};

export const getSavings = async (): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions/savings");
		return response.data;
	} catch (error) {
		console.error("Error fetching savings", error);
		throw error;
	}
};

export const getTransactionsByPeriod = async (
	startDate: number,
	endDate: number,
): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions/period", {
			params: { start_date: startDate, end_date: endDate },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching transactions by period", error);
		throw error;
	}
};

export const getTransactionsMonthly = async (): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transactions/monthly");
		return response.data;
	} catch (error) {
		console.error("Error fetching monthly transactions", error);
		throw error;
	}
};

export const getTransactionsByAccount = async (
	id: number,
): Promise<Transaction[]> => {
	try {
		const response = await api.get(`/transactions/account/${id}`)
		return response.data
	} catch (error) {
		console.error("Error fetching transactions by account", error);
		throw error;
	}
}

export const getBudgetSummary = async (): Promise<BudgetSummary> => {
	try {
		const response = await api.get("/budget/summary");
		return response.data;
	} catch (error) {
		console.error("Error fetching budget summary", error);
		throw error;
	}
};

export const getTransfers = async (): Promise<Transaction[]> => {
	try {
		const response = await api.get("/transfers");
		return response.data;
	} catch (error) {
		console.error("Error fetching transfers", error);
		throw error;
	}
};

export const createTransfer = async (
	transfer: Omit<
		Transaction,
		"id" | "amount_in_base_currency" | "exchange_rate"
	>,
): Promise<Transaction> => {
	try {
		const response = await api.post("/transfers", transfer);
		return response.data;
	} catch (error) {
		console.error("Error creating transfer", error);
		throw error;
	}
};

export const deleteAllData = async (): Promise<void> => {
	try {
		await api.post("/reset");
	} catch (error) {
		console.error("Error deleting all data", error);
		throw error;
	}
};
