import { XIcon } from "lucide-react";
import { cookies } from "next/headers";

type Props = {
	isAvailable: boolean;
};

const pClasses = "ml-1 text-sm font-semibold text-neutral-500";

export const AvailabilityMessage = async ({ isAvailable }: Props) => {
	const flashRaw = (await cookies()).get("pdp-flash")?.value;
	const flash = flashRaw ? (JSON.parse(flashRaw) as { type: string; message: string }) : null;
	return (
		<div>
			{flash?.message ? (
				<div className="mb-3 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
					{flash.message}
				</div>
			) : null}
			{!isAvailable ? (
				<div className="mt-6 flex items-center">
					<XIcon className="h-5 w-5 flex-shrink-0 text-neutral-50" aria-hidden="true" />
					<p className={pClasses}>Out of stock</p>
				</div>
			) : null}
		</div>
	);
};
