import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAxios = <U, P = []>(
	delegate: (params?: P) => Promise<U>,
	params?: P,
) => {
	const [data, setData] = useState<U>();
	const [error, setError] = useState("");
	const [loaded, setLoaded] = useState(false);
	const controllerRef = useRef(new AbortController());
	const [reloadFlag, setReloadFlag] = useState(0); // State to trigger reloads

	const cancel = () => {
		controllerRef.current.abort();
	};

	const reload = useCallback(() => {
		setReloadFlag((prev) => prev + 1); // Increment the reload flag to trigger useEffect
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const response = await delegate(params);

				setData(response);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setError(error.response?.data?.message || error.message);
				} else {
					setError((error as Error).message);
				}
			} finally {
				setLoaded(true);
			}
		})();

		return () => cancel();
	}, [delegate, params, reloadFlag]);

	return { cancel, data, error, loaded, reload };
};
