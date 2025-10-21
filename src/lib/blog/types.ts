export interface Author {
	id: string;
	name: string;
	title?: string;
	bio?: string;
	avatar?: string;
	social?: {
		twitter?: string;
		linkedin?: string;
	};
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

export interface Article {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featuredImage?: string;
	publishedAt: string;
	updatedAt?: string;
	readTime: number;
	author: Author;
	category?: Category;
	tags?: string[];
	featured?: boolean;
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
		keywords?: string[];
	};
}

export interface BlogData {
	articles: Article[];
	categories: Category[];
	authors: Author[];
}
