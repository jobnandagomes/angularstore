// Implementação de estratégia Offline-First com IndexedDB
export const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ngsw-worker.js', {
      scope: '/',
      type: 'module'
    }).then((registration) => {
      // Configuração de atualizações em background
      registration.update();
    });
  }
}

// Estratégia de pré-cache para assets críticos
const PRECACHE_CONFIG = {
  cacheName: 'tech-store-core-v1',
  plugins: [
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Dias
    }),
  ],
}; 