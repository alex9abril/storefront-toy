"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function ProductsFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState<string>(searchParams.get("q") || "");

	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	function apply() {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		if (query) params.set("q", query);
		else params.delete("q");
		router.push(`?${params.toString()}`);
	}

	return (
		<aside className="sticky top-20 h-fit w-full max-w-xs space-y-6 rounded-lg border border-neutral-200 bg-white p-4">
			<div>
				<label className="text-sm font-medium text-neutral-700">Buscar</label>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && apply()}
					placeholder="Buscar productos..."
					className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-toyota-red"
				/>
			</div>

			<div className="space-y-3">
				<p className="text-sm font-medium text-neutral-700">Explorar por categoría</p>
				<ul className="space-y-1 text-sm text-neutral-700">
					<li>
						<a className="link-primary" href="?q=refacciones">
							Refacciones
						</a>
					</li>
					<li>
						<a className="link-primary" href="?q=accesorios">
							Accesorios
						</a>
					</li>
					<li>
						<a className="link-primary" href="?q=seguridad">
							Seguridad
						</a>
					</li>
					<li>
						<a className="link-primary" href="?q=interior">
							Interior
						</a>
					</li>
				</ul>
			</div>

			<button onClick={apply} className="btn-primary w-full">
				Aplicar filtros
			</button>
		</aside>
	);
}
