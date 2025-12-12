self.addEventListener("install", (event) => {
  console.log("✅ Service Worker instalado");
  self.skipWaiting(); // fuerza activación inmediata
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activo");
  clients.claim(); // toma control de las pestañas abiertas
});

/* (opcional, más adelante puedes meter cache aquí) */
self.addEventListener("fetch", () => {});
