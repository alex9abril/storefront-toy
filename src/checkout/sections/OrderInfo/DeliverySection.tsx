import { Section } from "./Section";
import { type OrderFragment, type ShippingFragment, type WarehouseFragment } from "@/checkout/graphql";

const isShipping = (deliveryMethod: OrderFragment["deliveryMethod"]): deliveryMethod is ShippingFragment =>
	deliveryMethod?.__typename === "ShippingMethod";

const isWarehouse = (deliveryMethod: OrderFragment["deliveryMethod"]): deliveryMethod is WarehouseFragment =>
	deliveryMethod?.__typename === "Warehouse";

export const DeliverySection = ({ deliveryMethod }: { deliveryMethod: OrderFragment["deliveryMethod"] }) => {
	const getDeliveryEstimateText = () => {
		const { minimumDeliveryDays: min, maximumDeliveryDays: max } = deliveryMethod as ShippingFragment;

		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} días hábiles`;
	};

	return (
		<Section title="Método de entrega">
			{!isShipping(deliveryMethod) && !isWarehouse(deliveryMethod) ? (
				<p color="secondary" style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>
					No aplica
				</p>
			) : isShipping(deliveryMethod) ? (
				<>
					<p style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>{deliveryMethod.name}</p>
					<p style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>{getDeliveryEstimateText()}</p>
				</>
			) : (
				<>
					<p style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>
						Recoger en {deliveryMethod.name}
					</p>
					<p color="secondary" style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>
						{(() => {
							const address = deliveryMethod.address as unknown;
							if (
								address &&
								typeof address === "object" &&
								"city" in address &&
								"streetAddress1" in address
							) {
								const city = (address as { city: string }).city;
								const streetAddress1 = (address as { streetAddress1: string }).streetAddress1;
								return `${city}, ${streetAddress1}`;
							}
							return "Dirección no disponible";
						})()}
					</p>
				</>
			)}
		</Section>
	);
};
