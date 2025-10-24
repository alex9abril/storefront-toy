"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

function humanizeSlug(input: string): string {
	const cleaned = input.replace(/^\|\s*/, "");
	return cleaned
		.replace(/[-_]+/g, " ")
		.trim()
		.split(" ")
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ")
		.toUpperCase();
}

const mode = (process.env.NEXT_PUBLIC_WAREHOUSE_MODE || "all").toLowerCase();
const rawIdOrSlug = process.env.NEXT_PUBLIC_WAREHOUSE_ID || process.env.NEXT_PUBLIC_WAREHOUSE_SLUG || "";
const companyName = mode === "single" && rawIdOrSlug ? `${humanizeSlug(rawIdOrSlug)}` : "| TOYOTA";

export const Logo = () => {
	const pathname = usePathname();

	const content = (
		<div className="mt-1 flex w-[160px] items-center gap-1.5 font-bold leading-none sm:mt-2 sm:w-[200px] sm:gap-2">
			<Image src="/toyota.png" alt="Toyota" width={32} height={32} className="sm:h-[45px] sm:w-[45px]" />
			<span className="text-sm leading-none text-gray-800 sm:text-base">{companyName}</span>
		</div>
	);

	if (pathname === "/") {
		return (
			<h1 className="flex items-center" aria-label="homepage">
				{content}
			</h1>
		);
	}
	return (
		<div>
			<LinkWithChannel aria-label="homepage" href="/">
				{content}
			</LinkWithChannel>
		</div>
	);
};
