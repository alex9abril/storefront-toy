import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";

const inter = Inter({ subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className="min-h-dvh">
			<head>
				{process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID && (
					<link
						rel="stylesheet"
						href={`https://use.typekit.net/${process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID}.css`}
					/>
				)}
				{process.env.NEXT_PUBLIC_HELVETICA_NEUE_CSS && (
					<link rel="stylesheet" href={process.env.NEXT_PUBLIC_HELVETICA_NEUE_CSS} />
				)}
			</head>
			<body className={`${inter.className} min-h-dvh font-helvetica`}>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
			</body>
		</html>
	);
}
