import compact from "lodash-es/compact";
import React, { type PropsWithChildren } from "react";
import { type AddressFragment } from "@/checkout/graphql";

interface AddressProps {
	address: AddressFragment;
}

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({ address, children, ...textProps }) => {
	const name = `${address.firstName} ${address.lastName}`;

	const { phone, city, countryArea, postalCode, streetAddress1, country } = address;

	return (
		<div className="pointer-events-none flex flex-col">
			<p
				{...textProps}
				className="font-normal"
				style={{ color: "rgb(202, 24, 24)", fontSize: "14px", fontWeight: 400 }}
			>
				{name}
			</p>
			<p {...textProps} style={{ color: "#757575", fontSize: "12px", fontWeight: 300 }}>
				{phone}
			</p>
			<p {...textProps} style={{ color: "#757575", fontSize: "12px", fontWeight: 300 }}>
				{compact([streetAddress1, city, postalCode]).join(", ")}
			</p>
			<p {...textProps} style={{ color: "#757575", fontSize: "12px", fontWeight: 300 }}>
				{compact([countryArea, country.country]).join(", ")}
			</p>
			{children}
		</div>
	);
};
