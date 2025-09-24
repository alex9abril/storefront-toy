"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import Image from "next/image";

export type ProductMedia = { url: string; alt?: string | null }[];

export function ProductGallery({
	media,
	thumbnail,
}: {
	media: ProductMedia;
	thumbnail?: { url: string; alt?: string | null } | null;
}) {
	const all = (media && media.length ? media : []).length ? media : thumbnail ? [thumbnail] : [];
	const [index, setIndex] = useState(0);

	if (!all.length) {
		return (
			<div className="relative w-full">
				<div className="relative aspect-square w-full overflow-hidden rounded bg-neutral-50">
					<div className="flex h-full w-full items-center justify-center border border-dashed border-neutral-300">
						<ImageOff aria-hidden className="h-10 w-10 text-neutral-400" />
						<span className="sr-only">Sin imagen disponible</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<div className="flex flex-col justify-center gap-3">
				{all.map((m, i) => (
					<button
						key={`${m.url}-${i}`}
						type="button"
						className={`relative h-12 w-12 overflow-hidden rounded border ${
							i === index ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200"
						}`}
						onClick={() => setIndex(i)}
						aria-label={`thumbnail-${i + 1}`}
					>
						<Image src={m.url} alt={m.alt || ""} fill sizes="48px" className="object-cover" />
					</button>
				))}
			</div>
			<div className="min-w-0 flex-1">
				<div className="relative aspect-square overflow-hidden rounded bg-neutral-50">
					<Image
						src={all[index]!.url}
						alt={all[index]!.alt || ""}
						fill
						sizes="(max-width: 1024px) 100vw, 768px"
						className="object-contain p-2"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
