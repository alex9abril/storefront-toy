"use client";
import { ErrorBoundary } from "react-error-boundary";
import { Provider as UrqlProvider } from "urql";
import { ToastContainer } from "react-toastify";
import { alertsContainerProps } from "./hooks/useAlerts/consts";
import { RootViews } from "./views/RootViews";
import { useUrqlClient } from "@/ui/components/AuthProvider";
import { PageNotFound } from "@/checkout/views/PageNotFound";
import "./index.css";

export const Root = () => {
	// Usar el contexto de urql del AuthProvider global
	const urqlClient = useUrqlClient();

	return (
		<UrqlProvider value={urqlClient}>
			<ToastContainer {...alertsContainerProps} />
			<ErrorBoundary FallbackComponent={PageNotFound}>
				<RootViews />
			</ErrorBoundary>
		</UrqlProvider>
	);
};
