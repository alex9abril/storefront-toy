import { cookies } from "next/headers";
import { executeGraphQL } from "@/lib/graphql";
import { WarehousesDocument } from "@/gql/graphql";

const COOKIE_KEY = "warehouseId";

export type WarehouseSelectionMode = "all" | "single";

export function getWarehouseMode(): WarehouseSelectionMode {
	const mode = process.env.NEXT_PUBLIC_WAREHOUSE_MODE?.toLowerCase();
	return mode === "single" ? "single" : "all";
}

export async function getConfiguredWarehouseId(): Promise<string | null> {
	const idOrSlug = process.env.NEXT_PUBLIC_WAREHOUSE_ID || null;
	const slugEnv = process.env.NEXT_PUBLIC_WAREHOUSE_SLUG || null;
	const data = await executeGraphQL(WarehousesDocument, { variables: { first: 100 }, withAuth: false });
	const edges = data.warehouses?.edges || [];
	if (idOrSlug) {
		const byId = edges.find((e) => e.node.id === idOrSlug)?.node.id;
		if (byId) return byId;
		const bySlug = edges.find((e) => e.node.slug === idOrSlug)?.node.id;
		if (bySlug) return bySlug;
	}
	if (slugEnv) {
		const bySlug = edges.find((e) => e.node.slug === slugEnv)?.node.id;
		if (bySlug) return bySlug;
		const byId = edges.find((e) => e.node.id === slugEnv)?.node.id;
		if (byId) return byId;
	}
	return null;
}

export async function getSelectedWarehouseId(): Promise<string | null> {
	// In single mode, always honor the configured warehouse and ignore cookie
	if (getWarehouseMode() === "single") {
		return getConfiguredWarehouseId();
	}
	const cookie = (await cookies()).get(COOKIE_KEY)?.value || null;
	if (cookie) return cookie;
	return getConfiguredWarehouseId();
}

export async function setSelectedWarehouseId(id: string) {
	(await cookies()).set(COOKIE_KEY, id, { sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
}
