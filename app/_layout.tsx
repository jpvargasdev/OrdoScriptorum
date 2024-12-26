import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useUserDefaultsStore } from "@/state/user";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	// rehydrate user defaults
	useEffect(() => {
		const unsub = useUserDefaultsStore.persist.onFinishHydration(() => {
			console.log("User defaults rehydrated");
		});

		// Cleanup subscription on component unmount
		return () => {
			unsub();
		};
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{ headerShown: false, title: "Home" }}
				/>
				<Stack.Screen
					name="new-transaction"
					options={{
						presentation: "modal",
						headerShown: true,
						title: "New Transaction",
						headerBackButtonMenuEnabled: true,
					}}
				/>
				<Stack.Screen
					name="new-account"
					options={{
						presentation: "modal",
						headerShown: true,
						title: "New Account",
					}}
				/>
				<Stack.Screen
					name="transactions-by"
					options={{
						presentation: "modal",
						headerShown: true,
						title: "Transactions",
					}}
				/>
				<Stack.Screen name="account" />
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
