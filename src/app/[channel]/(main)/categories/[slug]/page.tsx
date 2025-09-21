import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import {
	getCategoryId,
	listProductsByCategory,
	listProductsByCategoryNoChannel,
} from "@/lib/utils/listProductsByCategory";
import { type ProductListByCategoryQuery, type ProductListByCategory_NoChannelArgQuery } from "@/gql/graphql";
import { ProductList } from "@/ui/components/ProductList";

export const generateMetadata = async (
	props: { params: Promise<{ slug: string; channel: string }> },
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const params = await props.params;
	return {
		title: `${params.slug} | ${(await parent).title?.absolute}`,
		description: params.slug,
	};
};

export default async function Page(props: { params: Promise<{ slug: string; channel: string }> }) {
	const params = await props.params;
	const categoryId = await getCategoryId(params.slug);
	if (!categoryId) {
		notFound();
	}
	type ProductsConnection = NonNullable<ProductListByCategoryQuery["products"]>;
	type ProductsEdges = ProductsConnection["edges"];

	let productsConn: ProductsConnection | null = null;
	try {
		const dataA = await listProductsByCategory(categoryId, params.channel, 100);
		productsConn = dataA.products ?? null;
	} catch {
		const dataB: ProductListByCategory_NoChannelArgQuery = await listProductsByCategoryNoChannel(
			params.slug,
			100,
		);
		if (dataB.category?.products) {
			// Re-shape to expected connection
			productsConn = {
				totalCount: dataB.category.products.totalCount,
				edges: dataB.category.products.edges.map((edge) => ({ node: edge.node })),
			} as ProductsConnection;
		}
	}

	const products: ProductsConnection =
		productsConn ?? ({ totalCount: 0, edges: [] as ProductsEdges } as ProductsConnection);

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="pb-8 text-xl font-semibold">{params.slug}</h1>
			{products.totalCount === 0 ? (
				<p className="text-sm text-neutral-500">No hay productos en esta categoría</p>
			) : (
				<ProductList products={products.edges.map((e) => e.node)} />
			)}
		</div>
	);
}
