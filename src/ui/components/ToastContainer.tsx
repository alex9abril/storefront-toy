"use client";

import { Toast } from "./Toast";

interface ToastContainerProps {
	toasts: Array<{
		id: string;
		message: string;
		type: "success" | "error" | "info";
		duration?: number;
	}>;
	onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
	return (
		<>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					onClose={() => onRemove(toast.id)}
				/>
			))}
		</>
	);
};
