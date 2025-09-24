import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";
import { getWarehouseMode, getConfiguredWarehouseId } from "@/lib/warehouse";

export const ProductList = async ({ products }: { products: readonly ProductListItemFragment[] }) => {
	// En modo single, ocultar productos sin stock en el almacén configurado
	let visible = products ;
	if (getWarehouseMode() === "single") {
		const configuredId = await getConfiguredWarehouseId();
		if (configuredId) {
			visible = products.filter((p) => {
				const variants = p.variants || [];
				return variants.some((v) =>
					(v?.stocks || []).some((s) => s?.warehouse?.id === configuredId && (s?.quantity ?? 0) > 0),
				);
			});
		}
	}
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{visible.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					priority={index < 2}
					loading={index < 3 ? "eager" : "lazy"}
				/>
			))}
		</ul>
	);
};
