import { getDefaultStore, atom, createStore } from "jotai";

// Átomo para el usuario
export const userAtom = atom<string | null>(null); // Guarda el ID o nombre del usuario actual

// Átomo para transacciones
export const transactionsAtom = atom<Array<Transaction>>([]); // Lista de transacciones

export const accountsAtom = atom<Array<Account>>([]);

export const categoriesAtom = atom<Array<Category>>([]);

export const defaultStore = createStore();
