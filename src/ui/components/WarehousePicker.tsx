"use client";

import { useEffect, useRef, useState } from "react";
import { Store } from "lucide-react";

type Warehouse = { id: string; name: string };

export function WarehousePicker({
	warehouses,
	selectedId,
	action,
}: {
	warehouses: Warehouse[];
	selectedId?: string | null;
	action: (formData: FormData) => void;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const [currentId, setCurrentId] = useState<string>(selectedId || warehouses[0]?.id || "");

	useEffect(() => {
		setCurrentId(selectedId || warehouses[0]?.id || "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedId]);

	return (
		<label className="block" style={{ marginBottom: 15 }}>
			<div className="mb-1 text-sm font-medium text-neutral-700">Almacén</div>
			<form ref={formRef} action={action} className="relative">
				<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
					<Store className="h-5 w-5" />
				</span>
				<select
					name="warehouseId"
					className="w-full appearance-none rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-8 text-sm text-neutral-900 focus:border-neutral-800 focus:outline-none"
					value={currentId}
					onChange={(e) => {
						setCurrentId(e.target.value);
						formRef.current?.requestSubmit();
					}}
				>
					{warehouses.map((w) => (
						<option key={w.id} value={w.id}>
							{w.name}
						</option>
					))}
				</select>
				<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
					▾
				</span>
			</form>
		</label>
	);
}
