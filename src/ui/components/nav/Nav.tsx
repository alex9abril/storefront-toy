import { Suspense } from "react";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { SearchBar } from "./components/SearchBar";

export const Nav = ({ channel }: { channel: string }) => {
	return (
		<nav className="flex w-full items-center justify-center gap-4 lg:gap-6" aria-label="Main navigation">
			{/* Barra de búsqueda central */}
			<div className="max-w-2xl flex-1">
				<SearchBar channel={channel} />
			</div>

			{/* Iconos de la derecha */}
			<div className="flex items-center gap-4">
				{/* Icono de comparar */}
				<button
					className="text-[#EB0A1E] transition-colors hover:text-[#C8102E]"
					aria-label="Comparar productos"
				>
					<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</button>

				{/* Icono de favoritos */}
				<button className="text-[#EB0A1E] transition-colors hover:text-[#C8102E]" aria-label="Favoritos">
					<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</button>

				{/* Carrito */}
				<Suspense fallback={<div className="w-6" />}>
					<CartNavItem channel={channel} />
				</Suspense>

				{/* Menú de usuario */}
				<Suspense fallback={<div className="w-8" />}>
					<UserMenuContainer />
				</Suspense>
			</div>

			{/* Menú móvil */}
			<Suspense>
				<MobileMenu>
					<SearchBar channel={channel} />
					<NavLinks channel={channel} />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
