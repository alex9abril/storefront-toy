import Link from "next/link";
import { Boxes, ShoppingBag, Wrench } from "lucide-react";

function Card({
	title,
	description,
	href,
	Icon,
}: {
	title: string;
	description: string;
	href: string;
	Icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<div className="card flex flex-col justify-between p-6">
			<div className="flex items-center gap-3">
				<div className="rounded-full bg-neutral-100 p-3">
					<Icon className="h-5 w-5 text-neutral-700" />
				</div>
				<h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
			</div>
			<p className="mt-3 text-sm text-neutral-600">{description}</p>
			<div className="mt-6">
				<Link className="btn-dark" href={href}>
					Explorar
				</Link>
			</div>
		</div>
	);
}

export function SectionsShowcase({ channel }: { channel: string }) {
	return (
		<section className="mx-auto max-w-7xl p-8">
			<h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Explora por secciones</h2>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<Card
					title="Refacciones"
					description="Encuentra repuestos originales para mantener tu Toyota como nuevo."
					href={`/${channel}/categories/refacciones-toyota`}
					Icon={Wrench}
				/>
				<Card
					title="Accesorios"
					description="Personaliza tu vehículo con accesorios oficiales."
					href={`/${channel}/categories/accesorios-toyota`}
					Icon={ShoppingBag}
				/>
				<Card
					title="Más categorías"
					description="Explora todo el catálogo disponible en tu canal."
					href={`/${channel}/products`}
					Icon={Boxes}
				/>
			</div>
		</section>
	);
}
