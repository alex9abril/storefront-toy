"use client";

import { useState } from "react";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	className?: string;
}

export const SearchBar = ({
	onSearch,
	placeholder = "Buscar artículos...",
	className = "",
}: SearchBarProps) => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	const handleClear = () => {
		setQuery("");
		onSearch("");
	};

	return (
		<form onSubmit={handleSubmit} className={`relative ${className}`}>
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder}
					className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-10 text-neutral-900 placeholder-neutral-500 focus:border-[#EB0A1E] focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20"
				/>
				{query && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>
		</form>
	);
};
