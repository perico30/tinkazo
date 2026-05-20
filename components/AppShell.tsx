'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Notification from '@/components/Notification';
import BottomNav from '@/components/BottomNav';
import type { LegalLink } from '@/types';

// --- Legal Modal (moved from App.tsx) ---
const LegalModal: React.FC<{ content: LegalLink; onClose: () => void }> = ({ content, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div 
      className="bg-gray-800 rounded-2xl max-w-2xl w-full flex flex-col max-h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">{content.title}</h2>
        <button onClick={onClose} className="bg-gray-700 text-white rounded-full p-1.5 leading-none hover:bg-gray-600">&times;</button>
      </header>
      <div className="p-6 overflow-y-auto">
        <p className="whitespace-pre-wrap text-gray-300">{content.content}</p>
      </div>
       <footer className="p-4 border-t border-gray-700 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transition-colors">
            Cerrar
        </button>
      </footer>
    </div>
  </div>
);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const {
    appConfig, isConfigLoaded, notification, setNotification,
    legalModalContent, setLegalModalContent, dataFetchError
  } = useApp();
  const pathname = usePathname();

  const renderMainContent = () => {
    if (dataFetchError) {
      return (
        <div className="fixed inset-0 bg-[#020617] flex flex-col justify-center items-center z-50 p-6 text-center">
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <span className="text-5xl mb-4 block animate-bounce">⚠️</span>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error de Conexión</h2>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              No se pudo establecer la conexión con la base de datos de Supabase. 
              Por favor, asegúrate de configurar las variables de entorno 
              <code className="text-cyan-400 bg-cyan-950/50 px-1 py-0.5 rounded mx-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> y 
              <code className="text-cyan-400 bg-cyan-950/50 px-1 py-0.5 rounded mx-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu hosting.
            </p>
            {dataFetchError !== 'true' && (
              <div className="bg-black/40 border border-red-500/20 rounded-xl p-3 mb-6 text-left">
                <span className="text-red-400 text-xs font-bold block mb-1">Detalle del error:</span>
                <code className="text-red-300/80 text-[11px] block font-mono break-all whitespace-pre-wrap">
                  {dataFetchError}
                </code>
              </div>
            )}
            <button 
              onClick={async () => {
                if ('serviceWorker' in navigator) {
                  try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                      await registration.unregister();
                    }
                  } catch (e) {
                    console.error('Failed to unregister service workers:', e);
                  }
                }
                if ('caches' in window) {
                  try {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                  } catch (e) {
                    console.error('Failed to clear caches:', e);
                  }
                }
                window.location.reload();
              }} 
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.3)] w-full"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    if (!isConfigLoaded) {
      return (
        <div className="fixed inset-0 bg-[#020617] flex flex-col justify-center items-center z-50">
           {/* Spinning soccer ball loading */}
           <div className="relative mb-8">
             <div className="absolute inset-[-24px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
             <img 
               src="/soccer-ball.png" 
               alt="Cargando" 
               className="relative w-32 h-32 object-contain animate-spin-slow drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]"
             />
           </div>
           <p className="text-cyan-400 font-medium uppercase tracking-[0.2em] text-sm animate-pulse">Conectando...</p>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="bg-[#020617] flex justify-center items-center fixed inset-0 w-full h-full overflow-hidden">
      <main 
        className="w-full h-[100dvh] relative overflow-hidden shadow-2xl flex flex-col body-bg-space pt-safe"
        style={appConfig.theme.backgroundImageUrl ? {
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,0.75), rgba(2,6,23,0.85)), url(${appConfig.theme.backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : undefined}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar relative overscroll-none">
            {renderMainContent()}
        </div>
        
        {legalModalContent && <LegalModal content={legalModalContent} onClose={() => setLegalModalContent(null)} />}
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </main>
      
      {/* Global BottomNav — handles its own visibility */}
      <BottomNav />
    </div>
  );
}
