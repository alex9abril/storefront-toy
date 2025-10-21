import { NextResponse ,type  NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Rutas que requieren autenticación
	const protectedRoutes = ["/orders", "/profile", "/account"];

	// Rutas de autenticación
	const authRoutes = ["/login", "/register"];

	// Verificar si la ruta actual requiere autenticación
	const isProtectedRoute = protectedRoutes.some((route) => pathname.includes(route));
	const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

	// Si es una ruta protegida, verificar si hay token de autenticación
	if (isProtectedRoute) {
		const token = request.cookies.get("saleor-auth-token");

		if (!token) {
			// Redirigir al login si no hay token
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Si es una ruta de auth y ya hay token, redirigir al home
	if (isAuthRoute) {
		const token = request.cookies.get("saleor-auth-token");

		if (token) {
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
