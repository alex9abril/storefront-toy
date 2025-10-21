import { type BlogData } from "@/lib/blog/types";

interface BlogStatsProps {
	data: BlogData;
	className?: string;
}

export const BlogStats = ({ data, className = "" }: BlogStatsProps) => {
	const totalArticles = data.articles.length;
	const totalCategories = data.categories.length;
	const totalAuthors = data.authors.length;
	const featuredArticles = data.articles.filter((article) => article.featured).length;

	return (
		<div className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${className}`}>
			<div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-200">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB0A1E]/10">
						<svg className="h-5 w-5 text-[#EB0A1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-neutral-600">Artículos</p>
						<p className="text-2xl font-bold text-neutral-900">{totalArticles}</p>
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-200">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
						<svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-neutral-600">Categorías</p>
						<p className="text-2xl font-bold text-neutral-900">{totalCategories}</p>
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-200">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
						<svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-neutral-600">Autores</p>
						<p className="text-2xl font-bold text-neutral-900">{totalAuthors}</p>
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-neutral-200">
				<div className="flex items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
						<svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-neutral-600">Destacados</p>
						<p className="text-2xl font-bold text-neutral-900">{featuredArticles}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
