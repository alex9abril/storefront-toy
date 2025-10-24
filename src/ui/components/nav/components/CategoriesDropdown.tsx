"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { executeGraphQL } from "@/lib/graphql";
import { CategoryHierarchyDocument } from "@/gql/graphql";

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

	const getCategoryChildren = (categoryId: string) => {
		return categories.find((cat) => cat.id === categoryId)?.children || [];
	};

	if (loading) {
		return (
			<div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
				<svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				<span className="hidden sm:inline">Cargando categorías...</span>
				<span className="sm:hidden">Cargando...</span>
			</div>
		);
	}

	return (
		<div className="relative">
			{/* Botón trigger */}
			<button
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:text-[#EB0A1E] sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
			>
				<svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				<span className="hidden sm:inline">Todas las categorías</span>
				<span className="sm:hidden">Categorías</span>
				<ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
			</button>

			{/* Menú flotante */}
			{isOpen && (
				<div
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
					className="absolute left-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-gray-200 bg-white shadow-xl sm:w-[400px] lg:w-[800px]"
				>
					<div className="flex flex-col lg:flex-row">
						{/* Panel izquierdo - Categorías principales */}
						<div className="w-full border-b border-gray-200 lg:w-1/3 lg:border-b-0 lg:border-r">
							<div className="p-3 sm:p-4">
								<h3 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">Categorías</h3>
								<div className="space-y-1">
									{categories.map((category) => (
										<div
											key={category.id}
											onMouseEnter={() => setHoveredCategory(category.id)}
											className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors sm:px-3 sm:py-2 ${
												hoveredCategory === category.id ? "bg-[#EB0A1E] text-white" : "hover:bg-gray-50"
											}`}
										>
											<div className="flex items-center gap-1.5 sm:gap-2">
												<span className="text-xs sm:text-sm">-</span>
												<span className="text-xs font-medium sm:text-sm">{category.name}</span>
											</div>
											{category.children && category.children.length > 0 && (
												<svg
													className="h-3 w-3 sm:h-4 sm:w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
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
						<div className="w-full lg:w-2/3">
							<div className="p-3 sm:p-4">
								{hoveredCategory && (
									<>
										<h3 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-4 sm:text-sm">
											{categories.find((cat) => cat.id === hoveredCategory)?.name}
										</h3>
										<div className="space-y-2 sm:space-y-4">
											{getCategoryChildren(hoveredCategory).length > 0 ? (
												<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
													{getCategoryChildren(hoveredCategory).map((child) => (
														<LinkWithChannel
															key={child.id}
															href={`/categories/${child.slug}`}
															className="block rounded-md border border-gray-200 p-2 transition-colors hover:border-[#EB0A1E] hover:bg-gray-50 sm:p-3"
														>
															<div className="flex items-center gap-1.5 sm:gap-2">
																<span className="text-xs sm:text-sm">-</span>
																<span className="text-xs font-medium text-gray-900 sm:text-sm">
																	{child.name}
																</span>
															</div>
														</LinkWithChannel>
													))}
												</div>
											) : (
												<div className="py-4 text-center sm:py-8">
													<p className="text-xs text-gray-500 sm:text-sm">No hay subcategorías disponibles</p>
													<LinkWithChannel
														href={`/categories/${categories.find((cat) => cat.id === hoveredCategory)?.slug}`}
														className="mt-2 inline-block rounded-md bg-[#EB0A1E] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#C8102E] sm:px-4 sm:py-2 sm:text-sm"
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
