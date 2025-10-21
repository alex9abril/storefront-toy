import Link from "next/link";
import Image from "next/image";
import { type Article } from "@/lib/blog/types";

interface ArticleCardProps {
	article: Article;
	featured?: boolean;
}

export const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
	const cardClasses = featured ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-1";

	return (
		<article className={`group ${cardClasses}`}>
			<Link href={`/blog/${article.slug}`} className="block">
				<div className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:shadow-lg hover:ring-neutral-300">
					{article.featuredImage && (
						<div className="relative h-48 w-full overflow-hidden md:h-56">
							<Image
								src={article.featuredImage}
								alt={article.title}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							{article.category && (
								<div className="absolute left-4 top-4">
									<span className="inline-flex items-center rounded-full bg-[#EB0A1E] px-3 py-1 text-xs font-semibold text-white">
										{article.category.name}
									</span>
								</div>
							)}
						</div>
					)}
					<div className="p-6">
						<div className="mb-3 flex items-center gap-4 text-sm text-neutral-500">
							<time dateTime={article.publishedAt}>
								{new Date(article.publishedAt).toLocaleDateString("es-MX", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
							<span>•</span>
							<span>{article.readTime} min de lectura</span>
						</div>
						<h2 className="mb-3 text-xl font-bold text-neutral-900 transition-colors group-hover:text-[#EB0A1E]">
							{article.title}
						</h2>
						<p className="mb-4 line-clamp-3 text-neutral-600">{article.excerpt}</p>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EB0A1E]/10">
									<svg
										className="h-4 w-4 text-[#EB0A1E]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<span className="text-sm font-medium text-neutral-700">{article.author.name}</span>
							</div>
							{article.tags && article.tags.length > 0 && (
								<div className="flex gap-1">
									{article.tags.slice(0, 2).map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</Link>
		</article>
	);
};
