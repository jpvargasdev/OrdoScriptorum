import "react-native-reanimated";

import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
SplashScreen.preventAutoHideAsync();

import { useUserDefaultsStore } from "@/state/user";

export default function AppLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	useEffect(() => {
		const unsub = useUserDefaultsStore.persist.onFinishHydration(() => {
			console.log("User defaults rehydrated");
		});

		// Cleanup subscription on component unmount
		return () => {
			unsub();
		};
	}, []);

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Slot />
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
