import { Title } from "@/checkout/components/Title";

export default function DebugCheckoutMetadataPage() {
	// Página de debug estática - no hace consultas GraphQL durante el build
	return (
		<div className="container mx-auto p-8">
			<Title className="mb-4">Diagnóstico de Metadatos del Checkout</Title>

			<div className="mb-8 border-l-4 border-blue-500 bg-blue-100 p-4 text-blue-700">
				<p className="font-bold">📋 Instrucciones para Verificar Metadatos</p>
				<ol className="mt-2 list-inside list-decimal">
					<li>Agrega algunos productos al carrito con diferentes almacenes</li>
					<li>Ve al checkout</li>
					<li>Abre las herramientas de desarrollador (F12)</li>
					<li>Ve a la pestaña &quot;Console&quot;</li>
					<li>Busca los logs que dicen &quot;✅ Warehouse info saved to checkout line metadata&quot;</li>
					<li>Verifica que se muestren los IDs de línea, almacén y variante</li>
				</ol>
			</div>

			<div className="mb-8 border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
				<p className="font-bold">✅ Lo que deberías ver en los logs:</p>
				<pre className="mt-2 rounded bg-white p-2 text-sm">
					{`✅ Warehouse info saved to checkout line metadata: {
  lineId: "Q2hlY2tvdXRMaW5lOjEyMzQ1",
  warehouseId: "V2FyZWhvdXNlOjEyMzQ1", 
  warehouseName: "Toyota Universidad",
  variantId: "UHJvZHVjdFZhcmlhbnQ6MTIzNDU"
}`}
				</pre>
			</div>

			<div className="mb-8 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
				<p className="font-bold">🔍 Verificación en Saleor Admin</p>
				<ol className="mt-2 list-inside list-decimal">
					<li>Ve al panel de administración de Saleor</li>
					<li>
						Navega a <span className="font-semibold">Órdenes</span>
					</li>
					<li>Busca la orden más reciente</li>
					<li>
						En los detalles de la orden, busca la sección de{" "}
						<span className="font-semibold">&quot;Líneas de la orden&quot;</span>
					</li>
					<li>Cada línea debería tener metadatos con:</li>
					<ul className="ml-4 list-inside list-disc">
						<li>
							<code>warehouse_id</code>: ID del almacén seleccionado
						</li>
						<li>
							<code>warehouse_name</code>: Nombre del almacén
						</li>
						<li>
							<code>variant_id</code>: ID de la variante del producto
						</li>
					</ul>
				</ol>
			</div>

			<div className="mb-8 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
				<p className="font-bold">❌ Si no ves los logs o metadatos:</p>
				<ol className="mt-2 list-inside list-decimal">
					<li>Verifica que estés seleccionando un almacén antes de agregar al carrito</li>
					<li>Revisa la consola en busca de errores</li>
					<li>
						Asegúrate de que la mutación <code>CheckoutLineUpdateMetadataDocument</code> esté funcionando
					</li>
					<li>Verifica que el checkout tenga líneas (productos agregados)</li>
				</ol>
			</div>
		</div>
	);
}
