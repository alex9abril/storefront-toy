"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { GetFilterableAttributesDocument, AttributeChoicesDocument } from "@/gql/graphql";

type Attr = { id: string; name: string; slug: string };
type Choice = { id: string; name: string; slug: string };

function CarIcon() {
	return (
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			className="text-amber-500"
		>
			<rect x="1" y="5" width="22" height="10" rx="2" className="fill-amber-100" />
			<path
				d="M3 15V13m18 2V13M6 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm12 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM4 10h16l-1.2-3A2 2 0 0 0 17 6H7a2 2 0 0 0-1.8 1.1L4 10Z"
				className="fill-current"
			/>
		</svg>
	);
}

export function VehicleSelectorBanner() {
	const router = useRouter();
	const { channel } = useParams<{ channel?: string }>();

	const [attributes, setAttributes] = useState<Attr[]>([]);
	const [choicesBySlug, setChoicesBySlug] = useState<Record<string, Choice[]>>({});
	const [selectedBySlug, setSelectedBySlug] = useState<Record<string, string>>({});

	const normalize = (s: string) =>
		(s || "")
			.toLowerCase()
			.replaceAll("á", "a")
			.replaceAll("é", "e")
			.replaceAll("í", "i")
			.replaceAll("ó", "o")
			.replaceAll("ú", "u")
			.replaceAll("ñ", "n");

	// Campos de selección (se omite "Marca"; por defecto será TOYOTA)
	const fields = useMemo(
		() => [
			{ key: "modelo", label: "Modelo", aliases: ["modelo"] },
			{ key: "anio", label: "Año", aliases: ["anio", "ano", "año"] },
			{ key: "acabado", label: "Acabado", aliases: ["acabado"] },
			{ key: "transmision", label: "Transmisión", aliases: ["transmision", "transmisión"] },
		],
		[],
	);

	useEffect(() => {
		void (async () => {
			try {
				const data = await executeGraphQL(GetFilterableAttributesDocument, {
					variables: { first: 50 },
					withAuth: false,
				});
				const list = (data.attributes?.edges || []).map(
					(e): Attr => ({
						id: e?.node?.id ?? "",
						name: e?.node?.name ?? "",
						slug: e?.node?.slug ?? "",
					}),
				);
				setAttributes(list);

				// Preload choices para campos visibles y forzar marca = toyota
				const attributesNeeded: Attr[] = [];
				for (const f of fields) {
					const attr = list.find((a) => f.aliases.includes(normalize(a.slug)));
					if (attr) attributesNeeded.push(attr);
				}
				// Detectar atributo de marca para preseleccionar 'toyota' y cargar sus choices (para nombre)
				const brandAttr = list.find((a) => normalize(a.slug) === "marca");
				if (brandAttr) {
					attributesNeeded.push(brandAttr);
					setSelectedBySlug((prev) => ({ ...prev, [brandAttr.slug]: "toyota" }));
				}

				for (const att of attributesNeeded) {
					const ch = await executeGraphQL(AttributeChoicesDocument, {
						variables: { slug: att.slug, first: 100, after: null },
						withAuth: false,
					});
					const opts = (ch.attributes?.edges?.[0]?.node.choices?.edges || []).map(
						(x): Choice => ({ id: x?.node?.id ?? "", name: x?.node?.name ?? "", slug: x?.node?.slug ?? "" }),
					);
					setChoicesBySlug((prev) => ({ ...prev, [att.slug]: opts }));
				}
			} catch (err) {
				console.error("VehicleSelectorBanner load error", err);
			}
		})();
	}, [fields]);

	function confirmAndGo() {
		try {
			// Persist for sidebar filters
			const inputNameByAttr: Record<string, string> = {};
			for (const att of attributes) {
				const slug = selectedBySlug[att.slug];
				const name = (choicesBySlug[att.slug] || []).find((c) => c.slug === slug)?.name || "";
				if (slug) inputNameByAttr[att.slug] = name;
			}
			localStorage.setItem("vehicle.selectedBySlug", JSON.stringify(selectedBySlug));
			localStorage.setItem("vehicle.inputNameByAttr", JSON.stringify(inputNameByAttr));
			localStorage.setItem("vehicle.confirmed", JSON.stringify(true));
		} catch {}
		const ch = encodeURIComponent(channel || "");
		router.push(`/${ch}/products`);
	}

	return (
		<section
			role="region"
			aria-labelledby="vf_title"
			className="mx-auto mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg md:p-8 dark:border-neutral-700/50 dark:bg-neutral-900/70"
		>
			<div className="mb-4 flex items-start gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200">
					<CarIcon />
				</div>
				<div>
					<h3
						id="vf_title"
						className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
					>
						Completa los datos de tu vehículo para encontrar productos compatibles
					</h3>
					<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
						Selecciona los datos. Si no los conoces, búscalos en la Tarjeta de Circulación.
					</p>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
				{fields.map((f) => {
					const attr = attributes.find((a) => f.aliases.includes(normalize(a.slug)));
					const selectKey = attr?.slug || f.key; // fall back to field key if missing
					const disabled = !attr;
					const options = attr ? choicesBySlug[attr.slug] || [] : [];
					return (
						<div key={f.key} className="space-y-2">
							<label
								htmlFor={`vf_${selectKey}`}
								className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
							>
								{f.label}
							</label>
							<div className="relative">
								<select
									id={`vf_${selectKey}`}
									name={selectKey}
									aria-label={`Selecciona ${f.label}`}
									disabled={disabled}
									className={`h-12 w-full appearance-none rounded-xl border bg-white px-3 pr-9 text-sm outline-none transition-all placeholder:text-neutral-500 focus:ring-2 focus:ring-toyota-red dark:bg-neutral-800 ${
										disabled
											? "cursor-not-allowed border-neutral-300 text-neutral-400 dark:border-neutral-700"
											: "border-neutral-300 text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-50"
									}`}
									value={selectedBySlug[selectKey] || ""}
									onChange={(e) => setSelectedBySlug((prev) => ({ ...prev, [selectKey]: e.target.value }))}
								>
									<option value="">Seleccionar</option>
									{options.map((c) => (
										<option key={c.id} value={c.slug}>
											{c.name}
										</option>
									))}
								</select>
								<span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-neutral-400">
									▾
								</span>
							</div>
						</div>
					);
				})}
				<div className="flex items-end">
					<button
						type="button"
						onClick={confirmAndGo}
						className="h-12 w-full rounded-xl bg-toyota-red px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-300 active:translate-y-px"
					>
						Buscar
					</button>
				</div>
			</div>
		</section>
	);
}
