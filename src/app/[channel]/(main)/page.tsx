import { draftMode } from "next/headers";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { Hero } from "@/ui/components/Hero";
import { SectionsShowcase } from "@/ui/components/SectionsShowcase";
import { VehicleSelectorBanner } from "@/ui/components/VehicleSelectorBanner";

export const metadata = {
	title: "Toyota Refacciones",
	description: "Refacciones originales Toyota para todos los modelos y años.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const homeCollectionSlug = process.env.NEXT_PUBLIC_HOME_COLLECTION_SLUG || "featured-products";

	let isEnabled = false;
	try {
		const draft = await draftMode();
		isEnabled = draft.isEnabled;
	} catch (error) {
		// draftMode puede fallar en algunos contextos, continuar sin draft mode
		console.warn("[Home/Page] Error getting draft mode:", error);
	}

	let data;
	try {
		console.log("[Home/Page] Payload", {
			operation: "ProductListByCollection",
			variables: { slug: homeCollectionSlug, channel: params.channel },
		});
		data = await executeGraphQL(ProductListByCollectionDocument, {
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
	} catch (error) {
		console.error("[Home/Page] Error loading products:", error);
		data = null;
	}

	if (!data?.collection?.products) {
		return (
			<>
				<Hero />
				<div className="mx-auto max-w-7xl px-6">
					<VehicleSelectorBanner />
					<div className="mx-auto max-w-7xl p-8 pb-16">
						<p className="text-center text-gray-500">No se pudieron cargar los productos en este momento.</p>
					</div>
				</div>
			</>
		);
	}

	const products = data.collection.products.edges.map(({ node: product }) => product);

	return (
		<>
			<Hero />
			<div className="mx-auto max-w-7xl px-6">
				<VehicleSelectorBanner />
				{/* Sección de íconos destacados estilo marketplace */}
				<div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 sm:grid-cols-3 lg:grid-cols-5">
					{[
						{ title: "Envío Rápido" },
						{ title: "Refacciones Originales" },
						{ title: "Promociones Exclusivas" },
						{ title: "Instalación Disponible" },
						{ title: "Garantía Toyota" },
					].map((item) => (
						<div
							key={item.title}
							className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-100"
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB0A1E]/10 text-[#EB0A1E]">
								★
							</div>
							<p className="text-sm font-semibold text-neutral-800">{item.title}</p>
						</div>
					))}
				</div>
			</div>
			<SectionsShowcase channel={params.channel} />
			<section className="mx-auto max-w-7xl p-8 pb-16">
				<h2 className="mb-6 text-2xl font-extrabold tracking-tight text-neutral-900">Ofertas destacadas</h2>
				<ProductList products={products} />
			</section>
		</>
	);
}
