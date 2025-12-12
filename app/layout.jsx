"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "@/css/globals.css";
import "@/css/diseño.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Rutas donde NO quieres mostrar el navbar
  const rutasSinNavbar = [
    "/",
    "/login",
    "/auth",
    "/register",
    "/proyectos",
    "/terminos"
  ];

  const mostrarNavbar = !rutasSinNavbar.includes(pathname);

  /* -----------------------------------------
     REGISTRO DEL SERVICE WORKER (PWA)
  ----------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service Worker registrado"))
        .catch((err) =>
          console.error("❌ Error registrando Service Worker:", err)
        );
    }
  }, []);

  return (
    <html lang="es">
      <head>
        {/* MANIFEST PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>

      <body className="app-body">
        <div className="layout-container">
          {mostrarNavbar && <Navbar />}

          <main className={mostrarNavbar ? "layout-content" : "layout-full"}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
