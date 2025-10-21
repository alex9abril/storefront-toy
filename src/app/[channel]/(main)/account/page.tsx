import { type Metadata } from "next";
import { AccountLayout } from "@/ui/components/account/AccountLayout";

export const metadata: Metadata = {
	title: "Mi Cuenta - Refacciones Toyota",
	description: "Administra tu información personal, pedidos, direcciones y métodos de pago.",
};

export default function AccountPage() {
	return <AccountLayout />;
}
