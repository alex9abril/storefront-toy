import {
	GetCategoryIdDocument,
	ProductListByCategoryDocument,
	ProductListByCategory_NoChannelArgDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function getCategoryId(slug: string): Promise<string | null> {
	const res = await executeGraphQL(GetCategoryIdDocument, {
		variables: { slug },
		revalidate: 60,
	});
	return res.category?.id ?? null;
}

export async function listProductsByCategory(categoryId: string, channel: string, first: number = 100) {
	try {
		return await executeGraphQL(ProductListByCategoryDocument, {
			variables: { category: categoryId, channel, first },
			revalidate: 60,
		});
	} catch (err) {
		// As a fallback, try the no-channel variant using slug-level query on the caller side if needed
		throw err;
	}
}

export async function listProductsByCategoryNoChannel(slug: string, first: number = 100) {
	return executeGraphQL(ProductListByCategory_NoChannelArgDocument, {
		variables: { slug, first },
		revalidate: 60,
	});
}
