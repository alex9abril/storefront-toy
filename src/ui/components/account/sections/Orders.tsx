"use client";

import { useState } from "react";
import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Estados de pago - Estilo corporativo
const paymentStatusColors = {
	NOT_CHARGED: "bg-gray-100 text-gray-700 border border-gray-200",
	PARTIALLY_CHARGED: "bg-blue-50 text-blue-700 border border-blue-200",
	FULLY_CHARGED: "bg-green-50 text-green-700 border border-green-200",
	PARTIALLY_REFUNDED: "bg-orange-50 text-orange-700 border border-orange-200",
	FULLY_REFUNDED: "bg-red-50 text-red-700 border border-red-200",
	PENDING: "bg-gray-100 text-gray-700 border border-gray-200",
	REFUSED: "bg-red-50 text-red-700 border border-red-200",
};

const paymentStatusLabels = {
	NOT_CHARGED: "Pendiente de Pago",
	PARTIALLY_CHARGED: "Pago Parcial",
	FULLY_CHARGED: "Pagado",
	PARTIALLY_REFUNDED: "Reembolso Parcial",
	FULLY_REFUNDED: "Reembolsado",
	PENDING: "Pendiente",
	REFUSED: "Rechazado",
};

// Estados del pedido - Estilo corporativo
const orderStatusColors = {
	DRAFT: "bg-gray-100 text-gray-700 border border-gray-200",
	UNFULFILLED: "bg-amber-50 text-amber-700 border border-amber-200",
	PARTIALLY_FULFILLED: "bg-blue-50 text-blue-700 border border-blue-200",
	FULFILLED: "bg-green-50 text-green-700 border border-green-200",
	CANCELED: "bg-red-50 text-red-700 border border-red-200",
	RETURNED: "bg-orange-50 text-orange-700 border border-orange-200",
	PARTIALLY_RETURNED: "bg-purple-50 text-purple-700 border border-purple-200",
};

const orderStatusLabels = {
	DRAFT: "Borrador",
	UNFULFILLED: "Pendiente de Surtir",
	PARTIALLY_FULFILLED: "Parcialmente Surtido",
	FULFILLED: "Surtido",
	CANCELED: "Cancelado",
	RETURNED: "Devuelto",
	PARTIALLY_RETURNED: "Parcialmente Devuelto",
};

