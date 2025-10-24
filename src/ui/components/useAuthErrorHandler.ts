"use client";

import { useEffect, useRef } from "react";

/**
 * Hook para manejar errores de autenticación y evitar ciclos infinitos
 */
export const useAuthErrorHandler = () => {
	const errorCountRef = useRef(0);
	const lastErrorTimeRef = useRef(0);
	const maxErrors = 5;
	const errorWindow = 30000; // 30 segundos

	useEffect(() => {
		const handleAuthError = (event: CustomEvent) => {
			const now = Date.now();
			const timeSinceLastError = now - lastErrorTimeRef.current;

			// Resetear contador si han pasado más de 30 segundos
			if (timeSinceLastError > errorWindow) {
				errorCountRef.current = 0;
			}

			errorCountRef.current++;
			lastErrorTimeRef.current = now;

			// Si hay demasiados errores en poco tiempo, evitar más reintentos
			if (errorCountRef.current > maxErrors) {
				console.warn("Demasiados errores de autenticación, evitando reintentos");
				event.preventDefault();
				return false;
			}

			return true;
		};

		// Escuchar eventos de error de autenticación
		window.addEventListener("auth-error", handleAuthError as EventListener);

		return () => {
			window.removeEventListener("auth-error", handleAuthError as EventListener);
		};
	}, []);

	return {
		shouldRetry: () => {
			const now = Date.now();
			const timeSinceLastError = now - lastErrorTimeRef.current;

			// Resetear contador si han pasado más de 30 segundos
			if (timeSinceLastError > errorWindow) {
				errorCountRef.current = 0;
			}

			return errorCountRef.current <= maxErrors;
		},
		resetErrorCount: () => {
			errorCountRef.current = 0;
			lastErrorTimeRef.current = 0;
		},
	};
};
