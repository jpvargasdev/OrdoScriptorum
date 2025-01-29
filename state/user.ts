import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserDefaultsState {
	startDayOfMonth: number;
	endDayOfMonth: number;
	user?: User;
	session: string | null;
	setUser: (user: User) => void;
	setSession: (session: string | null) => void;
	setStartDay: (day: number) => void;
	setEndDay: (day: number) => void;
	resetDefaults: () => void;
}

export const useUserDefaultsStore = create(
	persist<UserDefaultsState>(
		(set) => ({
			startDayOfMonth: 25, // Default start day
			endDayOfMonth: 24, // Default end day
			session: null,

			// Update the start day
			setStartDay: (day: number) => set({ startDayOfMonth: day }),

			// Update the end day
			setEndDay: (day: number) => set({ endDayOfMonth: day }),

			// Update the user
			setUser: (user: User) => set({ user }),
			setSession: (session: string | null) => set({ session }),

			// Reset to default values
			resetDefaults: () => set({ startDayOfMonth: 25, endDayOfMonth: 24 }),
		}),
		{
			name: "user-defaults-storage", // Unique storage key
			storage: createJSONStorage(() => AsyncStorage), // Use local storage
		},
	),
);
