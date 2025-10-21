"use client";

import { useState } from "react";
import { ToastContainer } from "./ToastContainer";
import { useToast } from "@/hooks/useToast";

export function PasswordResetForm() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { toasts, showSuccess, showError, removeToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Aquí implementaríamos la lógica de reset de contraseña
			// Por ahora simulamos el envío
			await new Promise((resolve) => setTimeout(resolve, 1000));

			showSuccess("Se ha enviado un enlace de recuperación a tu email");
			setIsSubmitted(true);
		} catch (error) {
			showError("Error al enviar el enlace de recuperación");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="mx-auto mt-16 w-full max-w-lg">
				<div className="rounded border p-8 text-center shadow-md">
					<div className="mb-4">
						<svg
							className="mx-auto h-16 w-16 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2 className="mb-4 text-2xl font-bold text-neutral-900">¡Enlace enviado!</h2>
					<p className="mb-6 text-neutral-600">
						Hemos enviado un enlace de recuperación a <strong>{email}</strong>
					</p>
					<p className="text-sm text-neutral-500">
						Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
					</p>
					<button
						onClick={() => {
							setIsSubmitted(false);
							setEmail("");
						}}
						className="mt-6 text-[#EB0A1E] transition-colors hover:text-[#C4081A]"
					>
						← Volver al inicio de sesión
					</button>
				</div>
				<ToastContainer toasts={toasts} onRemove={removeToast} />
			</div>
		);
	}

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<div className="rounded border p-8 shadow-md">
				<div className="mb-6 text-center">
					<h2 className="mb-2 text-2xl font-bold text-neutral-900">¿Olvidaste tu contraseña?</h2>
					<p className="text-neutral-600">
						Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="tu@email.com"
							required
							disabled={isLoading}
							className="w-full rounded border bg-neutral-50 px-4 py-2 disabled:opacity-50"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading || !email}
						className="flex w-full items-center justify-center gap-2 rounded bg-[#EB0A1E] px-4 py-2 text-white hover:bg-[#C4081A] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? (
							<>
								<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Enviando...
							</>
						) : (
							"Enviar enlace de recuperación"
						)}
					</button>
				</form>

				<div className="mt-6 text-center">
					<button
						onClick={() => window.history.back()}
						className="text-[#EB0A1E] transition-colors hover:text-[#C4081A]"
					>
						← Volver al inicio de sesión
					</button>
				</div>
			</div>
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
