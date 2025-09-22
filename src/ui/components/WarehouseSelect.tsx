import { executeGraphQL } from "@/lib/graphql";
import { WarehousesDocument } from "@/gql/graphql";
import { getSelectedWarehouseId, setSelectedWarehouseId, getWarehouseMode } from "@/lib/warehouse";

export async function WarehouseSelect() {
	if (getWarehouseMode() !== "all") return null;
	const [data, selectedId] = await Promise.all([
		executeGraphQL(WarehousesDocument, { variables: { first: 100 }, withAuth: false }),
		getSelectedWarehouseId(),
	]);
	const warehouses = data.warehouses?.edges.map((e) => e.node) || [];
	if (!warehouses.length) return null;

	async function setWarehouse(formData: FormData) {
		"use server";
		const id = formData.get("warehouseId") as string;
		if (id) await setSelectedWarehouseId(id);
	}

	return (
		<form action={setWarehouse} className="text-sm text-neutral-700">
			<label className="mr-2">Almacén:</label>
			<select
				name="warehouseId"
				defaultValue={selectedId || undefined}
				className="rounded-md border border-neutral-300 px-2 py-1"
			>
				{warehouses.map((w) => (
					<option key={w.id} value={w.id}>
						{w.name}
					</option>
				))}
			</select>
			<button type="submit" className="btn-outline ml-2">
				Cambiar
			</button>
		</form>
	);
}
