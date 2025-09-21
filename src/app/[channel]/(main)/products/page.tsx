import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";
import { ProductsFilters } from "@/ui/components/ProductsFilters";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor: string | string[] | undefined;
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const { isEnabled } = await draftMode();
	console.log("[Products/Page] Payload", {
		operation: "ProductListPaginated",
		variables: { first: ProductsPerPage, after: cursor, channel: (await props.params).channel },
	});

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: cursor,
			channel: params.channel,
		},
		...(isEnabled ? { cache: "no-store" as RequestCache } : { revalidate: 60 }),
	});

	if (!products) {
		notFound();
	}
	console.log("[Products/Page] GraphQL response", {
		channel: params.channel,
		pageSize: ProductsPerPage,
		total: products.edges.length,
		firstNames: products.edges.map((e) => e.node.name).slice(0, 5),
	});

	const newSearchParams = new URLSearchParams({
		...(products.pageInfo.endCursor && { cursor: products.pageInfo.endCursor }),
	});

	return (
		<section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-8 pb-16 lg:grid-cols-12">
			<div className="lg:col-span-3">
				<ProductsFilters />
			</div>
			<div className="lg:col-span-9">
				<h2 className="sr-only">Product list</h2>
				<ProductList products={products.edges.map((e) => e.node)} />
				<Pagination
					pageInfo={{
						...products.pageInfo,
						basePathname: `/products`,
						urlSearchParams: newSearchParams,
					}}
				/>
			</div>
		</section>
	);
}
