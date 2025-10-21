import Link from "next/link";
import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";
import { CategoriesDropdown } from "./nav/components/CategoriesDropdown";

export function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-20">
			{/* Fila Superior - Información de contacto */}
			<div className="bg-gray-50 text-gray-700">
				<div className="mx-auto max-w-7xl px-3 sm:px-8">
					<div className="flex h-10 items-center justify-between text-xs">
						{/* Izquierda - Información de contacto */}
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1">
								<svg className="h-3 w-3 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
										clipRule="evenodd"
									/>
								</svg>
								<span>Horarios: Lun - Vie 8am - 6pm</span>
							</div>
							<div className="flex items-center gap-1">
								<svg className="h-3 w-3 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<span>Chat en vivo</span>
							</div>
							<div className="flex items-center gap-1">
								<svg className="h-3 w-3 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<span>Soporte telefónico</span>
							</div>
						</div>

						{/* Derecha - Envío e idioma */}
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1">
								<svg className="h-3 w-3 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
									<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
								</svg>
								<span>Envío rápido y gratuito</span>
							</div>
							<div className="flex items-center gap-1">
								<span>🇲🇽</span>
								<span>ES</span>
							</div>
							<div className="flex items-center gap-1">
								<span>MXN</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Fila Media - Logo y búsqueda */}
			<div className="bg-gray-100 text-gray-800">
				<div className="mx-auto max-w-7xl px-3 sm:px-8">
					<div className="flex h-16 items-center justify-between gap-4 md:gap-8">
						<Logo />
						<Nav channel={channel} />
					</div>
				</div>
			</div>

			{/* Fila Inferior - Navegación */}
			<div className="border-b border-gray-200 bg-white">
				<div className="mx-auto max-w-7xl px-3 sm:px-8">
					<div className="flex h-12 items-center justify-between">
						{/* Izquierda - Menú categorías */}
						<div className="flex items-center gap-2">
							<CategoriesDropdown />
						</div>

						{/* Centro - Enlaces de navegación */}
						<div className="hidden items-center gap-6 md:flex">
							<Link
								href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}`}
								className="text-sm font-medium text-[#EB0A1E] hover:text-[#C8102E]"
							>
								Inicio
							</Link>
							<Link
								href={`/${
									process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"
								}/categories/refacciones-toyota`}
								className="text-sm font-medium text-gray-700 hover:text-[#EB0A1E]"
							>
								Productos
							</Link>
							<Link
								href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}/blog`}
								className="text-sm font-medium text-gray-700 hover:text-[#EB0A1E]"
							>
								Blog
							</Link>
							<Link
								href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}/contact`}
								className="text-sm font-medium text-gray-700 hover:text-[#EB0A1E]"
							>
								Contacto
							</Link>
						</div>

						{/* Derecha - Mi cuenta (oculto temporalmente) */}
						{/* <div className="flex items-center">
							<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#EB0A1E] border border-[#EB0A1E] rounded hover:bg-[#EB0A1E] hover:text-white transition-colors">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
								</svg>
								Mi cuenta
							</button>
						</div> */}
					</div>
				</div>
			</div>
		</header>
	);
}
