"use client";

import { useState, useEffect } from "react";

interface ConnectionStatusProps {
	show?: boolean;
}

export const ConnectionStatus = ({ show = false }: ConnectionStatusProps) => {
	const [status, setStatus] = useState<"connected" | "disconnected" | "error">("connected");
	const [errorCount, setErrorCount] = useState(0);

	useEffect(() => {
		if (!show) return;

		const handleOnline = () => setStatus("connected");
		const handleOffline = () => setStatus("disconnected");
		const handleError = () => {
			setStatus("error");
			setErrorCount((prev) => prev + 1);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		window.addEventListener("auth-error", handleError);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("auth-error", handleError);
		};
	}, [show]);

	if (!show) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<div
				className={`rounded-lg px-3 py-2 text-sm font-medium ${
					status === "connected"
						? "bg-green-100 text-green-800"
						: status === "disconnected"
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
				}`}
			>
				{status === "connected" && "🟢 Conectado"}
				{status === "disconnected" && "🟡 Sin conexión"}
				{status === "error" && `🔴 Error (${errorCount})`}
			</div>
		</div>
	);
};
