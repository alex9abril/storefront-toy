"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
	onClose?: () => void;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onClose?.(), 300); // Esperar a que termine la animación
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!isVisible) return null;

	const getToastStyles = () => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200 text-green-800";
			case "error":
				return "bg-red-50 border-red-200 text-red-800";
			case "info":
				return "bg-blue-50 border-blue-200 text-blue-800";
			default:
				return "bg-gray-50 border-gray-200 text-gray-800";
		}
	};

	const getIcon = () => {
		switch (type) {
			case "success":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case "error":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case "info":
				return (
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
				);
		}
	};

	const toastContent = (
		<div className="animate-in slide-in-from-right-full fixed right-4 top-4 z-50 duration-300">
			<div className={`flex items-center gap-3 rounded-lg border p-4 shadow-lg ${getToastStyles()}`}>
				{getIcon()}
				<span className="text-sm font-medium">{message}</span>
				<button
					onClick={() => {
						setIsVisible(false);
						setTimeout(() => onClose?.(), 300);
					}}
					className="ml-2 text-current opacity-70 hover:opacity-100"
				>
					<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	);

	// Renderizar en portal para evitar problemas de z-index
	if (typeof window !== "undefined") {
		return createPortal(toastContent, document.body);
	}

	return null;
};
