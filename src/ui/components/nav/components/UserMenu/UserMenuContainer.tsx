"use client";

import { UserIcon } from "lucide-react";
import { Suspense } from "react";
import { useQuery } from "urql";
import { UserMenu } from "./UserMenu";
import { UserMenuSkeleton } from "./UserMenuSkeleton";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

function UserMenuContent() {
	const [{ data, fetching, error }] = useQuery({
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
		requestPolicy: "cache-first",
	});

	if (fetching) {
		return <UserMenuSkeleton />;
	}

	if (error) {
		console.log("❌ NO HAY SESIÓN ACTIVA - Error en consulta:", error);
	}

	if (data?.me) {
		const user = data.me ;
		const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;

		// Log de sesión activa
		console.log("🔐 SESIÓN ACTIVA DETECTADA:", {
			userId: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			userName: userName,
			timestamp: new Date().toISOString(),
			location: "Client-side",
		});

		return (
			<div className="flex items-center gap-2">
				<span className="hidden text-xs text-gray-600 sm:block">Hola, {userName}</span>
				<UserMenu user={user} />
			</div>
		);
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
