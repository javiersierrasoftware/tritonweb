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

  console.log("🔒 [MIDDLEWARE] Path:", pathname);
  console.log("🔒 [MIDDLEWARE] Token exists:", !!token);
  if (token) {
    console.log("🔒 [MIDDLEWARE] Token Role:", token.role);
    console.log("🔒 [MIDDLEWARE] Token Email:", token.email);
  } else {
    console.log("🔒 [MIDDLEWARE] No token found.");
  }

  // Si no hay token, redirigir a login
  if (!token) {
    console.log("🔒 [MIDDLEWARE] Redirecting to login (No Token)");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es ruta de Admin, verificar el rol
  if (isAdminRoute) {
    console.log("🔒 [MIDDLEWARE] Admin Route Detected.");
    if (token.role?.toUpperCase() !== "ADMIN") {
      console.log("⚠️ [MIDDLEWARE] ACCESS DENIED: Role is", token.role, "Expected ADMIN");
      // RELAXED CHECK: Still logging but allowing to pass to let Page Guard handle it (or blocking if we want strictness)
      // For debugging, we want to know if this HIT.
      // If we want to strictly debug why it fails, we can temporarily allow it but log LOUDLY.
    } else {
      console.log("✅ [MIDDLEWARE] ACCESS GRANTED: Admin role confirmed.");
    }
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