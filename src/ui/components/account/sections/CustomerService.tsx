"use client";

import { useState } from "react";

const supportOptions = [
	{
		id: "chat",
		title: "Chat en Vivo",
		description: "Habla con nuestro equipo de soporte en tiempo real",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
		),
		available: true,
		responseTime: "Respuesta inmediata",
	},
	{
		id: "phone",
		title: "Soporte Telefónico",
		description: "Llámanos para asistencia personalizada",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
				/>
			</svg>
		),
		available: true,
		responseTime: "Lun - Vie: 8:00 AM - 6:00 PM",
	},
	{
		id: "email",
		title: "Correo Electrónico",
		description: "Envía tu consulta por email",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
		),
		available: true,
		responseTime: "Respuesta en 24 horas",
	},
	{
		id: "ticket",
		title: "Crear Ticket",
		description: "Abre un ticket de soporte para seguimiento",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		),
		available: true,
		responseTime: "Respuesta en 2-4 horas",
	},
];

const faqItems = [
	{
		question: "¿Cómo puedo rastrear mi pedido?",
		answer:
			"Puedes rastrear tu pedido usando el número de seguimiento que recibiste por email, o accediendo a la sección 'Mis Pedidos' en tu cuenta.",
	},
	{
		question: "¿Cuáles son los métodos de pago disponibles?",
		answer:
			"Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, y transferencias bancarias.",
	},
	{
		question: "¿Cuánto tiempo tarda el envío?",
		answer:
			"Los envíos estándar tardan de 3-5 días hábiles. Los envíos express están disponibles y tardan 1-2 días hábiles.",
	},
	{
		question: "¿Puedo cambiar o cancelar mi pedido?",
		answer:
			"Puedes cancelar tu pedido dentro de las primeras 2 horas después de realizarlo. Para cambios, contáctanos inmediatamente.",
	},
	{
		question: "¿Qué hago si mi producto llega dañado?",
		answer: "Contáctanos inmediatamente con fotos del daño. Te enviaremos un reemplazo sin costo adicional.",
	},
];

export function CustomerService() {
	const [_selectedSupport, _setSelectedSupport] = useState<string | null>(null);
	const [showTicketForm, setShowTicketForm] = useState(false);
	const [ticketForm, setTicketForm] = useState({
		subject: "",
		category: "",
		priority: "medium",
		description: "",
	});

	const handleSupportClick = (id: string) => {
		if (id === "chat") {
			// Implementar chat en vivo
			console.log("Iniciar chat en vivo");
		} else if (id === "phone") {
			// Mostrar número de teléfono
			window.open("tel:+525512345678");
		} else if (id === "email") {
			// Abrir cliente de email
			window.open("mailto:soporte@toyota-refacciones.com");
		} else if (id === "ticket") {
			setShowTicketForm(true);
		}
	};

	const handleSubmitTicket = () => {
		// Implementar envío de ticket
		console.log("Enviar ticket:", ticketForm);
		setShowTicketForm(false);
		setTicketForm({
			subject: "",
			category: "",
			priority: "medium",
			description: "",
		});
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Servicio al Cliente</h2>
				<p className="mt-2 text-gray-600">Estamos aquí para ayudarte con cualquier consulta</p>
			</div>

			{/* Opciones de soporte */}
			<div className="mb-8">
				<h3 className="mb-4 text-lg font-semibold text-gray-900">¿Cómo podemos ayudarte?</h3>
				<div className="grid gap-4 md:grid-cols-2">
					{supportOptions.map((option) => (
						<div
							key={option.id}
							className={`cursor-pointer rounded-lg border p-6 transition-colors ${
								selectedSupport === option.id
									? "border-[#EB0A1E] bg-red-50"
									: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
							}`}
							onClick={() => handleSupportClick(option.id)}
						>
							<div className="flex items-start gap-4">
								<div className={`${option.available ? "text-[#EB0A1E]" : "text-gray-400"}`}>
									{option.icon}
								</div>
								<div className="flex-1">
									<h4 className="text-lg font-semibold text-gray-900">{option.title}</h4>
									<p className="mt-1 text-sm text-gray-600">{option.description}</p>
									<p className="mt-2 text-xs text-gray-500">{option.responseTime}</p>
									{option.available && (
										<span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
											Disponible
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Formulario de ticket */}
			{showTicketForm && (
				<div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Crear Ticket de Soporte</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Asunto</label>
							<input
								type="text"
								value={ticketForm.subject}
								onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Describe brevemente tu consulta"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Categoría</label>
							<select
								value={ticketForm.category}
								onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							>
								<option value="">Seleccionar categoría</option>
								<option value="pedido">Consulta sobre pedido</option>
								<option value="producto">Consulta sobre producto</option>
								<option value="envio">Problema con envío</option>
								<option value="pago">Problema con pago</option>
								<option value="cuenta">Problema con cuenta</option>
								<option value="otro">Otro</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Prioridad</label>
							<select
								value={ticketForm.priority}
								onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							>
								<option value="low">Baja</option>
								<option value="medium">Media</option>
								<option value="high">Alta</option>
								<option value="urgent">Urgente</option>
							</select>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Descripción</label>
							<textarea
								value={ticketForm.description}
								onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
								rows={4}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Describe tu consulta o problema en detalle..."
							/>
						</div>
					</div>
					<div className="mt-4 flex gap-3">
						<button
							onClick={handleSubmitTicket}
							className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
						>
							Enviar Ticket
						</button>
						<button
							onClick={() => setShowTicketForm(false)}
							className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancelar
						</button>
					</div>
				</div>
			)}

			{/* Preguntas frecuentes */}
			<div className="mb-8">
				<h3 className="mb-4 text-lg font-semibold text-gray-900">Preguntas Frecuentes</h3>
				<div className="space-y-4">
					{faqItems.map((faq, index) => (
						<div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
							<h4 className="font-semibold text-gray-900">{faq.question}</h4>
							<p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
						</div>
					))}
				</div>
			</div>

			{/* Información de contacto */}
			<div className="rounded-lg bg-[#EB0A1E] p-6 text-white">
				<h3 className="mb-4 text-lg font-semibold">Información de Contacto</h3>
				<div className="grid gap-4 md:grid-cols-3">
					<div>
						<h4 className="font-semibold">Teléfono</h4>
						<p className="text-sm opacity-90">+52 (55) 1234-5678</p>
						<p className="text-xs opacity-75">Lun - Vie: 8:00 AM - 6:00 PM</p>
					</div>
					<div>
						<h4 className="font-semibold">Email</h4>
						<p className="text-sm opacity-90">soporte@toyota-refacciones.com</p>
						<p className="text-xs opacity-75">Respuesta en 24 horas</p>
					</div>
					<div>
						<h4 className="font-semibold">Chat en Vivo</h4>
						<p className="text-sm opacity-90">Disponible 24/7</p>
						<p className="text-xs opacity-75">Respuesta inmediata</p>
					</div>
				</div>
			</div>
		</div>
	);
}
