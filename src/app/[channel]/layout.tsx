import { type ReactNode } from "react";

export const generateStaticParams = () => {
	// Usar canales hardcodeados para evitar consultas GraphQL durante el build
	const defaultChannel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web";
	return [{ channel: defaultChannel }];
};

export default function ChannelLayout({ children }: { children: ReactNode }) {
	return children;
}
