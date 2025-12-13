import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret key is not set in environment variables!");
  }
  return new TextEncoder().encode(secret);
};

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
  const token = req.cookies.get("triton_session_token")?.value;
  const { pathname } = req.nextUrl;

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si no es una ruta protegida, no hacer nada
  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar el token
  try {
    const { payload } = await jwtVerify(token, await getSecretKey());

    // Si es ruta de Admin, verificar el rol
    if (isAdminRoute && payload.role !== "ADMIN") {
      // Si no es admin, redirigir al dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si el token es válido y tiene el rol correcto (o no es ruta de admin), continuar
    return NextResponse.next();

  } catch (err) {
    // Si el token es inválido/expirado, redirigir a login y borrar cookie
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("triton_session_token");
    return response;
  }
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