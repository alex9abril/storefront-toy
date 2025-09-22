import edjsHTML from "editorjs-html";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import xss from "xss";
import { type WithContext, type Product } from "schema-dts";
import { VariantSelector } from "@/ui/components/VariantSelector";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { executeGraphQL } from "@/lib/graphql";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import {
	CheckoutAddLineDocument,
	ProductDetailsDocument,
	ProductListDocument,
	WarehousesDocument,
} from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { AvailabilityMessage } from "@/ui/components/AvailabilityMessage";
import { getSelectedWarehouseId, getWarehouseMode, getConfiguredWarehouseId } from "@/lib/warehouse";
import { WarehousePicker } from "@/ui/components/WarehousePicker";
import { QuantityPicker } from "@/ui/components/QuantityPicker";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: product.thumbnail
			? {
					images: [
						{
							url: product.thumbnail.url,
							alt: product.name,
						},
					],
				}
			: null,
	};
}

export async function generateStaticParams({ params }: { params?: { channel?: string } }) {
	const channel = params?.channel || process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 60,
		variables: { first: 20, channel },
		withAuth: false,
	});

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

const parser = edjsHTML();

export default async function Page(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	console.log("[Product/Page] Payload", {
		operation: "ProductDetails",
		variables: { slug: decodeURIComponent((await props.params).slug), channel: (await props.params).channel },
	});
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const firstImage = product.thumbnail;
	const description = product?.description ? parser.parse(JSON.parse(product?.description)) : null;

	const variants = product.variants;
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID);

	const warehouseMode = getWarehouseMode();
	const preselectedWarehouseId =
		warehouseMode === "single" ? await getConfiguredWarehouseId() : await getSelectedWarehouseId();
	let configuredWarehouseName: string | null = null;
	if (preselectedWarehouseId) {
		try {
			const data = await executeGraphQL(WarehousesDocument, { variables: { first: 100 }, withAuth: false });
			const edges = data.warehouses?.edges || [];
			configuredWarehouseName = edges.find((e) => e.node.id === preselectedWarehouseId)?.node.name || null;
			if (!configuredWarehouseName && process.env.NEXT_PUBLIC_WAREHOUSE_SLUG) {
				const bySlug = edges.find((e) => e.node.slug === process.env.NEXT_PUBLIC_WAREHOUSE_SLUG);
				configuredWarehouseName = bySlug?.node.name || null;
			}
			if (!configuredWarehouseName && process.env.NEXT_PUBLIC_WAREHOUSE_SLUG) {
				const humanized = process.env.NEXT_PUBLIC_WAREHOUSE_SLUG.split("-")
					.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
					.join(" ");
				configuredWarehouseName = humanized;
			}
		} catch {}
	}
	const variantStocksDebug = (variants || []).map((v) => ({
		variantId: v.id,
		name: v.name,
		stocks: (v.stocks || []).map((s) => ({ qty: s?.quantity, wh: s?.warehouse?.name, id: s?.warehouse?.id })),
	}));
	console.log(
		"[Product/Page] Warehouses",
		JSON.stringify(
			{
				warehouseMode,
				preselectedWarehouseId,
				variants: variantStocksDebug,
			},
			null,
			2,
		),
	);

	// Compute availability per selected warehouse; if selected not present, show 0
	const variantStocks = selectedVariant?.stocks || [];
	const uniqueWarehousesForVariant = Array.from(
		new Map(variantStocks.map((s) => [s.warehouse?.id, s.warehouse])).values(),
	).filter(Boolean) as { id: string; name: string }[];
	const effectiveVariantWarehouseId = preselectedWarehouseId || uniqueWarehousesForVariant[0]?.id;
	const availableAtSelected = effectiveVariantWarehouseId
		? variantStocks.find((s) => s?.warehouse?.id === effectiveVariantWarehouseId)?.quantity || 0
		: 0;

	async function setWarehouse(formData: FormData) {
		"use server";
		if (getWarehouseMode() === "single") {
			// Ignore changes in single mode; always use configured warehouse
			redirect(`/${params.channel}/products/${params.slug}`);
		}
		const id = formData.get("warehouseId") as string;
		if (!id) return;
		const { setSelectedWarehouseId } = await import("@/lib/warehouse");
		await setSelectedWarehouseId(id);
		redirect(`/${params.channel}/products/${params.slug}`);
	}

	async function addItem(formData?: FormData) {
		"use server";

		const channelFromForm = formData?.get("channel") as string | undefined;
		const channel = channelFromForm || params.channel;
		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(channel),
			channel,
		});
		if (!checkout) {
			console.error("Checkout.findOrCreate returned null", { channel: params.channel });
			return;
		}

		await Checkout.saveIdToCookie(channel, checkout.id);

		if (!selectedVariantID) {
			return;
		}

		// Enforce stock per selected warehouse using Saleor data
		const requested = formData?.get("quantity") ? Number(formData.get("quantity")) : 1;
		// Current quantity of this variant already in checkout
		const currentInCheckout = (checkout.lines || [])
			.filter((l) => l?.variant?.id === selectedVariantID)
			.reduce((sum, l) => sum + (l?.quantity || 0), 0);
		const allowedToAdd = Math.max(0, (availableAtSelected || 0) - currentInCheckout);
		if (allowedToAdd <= 0) {
			// Set flash message and exit
			(await cookies()).set(
				"pdp-flash",
				JSON.stringify({ type: "warning", message: "Ya agregaste la cantidad disponible en este almacén." }),
				{ path: "/", maxAge: 10 },
			);
			console.error("No stock available to add for variant in selected warehouse", {
				selectedVariantID,
				availableAtSelected,
				currentInCheckout,
			});
			return;
		}
		const quantity = Math.min(requested, allowedToAdd);
		if (requested > allowedToAdd) {
			(await cookies()).set(
				"pdp-flash",
				JSON.stringify({
					type: "warning",
					message: `Solo se agregaron ${quantity} unidades (máximo disponible).`,
				}),
				{ path: "/", maxAge: 10 },
			);
		}

		// Add line to checkout; log errors if mutation fails
		const result = await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkout.id,
				productVariantId: decodeURIComponent(selectedVariantID),
				quantity,
			},
			cache: "no-store",
			withAuth: false,
			useAppToken: false,
		});

		const errors = result.checkoutLinesAdd?.errors;
		if (errors && Array.isArray(errors) && errors.length) {
			console.error("checkoutLinesAdd errors", errors);
			return;
		}

		revalidatePath("/cart");
	}

	const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

	const price = selectedVariant?.pricing?.price?.gross
		? formatMoney(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
		: isAvailable
			? formatMoneyRange({
					start: product?.pricing?.priceRange?.start?.gross,
					stop: product?.pricing?.priceRange?.stop?.gross,
				})
			: "";

	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: product.thumbnail?.url,
		...(selectedVariant
			? {
					name: `${product.name} - ${selectedVariant.name}`,
					description: product.seoDescription || `${product.name} - ${selectedVariant.name}`,
					offers: {
						"@type": "Offer",
						availability: selectedVariant.quantityAvailable
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: selectedVariant.pricing?.price?.gross.currency,
						price: selectedVariant.pricing?.price?.gross.amount,
					},
				}
			: {
					name: product.name,

					description: product.seoDescription || product.name,
					offers: {
						"@type": "AggregateOffer",
						availability: product.variants?.some((variant) => variant.quantityAvailable)
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: product.pricing?.priceRange?.start?.gross.currency,
						lowPrice: product.pricing?.priceRange?.start?.gross.amount,
						highPrice: product.pricing?.priceRange?.stop?.gross.amount,
					},
				}),
	};

	return (
		<section className="mx-auto grid max-w-7xl p-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-8">
				<div className="md:col-span-1 lg:col-span-5">
					{firstImage && (
						<ProductImageWrapper
							priority={true}
							alt={firstImage.alt ?? ""}
							width={1024}
							height={1024}
							src={firstImage.url}
						/>
					)}
				</div>
				<div className="flex flex-col pt-6 sm:col-span-1 sm:px-6 sm:pt-0 lg:col-span-3 lg:pt-16">
					<div>
						<h1 className="mb-6 flex-auto text-3xl font-medium tracking-tight text-neutral-900">
							{product?.name}
						</h1>
						{description && (
							<div className="mb-6 space-y-6 text-sm text-neutral-500">
								{description.map((content) => (
									<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
								))}
							</div>
						)}
						<p
							className="mb-6 text-sm"
							style={{ fontSize: "2rem", fontWeight: 200 }}
							data-testid="ProductElement_Price"
						>
							{price}
						</p>
						{/* Warehouse selector (por producto) */}
						{(() => {
							const allStocks =
								selectedVariant?.stocks || product.variants?.flatMap((v) => v.stocks || []) || [];
							const uniqueWarehouses = Array.from(
								new Map(allStocks.map((s) => [s.warehouse?.id, s.warehouse])).values(),
							).filter(Boolean) as { id: string; name: string }[];
							if (!uniqueWarehouses.length) return null;

							let filtered = uniqueWarehouses;
							let effectiveSelectedId = preselectedWarehouseId || uniqueWarehouses[0]!.id;

							if (warehouseMode === "single") {
								// In single mode, force showing the configured warehouse even if not in stocks
								const contains = preselectedWarehouseId
									? uniqueWarehouses.some((w) => w.id === preselectedWarehouseId)
									: false;
								if (preselectedWarehouseId && !contains) {
									// Mostrar siempre el nombre del env/slug si no está en stocks
									filtered = [
										{
											id: preselectedWarehouseId,
											name:
												configuredWarehouseName ||
												(process.env.NEXT_PUBLIC_WAREHOUSE_SLUG
													? process.env.NEXT_PUBLIC_WAREHOUSE_SLUG.split("-")
															.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
															.join(" ")
													: ""),
										},
									];
								} else if (preselectedWarehouseId) {
									filtered = uniqueWarehouses.filter((w) => w.id === preselectedWarehouseId);
								}
								effectiveSelectedId = preselectedWarehouseId || filtered[0]!.id;
							} else {
								// all mode: keep list as-is; select cookie/configured if present
								const contains = preselectedWarehouseId
									? uniqueWarehouses.some((w) => w.id === preselectedWarehouseId)
									: false;
								effectiveSelectedId = contains ? preselectedWarehouseId! : uniqueWarehouses[0]!.id;
							}

							console.log(
								"[Product/Page] WarehouseSelect",
								JSON.stringify(
									{
										env: {
											mode: process.env.NEXT_PUBLIC_WAREHOUSE_MODE,
											id: process.env.NEXT_PUBLIC_WAREHOUSE_ID,
											slug: process.env.NEXT_PUBLIC_WAREHOUSE_SLUG,
										},
										cookieSelected: preselectedWarehouseId,
										warehouseMode,
										uniqueWarehouses: uniqueWarehouses.map((w) => ({ id: w.id, name: w.name })),
										filtered: filtered.map((w) => ({ id: w.id, name: w.name })),
										effectiveSelectedId,
									},
									null,
									2,
								),
							);

							return (
								<WarehousePicker
									warehouses={filtered}
									selectedId={effectiveSelectedId}
									action={setWarehouse}
								/>
							);
						})()}

						<QuantityPicker
							value={1}
							available={availableAtSelected}
							action={addItem}
							channel={params.channel}
						/>

						{variants && (
							<VariantSelector
								selectedVariant={selectedVariant}
								variants={variants}
								product={product}
								channel={params.channel}
							/>
						)}
						<AvailabilityMessage isAvailable={isAvailable} />
					</div>
				</div>
			</div>
		</section>
	);
}
