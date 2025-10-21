"use client";

import { useState } from "react";

// Datos de ejemplo para las direcciones
const mockAddresses = [
	{
		id: "1",
		type: "Casa",
		name: "Casa Principal",
		address: "Av. Insurgentes Sur 1234, Col. Del Valle",
		city: "Ciudad de México",
		state: "CDMX",
		zipCode: "03100",
		phone: "+52 55 1234-5678",
		isDefault: true,
	},
	{
		id: "2",
		type: "Oficina",
		name: "Oficina Corporativa",
		address: "Paseo de la Reforma 500, Piso 15",
		city: "Ciudad de México",
		state: "CDMX",
		zipCode: "06600",
		phone: "+52 55 9876-5432",
		isDefault: false,
	},
	{
		id: "3",
		type: "Casa",
		name: "Casa de Vacaciones",
		address: "Calle Morelos 456, Centro",
		city: "Guadalajara",
		state: "Jalisco",
		zipCode: "44100",
		phone: "+52 33 5555-1234",
		isDefault: false,
	},
];

export function Addresses() {
	const [showAddForm, setShowAddForm] = useState(false);
	const [_editingAddress, setEditingAddress] = useState<string | null>(null);
	const [newAddress, setNewAddress] = useState({
		type: "Casa",
		name: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		phone: "",
	});

	const handleAddAddress = () => {
		// Aquí implementarías la lógica para agregar la dirección
		console.log("Agregar dirección:", newAddress);
		setShowAddForm(false);
		setNewAddress({
			type: "Casa",
			name: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			phone: "",
		});
	};

	const handleEditAddress = (id: string) => {
		setEditingAddress(id);
		// Aquí implementarías la lógica para editar la dirección
	};

	const handleDeleteAddress = (id: string) => {
		// Aquí implementarías la lógica para eliminar la dirección
		console.log("Eliminar dirección:", id);
	};

	const handleSetDefault = (id: string) => {
		// Aquí implementarías la lógica para establecer como dirección por defecto
		console.log("Establecer como predeterminada:", id);
	};

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Mis Direcciones</h2>
					<p className="mt-2 text-gray-600">Administra tus direcciones de envío</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
				>
					+ Agregar Dirección
				</button>
			</div>

			{/* Formulario para agregar nueva dirección */}
			{showAddForm && (
				<div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Nueva Dirección</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Tipo de Dirección</label>
							<select
								value={newAddress.type}
								onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							>
								<option value="Casa">Casa</option>
								<option value="Oficina">Oficina</option>
								<option value="Otro">Otro</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Nombre</label>
							<input
								type="text"
								value={newAddress.name}
								onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Ej: Casa Principal"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Dirección</label>
							<input
								type="text"
								value={newAddress.address}
								onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Calle, número, colonia"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Ciudad</label>
							<input
								type="text"
								value={newAddress.city}
								onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Estado</label>
							<input
								type="text"
								value={newAddress.state}
								onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Código Postal</label>
							<input
								type="text"
								value={newAddress.zipCode}
								onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Teléfono</label>
							<input
								type="tel"
								value={newAddress.phone}
								onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="+52 55 1234-5678"
							/>
						</div>
					</div>
					<div className="mt-4 flex gap-3">
						<button
							onClick={handleAddAddress}
							className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
						>
							Guardar Dirección
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

			{/* Lista de direcciones */}
			<div className="grid gap-4 md:grid-cols-2">
				{mockAddresses.map((address) => (
					<div key={address.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
									{address.isDefault && (
										<span className="rounded-full bg-[#EB0A1E] px-2 py-1 text-xs font-medium text-white">
											Predeterminada
										</span>
									)}
								</div>
								<p className="text-sm text-gray-600">{address.type}</p>
								<div className="mt-2 text-sm text-gray-700">
									<p>{address.address}</p>
									<p>
										{address.city}, {address.state} {address.zipCode}
									</p>
									<p className="mt-1">{address.phone}</p>
								</div>
							</div>
							<div className="ml-4 flex flex-col gap-2">
								<button
									onClick={() => handleEditAddress(address.id)}
									className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
								>
									Editar
								</button>
								{!address.isDefault && (
									<button
										onClick={() => handleSetDefault(address.id)}
										className="rounded-lg bg-[#EB0A1E] px-3 py-1 text-xs font-medium text-white hover:bg-[#C4081A]"
									>
										Predeterminada
									</button>
								)}
								<button
									onClick={() => handleDeleteAddress(address.id)}
									className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
								>
									Eliminar
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Mensaje si no hay direcciones */}
			{mockAddresses.length === 0 && (
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
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					<h3 className="mt-2 text-sm font-medium text-gray-900">No hay direcciones</h3>
					<p className="mt-1 text-sm text-gray-500">Agrega tu primera dirección de envío.</p>
				</div>
			)}
		</div>
	);
}
