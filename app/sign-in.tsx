import React from "react";
import {
	GoogleSignin,
	isSuccessResponse,
	isErrorWithCode,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";

import auth from "@react-native-firebase/auth";

import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCreateUser } from "@/hooks/apiHooks";
import { useSession } from "@/components/SessionProvider";
import { setHeaders } from "@/state";
import { router } from "expo-router";

GoogleSignin.configure();

const SignInScreen = () => {
	const { execute: executeCreateUser } = useCreateUser();
	const { signIn } = useSession();

	const onSignin = React.useCallback(async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const response = await GoogleSignin.signIn();
			if (isSuccessResponse(response)) {
				const googleCredential = auth.GoogleAuthProvider.credential(
					response.data.idToken,
				);
				const result = await auth().signInWithCredential(googleCredential);

				const token = await result.user.getIdToken();

				const user = {
					id: result.user.uid,
					email: result.user.email || "",
					display_name: result.user.displayName || "",
					photo_url: result.user.photoURL || "",
					phone_number: result.user.phoneNumber || "",
				};

				const headers = {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				};

				setHeaders(headers);

				await executeCreateUser({
					data: user,
				});

				signIn(user, user.id);
				router.replace("/");
			} else {
				// sign in was cancelled by user
			}
		} catch (error) {
			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.IN_PROGRESS:
						// operation (eg. sign in) already in progress
						console.log("Error sign in already in progress");
						break;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						console.log("Error play services not available");
						// Android only, play services not available or outdated
						break;
					default:
						// some other error happened
						console.log(error);
				}
			} else {
				// an error that's not related to google sign in occurred
				console.error(error);
			}
		}
	}, []);

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title" style={styles.title}>
				Welcome to Expenses
			</ThemedText>
			<GoogleSigninButton
				onPress={onSignin}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
	},
	title: {
		textAlign: "center",
	},
});

export default SignInScreen;
