import Link from "next/link";

export const StaticNavLinks = ({ channel: _channel }: { channel: string }) => {
	return (
		<>
			<Link
				href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}`}
				className="block py-3 text-lg font-medium text-gray-900 transition-colors hover:text-[#EB0A1E]"
			>
				Inicio
			</Link>
			<Link
				href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}/categories/refacciones-toyota`}
				className="block py-3 text-lg font-medium text-gray-900 transition-colors hover:text-[#EB0A1E]"
			>
				Productos
			</Link>
			<Link
				href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}/blog`}
				className="block py-3 text-lg font-medium text-gray-900 transition-colors hover:text-[#EB0A1E]"
			>
				Blog
			</Link>
			<Link
				href={`/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "toyota-web"}/contact`}
				className="block py-3 text-lg font-medium text-gray-900 transition-colors hover:text-[#EB0A1E]"
			>
				Contacto
			</Link>
		</>
	);
};
