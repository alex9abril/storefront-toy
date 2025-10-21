"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
	const slides = [
		{
			image: "/wallpapers/mg-gr-yaris-circuit-package-taller-limpio.jpeg",
			title: "MANTENIMIENTO ESENCIAL",
			subtitle: "Kits de servicio originales con 20% de descuento",
			description:
				"Prolonga la vida útil de tu vehículo con refacciones y lubricantes de la más alta calidad.",
			cta1: "Ver Kits de Mantenimiento",
			cta2: "Agendar Servicio",
			cta1Link: "/collections/kits-mantenimiento",
			cta2Link: "/servicios",
			badge: "20% OFF",
		},
		{
			image: "/wallpapers/istockphoto-1193247877-1024x1024.jpg",
			title: "POTENCIA Y SEGURIDAD",
			subtitle: "Frenos y Suspensión: ¡Hasta 25% OFF!",
			description: "Encuentra las refacciones que garantizan el máximo control y estabilidad en tu camino.",
			cta1: "Comprar Frenos",
			cta2: "Explorar Suspensión",
			cta1Link: "/collections/frenos",
			cta2Link: "/collections/suspension",
			badge: "25% OFF",
		},
		{
			image: "/wallpapers/pexels-pavel-danilyuk-6407523.jpg",
			title: "TU REFACCIÓN A UN CLIC",
			subtitle: "Miles de refacciones originales disponibles para envío inmediato",
			description:
				"Utiliza nuestro buscador avanzado o consulta por modelo para encontrar exactamente lo que necesitas.",
			cta1: "Buscar por Modelo",
			cta2: "Ver Catálogo Completo",
			cta1Link: "/buscar-por-modelo",
			cta2Link: "/catalogo",
			badge: "ENVÍO INMEDIATO",
		},
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
					<p className="text-xs font-semibold tracking-[0.2em] text-neutral-200">
						REFACCIONES ORIGINALES TOYOTA
					</p>
					<h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
						{current.title}
						<span className="ml-2 inline-block rounded bg-white px-2 py-1 text-2xl font-black text-[#EB0A1E] sm:text-3xl lg:text-4xl">
							{current.badge}
						</span>
					</h1>
					<p className="mt-4 text-lg font-semibold text-yellow-300 sm:text-xl">{current.subtitle}</p>
					<p className="mt-4 text-neutral-200 sm:text-lg">{current.description}</p>
					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Link
							className="inline-flex items-center justify-center rounded-lg bg-[#EB0A1E] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 focus:ring-2 focus:ring-red-300"
							href={current.cta1Link}
						>
							{current.cta1}
						</Link>
						<Link
							className="inline-flex items-center justify-center rounded-lg border border-white/80 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white/10"
							href={current.cta2Link}
						>
							{current.cta2}
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
