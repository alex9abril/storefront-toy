import { redirect } from "next/navigation";
import { SearchIcon } from "lucide-react";

export const SearchBar = ({ channel }: { channel: string }) => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(search)}`);
		}
	}

	return (
		<form action={onSubmit} className="group relative flex w-full items-center text-sm">
			<label className="w-full">
				<span className="sr-only">Buscar productos</span>
				<div className="flex w-full rounded-lg border-2 border-white bg-white shadow-lg">
					{/* Dropdown de categorías - oculto en móviles */}
					<div className="relative hidden sm:block">
						<select className="h-12 cursor-pointer appearance-none rounded-l-lg border-0 bg-transparent px-4 pr-8 text-sm text-gray-700 focus:border-0 focus:outline-none focus:ring-0">
							<option>Todas las categorías</option>
							<option>Refacciones</option>
							<option>Accesorios</option>
							<option>Lubricantes</option>
							<option>Filtros</option>
							<option>Frenos</option>
							<option>Suspensión</option>
							<option>Motor</option>
						</select>
						{/* Ícono de dropdown */}
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
						{/* Separador vertical */}
						<div className="absolute bottom-2 right-0 top-2 w-px bg-gray-300"></div>
					</div>

					{/* Campo de búsqueda */}
					<input
						type="text"
						name="search"
						placeholder="Buscar productos..."
						autoComplete="on"
						required
						className="h-12 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0 sm:rounded-l-lg"
					/>

					{/* Botón de búsqueda */}
					<button
						type="submit"
						className="flex h-12 items-center justify-center rounded-r-lg bg-[#EB0A1E] px-4 text-white transition-colors duration-200 hover:bg-[#C8102E] focus:bg-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:ring-offset-2 sm:px-6"
					>
						<span className="sr-only">Buscar</span>
						<SearchIcon aria-hidden className="h-5 w-5" />
					</button>
				</div>
			</label>
		</form>
	);
};
