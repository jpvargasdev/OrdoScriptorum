import "react-native-reanimated";

import {
	ThemeProvider,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
SplashScreen.preventAutoHideAsync();

import { useUserDefaultsStore } from "@/state/user";
import { SessionProvider } from "@/components/SessionProvider";

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
			<SessionProvider>
				<Slot />
			</SessionProvider>
		</ThemeProvider>
	);
}
