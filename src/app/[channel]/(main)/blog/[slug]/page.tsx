import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/blog/data";
import { AuthorInfo, RelatedArticles } from "@/ui/components/blog";

interface BlogArticlePageProps {
	params: Promise<{ channel: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = getArticleBySlug(slug);

	if (!article) {
		return {
			title: "Artículo no encontrado",
			description: "El artículo solicitado no existe.",
		};
	}

	return {
		title: article.seo?.metaTitle || article.title,
		description: article.seo?.metaDescription || article.excerpt,
		keywords: article.seo?.keywords,
		openGraph: {
			title: article.title,
			description: article.excerpt,
			images: article.featuredImage ? [article.featuredImage] : [],
		},
	};
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
	const { slug } = await params;
	const article = getArticleBySlug(slug);

	if (!article) {
		notFound();
	}

	const relatedArticles = getRelatedArticles(article.id);

	return (
		<article className="mx-auto max-w-4xl px-6 py-16">
			{/* Breadcrumb */}
			<nav className="mb-8">
				<ol className="flex items-center space-x-2 text-sm text-neutral-600">
					<li>
						<Link href="/blog" className="transition-colors hover:text-[#EB0A1E]">
							Blog
						</Link>
					</li>
					{article.category && (
						<>
							<li>/</li>
							<li>
								<Link
									href={`/blog?category=${article.category.slug}`}
									className="transition-colors hover:text-[#EB0A1E]"
								>
									{article.category.name}
								</Link>
							</li>
						</>
					)}
					<li>/</li>
					<li className="font-medium text-neutral-900">{article.title}</li>
				</ol>
			</nav>

			{/* Header del artículo */}
			<header className="mb-12">
				{article.category && (
					<div className="mb-4">
						<span className="inline-flex items-center rounded-full bg-[#EB0A1E] px-3 py-1 text-sm font-semibold text-white">
							{article.category.name}
						</span>
					</div>
				)}

				<h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">{article.title}</h1>

				<p className="mb-8 text-xl text-neutral-600">{article.excerpt}</p>

				{/* Información del artículo */}
				<div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
					<time dateTime={article.publishedAt}>
						{new Date(article.publishedAt).toLocaleDateString("es-MX", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</time>
					<span>•</span>
					<span>{article.readTime} min de lectura</span>
					{article.updatedAt && (
						<>
							<span>•</span>
							<span>
								Actualizado:{" "}
								{new Date(article.updatedAt).toLocaleDateString("es-MX", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</>
					)}
				</div>

				{/* Autor */}
				<div className="mt-8">
					<AuthorInfo author={article.author} showBio />
				</div>
			</header>

			{/* Imagen destacada */}
			{article.featuredImage && (
				<div className="mb-12">
					<div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
						<Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
					</div>
				</div>
			)}

			{/* Contenido del artículo */}
			<div className="prose prose-lg max-w-none">
				<div
					className="leading-relaxed text-neutral-700"
					dangerouslySetInnerHTML={{
						__html: article.content
							.replace(/\n/g, "<br>")
							.replace(/### /g, '<h3 class="text-2xl font-bold text-neutral-900 mt-8 mb-4">')
							.replace(/## /g, '<h2 class="text-3xl font-bold text-neutral-900 mt-10 mb-6">')
							.replace(/# /g, '<h1 class="text-4xl font-bold text-neutral-900 mt-12 mb-8">')
							.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-900">$1</strong>')
							.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
							.replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
							.replace(/(<li.*?<\/li>)/g, '<ul class="list-disc list-inside mb-4">$1</ul>'),
					}}
				/>
			</div>

			{/* Tags */}
			{article.tags && article.tags.length > 0 && (
				<div className="mt-12">
					<h3 className="mb-4 text-lg font-semibold text-neutral-900">Etiquetas</h3>
					<div className="flex flex-wrap gap-2">
						{article.tags.map((tag) => (
							<span
								key={tag}
								className="cursor-pointer rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 transition-colors hover:bg-[#EB0A1E] hover:text-white"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Compartir artículo */}
			<div className="mt-12 border-t border-neutral-200 pt-8">
				<h3 className="mb-4 text-lg font-semibold text-neutral-900">Compartir este artículo</h3>
				<div className="flex gap-4">
					<a
						href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
							article.title,
						)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					>
						<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
						</svg>
						Twitter
					</a>
					<a
						href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
							typeof window !== "undefined" ? window.location.href : "",
						)}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-800"
					>
						<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
						LinkedIn
					</a>
					<button
						onClick={() => {
							void navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
							alert("Enlace copiado al portapapeles");
						}}
						className="flex items-center gap-2 rounded-lg bg-neutral-600 px-4 py-2 text-white transition-colors hover:bg-neutral-700"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						Copiar enlace
					</button>
				</div>
			</div>

			{/* Artículos relacionados */}
			{relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
		</article>
	);
}
