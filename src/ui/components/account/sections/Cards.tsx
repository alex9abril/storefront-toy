"use client";

import { useState } from "react";

// Datos de ejemplo para las tarjetas
const mockCards = [
	{
		id: "1",
		type: "Visa",
		lastFour: "1234",
		expiryMonth: "12",
		expiryYear: "2026",
		isDefault: true,
		holderName: "Alejandro Grijalva Antonio",
	},
	{
		id: "2",
		type: "Mastercard",
		lastFour: "5678",
		expiryMonth: "08",
		expiryYear: "2025",
		isDefault: false,
		holderName: "Alejandro Grijalva Antonio",
	},
	{
		id: "3",
		type: "American Express",
		lastFour: "9012",
		expiryMonth: "03",
		expiryYear: "2027",
		isDefault: false,
		holderName: "Alejandro Grijalva Antonio",
	},
];

const cardIcons = {
	Visa: (
		<svg className="h-8 w-12" viewBox="0 0 24 16" fill="none">
			<rect width="24" height="16" rx="2" fill="#1A1F71" />
			<path d="M8.5 5.5h7v5h-7z" fill="white" />
			<text x="12" y="10" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
				VISA
			</text>
		</svg>
	),
	Mastercard: (
		<svg className="h-8 w-12" viewBox="0 0 24 16" fill="none">
			<rect width="24" height="16" rx="2" fill="#EB001B" />
			<circle cx="9" cy="8" r="3" fill="#F79E1B" />
			<circle cx="15" cy="8" r="3" fill="#FF5F00" />
		</svg>
	),
	"American Express": (
		<svg className="h-8 w-12" viewBox="0 0 24 16" fill="none">
			<rect width="24" height="16" rx="2" fill="#006FCF" />
			<text x="12" y="10" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
				AMEX
			</text>
		</svg>
	),
};

export function Cards() {
	const [showAddForm, setShowAddForm] = useState(false);
	const [newCard, setNewCard] = useState({
		number: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
		holderName: "",
	});

	const handleAddCard = () => {
		// Aquí implementarías la lógica para agregar la tarjeta
		console.log("Agregar tarjeta:", newCard);
		setShowAddForm(false);
		setNewCard({
			number: "",
			expiryMonth: "",
			expiryYear: "",
			cvv: "",
			holderName: "",
		});
	};

	const handleDeleteCard = (id: string) => {
		// Aquí implementarías la lógica para eliminar la tarjeta
		console.log("Eliminar tarjeta:", id);
	};

	const handleSetDefault = (id: string) => {
		// Aquí implementarías la lógica para establecer como tarjeta por defecto
		console.log("Establecer como predeterminada:", id);
	};

	const _maskCardNumber = (number: string) => {
		return "**** **** **** " + number;
	};

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Mis Tarjetas</h2>
					<p className="mt-2 text-gray-600">Administra tus métodos de pago</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
				>
					+ Agregar Tarjeta
				</button>
			</div>

			{/* Formulario para agregar nueva tarjeta */}
			{showAddForm && (
				<div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Nueva Tarjeta</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Número de Tarjeta</label>
							<input
								type="text"
								value={newCard.number}
								onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="1234 5678 9012 3456"
								maxLength={19}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Mes de Vencimiento</label>
							<select
								value={newCard.expiryMonth}
								onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							>
								<option value="">Seleccionar</option>
								{Array.from({ length: 12 }, (_, i) => (
									<option key={i + 1} value={String(i + 1).padStart(2, "0")}>
										{String(i + 1).padStart(2, "0")}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Año de Vencimiento</label>
							<select
								value={newCard.expiryYear}
								onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							>
								<option value="">Seleccionar</option>
								{Array.from({ length: 10 }, (_, i) => (
									<option key={i} value={String(new Date().getFullYear() + i)}>
										{new Date().getFullYear() + i}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">CVV</label>
							<input
								type="text"
								value={newCard.cvv}
								onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="123"
								maxLength={4}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Nombre del Titular</label>
							<input
								type="text"
								value={newCard.holderName}
								onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Como aparece en la tarjeta"
							/>
						</div>
					</div>
					<div className="mt-4 flex gap-3">
						<button
							onClick={handleAddCard}
							className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
						>
							Guardar Tarjeta
						</button>
						<button
							onClick={() => setShowAddForm(false)}
							className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancelar
						</button>
					</div>
				</div>
			)}

			{/* Lista de tarjetas */}
			<div className="grid gap-4 md:grid-cols-2">
				{mockCards.map((card) => (
					<div key={card.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-3">
									{cardIcons[card.type as keyof typeof cardIcons]}
									<div>
										<h3 className="text-lg font-semibold text-gray-900">
											{card.type} •••• {card.lastFour}
										</h3>
										<p className="text-sm text-gray-600">{card.holderName}</p>
									</div>
									{card.isDefault && (
										<span className="rounded-full bg-[#EB0A1E] px-2 py-1 text-xs font-medium text-white">
											Predeterminada
										</span>
									)}
								</div>
								<div className="mt-2 text-sm text-gray-600">
									<p>
										Vence: {card.expiryMonth}/{card.expiryYear}
									</p>
								</div>
							</div>
							<div className="ml-4 flex flex-col gap-2">
								{!card.isDefault && (
									<button
										onClick={() => handleSetDefault(card.id)}
										className="rounded-lg bg-[#EB0A1E] px-3 py-1 text-xs font-medium text-white hover:bg-[#C4081A]"
									>
										Predeterminada
									</button>
								)}
								<button
									onClick={() => handleDeleteCard(card.id)}
									className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
								>
									Eliminar
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Mensaje si no hay tarjetas */}
			{mockCards.length === 0 && (
				<div className="py-12 text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
					<h3 className="mt-2 text-sm font-medium text-gray-900">No hay tarjetas</h3>
					<p className="mt-1 text-sm text-gray-500">Agrega tu primera tarjeta de pago.</p>
				</div>
			)}

			{/* Información de seguridad */}
			<div className="mt-8 rounded-lg bg-blue-50 p-4">
				<div className="flex">
					<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Información de Seguridad</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>• Tus datos de tarjeta están encriptados y protegidos</p>
							<p>• No almacenamos el CVV de tus tarjetas</p>
							<p>• Puedes eliminar tus tarjetas en cualquier momento</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
