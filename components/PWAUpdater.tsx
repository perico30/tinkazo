'use client';

import { useEffect, useState } from 'react';

export default function PWAUpdater() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js?v=3')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);
        setRegistration(reg);

        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000); // Every hour

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              setShowUpdate(true);
            }
          });
        });
      })
      .catch((err) => {
        console.error('[PWA] SW registration failed:', err);
      });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdate(false);
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] flex justify-center">
      <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl max-w-md w-full border border-cyan-500/30">
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">¡Nueva versión disponible!</p>
          <p className="text-gray-400 text-xs">Actualiza para obtener las últimas mejoras.</p>
        </div>
        <button
          onClick={handleUpdate}
          className="btn-gradient px-4 py-2 rounded-lg text-white font-bold text-sm whitespace-nowrap"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
