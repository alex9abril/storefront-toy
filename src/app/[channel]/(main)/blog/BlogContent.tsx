"use client";

import { useState, useMemo } from "react";
import { type BlogData } from "@/lib/blog/types";
import { getFeaturedArticles, searchArticles } from "@/lib/blog/data";
import { BlogHeader, ArticleCard, SearchBar, Pagination, BlogStats } from "@/ui/components/blog";

interface BlogContentProps {
	data: BlogData;
}

export const BlogContent = ({ data }: BlogContentProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const articlesPerPage = 6;

	const featuredArticles = getFeaturedArticles();
	const allArticles = data.articles;

	const filteredArticles = useMemo(() => {
		let articles = allArticles;

		if (selectedCategory) {
			articles = articles.filter((article) => article.category?.slug === selectedCategory);
		}

		if (searchQuery) {
			articles = searchArticles(searchQuery);
		}

		return articles;
	}, [allArticles, selectedCategory, searchQuery]);

	const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
	const startIndex = (currentPage - 1) * articlesPerPage;
	const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<BlogHeader
				title="Blog Toyota"
				description="Artículos y noticias sobre refacciones Toyota, mantenimiento y consejos para tu vehículo."
				categories={data.categories}
				selectedCategory={selectedCategory}
				onCategoryChange={handleCategoryChange}
			/>

			<div className="mx-auto max-w-7xl px-6 py-16">
				{/* Estadísticas del blog */}
				{!searchQuery && !selectedCategory && (
					<div className="mb-12">
						<BlogStats data={data} />
					</div>
				)}

				{/* Barra de búsqueda */}
				<div className="mb-12">
					<SearchBar
						onSearch={handleSearch}
						placeholder="Buscar artículos sobre Toyota..."
						className="mx-auto max-w-2xl"
					/>
				</div>

				{/* Artículos destacados */}
				{!searchQuery && !selectedCategory && (
					<section className="mb-16">
						<h2 className="mb-8 text-3xl font-bold text-neutral-900">Artículos destacados</h2>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{featuredArticles.map((article) => (
								<ArticleCard key={article.id} article={article} featured />
							))}
						</div>
					</section>
				)}

				{/* Todos los artículos */}
				<section>
					<h2 className="mb-8 text-3xl font-bold text-neutral-900">
						{searchQuery
							? `Resultados para "${searchQuery}"`
							: selectedCategory
								? `Categoría: ${
										data.categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
									}`
								: "Todos los artículos"}
					</h2>

					{paginatedArticles.length > 0 ? (
						<>
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								{paginatedArticles.map((article) => (
									<ArticleCard key={article.id} article={article} />
								))}
							</div>
							{totalPages > 1 && (
								<div className="mt-12">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</>
					) : (
						<div className="py-16 text-center">
							<div className="mb-4">
								<svg
									className="mx-auto h-16 w-16 text-neutral-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-semibold text-neutral-700">No se encontraron artículos</h3>
							<p className="text-neutral-600">
								{searchQuery
									? `No hay artículos que coincidan con "${searchQuery}"`
									: "No hay artículos en esta categoría"}
							</p>
						</div>
					)}
				</section>
			</div>
		</>
	);
};
