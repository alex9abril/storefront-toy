"use client";

import { useState, useCallback } from "react";

interface ToastState {
	id: string;
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
}

export const useToast = () => {
	const [toasts, setToasts] = useState<ToastState[]>([]);

	const showToast = useCallback(
		(message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: ToastState = { id, message, type, duration };

			setToasts((prev) => [...prev, newToast]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showSuccess = useCallback(
		(message: string) => {
			showToast(message, "success");
		},
		[showToast],
	);

	const showError = useCallback(
		(message: string) => {
			showToast(message, "error");
		},
		[showToast],
	);

	const showInfo = useCallback(
		(message: string) => {
			showToast(message, "info");
		},
		[showToast],
	);

	return {
		toasts,
		showToast,
		showSuccess,
		showError,
		showInfo,
		removeToast,
	};
};
