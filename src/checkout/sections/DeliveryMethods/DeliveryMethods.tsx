import React from "react";
import { Title } from "@/checkout/components/Title";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { SelectBox } from "@/checkout/components/SelectBox";
import { SelectBoxGroup } from "@/checkout/components/SelectBoxGroup";
import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { Divider } from "@/checkout/components/Divider";
import { type CommonSectionProps } from "@/checkout/lib/globalTypes";
import { useDeliveryMethodsForm } from "@/checkout/sections/DeliveryMethods/useDeliveryMethodsForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { useUser } from "@/checkout/hooks/useUser";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
	const { checkout } = useCheckout();
	const { authenticated } = useUser();
	const { shippingMethods, shippingAddress, availableCollectionPoints, deliveryMethod, metadata } = checkout;
	const form = useDeliveryMethodsForm();
	const { updateState } = useCheckoutUpdateState();

	// Obtener información del almacén desde metadatos
	const selectedWarehouseId = metadata?.find((m) => m.key === "selected_warehouse_id")?.value;
	const selectedWarehouseName = metadata?.find((m) => m.key === "selected_warehouse_name")?.value;

	// Debug logs para investigar el estado del checkout
	console.log("🔍 Debug - DeliveryMethods:", {
		availableCollectionPoints,
		availableCollectionPointsLength: availableCollectionPoints?.length || 0,
		deliveryMethod,
		shippingAddress,
		checkoutId: checkout.id,
		isShippingRequired: checkout.isShippingRequired,
		selectedWarehouseId,
		selectedWarehouseName,
		metadata,
	});

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} días hábiles`;
	};

	if (!checkout?.isShippingRequired || collapsed) {
		return null;
	}

	return (
		<FormProvider form={form}>
			<Divider />
			<div className="py-4" data-testid="deliveryMethods">
				<Title className="mb-2">Métodos de envío</Title>

				{/* Mostrar información del almacén seleccionado */}
				{(deliveryMethod?.__typename === "Warehouse" || selectedWarehouseName) && (
					<div className="mb-4 rounded-lg bg-green-50 p-4">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-green-800">
									Recoger en tienda: {deliveryMethod?.name || selectedWarehouseName || "Almacén seleccionado"}
								</p>
								<p className="text-xs text-green-600">El pedido se preparará en el almacén seleccionado</p>
							</div>
						</div>
					</div>
				)}

				{!authenticated && !shippingAddress && !availableCollectionPoints?.length && (
					<p>Completa la dirección de envío para ver los métodos disponibles</p>
				)}
				{authenticated && !shippingAddress && updateState.checkoutShippingUpdate ? (
					<DeliveryMethodsSkeleton />
				) : (
					<SelectBoxGroup label="métodos de envío">
						{/* Métodos de envío tradicionales */}
						{shippingMethods?.map(
							({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
								<SelectBox key={id} name="selectedMethodId" value={id}>
									<div className="pointer-events-none flex min-h-12 grow flex-col justify-center">
										<div className="flex flex-row items-center justify-between self-stretch">
											<p>{name}</p>
											<p>{getFormattedMoney(price)}</p>
										</div>
										<p className="font-xs" color="secondary">
											{getSubtitle({ min, max })}
										</p>
									</div>
								</SelectBox>
							),
						)}
						{/* Almacenes para recoger en tienda */}
						{availableCollectionPoints?.map((warehouse) => (
							<SelectBox key={warehouse.id} name="selectedMethodId" value={warehouse.id}>
								<div className="pointer-events-none flex min-h-12 grow flex-col justify-center">
									<div className="flex flex-row items-center justify-between self-stretch">
										<p>Recoger en {warehouse.name}</p>
										<p className="font-semibold text-green-600">Gratis</p>
									</div>
									<p className="font-xs" color="secondary">
										{warehouse.address.city}, {warehouse.address.streetAddress1}
									</p>
								</div>
							</SelectBox>
						))}
					</SelectBoxGroup>
				)}
			</div>
		</FormProvider>
	);
};
