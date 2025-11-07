// Removed unused Link/Image imports after vendor credit removal
import { draftMode } from "next/headers";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { WarehouseSelect } from "@/ui/components/WarehouseSelect";

export async function Footer({ channel }: { channel: string }) {
	const { isEnabled } = await draftMode();

	let footerLinks = null;
	try {
		footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
			variables: { slug: "footer", channel },
			...(isEnabled ? { cache: "no-store" as RequestCache } : { revalidate: 60 * 60 * 24 }),
		});
	} catch (error) {
		console.error("Error loading footer menu:", error);
	}

	let channels = null;
	if (process.env.SALEOR_APP_TOKEN) {
		try {
			channels = await executeGraphQL(ChannelsListDocument, {
				withAuth: false, // disable cookie-based auth for this call
				headers: {
					// and use app token instead
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			});
		} catch (error) {
			console.error("Error loading channels:", error);
		}
	}

	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-3 gap-8 py-16">
					{footerLinks?.menu?.items?.map((item) => {
						return (
							<div key={item.id}>
								<h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
								<ul className="mt-4 space-y-4 [&>li]:text-neutral-500">
									{item.children?.map((child) => {
										if (child.category) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={`/categories/${child.category.slug}`}>
														{child.category.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={`/collections/${child.collection.slug}`}>
														{child.collection.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={`/pages/${child.page.slug}`}>
														{child.page.title}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={child.url}>{child.name}</LinkWithChannel>
												</li>
											);
										}
										return null;
									})}
								</ul>
							</div>
						);
					})}
				</div>

				{channels?.channels && (
					<div className="mb-4 text-neutral-500">
						<label>
							<span className="text-sm">Cambiar moneda:</span> <ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				<div className="mb-4 text-neutral-500">
					<WarehouseSelect />
				</div>

				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} Ágora.</p>
					{/* Removed vendor credit per request */}
				</div>
			</div>
		</footer>
	);
}
