import React from "react";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { CommonColors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useUserDefaultsStore } from "@/state/user";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCreateUser } from "@/hooks/apiHooks";

GoogleSignin.configure();

const SignInScreen = () => {
  const { execute: executeCreateUser } = useCreateUser();

  const { setUser, setSession } = useUserDefaultsStore();
  const onSignin = React.useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUser(response.data.user);
        setSession(response.data.idToken);
        executeCreateUser({
          email: response.data.user.email,
          display_name: response.data.user.name,
          photo_url: response.data.user.photo,
          phone_number: 0,
        });
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
      <ThemedText
        type="title"
        lightColor="#fff"
        darkColor="#fff"
        style={styles.title}
      >
        Welcome to Expenses
      </ThemedText>
      <GoogleSigninButton
        onPress={onSignin}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CommonColors.Primary,
    justifyContent: "space-around",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
});

export default SignInScreen;
