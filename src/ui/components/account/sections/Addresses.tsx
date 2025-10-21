"use client";

import { useState } from "react";
import { useQuery } from "urql";

// Datos de ejemplo para las direcciones (ya no se usan, se obtienen de Saleor)
const _mockAddresses = [
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
	const [editingAddress, setEditingAddress] = useState<string | null>(null);
	const [newAddress, setNewAddress] = useState({
		firstName: "",
		lastName: "",
		companyName: "",
		streetAddress1: "",
		streetAddress2: "",
		city: "",
		postalCode: "",
		country: "MX",
		phone: "",
	});
	const [editAddress, setEditAddress] = useState({
		firstName: "",
		lastName: "",
		companyName: "",
		streetAddress1: "",
		streetAddress2: "",
		city: "",
		postalCode: "",
		country: "MX",
		phone: "",
	});

	// Consulta GraphQL para obtener direcciones del usuario
	const [{ data, fetching, error }] = useQuery({
		query: `
			query UserAddresses {
				me {
					id
					addresses {
						id
						firstName
						lastName
						companyName
						streetAddress1
						streetAddress2
						city
						postalCode
						country {
							code
							country
						}
						phone
						isDefaultShippingAddress
						isDefaultBillingAddress
					}
				}
			}
		`,
		requestPolicy: "cache-first",
	});

	// Obtener direcciones de Saleor
	const addresses = data?.me?.addresses || [];

	const handleAddAddress = () => {
		// Aquí implementarías la lógica para agregar la dirección
		console.log("Agregar dirección:", newAddress);
		setShowAddForm(false);
		setNewAddress({
			firstName: "",
			lastName: "",
			companyName: "",
			streetAddress1: "",
			streetAddress2: "",
			city: "",
			postalCode: "",
			country: "MX",
			phone: "",
		});
	};

	const handleEditAddress = (id: string) => {
		const address = addresses.find((addr: any) => addr.id === id);
		if (address) {
			setEditAddress({
				firstName: address.firstName || "",
				lastName: address.lastName || "",
				companyName: address.companyName || "",
				streetAddress1: address.streetAddress1 || "",
				streetAddress2: address.streetAddress2 || "",
				city: address.city || "",
				postalCode: address.postalCode || "",
				country: address.country?.code || "MX",
				phone: address.phone || "",
			});
			setEditingAddress(id);
		}
	};

	const handleSaveEdit = () => {
		// Aquí implementarías la lógica para guardar la dirección editada
		console.log("Guardar dirección editada:", editAddress);
		setEditingAddress(null);
		setEditAddress({
			firstName: "",
			lastName: "",
			companyName: "",
			streetAddress1: "",
			streetAddress2: "",
			city: "",
			postalCode: "",
			country: "MX",
			phone: "",
		});
	};

	const handleCancelEdit = () => {
		setEditingAddress(null);
		setEditAddress({
			firstName: "",
			lastName: "",
			companyName: "",
			streetAddress1: "",
			streetAddress2: "",
			city: "",
			postalCode: "",
			country: "MX",
			phone: "",
		});
	};

	const handleDeleteAddress = (id: string) => {
		// Aquí implementarías la lógica para eliminar la dirección
		console.log("Eliminar dirección:", id);
	};

	const handleSetDefault = (id: string) => {
		// Aquí implementarías la lógica para establecer como dirección por defecto
		console.log("Establecer como predeterminada:", id);
	};

	// Estados de carga y error
	if (fetching) {
		return (
			<div className="p-6">
				<div className="mb-6">
					<h2 className="text-xl font-normal text-gray-900">Mis Direcciones</h2>
					<p className="mt-1 text-sm font-normal text-gray-500">Administra tus direcciones de envío</p>
				</div>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
							<div className="mb-2 h-4 w-1/4 rounded bg-gray-200"></div>
							<div className="h-3 w-1/2 rounded bg-gray-200"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="mb-6">
					<h2 className="text-xl font-normal text-gray-900">Mis Direcciones</h2>
					<p className="mt-1 text-sm font-normal text-gray-500">Administra tus direcciones de envío</p>
				</div>
				<div className="rounded-lg border border-red-200 bg-red-50 p-6">
					<div className="flex items-center">
						<svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">Error al cargar direcciones</h3>
							<p className="mt-1 text-sm text-red-700">{error.message}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
							<label className="block text-sm font-medium text-gray-700">Nombre</label>
							<input
								type="text"
								value={newAddress.firstName}
								onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Nombre"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Apellido</label>
							<input
								type="text"
								value={newAddress.lastName}
								onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Apellido"
								required
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Empresa (Opcional)</label>
							<input
								type="text"
								value={newAddress.companyName}
								onChange={(e) => setNewAddress({ ...newAddress, companyName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Nombre de la empresa"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Dirección</label>
							<input
								type="text"
								value={newAddress.streetAddress1}
								onChange={(e) => setNewAddress({ ...newAddress, streetAddress1: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Calle, número, colonia"
								required
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Dirección 2 (Opcional)</label>
							<input
								type="text"
								value={newAddress.streetAddress2}
								onChange={(e) => setNewAddress({ ...newAddress, streetAddress2: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Apartamento, suite, etc."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Ciudad</label>
							<input
								type="text"
								value={newAddress.city}
								onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Ciudad"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Código Postal</label>
							<input
								type="text"
								value={newAddress.postalCode}
								onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Código Postal"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">País</label>
							<select
								value={newAddress.country}
								onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								required
							>
								<option value="MX">México</option>
								<option value="US">Estados Unidos</option>
								<option value="CA">Canadá</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Teléfono</label>
							<input
								type="tel"
								value={newAddress.phone}
								onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Teléfono"
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

			{/* Formulario para editar dirección */}
			{editingAddress && (
				<div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
					<h3 className="mb-4 text-lg font-semibold text-blue-900">Editar Dirección</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Nombre</label>
							<input
								type="text"
								value={editAddress.firstName}
								onChange={(e) => setEditAddress({ ...editAddress, firstName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Nombre"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Apellido</label>
							<input
								type="text"
								value={editAddress.lastName}
								onChange={(e) => setEditAddress({ ...editAddress, lastName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Apellido"
								required
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Empresa (Opcional)</label>
							<input
								type="text"
								value={editAddress.companyName}
								onChange={(e) => setEditAddress({ ...editAddress, companyName: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Nombre de la empresa"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Dirección</label>
							<input
								type="text"
								value={editAddress.streetAddress1}
								onChange={(e) => setEditAddress({ ...editAddress, streetAddress1: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Calle, número, colonia"
								required
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700">Dirección 2 (Opcional)</label>
							<input
								type="text"
								value={editAddress.streetAddress2}
								onChange={(e) => setEditAddress({ ...editAddress, streetAddress2: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Apartamento, suite, etc."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Ciudad</label>
							<input
								type="text"
								value={editAddress.city}
								onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Ciudad"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Código Postal</label>
							<input
								type="text"
								value={editAddress.postalCode}
								onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Código Postal"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">País</label>
							<select
								value={editAddress.country}
								onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								required
							>
								<option value="MX">México</option>
								<option value="US">Estados Unidos</option>
								<option value="CA">Canadá</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Teléfono</label>
							<input
								type="tel"
								value={editAddress.phone}
								onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
								placeholder="Teléfono"
							/>
						</div>
					</div>
					<div className="mt-4 flex gap-3">
						<button
							onClick={handleSaveEdit}
							className="rounded-lg bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A]"
						>
							Guardar Cambios
						</button>
						<button
							onClick={handleCancelEdit}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancelar
						</button>
					</div>
				</div>
			)}

			{/* Lista de direcciones */}
			<div className="grid gap-4 md:grid-cols-2">
				{addresses.map((address: any) => (
					<div
						key={address.id}
						className={`rounded-lg border p-6 shadow-sm ${
							editingAddress === address.id ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
						}`}
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-gray-900">
										{address.firstName} {address.lastName}
									</h3>
									{editingAddress === address.id && (
										<span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
											Editando
										</span>
									)}
									{(address.isDefaultShippingAddress || address.isDefaultBillingAddress) && (
										<span className="rounded-full bg-[#EB0A1E] px-2 py-1 text-xs font-medium text-white">
											Predeterminada
										</span>
									)}
								</div>
								{address.companyName && <p className="text-sm text-gray-600">{address.companyName}</p>}
								<div className="mt-2 text-sm text-gray-700">
									<p>{address.streetAddress1}</p>
									{address.streetAddress2 && <p>{address.streetAddress2}</p>}
									<p>
										{address.city}, {address.postalCode}
									</p>
									<p>{address.country.country}</p>
									{address.phone && <p className="mt-1">Tel: {address.phone}</p>}
								</div>
								<div className="mt-2 flex gap-2">
									{address.isDefaultShippingAddress && (
										<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
											Envío
										</span>
									)}
									{address.isDefaultBillingAddress && (
										<span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
											Facturación
										</span>
									)}
								</div>
							</div>
							<div className="ml-4 flex flex-col gap-2">
								{editingAddress === address.id ? (
									<div className="flex gap-2">
										<button
											onClick={handleSaveEdit}
											className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
										>
											Guardar
										</button>
										<button
											onClick={handleCancelEdit}
											className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
										>
											Cancelar
										</button>
									</div>
								) : (
									<button
										onClick={() => handleEditAddress(address.id)}
										className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
									>
										Editar
									</button>
								)}
								{!address.isDefaultShippingAddress && !address.isDefaultBillingAddress && (
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
			{addresses.length === 0 && (
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
