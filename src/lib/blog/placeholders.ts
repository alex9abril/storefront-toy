// Configuración de servicios de imágenes placeholder

export const placeholderServices = {
	// Picsum Photos - Imágenes aleatorias de alta calidad
	picsum: {
		baseUrl: "https://picsum.photos",
		getImage: (width: number, height: number, seed?: number) => {
			const seedParam = seed ? `?random=${seed}` : "";
			return `${placeholderServices.picsum.baseUrl}/${width}/${height}${seedParam}`;
		},
		// Imágenes específicas para artículos del blog
		blogImages: {
			article1: "https://picsum.photos/800/600?random=1",
			article2: "https://picsum.photos/800/600?random=2",
			article3: "https://picsum.photos/800/600?random=3",
			article4: "https://picsum.photos/800/600?random=4",
			article5: "https://picsum.photos/800/600?random=5",
			article6: "https://picsum.photos/800/600?random=6",
		},
	},

	// Pravatar - Avatares de personas
	pravatar: {
		baseUrl: "https://i.pravatar.cc",
		getAvatar: (size: number, seed?: number) => {
			const seedParam = seed ? `?img=${seed}` : "";
			return `${placeholderServices.pravatar.baseUrl}/${size}${seedParam}`;
		},
		// Avatares específicos para autores
		authors: {
			carlos: "https://i.pravatar.cc/150?img=1",
			ana: "https://i.pravatar.cc/150?img=2",
			miguel: "https://i.pravatar.cc/150?img=3",
		},
	},

	// Unsplash - Imágenes de alta calidad (alternativa)
	unsplash: {
		baseUrl: "https://source.unsplash.com",
		getImage: (width: number, height: number, keywords?: string) => {
			const keywordsParam = keywords ? `/${keywords}` : "";
			return `${placeholderServices.unsplash.baseUrl}/${width}x${height}${keywordsParam}`;
		},
	},

	// Lorem Picsum - Alternativa a Picsum
	loremPicsum: {
		baseUrl: "https://picsum.photos",
		getImage: (width: number, height: number, seed?: number) => {
			const seedParam = seed ? `?random=${seed}` : "";
			return `${placeholderServices.loremPicsum.baseUrl}/${width}/${height}${seedParam}`;
		},
	},
};

// Función helper para obtener imágenes de artículos
export const getBlogImage = (articleId: string): string => {
	const imageMap: Record<string, string> = {
		"1": placeholderServices.picsum.blogImages.article1,
		"2": placeholderServices.picsum.blogImages.article2,
		"3": placeholderServices.picsum.blogImages.article3,
		"4": placeholderServices.picsum.blogImages.article4,
		"5": placeholderServices.picsum.blogImages.article5,
		"6": placeholderServices.picsum.blogImages.article6,
	};

	return imageMap[articleId] || placeholderServices.picsum.getImage(800, 600);
};

// Función helper para obtener avatares de autores
export const getAuthorAvatar = (authorId: string): string => {
	const avatarMap: Record<string, string> = {
		"1": placeholderServices.pravatar.authors.carlos,
		"2": placeholderServices.pravatar.authors.ana,
		"3": placeholderServices.pravatar.authors.miguel,
	};

	return avatarMap[authorId] || placeholderServices.pravatar.getAvatar(150);
};

// Función para obtener imagen aleatoria
export const getRandomImage = (width: number = 800, height: number = 600): string => {
	return placeholderServices.picsum.getImage(width, height, Math.floor(Math.random() * 1000));
};

// Función para obtener avatar aleatorio
export const getRandomAvatar = (size: number = 150): string => {
	return placeholderServices.pravatar.getAvatar(size, Math.floor(Math.random() * 100));
};
