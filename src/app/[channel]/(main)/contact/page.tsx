import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "Contacto - Refacciones Toyota",
	description: "Contáctanos para cualquier consulta sobre refacciones Toyota. Estamos aquí para ayudarte.",
};

export default async function ContactPage(_props: { params: Promise<{ channel: string }> }) {
	return (
		<div className="mx-auto max-w-7xl px-6 py-16">
			<div className="text-center">
				<h1 className="mb-4 text-4xl font-bold text-gray-900">Contacto</h1>
				<p className="mb-8 text-lg text-gray-600">
					Contáctanos para cualquier consulta sobre refacciones Toyota. Estamos aquí para ayudarte.
				</p>

				<div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
					{/* Información de contacto */}
					<div className="rounded-lg bg-gray-50 p-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Información de Contacto</h2>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<svg className="h-5 w-5 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<span className="text-gray-700">+52 (55) 1234-5678</span>
							</div>
							<div className="flex items-center gap-3">
								<svg className="h-5 w-5 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
								<span className="text-gray-700">contacto@toyota-refacciones.com</span>
							</div>
							<div className="flex items-center gap-3">
								<svg className="h-5 w-5 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="text-gray-700">Ciudad de México, México</span>
							</div>
						</div>
					</div>

					{/* Horarios */}
					<div className="rounded-lg bg-gray-50 p-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Horarios de Atención</h2>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Lunes - Viernes</span>
								<span className="font-medium text-gray-900">8:00 AM - 6:00 PM</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Sábados</span>
								<span className="font-medium text-gray-900">9:00 AM - 2:00 PM</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Domingos</span>
								<span className="font-medium text-gray-900">Cerrado</span>
							</div>
						</div>
					</div>
				</div>

				{/* Mensaje de contacto */}
				<div className="mx-auto mt-12 max-w-2xl rounded-lg border border-gray-200 bg-white p-8">
					<h2 className="mb-4 text-xl font-semibold text-gray-900">Envíanos un Mensaje</h2>
					<p className="mb-6 text-gray-600">
						¿Tienes alguna pregunta sobre refacciones Toyota? Estamos aquí para ayudarte.
					</p>
					<div className="inline-block rounded-md bg-[#EB0A1E] px-6 py-3 text-white">
						<span className="font-medium">Próximamente: Formulario de contacto</span>
					</div>
				</div>
			</div>
		</div>
	);
}
