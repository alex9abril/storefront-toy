"use client";

export function QuantityPicker({
	value = 1,
	available,
	action,
	channel,
	variantId,
	warehouseId,
	warehouseName,
}: {
	value?: number;
	available: number;
	action: (formData: FormData) => void;
	channel: string;
	variantId?: string;
	warehouseId?: string;
	warehouseName?: string;
}) {
	const maxOptions = Math.max(0, Math.floor(available || 0));
	const initial = Math.min(Math.max(1, value || 1), Math.max(1, maxOptions));

	return (
		<form action={action} className="mt-6 flex flex-col gap-2">
			<input type="hidden" name="channel" value={channel} />
			{variantId && <input type="hidden" name="variantId" value={variantId} />}
			<input type="hidden" name="availableAtSelected" value={available} />
			{warehouseId && <input type="hidden" name="warehouseId" value={warehouseId} />}
			{warehouseName && <input type="hidden" name="warehouseName" value={warehouseName} />}
			<div className="flex items-center gap-3">
				<label className="text-sm text-neutral-700">Cantidad:</label>
				<select
					name="quantity"
					className="w-20 rounded-md border border-neutral-300 px-3 py-2 text-sm"
					defaultValue={String(initial)}
					disabled={maxOptions < 1}
				>
					{Array.from({ length: maxOptions }, (_, i) => i + 1).map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
				<span className="text-xs text-neutral-600">
					{maxOptions > 0 ? `(${maxOptions} Disponibles)` : "(No disponible)"}
				</span>
			</div>
			<br />
			<button type="submit" className="btn-primary w-full" disabled={maxOptions < 1}>
				Agregar al carrito
			</button>
		</form>
	);
}
