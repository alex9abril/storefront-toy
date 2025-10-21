// Configuración del blog
export const blogConfig = {
	// Configuración general
	site: {
		name: "Blog Toyota Refacciones",
		description: "Artículos y noticias sobre refacciones Toyota, mantenimiento y consejos para tu vehículo.",
		url: "https://refacciones-toyota.com/blog",
		logo: "/images/logo-toyota.png",
	},

	// Configuración de paginación
	pagination: {
		articlesPerPage: 6,
		showPagination: true,
		maxVisiblePages: 5,
	},

	// Configuración de búsqueda
	search: {
		enabled: true,
		placeholder: "Buscar artículos sobre Toyota...",
		minQueryLength: 2,
		highlightResults: true,
	},

	// Configuración de categorías
	categories: {
		enabled: true,
		showInHeader: true,
		showCount: true,
	},

	// Configuración de autores
	authors: {
		showBio: true,
		showSocial: true,
		showAvatar: true,
	},

	// Configuración de artículos
	articles: {
		showReadTime: true,
		showPublishDate: true,
		showUpdateDate: true,
		showTags: true,
		showRelated: true,
		showShareButtons: true,
		showAuthor: true,
		showCategory: true,
	},

	// Configuración de SEO
	seo: {
		enabled: true,
		generateSitemap: true,
		generateRSS: false,
		ogImage: "/images/blog/og-default.jpg",
		twitterCard: "summary_large_image",
	},

	// Configuración de redes sociales
	social: {
		twitter: {
			enabled: true,
			username: "@ToyotaRefacciones",
		},
		linkedin: {
			enabled: true,
			company: "Toyota Refacciones",
		},
		facebook: {
			enabled: true,
			appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
		},
	},

	// Configuración de analytics
	analytics: {
		googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
		enabled: true,
	},

	// Configuración de comentarios
	comments: {
		enabled: false,
		provider: "disqus", // "disqus" | "utterances" | "giscus"
		disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
	},

	// Configuración de newsletter
	newsletter: {
		enabled: false,
		provider: "mailchimp", // "mailchimp" | "convertkit" | "custom"
		endpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
	},

	// Configuración de cache
	cache: {
		enabled: true,
		ttl: 3600, // 1 hora en segundos
		revalidate: 60, // 1 minuto
	},

	// Configuración de imágenes
	images: {
		quality: 80,
		formats: ["webp", "jpg"],
		sizes: [320, 640, 768, 1024, 1280, 1920],
		lazy: true,
		placeholder: "blur",
	},

	// Configuración de contenido
	content: {
		excerptLength: 160,
		readTimeWordsPerMinute: 200,
		showWordCount: false,
		allowHTML: true,
		markdown: false,
	},

	// Configuración de desarrollo
	development: {
		showStats: true,
		showDebugInfo: false,
		logLevel: "info",
	},
};

// Tipos para la configuración
export type BlogConfig = typeof blogConfig;
