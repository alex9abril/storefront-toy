import { executeGraphQL } from "@/lib/graphql";
import { AllWarehousesDocument } from "@/gql/graphql";

export default async function DebugWarehousesPage() {
	console.log("🔍 Debug - Checking warehouse configuration...");

	const { warehouses } = await executeGraphQL(AllWarehousesDocument, {
		variables: { first: 100 },
		withAuth: false,
	});

	const warehouseList = warehouses?.edges.map((edge) => edge.node) || [];

	console.log("🔍 Debug - Warehouse configuration:", {
		totalWarehouses: warehouseList.length,
		warehouses: warehouseList.map((w) => ({
			id: w.id,
			name: w.name,
			clickAndCollectOption: w.clickAndCollectOption,
			isPrivate: w.isPrivate,
			address: w.address,
		})),
	});

	return (
		<div className="min-h-screen bg-white p-8">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-8 text-3xl font-bold">Diagnóstico de Almacenes</h1>

				<div className="mb-6 rounded-lg bg-yellow-50 p-4">
					<h2 className="mb-2 text-lg font-semibold text-yellow-800">⚠️ Configuración Requerida</h2>
					<p className="text-yellow-700">
						Para que los almacenes aparezcan como opciones de entrega, cada almacén debe tener
						<code className="mx-1 rounded bg-yellow-200 px-1">clickAndCollectOption</code>
						configurado como <code className="mx-1 rounded bg-yellow-200 px-1">LOCAL</code> o{" "}
						<code className="mx-1 rounded bg-yellow-200 px-1">ALL</code>.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Almacenes Configurados ({warehouseList.length})</h2>

					{warehouseList.length === 0 ? (
						<p className="text-gray-500">No se encontraron almacenes.</p>
					) : (
						<div className="space-y-3">
							{warehouseList.map((warehouse) => {
								const clickAndCollectOption = warehouse.clickAndCollectOption as string;
								const isDisabled = clickAndCollectOption === "DISABLED";
								const isLocal = clickAndCollectOption === "LOCAL";

								return (
									<div
										key={warehouse.id}
										className={`rounded-lg border p-4 ${
											isDisabled ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
										}`}
									>
										<div className="flex items-center justify-between">
											<div>
												<h3 className="font-semibold">{warehouse.name}</h3>
												<p className="text-sm text-gray-600">
													{warehouse.address.city}, {warehouse.address.streetAddress1}
												</p>
											</div>
											<div className="text-right">
												<span
													className={`inline-block rounded px-2 py-1 text-xs font-medium ${
														isDisabled
															? "bg-red-100 text-red-800"
															: isLocal
																? "bg-blue-100 text-blue-800"
																: "bg-green-100 text-green-800"
													}`}
												>
													{warehouse.clickAndCollectOption}
												</span>
												{warehouse.isPrivate && (
													<span className="ml-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
														PRIVADO
													</span>
												)}
											</div>
										</div>

										{isDisabled && (
											<div className="mt-2 text-sm text-red-600">
												❌ Este almacén no está configurado para recogida en tienda
											</div>
										)}

										{!isDisabled && (
											<div className="mt-2 text-sm text-green-600">
												✅ Este almacén está configurado para recogida en tienda
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>

				<div className="mt-8 rounded-lg bg-blue-50 p-4">
					<h2 className="mb-2 text-lg font-semibold text-blue-800">📋 Instrucciones para Configurar</h2>
					<ol className="list-inside list-decimal space-y-2 text-blue-700">
						<li>Ve al panel de administración de Saleor</li>
						<li>
							Navega a <strong>Configuración → Almacenes</strong>
						</li>
						<li>Para cada almacén que quieras usar como punto de recogida:</li>
						<li>
							<ul className="ml-4 list-inside list-disc">
								<li>Edita el almacén</li>
								<li>
									En la sección <strong>&quot;Click and Collect&quot;</strong>
								</li>
								<li>
									Selecciona <strong>&quot;Local&quot;</strong> o <strong>&quot;All&quot;</strong>
								</li>
								<li>Guarda los cambios</li>
							</ul>
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
