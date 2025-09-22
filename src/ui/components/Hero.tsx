import Link from "next/link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-neutral-900">
			<div
				className="absolute inset-0 -z-10 bg-cover bg-center opacity-60"
				style={{ backgroundImage: "url('/imagen-2.jpg')" }}
			/>
			<div className="mx-auto max-w-7xl px-6 py-24 lg:flex lg:items-center lg:gap-12 lg:px-8">
				<div className="max-w-2xl">
					<p className="text-sm tracking-widest text-neutral-300">NUESTROS MODELOS</p>
					<h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						Descubre tu Toyota
					</h1>
					<p className="mt-4 text-neutral-300">
						Explora nuestra familia de productos y accesorios originales.
					</p>
					<div className="mt-8 flex items-center gap-4">
						<Link className="btn-primary" href="/products">
							Explorar productos
						</Link>
						<Link className="link-primary" href="/collections/los-mas-vendidos">
							Los más vendidos
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
