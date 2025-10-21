import Link from "next/link";
import Image from "next/image";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";

export const metadata = {
	title: "Checkout · Tienda",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await props.searchParams;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	function humanizeSlug(input: string): string {
		const cleaned = (input || "").replace(/^\|\s*/, "");
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

	return (
		<div className="min-h-dvh bg-white">
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-8">
				<div className="flex items-center font-bold">
					<Link aria-label="homepage" href="/">
						<div className="mt-2 flex items-center gap-2 leading-none">
							<Image src="/toyota.png" alt="Toyota" width={45} height={45} />
							<span className="leading-none">{companyName}</span>
						</div>
					</Link>
				</div>
				<h1 className="mt-8 text-3xl font-bold text-neutral-900">Revisa y confirma tu pedido</h1>

				<section className="mb-12 mt-6 flex-1">
					<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
				</section>
			</section>
		</div>
	);
}
