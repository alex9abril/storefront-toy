import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql";
import { getServerAuthClient } from "@/app/config";

type GraphQLErrorResponse = {
	errors: readonly {
		message: string;
	}[];
};

type GraphQLRespone<T> = { data: T } | GraphQLErrorResponse;

export async function executeGraphQL<Result, Variables>(
	operation: TypedDocumentString<Result, Variables>,
	options: {
		headers?: HeadersInit;
		cache?: RequestCache;
		revalidate?: number;
		withAuth?: boolean;
		useAppToken?: boolean;
	} & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables }),
): Promise<Result> {
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	const { variables, headers, cache, revalidate, withAuth = true, useAppToken = true } = options;

	const mergedHeaders = new Headers({ "Content-Type": "application/json" });
	if (useAppToken && process.env.SALEOR_APP_TOKEN) {
		mergedHeaders.set("Authorization", `Bearer ${process.env.SALEOR_APP_TOKEN}`);
	}
	if (headers) {
		const userHeaders = new Headers(headers);
		userHeaders.forEach((value, key) => mergedHeaders.set(key, value));
	}

	const input = {
		method: "POST",
		headers: mergedHeaders,
		body: JSON.stringify({
			query: operation.toString(),
			...(variables && { variables }),
		}),
		cache: cache,
		next: { revalidate },
	};

	let response = withAuth
		? await (await getServerAuthClient()).fetchWithAuth(process.env.NEXT_PUBLIC_SALEOR_API_URL, input)
		: await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);

	if (!response.ok) {
		const bodyText = await (async () => {
			try {
				return await response.text();
			} catch {
				return "";
			}
		})();
		// Retry once without auth if auth client produced an invalid request (e.g., empty body)
		if (withAuth && bodyText.includes("Must provide a query string")) {
			response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, input);
		}
		if (!response.ok) {
			console.error(input.body);
			throw new HTTPError(response, bodyText);
		}
	}

	const body = (await response.json()) as GraphQLRespone<Result>;

	if ("errors" in body) {
		throw new GraphQLError(body);
	}

	return body.data;
}

class GraphQLError extends Error {
	constructor(public errorResponse: GraphQLErrorResponse) {
		const message = errorResponse.errors.map((error) => error.message).join("\n");
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
class HTTPError extends Error {
	constructor(response: Response, body: string) {
		const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
