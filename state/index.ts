// requestFactory.ts
import { create } from "zustand";
import axios from "axios";
import { useUserDefaultsStore } from "./user";

const API_BASE_URL = process.env.API_BASE_URL
	? `${process.env.API_BASE_URL}/api/v1`
	: "http://localhost:8080/api/v1";

const session = useUserDefaultsStore.getState().session;

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + session,
	},
});

export const setHeaders = (headers: any) => {
	api.defaults.headers = {
		...api.defaults.headers,
		...headers,
	};
};

interface RequestState<T> {
	data: T | null;
	loading: boolean;
	error: boolean;
	errorData: any;
	success: boolean;
	lastParams: any; // <-- store the last params used for execute
}

const initialState: Omit<RequestState<any>, "lastParams"> = {
	data: null,
	loading: false,
	error: false,
	errorData: null,
	success: false,
};

export const request = <T>(
	config: { method: string; url: string },
	options?: {
		onSuccess?: (res: any) => void;
		onError?: (err: any) => void;
		onFinal?: () => void;
	},
) =>
	create<
		RequestState<T> & {
			execute: (params?: any) => Promise<void>;
			reload: (params?: any) => Promise<void>;
		}
	>((set, get) => ({
		...initialState,
		lastParams: null,

		execute: async (params = {}) => {
			const { id, data, query, force, headers } = params;
			const { method, url } = config;

			// If this is a GET request and we already have data in the store,
			// skip unless force === true
			if (!force && method === "GET" && get().data) {
				return;
			}

			set({
				...initialState,
				loading: true,
				lastParams: params,
			});

			try {
				const res = await api({
					method,
					url: id ? `${url}/${id}` : url,
					data,
					params: query,
					headers,
				});

				set({
					...initialState,
					data: res.data,
					success: true,
					lastParams: params,
				});
				options?.onSuccess?.(res);
				params?.onSuccess?.(res);
			} catch (err) {
				set({
					...initialState,
					error: true,
					errorData: err,
					lastParams: params,
				});

				console.error(err);

				options?.onError?.(err);
				params?.onError?.(err);
			} finally {
				options?.onFinal?.();
				params?.onFinal?.();
			}
		},

		// The reload method re-calls execute, always with force: true
		reload: async (overrideParams = {}) => {
			const { lastParams } = get();
			const mergedParams = {
				...lastParams,
				...overrideParams,
				force: true,
			};
			await get().execute(mergedParams);
		},
	}));
