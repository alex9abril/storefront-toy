import { ArticleCard } from "./ArticleCard";
import { type Article } from "@/lib/blog/types";

interface RelatedArticlesProps {
	articles: Article[];
	title?: string;
}

export const RelatedArticles = ({ articles, title = "Artículos relacionados" }: RelatedArticlesProps) => {
	if (articles.length === 0) return null;

	return (
		<section className="mt-16">
			<h3 className="mb-8 text-2xl font-bold text-neutral-900">{title}</h3>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{articles.map((article) => (
					<ArticleCard key={article.slug} article={article} />
				))}
			</div>
		</section>
	);
};
