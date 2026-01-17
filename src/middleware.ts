import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas de ADMIN
const adminRoutes = [
  "/stories/create",
  "/stories/manage",
  "/stories/edit",
  "/events/create",
  "/events/manage",
  "/events/edit",
  "/admin",
];

// Rutas de USUARIO (cualquier rol)
const protectedRoutes = ["/dashboard", "/perfil"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si no es una ruta protegida, no hacer nada
  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Verificar el token usando NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware checking path:", pathname);
  console.log("Token found:", token ? "YES" : "NO");
  if (token) {
    console.log("Token role:", token.role);
  }

  // Si no hay token, redirigir a login
  if (!token) {
    console.log("Redirecting to login...");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es ruta de Admin, verificar el rol
  if (isAdminRoute && token.role !== "ADMIN") {
    // Si no es admin, redirigir al dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Si el token es válido y tiene el rol correcto (o no es ruta de admin), continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /* User routes */
    "/dashboard/:path*",
    "/perfil/:path*",

    /* Admin Pages */
    "/stories/create/:path*",
    "/stories/manage/:path*",
    "/stories/edit/:path*",
    "/events/create/:path*",
    "/events/manage/:path*",
    "/events/edit/:path*",
    "/admin/:path*",
  ],
};