import { UserIcon } from "lucide-react";
import { Suspense } from "react";
import { UserMenu } from "./UserMenu";
import { UserMenuSkeleton } from "./UserMenuSkeleton";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { getServerAuthClient } from "@/app/config";

async function UserMenuContent() {
	try {
		const authClient = await getServerAuthClient();
		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

		if (!saleorApiUrl) {
			console.log("❌ NO HAY SESIÓN ACTIVA - Saleor API URL no configurada");
			return;
		}

		const response = await authClient.fetchWithAuth(saleorApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					query CurrentUser {
						me {
							id
							email
							firstName
							lastName
						}
					}
				`,
			}),
		});

		const result = (await response.json()) as {
			data?: {
				me?: {
					id: string;
					email: string;
					firstName: string;
					lastName: string;
				};
			};
		};

		if (result?.data?.me) {
			const user = result.data.me;
			const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;

			// Log de sesión activa
			console.log("🔐 SESIÓN ACTIVA DETECTADA:", {
				userId: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				userName: userName,
				timestamp: new Date().toISOString(),
				location: "Server-side",
			});

			return (
				<div className="flex items-center gap-2">
					<span className="hidden text-xs text-gray-600 sm:block">Hola, {userName}</span>
					<UserMenu user={user} />
				</div>
			);
		} else {
			console.log("❌ NO HAY SESIÓN ACTIVA - Usuario no encontrado");
		}
	} catch (error) {
		// Si hay error en la consulta, asumimos que no hay sesión activa
		console.log("❌ NO HAY SESIÓN ACTIVA - Error en consulta:", error);
	}

	// Si no hay usuario o hay error, mostrar icono de login
	console.log("🔓 MOSTRANDO ICONO DE LOGIN - Sin sesión activa");

	return (
		<LinkWithChannel
			href="/login"
			className="h-6 w-6 flex-shrink-0 transition-opacity hover:opacity-75"
			aria-label="Iniciar sesión"
		>
			<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
			<span className="sr-only">Iniciar sesión</span>
		</LinkWithChannel>
	);
}

export function UserMenuContainer() {
	return (
		<Suspense fallback={<UserMenuSkeleton />}>
			<UserMenuContent />
		</Suspense>
	);
}
