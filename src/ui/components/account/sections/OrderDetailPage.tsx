"use client";

import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface OrderDetailPageProps {
	orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// Query para obtener los detalles de la orden
	const [{ data, fetching, error }] = useQuery({
		query: `
			query OrderDetail($id: ID!) {
				order(id: $id) {
					id
					number
					created
					status
					paymentStatus
					trackingClientId
					fulfillments {
						id
						status
						trackingNumber
					}
					total {
						gross {
							amount
							currency
						}
					}
					subtotal {
						gross {
							amount
							currency
						}
					}
					shippingPrice {
						gross {
							amount
							currency
						}
					}
					lines {
						id
						quantity
						variant {
							id
							name
							product {
								id
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
					shippingAddress {
						firstName
						lastName
						companyName
						streetAddress1
						streetAddress2
						city
						postalCode
						country {
							country
							code
						}
						phone
					}
					billingAddress {
						firstName
						lastName
						companyName
						streetAddress1
						streetAddress2
						city
						postalCode
						country {
							country
							code
						}
						phone
					}
				}
			}
		`,
		variables: { id: orderId },
		requestPolicy: "cache-first",
	});

	const handleReorder = async () => {
		setIsLoading(true);
		try {
			// Aquí implementarías la lógica para reordenar
			// Por ahora simulamos el proceso
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Funcionalidad de reordenar próximamente disponible");
		} catch (error) {
			console.error("Error al reordenar:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	// Obtener número de seguimiento
	const getTrackingNumber = (order: any) => {
		// Prioridad: trackingClientId > fulfillments[0].trackingNumber
		if (order.trackingClientId) {
			return order.trackingClientId;
		}
		if (order.fulfillments && order.fulfillments.length > 0) {
			const fulfillment = order.fulfillments[0];
			return fulfillment.trackingNumber;
		}
		return null;
	};

	// Obtener información del fulfillment
	const getFulfillmentInfo = (order: any) => {
		if (order.fulfillments && order.fulfillments.length > 0) {
			const fulfillment = order.fulfillments[0];
			return {
				status: fulfillment.status,
			};
		}
		return null;
	};

	const getStatusColor = (status: string) => {
		const statusColors: Record<string, string> = {
			UNFULFILLED: "bg-yellow-100 text-yellow-800",
			FULFILLED: "bg-green-100 text-green-800",
			PARTIALLY_FULFILLED: "bg-blue-100 text-blue-800",
			CANCELED: "bg-red-100 text-red-800",
			RETURNED: "bg-gray-100 text-gray-800",
		};
		return statusColors[status] || "bg-gray-100 text-gray-800";
	};

	const getPaymentStatusColor = (status: string) => {
		const statusColors: Record<string, string> = {
			NOT_CHARGED: "bg-yellow-100 text-yellow-800",
			FULLY_CHARGED: "bg-green-100 text-green-800",
			PARTIALLY_CHARGED: "bg-blue-100 text-blue-800",
			FULLY_REFUNDED: "bg-gray-100 text-gray-800",
		};
		return statusColors[status] || "bg-gray-100 text-gray-800";
	};

	const getStatusLabel = (status: string) => {
		const statusLabels: Record<string, string> = {
			UNFULFILLED: "Pendiente de Surtir",
			FULFILLED: "Surtido",
			PARTIALLY_FULFILLED: "Parcialmente Surtido",
			CANCELED: "Cancelado",
			RETURNED: "Devuelto",
		};
		return statusLabels[status] || status;
	};

	const getPaymentStatusLabel = (status: string) => {
		const statusLabels: Record<string, string> = {
			NOT_CHARGED: "Pendiente de Pago",
			FULLY_CHARGED: "Pagado",
			PARTIALLY_CHARGED: "Pago Parcial",
			FULLY_REFUNDED: "Reembolsado",
		};
		return statusLabels[status] || status;
	};

	if (fetching) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#EB0A1E]"></div>
					<p className="text-gray-600">Cargando detalles del pedido...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
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
						<h3 className="text-sm font-medium text-red-800">Error al cargar el pedido</h3>
						<p className="mt-1 text-sm text-red-700">{error.message}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!data?.order || !data.order) {
		return (
			<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
				<div className="flex items-center">
					<svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-yellow-800">Pedido no encontrado</h3>
						<p className="mt-1 text-sm text-yellow-700">No se pudo encontrar el pedido solicitado.</p>
					</div>
				</div>
			</div>
		);
	}

	const order = data.order;

	return (
		<div className="space-y-6">
			{/* Header del pedido */}
			<div className="flex items-center justify-between border-b border-gray-200 pb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pedido #{order.number}</h1>
					<p className="text-sm text-gray-600">Realizado el {formatDate(order.created)}</p>
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Volver
					</button>
					{order.paymentStatus === "FULLY_CHARGED" && order.status === "FULFILLED" && (
						<button
							onClick={handleReorder}
							disabled={isLoading}
							className="inline-flex items-center gap-2 rounded-md bg-[#EB0A1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4081A] disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Procesando...
								</>
							) : (
								<>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Volver a Pedir
								</>
							)}
						</button>
					)}
				</div>
			</div>

			{/* Estados del pedido */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<h3 className="mb-2 text-sm font-medium text-gray-900">Estado del Pedido</h3>
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
							order.status,
						)}`}
					>
						{getStatusLabel(order.status)}
					</span>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<h3 className="mb-2 text-sm font-medium text-gray-900">Estado de Pago</h3>
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(
							order.paymentStatus,
						)}`}
					>
						{getPaymentStatusLabel(order.paymentStatus)}
					</span>
				</div>
			</div>

			{/* Información de seguimiento */}
			{getTrackingNumber(order) && (
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0">
							<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h3 className="mb-2 text-lg font-medium text-blue-900">Información de Seguimiento</h3>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-blue-800">Número de seguimiento:</span>
									<span className="rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-900">
										{getTrackingNumber(order)}
									</span>
								</div>
								{getFulfillmentInfo(order)?.status && (
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-blue-800">Estado del envío:</span>
										<span className="text-sm text-blue-700">{getFulfillmentInfo(order).status}</span>
									</div>
								)}
							</div>
							<div className="mt-4">
								<p className="text-sm text-blue-700">
									Puedes usar este número para rastrear tu paquete en el sitio web del transportista.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Productos del pedido */}
			<div className="rounded-lg border border-gray-200 bg-white">
				<div className="border-b border-gray-200 px-6 py-4">
					<h2 className="text-lg font-medium text-gray-900">Productos</h2>
				</div>
				<div className="divide-y divide-gray-200">
					{order.lines.map((line) => (
						<div key={line.id} className="p-6">
							<div className="flex items-start gap-4">
								{line.variant.product.thumbnail && (
									<Image
										src={line.variant.product.thumbnail.url}
										alt={line.variant.product.thumbnail.alt || line.variant.product.name}
										width={64}
										height={64}
										className="h-16 w-16 rounded-lg object-cover"
									/>
								)}
								<div className="flex-1">
									<h3 className="text-sm font-medium text-gray-900">{line.variant.product.name}</h3>
									<p className="text-sm text-gray-600">{line.variant.name}</p>
									<p className="text-sm text-gray-600">Cantidad: {line.quantity}</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900">
										{formatCurrency(
											line.variant.pricing.price.gross.amount,
											line.variant.pricing.price.gross.currency,
										)}
									</p>
									<p className="text-xs text-gray-600">cada uno</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Resumen del pedido */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Dirección de envío */}
				{order.shippingAddress && (
					<div className="rounded-lg border border-gray-200 bg-white p-6">
						<h3 className="mb-4 text-lg font-medium text-gray-900">Dirección de Envío</h3>
						<div className="space-y-2 text-sm text-gray-600">
							<p>
								{order.shippingAddress.firstName} {order.shippingAddress.lastName}
							</p>
							{order.shippingAddress.companyName && <p>{order.shippingAddress.companyName}</p>}
							<p>{order.shippingAddress.streetAddress1}</p>
							{order.shippingAddress.streetAddress2 && <p>{order.shippingAddress.streetAddress2}</p>}
							<p>
								{order.shippingAddress.city}, {order.shippingAddress.postalCode}
							</p>
							<p>{order.shippingAddress.country.country}</p>
							{order.shippingAddress.phone && <p>Tel: {order.shippingAddress.phone}</p>}
						</div>
					</div>
				)}

				{/* Dirección de facturación */}
				{order.billingAddress && (
					<div className="rounded-lg border border-gray-200 bg-white p-6">
						<h3 className="mb-4 text-lg font-medium text-gray-900">Dirección de Facturación</h3>
						<div className="space-y-2 text-sm text-gray-600">
							<p>
								{order.billingAddress.firstName} {order.billingAddress.lastName}
							</p>
							{order.billingAddress.companyName && <p>{order.billingAddress.companyName}</p>}
							<p>{order.billingAddress.streetAddress1}</p>
							{order.billingAddress.streetAddress2 && <p>{order.billingAddress.streetAddress2}</p>}
							<p>
								{order.billingAddress.city}, {order.billingAddress.postalCode}
							</p>
							<p>{order.billingAddress.country.country}</p>
							{order.billingAddress.phone && <p>Tel: {order.billingAddress.phone}</p>}
						</div>
					</div>
				)}
			</div>

			{/* Resumen de precios */}
			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<h3 className="mb-4 text-lg font-medium text-gray-900">Resumen del Pedido</h3>
				<div className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Subtotal</span>
						<span className="font-medium">
							{formatCurrency(order.subtotal.gross.amount, order.subtotal.gross.currency)}
						</span>
					</div>
					{order.shippingPrice && (
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Envío</span>
							<span className="font-medium">
								{formatCurrency(order.shippingPrice.gross.amount, order.shippingPrice.gross.currency)}
							</span>
						</div>
					)}
					<div className="border-t border-gray-200 pt-3">
						<div className="flex justify-between text-lg font-medium">
							<span>Total</span>
							<span>{formatCurrency(order.total.gross.amount, order.total.gross.currency)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
