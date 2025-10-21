import Image from "next/image";
import { CheckoutLink } from "./CheckoutLink";
import { DeleteLineButton } from "./DeleteLineButton";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const metadata = {
	title: "Carrito",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<section className="mx-auto max-w-7xl p-8">
				<div className="flex flex-col items-center justify-center py-16 text-center">
					{/* Icono de carrito vacío */}
					<div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-neutral-100">
						<svg className="h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6M17 18a2 2 0 100 4 2 2 0 000-4zM9 18a2 2 0 100 4 2 2 0 000-4z"
							/>
						</svg>
					</div>

					<h1 className="mb-4 text-3xl font-bold text-neutral-900">Tu carrito está vacío</h1>
					<p className="mb-8 text-lg text-neutral-500">Aún no has agregado artículos al carrito.</p>

					<LinkWithChannel
						href="/products"
						className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						Explorar productos
					</LinkWithChannel>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="mt-8 text-3xl font-bold text-neutral-900">Tu carrito</h1>
			<form className="mt-12">
				<ul
					data-testid="CartProductList"
					role="list"
					className="divide-y divide-neutral-200 border-b border-t border-neutral-200"
				>
					{checkout.lines.map((item) => (
						<li key={item.id} className="flex py-4">
							<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 sm:h-32 sm:w-32">
								{item.variant?.product?.thumbnail?.url && (
									<Image
										src={item.variant.product.thumbnail.url}
										alt={item.variant.product.thumbnail.alt ?? ""}
										width={200}
										height={200}
										className="h-full w-full object-contain object-center"
									/>
								)}
							</div>
							<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
								<div className="flex justify-between justify-items-start gap-4">
									<div>
										<LinkWithChannel
											href={getHrefForVariant({
												productSlug: item.variant.product.slug,
												variantId: item.variant.id,
											})}
										>
											<h2 className="font-medium text-neutral-700">{item.variant?.product?.name}</h2>
										</LinkWithChannel>
										<p className="mt-1 text-sm text-neutral-500">{item.variant?.product?.category?.name}</p>
										{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
											<p className="mt-1 text-sm text-neutral-500">Variante: {item.variant.name}</p>
										)}
									</div>
									<p className="text-right font-semibold text-neutral-900">
										{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
									</p>
								</div>
								<div className="flex justify-between">
									<div className="text-sm font-bold">Cantidad: {item.quantity}</div>
									<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
								</div>
							</div>
						</li>
					))}
				</ul>

				<div className="mt-12">
					<div className="rounded border bg-neutral-50 px-4 py-2">
						<div className="flex items-center justify-between gap-2 py-2">
							<div>
								<p className="font-semibold text-neutral-900">Total</p>
								<p className="mt-1 text-sm text-neutral-500">El envío se calculará en el siguiente paso</p>
							</div>
							<div className="font-medium text-neutral-900">
								{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
							</div>
						</div>
					</div>
					<div className="mt-10 text-center">
						<CheckoutLink
							checkoutId={checkoutId}
							disabled={!checkout.lines.length}
							className="w-full sm:w-1/3"
						/>
					</div>
				</div>
			</form>
		</section>
	);
}