export function Orders() {
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const router = useRouter();

	// Consulta real de Saleor
	const [{ data, fetching, error }] = useQuery({
		query: `
			query CurrentUserOrderList {
				me {
					id
					email
					firstName
					lastName
					orders(first: 10) {
						edges {
							node {
								id
								number
								created
								status
								paymentStatus
								total {
									gross {
										amount
										currency
									}
								}
								lines {
									quantity
									variant {
										name
										product {
											name
											thumbnail {
												url
												alt
											}
										}
										pricing {
											price {
												gross {
													amount
													currency
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		`,
		requestPolicy: "cache-first",
	});

	// Procesar datos de Saleor
	const orders = data?.me?.orders?.edges?.map((edge) => edge.node) || [];

	// Filtrar pedidos
	const filteredOrders = (orders as any[]).filter((order: any) => {
		const matchesStatus =
			!filterStatus || order.paymentStatus === filterStatus || order.status === filterStatus;
		const matchesSearch = !searchQuery || order.number.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	// Formatear fecha
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Formatear moneda
	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	// Calcular total de artículos
	const getTotalItems = (lines: any[]) => {
		return lines.reduce((total, line) => total + line.quantity, 0);
	};

	if (fetching) {
		return (
			<div className="p-6">
				<div className="mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Mis Pedidos</h2>
					<p className="mt-2 text-gray-600">Cargando pedidos...</p>
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
					<h2 className="text-2xl font-bold text-gray-900">Mis Pedidos</h2>
					<p className="mt-2 text-red-600">Error al cargar los pedidos: {error.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-8">
				<h2 className="text-xl font-normal text-gray-900">Mis Pedidos</h2>
				<p className="mt-1 text-sm font-normal text-gray-500">Gestiona y da seguimiento a tus pedidos</p>
			</div>

			{/* Filtros */}
			<div className="mb-8 flex flex-wrap gap-4 border-b border-gray-200 pb-6">
				<select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-700 focus:border-gray-400 focus:outline-none"
				>
					<option value="">Todos los estados</option>
					<optgroup label="Estado de Pago">
						<option value="NOT_CHARGED">Pendiente de Pago</option>
						<option value="FULLY_CHARGED">Pagado</option>
						<option value="PARTIALLY_CHARGED">Pago Parcial</option>
						<option value="FULLY_REFUNDED">Reembolsado</option>
					</optgroup>
					<optgroup label="Estado del Pedido">
						<option value="UNFULFILLED">Pendiente de Surtir</option>
						<option value="FULFILLED">Surtido</option>
						<option value="PARTIALLY_FULFILLED">Parcialmente Surtido</option>
						<option value="CANCELED">Cancelado</option>
						<option value="RETURNED">Devuelto</option>
					</optgroup>
				</select>
				<input
					type="text"
					placeholder="Buscar por número de pedido..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="min-w-64 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-700 focus:border-gray-400 focus:outline-none"
				/>
			</div>

			{/* Lista de pedidos */}
			<div className="space-y-6">
				{filteredOrders.map((order) => (
					<div
						key={order.id}
						className="cursor-pointer border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-sm"
						onClick={() => router.push(`/account/orders/${order.id}`)}
					>
						{/* Header del pedido */}
						<div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-6">
									<div>
										<h3 className="text-base font-normal text-gray-900">Pedido #{order.number}</h3>
										<p className="text-sm font-normal text-gray-500">Fecha: {formatDate(order.created)}</p>
									</div>
									<div className="flex gap-2">
										<span
											className={`inline-flex rounded px-2 py-1 text-xs font-normal ${
												paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]
											}`}
										>
											{paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}
										</span>
										<span
											className={`inline-flex rounded px-2 py-1 text-xs font-normal ${
												orderStatusColors[order.status as keyof typeof orderStatusColors]
											}`}
										>
											{orderStatusLabels[order.status as keyof typeof orderStatusLabels]}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right">
										<p className="text-sm font-normal text-gray-500">
											{getTotalItems(order.lines)} artículo{getTotalItems(order.lines) > 1 ? "s" : ""}
										</p>
										<p className="text-base font-normal text-gray-900">
											{formatCurrency(order.total.gross.amount, order.total.gross.currency)}
										</p>
									</div>
									{order.paymentStatus === "FULLY_CHARGED" && order.status === "FULFILLED" && (
										<button className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50">
											Volver a Pedir
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Detalles del pedido - Siempre visibles */}
						<div className="px-6 py-4">
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{/* Productos */}
								<div>
									<h4 className="mb-3 text-sm font-normal text-gray-700">Productos</h4>
									<div className="space-y-3">
										{order.lines.map((line, index) => (
											<div
												key={index}
												className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-b-0"
											>
												{line.variant?.product?.thumbnail && (
													<Image
														src={line.variant.product.thumbnail.url}
														alt={line.variant.product.thumbnail.alt || line.variant.product.name}
														width={40}
														height={40}
														className="h-10 w-10 rounded object-cover"
													/>
												)}
												<div className="flex-1">
													<p className="text-sm font-normal text-gray-900">
														{line.variant?.product?.name || "Producto"}
													</p>
													{line.variant?.name && (
														<p className="text-xs font-normal text-gray-500">{line.variant.name}</p>
													)}
													<p className="text-xs font-normal text-gray-500">Cantidad: {line.quantity}</p>
												</div>
												<div className="text-right">
													<p className="text-sm font-normal text-gray-900">
														{formatCurrency(
															line.variant?.pricing?.price?.gross?.amount || 0,
															order.total.gross.currency,
														)}
													</p>
													<p className="text-xs font-normal text-gray-500">c/u</p>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Información adicional */}
								<div>
									<h4 className="mb-3 text-sm font-normal text-gray-700">Información del Pedido</h4>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="font-normal text-gray-500">Subtotal:</span>
											<span className="font-normal text-gray-900">
												{formatCurrency(order.total.gross.amount, order.total.gross.currency)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="font-normal text-gray-500">Estado de Pago:</span>
											<span className="font-normal text-gray-900">
												{paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels]}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="font-normal text-gray-500">Estado del Pedido:</span>
											<span className="font-normal text-gray-900">
												{orderStatusLabels[order.status as keyof typeof orderStatusLabels]}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Mensaje si no hay pedidos */}
			{filteredOrders.length === 0 && (
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
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					<h3 className="mt-2 text-sm font-medium text-gray-900">
						{orders.length === 0 ? "No hay pedidos" : "No se encontraron pedidos"}
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						{orders.length === 0
							? "Cuando realices tu primer pedido, aparecerá aquí."
							: "Intenta ajustar los filtros de búsqueda."}
					</p>
				</div>
			)}
		</div>
	);
}
