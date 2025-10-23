export default function DebugWarehousesPage() {
	// Página de debug estática - no hace consultas GraphQL durante el build
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
					<h2 className="text-xl font-semibold">Información de Almacenes</h2>

					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<p className="text-blue-700">
							Esta página de debug muestra información sobre la configuración de almacenes. Para ver los
							almacenes reales, visita la página en el navegador después del despliegue.
						</p>
					</div>
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
