"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { executeGraphQL } from "@/lib/graphql";
import {
	GetFilterableAttributesDocument,
	AttributeChoicesDocument,
	CategoryHierarchyDocument,
} from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export function ProductsFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState<string>(searchParams.get("q") || "");
	const [attributes, setAttributes] = useState<{ id: string; name: string; slug: string }[]>([]);
	const [choicesBySlug, setChoicesBySlug] = useState<
		Record<string, { id: string; name: string; slug: string }[]>
	>({});
	const [selectedBySlug, setSelectedBySlug] = useState<Record<string, string>>({});
	const [labelsBySlug, setLabelsBySlug] = useState<Record<string, string>>({});
	const [inputNameByAttr, setInputNameByAttr] = useState<Record<string, string>>({});
	const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState(false);
	const [categories, setCategories] = useState<
		{
			id: string;
			name: string;
			slug: string;
			level: number;
			parent?: { id: string; name: string; slug: string } | null;
		}[]
	>([]);
	const [showAllCats, setShowAllCats] = useState(false);

	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	useEffect(() => {
		void (async () => {
			try {
				// Restore persisted state from localStorage (if any)
				let savedSelectedObj: Record<string, string> = {};
				let savedInputsObj: Record<string, string> = {};
				let savedConfirmedBool = false;
				try {
					const savedSelected = localStorage.getItem("vehicle.selectedBySlug");
					const savedInputs = localStorage.getItem("vehicle.inputNameByAttr");
					const savedConfirmed = localStorage.getItem("vehicle.confirmed");
					if (savedSelected) savedSelectedObj = JSON.parse(savedSelected) as Record<string, string>;
					if (savedInputs) savedInputsObj = JSON.parse(savedInputs) as Record<string, string>;
					if (savedConfirmed) savedConfirmedBool = JSON.parse(savedConfirmed) as boolean;
				} catch {}

				// set state early so UI reflects persisted values immediately
				if (Object.keys(savedSelectedObj).length) setSelectedBySlug(savedSelectedObj);
				if (Object.keys(savedInputsObj).length) setInputNameByAttr(savedInputsObj);
				setVehicleConfirmed(savedConfirmedBool);

				const data = await executeGraphQL(GetFilterableAttributesDocument, {
					variables: { first: 50 },
					withAuth: false,
				});
				const list = (data.attributes?.edges || []).map((e): { id: string; name: string; slug: string } => ({
					id: e?.node?.id ?? "",
					name: e?.node?.name ?? "",
					slug: e?.node?.slug ?? "",
				}));
				const normalize = (s: string) =>
					(s || "")
						.toLowerCase()
						.replaceAll("á", "a")
						.replaceAll("é", "e")
						.replaceAll("í", "i")
						.replaceAll("ó", "o")
						.replaceAll("ú", "u")
						.replaceAll("ñ", "n");
				const desiredOrder = [
					"ano",
					"anio",
					"año",
					"marca",
					"modelo",
					"acabado",
					"transmision",
					"transmisión",
				];
				const orderIndex = (slug: string) => {
					const n = normalize(slug);
					const idx = desiredOrder.findIndex((k) => normalize(k) === n);
					return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
				};
				const sorted = [...list].sort((a, b) => {
					const ai = orderIndex(a.slug);
					const bi = orderIndex(b.slug);
					if (ai !== bi) return ai - bi;
					return (a.name || "").localeCompare(b.name || "");
				});
				setAttributes(sorted);

				// Load categories hierarchy
				const cat = await executeGraphQL(CategoryHierarchyDocument, {
					variables: { first: 100, childrenFirst: 50 },
					withAuth: false,
				});
				const flatCats = (cat.categories?.edges || []).map(
					(
						e,
					): {
						id: string;
						name: string;
						slug: string;
						level: number;
						parent?: { id: string; name: string; slug: string } | null;
					} => ({
						id: e?.node?.id ?? "",
						name: e?.node?.name ?? "",
						slug: e?.node?.slug ?? "",
						level: e?.node?.level ?? 0,
						parent: e?.node?.parent ?? null,
					}),
				);
				setCategories(flatCats);
				// load initial choices for each attribute
				for (const att of list) {
					const ch = await executeGraphQL(AttributeChoicesDocument, {
						variables: { slug: att.slug, first: 100, after: null },
						withAuth: false,
					});
					const opts =
						(ch.attributes?.edges?.[0]?.node.choices?.edges || []).map(
							(e): { id: string; name: string; slug: string } => ({
								id: e?.node?.id ?? "",
								name: e?.node?.name ?? "",
								slug: e?.node?.slug ?? "",
							}),
						) || [];
					setChoicesBySlug((prev) => ({ ...prev, [att.slug]: opts }));
					const pre = searchParams.get(att.slug) || savedSelectedObj[att.slug];
					if (pre) setSelectedBySlug((prev) => ({ ...prev, [att.slug]: pre }));
					const labels: Record<string, string> = Object.fromEntries(opts.map((o) => [o.slug, o.name]));
					setLabelsBySlug((prev) => ({ ...prev, ...labels }));
					if (!savedInputsObj[att.slug] && pre && labels[pre]) {
						setInputNameByAttr((prev) => ({ ...prev, [att.slug]: labels[pre] }));
					}
				}
			} catch (e) {
				console.error("Failed to load attributes", e);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist selection and confirmed state across navigation
	useEffect(() => {
		try {
			localStorage.setItem("vehicle.selectedBySlug", JSON.stringify(selectedBySlug));
			localStorage.setItem("vehicle.inputNameByAttr", JSON.stringify(inputNameByAttr));
			localStorage.setItem("vehicle.confirmed", JSON.stringify(vehicleConfirmed));
		} catch {}
	}, [selectedBySlug, inputNameByAttr, vehicleConfirmed]);

	function apply() {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		if (query) params.set("q", query);
		else params.delete("q");
		// set attribute selections
		for (const [slug, value] of Object.entries(selectedBySlug)) {
			if (value) params.set(slug, value);
			else params.delete(slug);
		}
		router.push(`?${params.toString()}`);
	}

	// reserved for future clear behavior

	const hasAnySelection = Object.values(selectedBySlug).some((v) => Boolean(v));
	const isVehicleConfirmed = !editingVehicle && (vehicleConfirmed || hasAnySelection);

	const selectedLabelsOrdered = attributes
		.map((att) => {
			const slug = selectedBySlug[att.slug];
			return slug ? labelsBySlug[slug] : "";
		})
		.filter(Boolean);

	return (
		<aside className="sticky top-20 h-fit w-full max-w-xs space-y-6 rounded-lg border border-neutral-200 bg-white p-4">
			{/* Sección 1: Vehículo (solo visible si hay selección) */}
			{isVehicleConfirmed && selectedLabelsOrdered.length > 0 && (
				<div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-neutral-800">
					<p className="text-xs uppercase text-neutral-600">Estas buscando piezas para tu</p>
					<p className="mt-1 text-lg font-extrabold leading-tight text-neutral-900">
						{selectedLabelsOrdered.join(" ")}
					</p>
					<button
						type="button"
						onClick={() => {
							setVehicleConfirmed(false);
							setEditingVehicle(true);
						}}
						className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
					>
						Cambiar vehículo
					</button>
				</div>
			)}

			{/* Formulario de selección de vehículo. Visible hasta que se confirma con el botón "Elegir vehículo" */}
			{!isVehicleConfirmed &&
				attributes.map((att) => (
					<div key={att.id} className="space-y-1">
						<label className="text-sm font-medium text-neutral-700">{att.name}</label>
						<input
							className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-toyota-red"
							list={`list-${att.slug}`}
							value={inputNameByAttr[att.slug] || ""}
							onChange={(e) => {
								const val = e.target.value;
								setInputNameByAttr((prev) => ({ ...prev, [att.slug]: val }));
								const match = (choicesBySlug[att.slug] || []).find(
									(c) => c.name.toLowerCase() === val.toLowerCase(),
								);
								setSelectedBySlug((prev) => ({ ...prev, [att.slug]: match ? match.slug : "" }));
							}}
							placeholder="Selecciona..."
						/>
						<datalist id={`list-${att.slug}`}>
							{(choicesBySlug[att.slug] || []).map((c) => (
								<option key={c.id} value={c.name} />
							))}
						</datalist>
					</div>
				))}
			{!isVehicleConfirmed && (
				<button
					type="button"
					onClick={() => {
						setVehicleConfirmed(true);
						setEditingVehicle(false);
					}}
					className="inline-flex w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
				>
					Elegir vehículo
				</button>
			)}

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
				<p className="text-sm font-medium text-neutral-900">Buscar por categoría</p>
				<ul className="divide-y divide-neutral-100 text-sm text-neutral-800">
					{(categories.filter((c) => c.level === 0) || [])
						.slice(0, showAllCats ? undefined : 4)
						.map((root) => (
							<li key={root.id} className="py-2">
								<details className="group">
									<summary className="flex cursor-pointer list-none items-center justify-between">
										<LinkWithChannel className="block py-1 hover:underline" href={`/categories/${root.slug}`}>
											{root.name}
										</LinkWithChannel>
										<span className="text-neutral-400 transition-transform group-open:rotate-90">›</span>
									</summary>
									<ul className="ml-3 mt-2 space-y-1">
										{categories
											.filter((c) => c.parent?.id === root.id)
											.map((lvl1) => (
												<li key={lvl1.id}>
													<details className="group">
														<summary className="flex cursor-pointer list-none items-center justify-between">
															<LinkWithChannel
																className="block py-1 hover:underline"
																href={`/categories/${lvl1.slug}`}
															>
																{lvl1.name}
															</LinkWithChannel>
															<span className="text-neutral-400 transition-transform group-open:rotate-90">
																›
															</span>
														</summary>
														<ul className="ml-3 mt-1 space-y-1">
															{categories
																.filter((c) => c.parent?.id === lvl1.id)
																.map((lvl2) => (
																	<li key={lvl2.id}>
																		<LinkWithChannel
																			className="block py-1 hover:underline"
																			href={`/categories/${lvl2.slug}`}
																		>
																			{lvl2.name}
																		</LinkWithChannel>
																	</li>
																))}
														</ul>
													</details>
												</li>
											))}
									</ul>
								</details>
							</li>
						))}
				</ul>
				{/* Ver todo / Ver menos */}
				<button
					type="button"
					onClick={() => setShowAllCats((s) => !s)}
					className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:underline"
				>
					{showAllCats ? "Ver menos" : "Ver todo"}
					<span
						className={`text-neutral-400 transition-transform ${showAllCats ? "rotate-180" : "rotate-0"}`}
					>
						⌄
					</span>
				</button>
			</div>

			<button onClick={apply} className="btn-primary w-full">
				Aplicar filtros
			</button>
		</aside>
	);
}
