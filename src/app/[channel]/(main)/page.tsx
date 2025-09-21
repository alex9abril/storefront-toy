import { draftMode } from "next/headers";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { Hero } from "@/ui/components/Hero";

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const homeCollectionSlug = process.env.NEXT_PUBLIC_HOME_COLLECTION_SLUG || "featured-products";
	const { isEnabled } = await draftMode();
	console.log("[Home/Page] Payload", {
		operation: "ProductListByCollection",
		variables: { slug: homeCollectionSlug, channel: (await props.params).channel },
	});
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: homeCollectionSlug,
			channel: params.channel,
		},
		...(isEnabled ? { cache: "no-store" as RequestCache } : { revalidate: 60 }),
	});

	console.log("[Home/Page] GraphQL response", {
		collectionSlug: homeCollectionSlug,
		channel: params.channel,
		total: data.collection?.products?.edges?.length ?? null,
		firstNames: data.collection?.products?.edges?.map((e) => e.node.name).slice(0, 5),
	});

	if (!data.collection?.products) {
		return null;
	}

	const products = data.collection?.products.edges.map(({ node: product }) => product);

	return (
		<>
			<Hero />
			<section className="mx-auto max-w-7xl p-8 pb-16">
				<h2 className="sr-only">Product list</h2>
				<ProductList products={products} />
			</section>
		</>
	);
}
