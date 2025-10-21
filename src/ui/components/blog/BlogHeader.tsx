import { type Category } from "@/lib/blog/types";

interface BlogHeaderProps {
	title: string;
	description: string;
	categories?: Category[];
	selectedCategory?: string;
	onCategoryChange?: (category: string) => void;
}

export const BlogHeader = ({
	title,
	description,
	categories = [],
	selectedCategory,
	onCategoryChange,
}: BlogHeaderProps) => {
	return (
		<div className="bg-black text-white">
			<div className="mx-auto max-w-7xl px-6 py-16">
				<div className="text-center">
					<h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
					<p className="mb-8 text-lg text-gray-300 md:text-xl">{description}</p>
				</div>

				{categories.length > 0 && (
					<div className="mt-8">
						<div className="flex flex-wrap justify-center gap-2">
							<button
								onClick={() => onCategoryChange?.("")}
								className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
									!selectedCategory
										? "border-[#EB0A1E] bg-[#EB0A1E] text-white"
										: "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
								}`}
							>
								Todos
							</button>
							{categories.map((category) => (
								<button
									key={category.slug}
									onClick={() => onCategoryChange?.(category.slug)}
									className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
										selectedCategory === category.slug
											? "border-[#EB0A1E] bg-[#EB0A1E] text-white"
											: "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
									}`}
								>
									{category.name}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
