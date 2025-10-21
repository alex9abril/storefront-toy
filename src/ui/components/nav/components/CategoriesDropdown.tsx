"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { executeGraphQL } from "@/lib/graphql";
import { CategoryHierarchyDocument } from "@/gql/graphql";

// Iconos para categorías
const categoryIcons: Record<string, string> = {
	frenos: "🔧",
	llantas: "⚙️",
	aceites: "🛢️",
	embrague: "⚡",
	parabrisas: "🪟",
	espejos: "🪞",
	motor: "🔩",
	filtros: "🔍",
	baterias: "🔋",
	amortiguadores: "🛡️",
	default: "📦",
};

type Category = {
	id: string;
	name: string;
	slug: string;
	level: number;
	parent?: { id: string; name: string; slug: string } | null;
	children?: Category[];
};

export const CategoriesDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	// Cargar categorías al montar el componente
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const result = await executeGraphQL(CategoryHierarchyDocument, {
					variables: { first: 100, childrenFirst: 50 },
					withAuth: false,
				});

				const flatCats = (result.categories?.edges || []).map(
					(e): Category => ({
						id: e?.node?.id ?? "",
						name: e?.node?.name ?? "",
						slug: e?.node?.slug ?? "",
						level: e?.node?.level ?? 0,
						parent: e?.node?.parent ?? null,
						children:
							e?.node?.children?.edges?.map((child) => ({
								id: child?.node?.id ?? "",
								name: child?.node?.name ?? "",
								slug: child?.node?.slug ?? "",
								level: child?.node?.level ?? 0,
							})) || [],
					}),
				);

				// Filtrar solo categorías principales (level 0) y ordenar
				const mainCategories = flatCats
					.filter((cat) => cat.level === 0)
					.sort((a, b) => a.name.localeCompare(b.name));

				setCategories(mainCategories);
			} catch (error) {
				console.error("Error loading categories:", error);
			} finally {
				setLoading(false);
			}
		};

		void loadCategories();
	}, []);

	const _getCategoryIcon = (slug: string) => {
		const normalizedSlug = slug.toLowerCase();
		return categoryIcons[normalizedSlug] || categoryIcons.default;
	};

	const getCategoryChildren = (categoryId: string) => {
		return categories.find((cat) => cat.id === categoryId)?.children || [];
	};

	if (loading) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
				<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				Cargando categorías...
			</div>
		);
	}

	return (
		<div className="relative">
			{/* Botón trigger */}
			<button
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#EB0A1E]"
			>
				<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				Todas las categorías
				<ChevronDownIcon className="h-4 w-4" />
			</button>

			{/* Menú flotante */}
			{isOpen && (
				<div
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
					className="absolute left-0 top-full z-50 mt-1 w-[800px] rounded-lg border border-gray-200 bg-white shadow-xl"
				>
					<div className="flex">
						{/* Panel izquierdo - Categorías principales */}
						<div className="w-1/3 border-r border-gray-200">
							<div className="p-4">
								<h3 className="mb-3 text-sm font-semibold text-gray-900">Categorías</h3>
								<div className="space-y-1">
									{categories.map((category) => (
										<div
											key={category.id}
											onMouseEnter={() => setHoveredCategory(category.id)}
											className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors ${
												hoveredCategory === category.id ? "bg-[#EB0A1E] text-white" : "hover:bg-gray-50"
											}`}
										>
											<div className="flex items-center gap-2">
												<span className="text-sm">-</span>
												<span className="text-sm font-medium">{category.name}</span>
											</div>
											{category.children && category.children.length > 0 && (
												<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5l7 7-7 7"
													/>
												</svg>
											)}
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Panel derecho - Subcategorías */}
						<div className="w-2/3">
							<div className="p-4">
								{hoveredCategory && (
									<>
										<h3 className="mb-4 text-sm font-semibold text-gray-900">
											{categories.find((cat) => cat.id === hoveredCategory)?.name}
										</h3>
										<div className="space-y-4">
											{getCategoryChildren(hoveredCategory).length > 0 ? (
												<div className="grid grid-cols-2 gap-4">
													{getCategoryChildren(hoveredCategory).map((child) => (
														<LinkWithChannel
															key={child.id}
															href={`/categories/${child.slug}`}
															className="block rounded-md border border-gray-200 p-3 transition-colors hover:border-[#EB0A1E] hover:bg-gray-50"
														>
															<div className="flex items-center gap-2">
																<span className="text-sm">-</span>
																<span className="text-sm font-medium text-gray-900">{child.name}</span>
															</div>
														</LinkWithChannel>
													))}
												</div>
											) : (
												<div className="py-8 text-center">
													<p className="text-sm text-gray-500">No hay subcategorías disponibles</p>
													<LinkWithChannel
														href={`/categories/${categories.find((cat) => cat.id === hoveredCategory)?.slug}`}
														className="mt-2 inline-block rounded-md bg-[#EB0A1E] px-4 py-2 text-sm text-white transition-colors hover:bg-[#C8102E]"
													>
														Ver productos
													</LinkWithChannel>
												</div>
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
