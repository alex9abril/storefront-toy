import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { Section } from "./Section";
import { Address } from "@/checkout/components/Address";
import { useOrder } from "@/checkout/hooks/useOrder";

export const OrderInfo = () => {
	const {
		order: { deliveryMethod, shippingAddress, billingAddress, userEmail },
	} = useOrder();

	return (
		<section className="mt-8">
			<PaymentSection />
			<DeliverySection deliveryMethod={deliveryMethod} />
			<Section title="Detalles de contacto">
				<p style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>{userEmail}</p>
			</Section>
			{shippingAddress && (
				<Section title="Dirección de envío">
					<Address address={shippingAddress} />
				</Section>
			)}
			{billingAddress && (
				<Section title="Dirección de facturación">
					<Address address={billingAddress} />
				</Section>
			)}
		</section>
	);
};
