import { redirect } from "next/navigation";
import { SearchIcon } from "lucide-react";

export const MobileSearchBar = ({ channel }: { channel: string }) => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(search)}`);
		}
	}

	return (
		<form action={onSubmit} className="w-full">
			<label className="w-full">
				<span className="sr-only">Buscar productos</span>
				<div className="relative flex w-full items-center rounded-lg border-2 border-gray-200 bg-white shadow-sm">
					{/* Campo de búsqueda */}
					<input
						type="text"
						name="search"
						placeholder="Buscar productos..."
						autoComplete="on"
						required
						className="h-12 w-full rounded-l-lg border-0 bg-transparent px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0"
					/>

					{/* Botón de búsqueda */}
					<button
						type="submit"
						className="flex h-12 items-center justify-center rounded-r-lg bg-[#EB0A1E] px-4 text-white transition-colors duration-200 hover:bg-[#C8102E] focus:bg-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:ring-offset-2"
					>
						<span className="sr-only">Buscar</span>
						<SearchIcon aria-hidden className="h-5 w-5" />
					</button>
				</div>
			</label>
		</form>
	);
};
