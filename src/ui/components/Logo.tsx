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
		<div className="mt-2 flex w-[200px] items-center gap-2 font-bold leading-none">
			<Image src="/toyota.png" alt="Toyota" width={45} height={45} />
			<span className="leading-none text-gray-800">{companyName}</span>
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
