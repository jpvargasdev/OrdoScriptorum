import { Redirect, Stack } from "expo-router";
import { useSession } from "@/components/SessionProvider";
import { ThemedText } from "@/components/ThemedText";

export default function AppLayout() {
	const { session, isLoading } = useSession();

	if (isLoading) {
		return <ThemedText>Loading...</ThemedText>;
	}

	// Only require authentication within the (app) group's layout as users
	// need to be able to access the (auth) group and sign in again.
	if (!session) {
		// On web, static rendering will stop here as the user is not authenticated
		// in the headless Node process that the pages are rendered in.
		return <Redirect href="/sign-in" />;
	}

	// This layout can be deferred because it's not the root layout.
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="new-account" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
      <Stack.Screen name="new-transaction" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="transactions-by" options={{ headerShown: false }} />
		</Stack>
	);
}
