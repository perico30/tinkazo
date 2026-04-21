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
    legalModalContent, setLegalModalContent
  } = useApp();
  const pathname = usePathname();

  const renderMainContent = () => {
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
