interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<nav className={`flex items-center justify-center space-x-2 ${className}`}>
			{/* Botón anterior */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
				</svg>
				Anterior
			</button>

			{/* Números de página */}
			<div className="flex items-center space-x-1">
				{getPageNumbers().map((page, index) => (
					<button
						key={index}
						onClick={() => typeof page === "number" && onPageChange(page)}
						disabled={page === "..."}
						className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
							page === currentPage
								? "bg-[#EB0A1E] text-white"
								: page === "..."
									? "cursor-default text-neutral-400"
									: "text-neutral-700 hover:bg-neutral-100"
						}`}
					>
						{page}
					</button>
				))}
			</div>

			{/* Botón siguiente */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Siguiente
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</nav>
	);
};
