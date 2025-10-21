import { UserIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export async function UserMenuContainer() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (user) {
		const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;

		return (
			<div className="flex items-center gap-2">
				<span className="hidden text-xs text-neutral-600 sm:block">Hola, {userName}</span>
				<UserMenu user={user} />
			</div>
		);
	} else {
		return (
			<LinkWithChannel href="/login" className="h-6 w-6 flex-shrink-0" aria-label="Iniciar sesión">
				<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Iniciar sesión</span>
			</LinkWithChannel>
		);
	}
}
