'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

// --- SVG Icons (22px optimized) ---
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Nav Items ---
interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  isCenter?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: HomeIcon },
  { id: 'jornadas', label: 'Jornadas', icon: TargetIcon },
  { id: 'play', label: 'JUGAR', icon: PlusIcon, isCenter: true },
  { id: 'tickets', label: 'Cartones', icon: TicketIcon },
  { id: 'profile', label: 'Perfil', icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const {
    currentUser, userRole,
    navigateToHome, navigateToClientPanel,
    showPurchaseSheet,
  } = useApp();

  // --- Visibility: ONLY for logged-in clients on non-panel pages ---
  const hiddenPaths = ['/admin', '/seller', '/promoter', '/login', '/register'];
  const isClient = currentUser && userRole === 'client';
  const isOnHiddenPath = hiddenPaths.some(p => pathname.startsWith(p));
  if (!isClient || isOnHiddenPath || showPurchaseSheet) return null;

  // --- Active state ---
  const getIsActive = (id: string): boolean => {
    switch (id) {
      case 'home': return pathname === '/';
      case 'jornadas': return false; // will link to jornadas section
      case 'tickets': return pathname === '/client';
      case 'profile': return false;
      default: return false;
    }
  };

  // --- Click handlers ---
  const getOnClick = (id: string) => {
    switch (id) {
      case 'home': return navigateToHome;
      case 'jornadas': return navigateToHome; // scrolls to jornadas on home
      case 'play': return navigateToHome; // opens jornada play
      case 'tickets': return navigateToClientPanel;
      case 'profile': return navigateToClientPanel;
      default: return navigateToHome;
    }
  };

  return (
    <nav
      className="fixed bottom-6 left-4 right-4 z-[999] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.5)] md:left-1/2 md:-translate-x-1/2 md:max-w-[420px] md:right-auto md:w-full"
    >
      <div className="flex items-center justify-around h-[68px] px-2">
        {NAV_ITEMS.map((item) => {
          // --- Central JUGAR button ---
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={getOnClick(item.id)}
                className="flex flex-col items-center justify-center -mt-5 flex-1 min-h-0"
                aria-label="Jugar"
              >
                <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 ring-4 ring-slate-900 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.4),0_8px_20px_rgba(139,92,246,0.3)] flex items-center justify-center active:scale-90 transition-transform">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[9px] uppercase font-black tracking-widest text-cyan-400 mt-1 leading-none">
                  JUGAR
                </span>
              </button>
            );
          }

          // --- Regular nav item ---
          const isActive = getIsActive(item.id);
          return (
            <button
              key={item.id}
              onClick={getOnClick(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-0 transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-105'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-[22px] h-[22px]" />
              <span className="text-[9px] uppercase font-black tracking-widest leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
