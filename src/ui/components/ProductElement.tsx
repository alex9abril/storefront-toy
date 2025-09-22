import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	return (
		<li data-testid="ProductElement" className="card p-6">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="flex flex-col gap-4">
					{product?.thumbnail?.url && (
						<div className="rounded-xl bg-neutral-100 p-4">
							<ProductImageWrapper
								loading={loading}
								src={product.thumbnail.url}
								alt={product.thumbnail.alt ?? ""}
								width={768}
								height={512}
								sizes={"768px"}
								priority={priority}
							/>
						</div>
					)}
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="chip mb-3">{product.category?.name}</div>
							<h3 className="text-3xl font-semibold tracking-tight text-neutral-900">{product.name}</h3>
							<p className="mt-2 text-sm text-neutral-600" data-testid="ProductElement_Category">
								{/* Placeholder for tagline/short description if present */}
							</p>
						</div>
						<button className="btn-outline">ESTRENA</button>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<button className="btn-dark">EXPLORAR</button>
						<p className="text-sm font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
							{formatMoneyRange(
								product?.pricing?.priceRange
									? {
											start: product.pricing.priceRange.start?.gross
												? {
														amount: product.pricing.priceRange.start.gross.amount,
														currency: product.pricing.priceRange.start.gross.currency,
													}
												: null,
											stop: null,
										}
									: null,
							)}
						</p>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
