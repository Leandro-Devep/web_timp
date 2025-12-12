// middleware.js
import { NextResponse } from "next/server";

// 🔹 Decodificador de JWT compatible con Edge
function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const payload = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // ⭐ Rutas públicas necesarias para que el login funcione bien
  const publicPaths = [
    "/",                // login
    "/servidores.jpg",  // tu fondo
    "/TIMP.png",        // tu logo
    "/favicon.ico",
  ];

  // Permitir rutas públicas y archivos estáticos de Next.js
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // 🔹 Leer token
  const token = request.cookies.get("token")?.value;

  // Si no hay token → regresar al login
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const data = decodeJwt(token);

  // 🔹 Solo admin puede pasar
  if (!data || data.rol !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si es admin → permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
