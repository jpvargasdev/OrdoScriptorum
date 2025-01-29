declare type MainCategory = "Needs" | "Wants" | "Savings";
declare type TransactionType = "Expense" | "Income" | "Savings" | "Transfer";

declare interface BudgetSummary {
	total_income: number;
	total_expenses: number;
	net_balance: number;
	needs_amount: number;
	wants_amount: number;
	savings_amount: number;
	needs_percentage: number;
	wants_percentage: number;
	savings_percentage: number;
	needs_budget: number;
	wants_budget: number;
	savings_budget: number;
	net_worth: number;
}

declare interface Category {
	id: number; // INTEGER PRIMARY KEY AUTOINCREMENT
	name: string; // TEXT UNIQUE NOT NULL - Name of the subcategory
	main_category: string; // TEXT NOT NULL - Main category (Needs, Wants, Savings, Transfer)
}

declare interface Transaction {
	id: number; // INTEGER PRIMARY KEY AUTOINCREMENT
	description: string; // TEXT NOT NULL
	amount: number; // REAL NOT NULL - Positive for income, negative for expenses
	currency: string; // TEXT NOT NULL
	amount_in_base_currency?: number; // REAL (nullable)
	exchange_rate?: number; // REAL (nullable)
	date: number; // INTEGER NOT NULL - Unix timestamp
	main_category: string; // TEXT NOT NULL - Needs, Wants, Savings
	subcategory: string; // TEXT NOT NULL - Name of the subcategory
	category_id?: number; // INTEGER (foreign key, nullable)
	account_id?: number; // INTEGER - Account from which the transaction is made
	related_account_id?: number; // INTEGER - Account to which the transaction is made (for transfers)
	transaction_type: string; // TEXT NOT NULL - 'Expense', 'Income', 'Savings', 'Transfer'
	fees?: number; // INTEGER DEFAULT 0 - Fees associated with the transaction
}

declare interface Account {
	id: number; // INTEGER PRIMARY KEY AUTOINCREMENT
	name: string; // TEXT UNIQUE NOT NULL - Name of the account
	type: string; // TEXT NOT NULL - Type of account (e.g., "Bank", "Credit Card", "Cash")
	currency: string; // TEXT NOT NULL - Currency of the account
	balance: number; // REAL DEFAULT 0 - Current balance of the account
}

declare interface User {
	id: string;
	name: string | null;
	email: string;
	photo: string | null;
	familyName: string | null;
	givenName: string | null;
};
