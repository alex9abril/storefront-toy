"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
	const slides = [
		{ image: "/hero-corolla.jpg", title: "COROLLA", subtitle: "Accesorios y refacciones originales" },
		{ image: "/hero-hilux.jpg", title: "HILUX", subtitle: "Trabajo pesado con garantía Toyota" },
		{ image: "/hero-prius.jpg", title: "PRIUS", subtitle: "Tecnología híbrida con repuestos oficiales" },
	];
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
		return () => clearInterval(id);
	}, [slides.length]);

	const current = slides[index];

	return (
		<section className="relative isolate overflow-hidden bg-neutral-900">
			<div
				className="absolute inset-0 -z-10 bg-cover bg-center opacity-60 transition-[background-image] duration-700"
				style={{ backgroundImage: `url('${current.image}')` }}
			/>
			<div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-24">
				<div className="max-w-2xl">
					<p className="text-xs font-semibold tracking-[0.2em] text-neutral-200">ACCESORIOS Y REFACCIONES</p>
					<h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
						EQUIPA TU TOYOTA
						<span className="ml-2 inline-block rounded bg-white px-2 py-1 text-2xl font-black text-[#EB0A1E] sm:text-3xl lg:text-4xl">
							HASTA -30%
						</span>
					</h1>
					<p className="mt-4 text-neutral-200 sm:text-lg">
						{current.subtitle}. Refacciones originales y accesorios.
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Link
							className="inline-flex items-center justify-center rounded-lg bg-[#EB0A1E] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 focus:ring-2 focus:ring-red-300"
							href="/products"
						>
							Ver Refacciones
						</Link>
						<Link
							className="inline-flex items-center justify-center rounded-lg border border-white/80 px-5 py-3 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white/10"
							href="/collections/los-mas-vendidos"
						>
							Explorar Accesorios
						</Link>
					</div>
				</div>
				<div className="mt-10 hidden flex-1 justify-end lg:flex">
					{/* Indicadores del carrusel */}
					<div className="flex items-center gap-2 self-end pb-2 pr-2">
						{slides.map((_, i) => (
							<span key={i} className={`h-2 w-6 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
