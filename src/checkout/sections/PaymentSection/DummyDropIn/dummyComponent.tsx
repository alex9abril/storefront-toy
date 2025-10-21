"use client";

import { useState } from "react";
import { dummyGatewayId } from "./types";
import { Button } from "@/checkout/components";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";

// Basic implementation of the test gateway:
// https://github.com/saleor/dummy-payment-app/

export const DummyComponent = () => {
	const { showCustomErrors } = useAlerts();
	const [isProcessing, setIsProcessing] = useState(false);

	const { checkout } = useCheckout();
	const [transactionInitializeState, transactionInitialize] = useTransactionInitializeMutation();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
	const isInProgress = completingCheckout || transactionInitializeState.fetching || isProcessing;

	const onInitalizeClick = async () => {
		// Prevenir múltiples clics
		if (isProcessing || isInProgress) {
			return;
		}

		setIsProcessing(true);

		console.log("🔍 Debug - Checkout total:", {
			amount: checkout.totalPrice.gross.amount,
			currency: checkout.totalPrice.gross.currency,
			checkoutId: checkout.id,
		});

		try {
			const result = await transactionInitialize({
				checkoutId: checkout.id,
				paymentGateway: {
					id: dummyGatewayId,
					data: {
						event: {
							includePspReference: true,
							type: "CHARGE_SUCCESS",
						},
					},
				},
			});

			console.log("🔍 Debug - Transaction initialize result:", result);

			if (result.data?.transactionInitialize?.transaction?.id) {
				// La transacción se inicializó correctamente, ahora completamos el checkout
				const checkoutResult = await onCheckoutComplete();

				if (checkoutResult?.apiErrors) {
					checkoutResult.apiErrors.forEach((error) => {
						showCustomErrors([{ message: error.message }]);
					});
				}
			} else {
				// Mostrar errores si los hay
				const errors = result.data?.transactionInitialize?.errors || [];
				errors.forEach((error) => {
					if (error.message) {
						showCustomErrors([{ message: error.message }]);
					}
				});
			}
		} catch (err) {
			console.error("There was a problem with Dummy Payment Gateway:", err);
			showCustomErrors([{ message: "Error al procesar el pago" }]);
		} finally {
			setIsProcessing(false);
		}
	};

	if (isInProgress) {
		return <Button variant="primary" disabled={true} label="Procesando pago..." />;
	}

	return <Button variant="primary" onClick={onInitalizeClick} label="Realizar pago y crear pedido" />;
};
