import { cookies } from "next/headers";
import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function getIdFromCookies(channel: string) {
	const cookieName = `checkoutId-${channel}`;
	const checkoutId = (await cookies()).get(cookieName)?.value || "";
	return checkoutId;
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function find(checkoutId: string) {
	try {
		const { checkout } = checkoutId
			? await executeGraphQL(CheckoutFindDocument, {
					variables: {
						id: checkoutId,
					},
					cache: "no-cache",
					withAuth: false,
					useAppToken: false,
				})
			: { checkout: null };

		return checkout;
	} catch {
		// we ignore invalid ID or checkout not found
	}
}

export async function findOrCreate({ channel, checkoutId }: { checkoutId?: string; channel: string }) {
	if (!checkoutId) {
		const created = await create({ channel });
		if (created.checkoutCreate?.checkout) {
			return created.checkoutCreate.checkout;
		}
		console.error("checkoutCreate errors:", created.checkoutCreate?.errors);
		return null;
	}
	const checkout = await find(checkoutId);
	if (checkout) return checkout;
	const created = await create({ channel });
	if (created.checkoutCreate?.checkout) {
		return created.checkoutCreate.checkout;
	}
	console.error("checkoutCreate errors:", created.checkoutCreate?.errors);
	return null;
}

export const create = ({ channel }: { channel: string }) =>
	executeGraphQL(CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { channel },
		withAuth: false,
		useAppToken: false,
	});
