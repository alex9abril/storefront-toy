"use client";

import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Logo } from "../../Logo";
import { useMobileMenu } from "./useMobileMenu";
import { OpenButton } from "./OpenButton";
import { CloseButton } from "./CloseButton";

type Props = {
	children: ReactNode;
};

export const MobileMenu = ({ children }: Props) => {
	const { closeMenu, openMenu, isOpen } = useMobileMenu();

	return (
		<>
			<OpenButton onClick={openMenu} aria-controls="mobile-menu" />
			<Transition show={isOpen}>
				<Dialog onClose={closeMenu}>
					<Dialog.Panel className="fixed inset-0 z-20 flex h-dvh w-screen flex-col overflow-y-scroll">
						<Transition.Child
							className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between bg-white/95 px-3 backdrop-blur-md sm:h-16 sm:px-8"
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="bg-transparent"
							enterTo="bg-white/95"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="bg-white/95"
							leaveTo="bg-transparent"
						>
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="opacity-0 -translate-y-3 bg-transparent"
							enterTo="opacity-100 translate-y-0 bg-white"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="opacity-100 translate-y-0 bg-white"
							leaveTo="opacity-0 -translate-y-3 bg-transparent"
						>
							<div className="flex h-full flex-col bg-white p-3 sm:p-8" id="mobile-menu">
								{/* Barra de búsqueda en móvil */}
								<div className="mb-6 w-full">{children}</div>
							</div>
						</Transition.Child>
					</Dialog.Panel>
				</Dialog>
			</Transition>
		</>
	);
};
