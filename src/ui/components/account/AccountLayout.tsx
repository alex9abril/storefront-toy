"use client";

import { useState } from "react";
import { AccountSidebar } from "./AccountSidebar";
import { Orders } from "./sections/Orders";
import { Addresses } from "./sections/Addresses";
import { Cards } from "./sections/Cards";
import { CustomerService } from "./sections/CustomerService";

export type AccountSection = "orders" | "addresses" | "cards" | "customer-service";

export function AccountLayout() {
	const [activeSection, setActiveSection] = useState<AccountSection>("orders");

	const renderContent = () => {
		switch (activeSection) {
			case "orders":
				return <Orders />;
			case "addresses":
				return <Addresses />;
			case "cards":
				return <Cards />;
			case "customer-service":
				return <CustomerService />;
			default:
				return <Orders />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
					<p className="mt-2 text-gray-600">Administra tu información personal y pedidos</p>
				</div>

				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="lg:w-1/4">
						<AccountSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
					</div>

					{/* Contenido principal */}
					<div className="lg:w-3/4">
						<div className="rounded-lg bg-white shadow-sm">{renderContent()}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
