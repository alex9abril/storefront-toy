// Configuración de imágenes para el blog
export const blogImages = {
	// Imágenes de artículos
	articles: {
		"mantenimiento-preventivo-toyota.jpg": "/images/blog/mantenimiento-preventivo-toyota.jpg",
		"refacciones-originales-vs-genericas.jpg": "/images/blog/refacciones-originales-vs-genericas.jpg",
		"tecnologia-hibrida-toyota.jpg": "/images/blog/tecnologia-hibrida-toyota.jpg",
		"sistemas-seguridad-toyota.jpg": "/images/blog/sistemas-seguridad-toyota.jpg",
		"diagnostico-problemas-toyota.jpg": "/images/blog/diagnostico-problemas-toyota.jpg",
		"innovaciones-tecnologicas-toyota.jpg": "/images/blog/innovaciones-tecnologicas-toyota.jpg",
	},

	// Imágenes de autores
	authors: {
		"carlos-mendoza.jpg": "/images/authors/carlos-mendoza.jpg",
		"ana-rodriguez.jpg": "/images/authors/ana-rodriguez.jpg",
		"miguel-torres.jpg": "/images/authors/miguel-torres.jpg",
	},

	// Imágenes por defecto
	defaults: {
		article: "/images/blog/default-article.jpg",
		author: "/images/authors/default-author.jpg",
		category: "/images/categories/default-category.jpg",
	},
};

// Función para obtener la URL de una imagen del blog
export const getBlogImage = (type: keyof typeof blogImages, filename: string): string => {
	const imageMap = blogImages[type];
	if (imageMap && filename in imageMap) {
		return imageMap[filename as keyof typeof imageMap];
	}

	// Retornar imagen por defecto si no se encuentra
	switch (type) {
		case "articles":
			return blogImages.defaults.article;
		case "authors":
			return blogImages.defaults.author;
		default:
			return blogImages.defaults.article;
	}
};
