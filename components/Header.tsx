import React from 'react';
import type { UserRole, RegisteredUser } from '../types';
import LogoutIcon from './icons/LogoutIcon';
import GearIcon from './icons/GearIcon';

interface HeaderProps {
  appName: string;
  logoUrl: string;
  userRole: UserRole;
  currentUser: RegisteredUser | null;
  primaryColor: string;
  userCartonCount: number;
  onHomeClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAdminClick: () => void;
  onSellerPanelClick?: () => void;
  onClientPanelClick?: () => void;
  onLogoutClick: () => void;
  hideNavButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  appName, 
  logoUrl, 
  userRole,
  currentUser,
  primaryColor,
  onHomeClick, 
  onLoginClick, 
  onRegisterClick,
  onAdminClick,
  onSellerPanelClick,
  onClientPanelClick,
  onLogoutClick,
  hideNavButtons = false,
}) => {
  return (
    <header 
      className="header-accent py-2 px-3 sm:py-3 sm:px-6 z-20 sticky top-0 border-b border-gray-800/50"
      style={{ '--glow-color': primaryColor } as React.CSSProperties}
    >
      <div className="container mx-auto flex justify-between items-center w-full">
        {/* Left: Logo + App Name */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          onClick={onHomeClick}
        >
          {logoUrl 
            ? <img src={logoUrl} alt={`${appName} Logo`} className="h-7 sm:h-10 w-auto object-contain" /> 
            : <div className="h-7 w-7 sm:h-10 sm:w-10 bg-cyan-500 rounded-full"></div>
          }
          <span className="text-sm sm:text-2xl font-black uppercase tracking-wider text-white">
            {appName}
          </span>
        </div>
        
        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right: Role-based actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* ═══════════ ADMIN ═══════════ */}
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2">
              {!hideNavButtons && (
                <button
                  onClick={onAdminClick}
                  className="flex items-center flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Panel Admin"
                >
                  <GearIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[9px] sm:text-sm font-bold uppercase">Mi Panel</span>
                </button>
              )}
              <button
                onClick={onLogoutClick}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 btn-gradient text-white font-bold rounded-lg shadow-lg transition-colors"
              >
                <LogoutIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span className="text-[9px] sm:text-sm uppercase">Salir</span>
              </button>
            </div>

          /* ═══════════ SELLER / PROMOTER ═══════════ */
          ) : (userRole === 'seller' || userRole === 'promoter') && currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Balance */}
              <div className="flex flex-col items-center bg-cyan-900/40 border border-cyan-800/80 px-1.5 py-0.5 rounded-md min-w-[35px]">
                <span className="text-[7px] text-gray-400 font-bold leading-none uppercase tracking-widest">Saldo</span>
                <span className="text-[10px] sm:text-sm font-black text-cyan-300 leading-tight">
                  {userRole === 'promoter' ? '∞' : `Bs ${Math.floor(currentUser.balance || 0)}`}
                </span>
              </div>

              {/* Mi Panel */}
              {onSellerPanelClick && (
                <button
                  onClick={onSellerPanelClick}
                  className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg transition-colors text-white"
                >
                  <GearIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                  <span className="text-[7.5px] sm:text-sm font-bold uppercase tracking-wider">Mi Panel</span>
                </button>
              )}

              {/* Logout */}
              <button
                onClick={onLogoutClick}
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-2 py-0.5 sm:px-4 sm:py-2 btn-gradient text-white rounded-lg shadow-lg transition-colors"
              >
                <LogoutIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                <span className="font-bold text-[7.5px] sm:text-sm uppercase tracking-wider">Salir</span>
              </button>
            </div>

          /* ═══════════ CLIENT (logged in) ═══════════ */
          ) : currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Compact Balance Badge */}
              <div className="flex flex-col items-center bg-cyan-900/40 border border-cyan-800/80 px-1.5 py-0.5 rounded-md min-w-[35px]">
                <span className="text-[7px] text-gray-400 font-bold leading-none uppercase tracking-widest">Saldo</span>
                <span className="text-[10px] sm:text-sm font-black text-cyan-300 leading-tight">Bs {Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}</span>
              </div>

              {/* Mi Panel */}
              {onClientPanelClick && (
                <button
                  onClick={onClientPanelClick}
                  className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg transition-colors text-white"
                  title="Panel de Cliente"
                >
                  <GearIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                  <span className="text-[7px] sm:text-[10px] font-bold uppercase tracking-wider">Mi Panel</span>
                </button>
              )}

              {/* Icon-only Logout */}
              <button
                onClick={onLogoutClick}
                className="btn-gradient rounded-lg p-1.5 sm:p-2 shadow-lg active:scale-90 transition-all"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogoutIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>

          /* ═══════════ GUEST (not logged in) ═══════════ */
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="px-3 py-2 sm:px-6 sm:py-2.5 text-white font-semibold text-xs sm:text-base rounded-lg hover:bg-white/10 transition-colors border border-white/10 min-h-0"
              >
                Inicia sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-3 py-2 sm:px-6 sm:py-2.5 text-white font-bold text-xs sm:text-base rounded-lg shadow-lg btn-gradient min-h-0"
              >
                Regístrate
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;