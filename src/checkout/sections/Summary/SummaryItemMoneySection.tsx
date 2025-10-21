import { type OrderLineFragment } from "@/checkout/graphql";
import { SummaryItemMoneyInfo } from "@/checkout/sections/Summary/SummaryItemMoneyInfo";

interface LineItemQuantitySelectorProps {
	line: OrderLineFragment;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
	return (
		<div className="flex flex-col items-end">
			<p style={{ color: "#757575", fontSize: "14px", fontWeight: 300 }}>Cantidad: {line.quantity}</p>
			<SummaryItemMoneyInfo {...line} undiscountedUnitPrice={line.undiscountedUnitPrice.gross} />
		</div>
	);
};
