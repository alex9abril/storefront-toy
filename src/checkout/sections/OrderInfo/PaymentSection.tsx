import { AlertIcon, SuccessIcon } from "../../assets/icons";
import { Section } from "./Section";

import { useOrder } from "@/checkout/hooks/useOrder";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";

const ErrorMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p className="mr-1 text-red-500">{message}</p>
			<AlertIcon />
		</>
	);
};

const SuccessMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p color="success" className="mr-1" style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>
				{message}
			</p>
			<SuccessIcon />
		</>
	);
};

export const PaymentSection = () => {
	const { order } = useOrder();
	const paymentStatus = usePaymentStatus(order);

	return (
		<Section title="Pago">
			<div data-testid="paymentStatus">
				<div className="flex flex-row items-center">
					{paymentStatus === "authorized" && (
						<SuccessMessage message="Hemos recibido tu autorización de pago" />
					)}

					{paymentStatus === "paidInFull" && <SuccessMessage message="Hemos recibido tu pago" />}

					{paymentStatus === "overpaid" && (
						<ErrorMessage message="Tu pedido ha sido pagado por más de lo debido. Esto puede ser un error durante el pago. Contacta al personal de la tienda para obtener ayuda." />
					)}
				</div>
			</div>
		</Section>
	);
};
