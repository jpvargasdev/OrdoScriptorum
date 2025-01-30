import { useUserDefaultsStore } from "@/state/user";
import {
	useContext,
	createContext,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import auth from "@react-native-firebase/auth";
import { setHeaders } from "@/state";

const AuthContext = createContext<{
	signIn: (user: User, session: string) => void;
	signOut: () => void;
	session?: string | null;
	isLoading?: boolean;
}>({
	signIn: () => null,
	signOut: () => null,
	session: null,
	isLoading: true,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useSession must be wrapped in a <SessionProvider />");
		}
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [isLoading, setIsLoading] = useState(true);
	const { setUser, resetDefaults, session, setSession } =
		useUserDefaultsStore();

	useEffect(() => {
		const createNewSessionToken = async () => {
			const token = await auth().currentUser?.getIdToken();
			setHeaders({
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			});
			setIsLoading(false);
		};
		// get new auth token
		if (session) {
			createNewSessionToken();
		} else {
			setIsLoading(false);
		}
	}, [session]);

	return (
		<AuthContext.Provider
			value={{
				signIn: (user: User, session: string) => {
					setUser(user);
					setSession(session);
				},
				signOut: () => {
					resetDefaults();
				},
				session,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
