import React from "react";
import { Title } from "@/checkout/components";
import { LinkAsButton } from "@/checkout/components/LinkAsButton";
import { ErrorContentWrapper } from "@/checkout/components/ErrorContentWrapper";

export const EmptyCartPage = () => {
	return (
		<ErrorContentWrapper>
			<Title className="mb-0 text-xl">Tu carrito está vacío</Title>
			<p>Agrega productos al carrito para continuar.</p>
			<LinkAsButton href="/" variant="secondary">
				Volver a la tienda
			</LinkAsButton>
		</ErrorContentWrapper>
	);
};
