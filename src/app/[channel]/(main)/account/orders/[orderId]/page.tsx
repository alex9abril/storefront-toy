import { type Metadata } from "next";
import { OrderDetailPage } from "@/ui/components/account/sections/OrderDetailPage";

export const metadata: Metadata = {
	title: "Detalle del Pedido - Mi Cuenta",
	description: "Detalle completo de tu pedido con información de productos, dirección de entrega y pago.",
};

interface OrderDetailProps {
	params: Promise<{ channel: string; orderId: string }>;
}

export default async function OrderDetail({ params }: OrderDetailProps) {
	const { orderId } = await params;

	return <OrderDetailPage orderId={orderId} />;
}
