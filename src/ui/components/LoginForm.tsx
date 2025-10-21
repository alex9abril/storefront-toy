"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { ToastContainer } from "./ToastContainer";
import { useToast } from "@/hooks/useToast";

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const { toasts, showSuccess, showError, removeToast } = useToast();
	const { signIn } = useSaleorAuthContext();

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		setError(null);

		try {
			const email = formData.get("email")?.toString();
			const password = formData.get("password")?.toString();

			if (!email || !password) {
				setError("Email y contraseña son requeridos");
				showError("Email y contraseña son requeridos");
				return;
			}

			// Usar el contexto de autenticación del cliente, igual que el checkout
			const result = await signIn({ email, password });

			if (result.data?.tokenCreate?.errors?.length > 0) {
				const errorMessage = result.data.tokenCreate.errors.map((error) => error.message).join(", ");
				setError(errorMessage);
				showError(errorMessage);
				return;
			}

			// Login exitoso - mostrar mensaje de éxito y redirigir
			showSuccess("¡Sesión iniciada correctamente!");
			setTimeout(() => {
				router.push("/");
				router.refresh(); // Refrescar para actualizar el estado de sesión
			}, 1000);
		} catch (err) {
			const errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
			setError(errorMessage);
			showError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="rounded border p-8 shadow-md" action={handleSubmit}>
				{error && (
					<div className="mb-4 rounded border border-red-200 bg-red-50 p-3">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						disabled={isLoading}
						className="w-full rounded border bg-neutral-50 px-4 py-2 disabled:opacity-50"
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							required
							disabled={isLoading}
							autoCapitalize="off"
							autoComplete="off"
							className="w-full rounded border bg-neutral-50 px-4 py-2 pr-10 disabled:opacity-50"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							disabled={isLoading}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
							aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
						>
							{showPassword ? (
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							) : (
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				<button
					className="flex w-full items-center justify-center gap-2 rounded bg-[#EB0A1E] px-4 py-2 text-white hover:bg-[#C4081A] disabled:cursor-not-allowed disabled:opacity-50"
					type="submit"
					disabled={isLoading}
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
							Iniciando sesión...
						</>
					) : (
						"Iniciar Sesión"
					)}
				</button>
			</form>

			<div className="mt-6 text-center">
				<button
					onClick={() => (window.location.href = "/forgot-password")}
					className="text-sm text-[#EB0A1E] transition-colors hover:text-[#C4081A]"
				>
					¿Olvidaste tu contraseña?
				</button>
			</div>

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
