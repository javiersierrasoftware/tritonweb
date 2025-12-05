import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = [
  "/dashboard",
  "/perfil",
  "/entrenamiento",
  "/mis-eventos",
  "/events/mis-eventos",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  const { pathname } = req.nextUrl;

  // Si la ruta está protegida y no hay token → Redirigir al login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configurar rutas donde aplica el middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/perfil/:path*",
    "/entrenamiento/:path*",
    "/mis-eventos/:path*",
    "/events/mis-eventos/:path*",
  ],
};