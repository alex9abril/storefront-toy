"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { invariant } from "ts-invariant";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { useState, type ReactNode } from "react";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
	useClient,
	errorExchange,
} from "urql";
import { useAuthErrorHandler } from "./useAuthErrorHandler";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl,
});

const makeUrqlClient = () => {
	return createClient({
		url: saleorApiUrl,
		suspense: true,
		requestPolicy: "cache-first",
		fetch: (input, init) => {
			// Manejar errores de autenticación para evitar ciclos infinitos
			return saleorAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init).catch((error) => {
				// Si hay un error de autenticación, no reintentar automáticamente
				if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
					console.warn("Authentication error, not retrying:", error.message);
					throw error;
				}
				throw error;
			});
		},
		exchanges: [
			dedupExchange,
			cacheExchange,
			errorExchange({
				onError: (error) => {
					// Evitar logs excesivos de errores de autenticación
					if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
						console.warn("GraphQL authentication error:", error.message);
					} else {
						console.error("GraphQL error:", error);
					}
				},
			}),
			fetchExchange,
		],
	});
};

export function AuthProvider({ children }: { children: ReactNode }) {
	invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());
	const [isRecreating, setIsRecreating] = useState(false);
	const { shouldRetry, resetErrorCount } = useAuthErrorHandler();

	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => {
			if (!isRecreating && shouldRetry()) {
				setIsRecreating(true);
				setUrqlClient(makeUrqlClient());
				setTimeout(() => setIsRecreating(false), 1000);
			}
		},
		onSignedIn: () => {
			if (!isRecreating && shouldRetry()) {
				setIsRecreating(true);
				setUrqlClient(makeUrqlClient());
				setTimeout(() => setIsRecreating(false), 1000);
				resetErrorCount(); // Resetear contador en login exitoso
			}
		},
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</SaleorAuthProvider>
	);
}

// Hook para acceder al cliente de urql desde el checkout
export const useUrqlClient = () => {
	return useClient();
};
