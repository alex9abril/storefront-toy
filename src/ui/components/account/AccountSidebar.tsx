"use client";

import { type AccountSection } from "./AccountLayout";

interface AccountSidebarProps {
	activeSection: AccountSection;
	onSectionChange: (section: AccountSection) => void;
}

const menuItems = [
	{
		id: "orders" as AccountSection,
		label: "Mis Pedidos",
		icon: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
				/>
			</svg>
		),
		description: "Gestiona tus pedidos y seguimiento",
	},
	{
		id: "addresses" as AccountSection,
		label: "Mis Direcciones",
		icon: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		),
		description: "Administra tus direcciones de envío",
	},
	{
		id: "cards" as AccountSection,
		label: "Mis Tarjetas",
		icon: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
				/>
			</svg>
		),
		description: "Gestiona tus métodos de pago",
	},
	{
		id: "customer-service" as AccountSection,
		label: "Servicio al Cliente",
		icon: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
				/>
			</svg>
		),
		description: "Soporte y ayuda",
	},
];

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
	return (
		<div className="rounded-lg bg-white shadow-sm">
			<div className="p-6">
				<h2 className="text-lg font-semibold text-gray-900">Mi Cuenta</h2>
				<p className="mt-1 text-sm text-gray-600">Administra tu información</p>
			</div>

			<nav className="px-6 pb-6">
				<ul className="space-y-2">
					{menuItems.map((item) => (
						<li key={item.id}>
							<button
								onClick={() => onSectionChange(item.id)}
								className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
									activeSection === item.id
										? "bg-[#EB0A1E] text-white"
										: "text-gray-700 hover:bg-gray-50 hover:text-[#EB0A1E]"
								}`}
							>
								<div className="flex items-center gap-3">
									<div className={`${activeSection === item.id ? "text-white" : "text-[#EB0A1E]"}`}>
										{item.icon}
									</div>
									<div>
										<div className="font-medium">{item.label}</div>
										<div
											className={`text-xs ${activeSection === item.id ? "text-white/80" : "text-gray-500"}`}
										>
											{item.description}
										</div>
									</div>
								</div>
							</button>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
