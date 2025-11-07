type GraphQLResponse = {
	data?: {
		__schema?: {
			types?: Array<{ name?: string }>;
		};
	};
};

export default async function DebugPage() {
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	const token = process.env.SALEOR_APP_TOKEN;

	let apiStatus = "❌ No configurado";
	let testQuery = "❌ No ejecutado";

	if (apiUrl && token) {
		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					query: "{ __schema { types { name } } }",
				}),
			});

			if (response.ok) {
				apiStatus = "✅ API responde correctamente";
				const data = (await response.json()) as GraphQLResponse;
				testQuery = `✅ Query ejecutada: ${data.data?.__schema?.types?.length || 0} tipos encontrados`;
			} else {
				apiStatus = `❌ API error: ${response.status} ${response.statusText}`;
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			apiStatus = `❌ Error de conexión: ${errorMessage}`;
		}
	}

	return (
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">Debug - Estado de la Aplicación</h1>

			<div className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold">Variables de Entorno:</h2>
					<p>API URL: {apiUrl || "❌ No configurado"}</p>
					<p>Token: {token ? "✅ Configurado" : "❌ No configurado"}</p>
					<p>Storefront URL: {process.env.NEXT_PUBLIC_STOREFRONT_URL || "❌ No configurado"}</p>
					<p>Canal: {process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "❌ No configurado"}</p>
				</div>

				<div>
					<h2 className="text-lg font-semibold">Estado de la API:</h2>
					<p>{apiStatus}</p>
					<p>{testQuery}</p>
				</div>

				<div>
					<h2 className="text-lg font-semibold">Información del Servidor:</h2>
					<p>Node ENV: {process.env.NODE_ENV}</p>
					<p>Timestamp: {new Date().toISOString()}</p>
				</div>
			</div>
		</div>
	);
}
