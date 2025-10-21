import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Rutas que requieren autenticación
	const protectedRoutes = ["/orders", "/profile"];

	// Rutas de autenticación
	const authRoutes = ["/login", "/register"];

	// Verificar si la ruta actual requiere autenticación
	const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route));
	const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

	// Para /account, permitir acceso sin verificar cookies
	// El componente AccountLayout manejará la autenticación del lado del cliente
	if (pathname.includes("/account")) {
		return NextResponse.next();
	}

	// Si es una ruta protegida, verificar si hay token de autenticación
	if (isProtectedRoute) {
		// Buscar múltiples posibles nombres de cookies de autenticación
		const possibleTokens = ["saleor-auth-token", "token", "auth-token", "session-token"];

		const hasToken = possibleTokens.some((tokenName) => {
			const token = request.cookies.get(tokenName);
			return token && token.value;
		});

		if (!hasToken) {
			// Redirigir al login si no hay token
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Si es una ruta de auth y ya hay token, redirigir al home
	if (isAuthRoute) {
		const possibleTokens = ["saleor-auth-token", "token", "auth-token", "session-token"];

		const hasToken = possibleTokens.some((tokenName) => {
			const token = request.cookies.get(tokenName);
			return token && token.value;
		});

		if (hasToken) {
			const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
