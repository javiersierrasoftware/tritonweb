import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = [
  "/dashboard",
  "/perfil",
  "/mis-eventos",
  "/events/mis-eventos",
  // ❌ "/entrenamiento" eliminada porque es pública
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("triton_session_token")?.value || "";
  const { pathname } = req.nextUrl;

  // Solo proteger las rutas realmente privadas
  const needsAuth = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (needsAuth && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurar rutas donde aplica el middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/perfil/:path*",
    "/mis-eventos/:path*",
    "/events/mis-eventos/:path*",
    // ❌ "/entrenamiento" eliminado del matcher
  ],
};