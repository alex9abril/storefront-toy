"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "./ToastContainer";
import { PasswordStrength } from "./PasswordStrength";
import { useToast } from "@/hooks/useToast";

interface ResetPasswordFormProps {
	token?: string;
}

export function ResetPasswordForm({ token: _token }: ResetPasswordFormProps) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toasts, showSuccess, showError, removeToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			showError("Las contraseñas no coinciden");
			return;
		}

		if (password.length < 8) {
			showError("La contraseña debe tener al menos 8 caracteres");
			return;
		}

		setIsLoading(true);

		try {
			// Aquí implementaríamos la lógica de reset de contraseña
			// Por ahora simulamos el proceso
			await new Promise((resolve) => setTimeout(resolve, 1000));

			showSuccess("¡Contraseña restablecida correctamente!");
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error) {
			showError("Error al restablecer la contraseña");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<div className="rounded border p-8 shadow-md">
				<div className="mb-6 text-center">
					<h2 className="mb-2 text-2xl font-bold text-neutral-900">Restablecer contraseña</h2>
					<p className="text-neutral-600">Ingresa tu nueva contraseña</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-700">
							Nueva contraseña
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Mínimo 8 caracteres"
								required
								disabled={isLoading}
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
						<PasswordStrength password={password} />
					</div>

					<div className="mb-6">
						<label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-neutral-700">
							Confirmar contraseña
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Repite tu nueva contraseña"
								required
								disabled={isLoading}
								className="w-full rounded border bg-neutral-50 px-4 py-2 pr-10 disabled:opacity-50"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								disabled={isLoading}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
								aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
							>
								{showConfirmPassword ? (
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
						type="submit"
						disabled={isLoading || !password || !confirmPassword}
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
								Restableciendo...
							</>
						) : (
							"Restablecer contraseña"
						)}
					</button>
				</form>

				<div className="mt-6 text-center">
					<button
						onClick={() => router.push("/login")}
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
