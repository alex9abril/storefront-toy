"use client";

import { Fragment } from "react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { useRouter } from "next/navigation";
import { UserInfo } from "./components/UserInfo";
import { UserAvatar } from "./components/UserAvatar";
import { type UserDetailsFragment } from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

type Props = {
	user: UserDetailsFragment;
};

export function UserMenu({ user }: Props) {
	const { signOut } = useSaleorAuthContext();
	const router = useRouter();

	const handleLogout = () => {
		try {
			signOut();
			// Redirigir al home después del logout
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	return (
		<Menu as="div" className="relative">
			<Menu.Button className="relative flex rounded-full bg-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800">
				<span className="sr-only">Open user menu</span>
				<UserAvatar user={user} />
			</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-neutral-200 bg-white py-1 text-start shadow ring-1 ring-neutral-200 ring-opacity-5 focus:outline-none">
					<UserInfo user={user} />
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/account"
									className={clsx(
										active && "bg-neutral-100",
										"block px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700",
									)}
								>
									Mi Cuenta
								</LinkWithChannel>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/orders"
									className={clsx(
										active && "bg-neutral-100",
										"block px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700",
									)}
								>
									Mis Pedidos
								</LinkWithChannel>
							)}
						</Menu.Item>
					</div>
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={handleLogout}
									className={clsx(
										active && "bg-neutral-100",
										"block w-full px-4 py-2 text-start text-sm font-medium text-neutral-500 hover:text-neutral-700",
									)}
								>
									Log Out
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
