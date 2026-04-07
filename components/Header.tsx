import React from 'react';
import type { UserRole, RegisteredUser } from '../types';
import LogoutIcon from './icons/LogoutIcon';
import GearIcon from './icons/GearIcon';
import TicketIcon from './icons/TicketIcon';

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
}

const Header: React.FC<HeaderProps> = ({ 
  appName, 
  logoUrl, 
  userRole,
  currentUser,
  primaryColor,
  userCartonCount,
  onHomeClick, 
  onLoginClick, 
  onRegisterClick,
  onAdminClick,
  onSellerPanelClick,
  onClientPanelClick,
  onLogoutClick,
}) => {
  return (
    <header 
      className="header-accent py-2 sm:py-4 px-1.5 sm:px-8 z-20 sticky top-0 border-b border-gray-800/50"
      style={{ '--glow-color': primaryColor } as React.CSSProperties}
    >
      <div className="container mx-auto flex justify-between items-center w-full">
        {/* Left Side: Logo */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          onClick={onHomeClick}
        >
          {logoUrl ? <img src={logoUrl} alt={`${appName} Logo`} className="h-7 sm:h-10 w-auto object-contain" /> : <div className="h-7 w-7 sm:h-10 sm:w-10 bg-cyan-500 rounded-full"></div>}
          <span className="text-[11px] xs:text-[14px] sm:text-2xl font-black uppercase tracking-wider text-white truncate max-w-[70px] sm:max-w-[150px]">{appName}</span>
        </div>
        
        {/* Center/Right Spacer */}
        <div className="flex-1"></div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onAdminClick}
                className="flex items-center flex-col sm:flex-row gap-0.5 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Panel Admin"
              >
                <GearIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[9px] sm:text-sm font-bold uppercase">Mi Panel</span>
              </button>
               <button
                onClick={onLogoutClick}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
              >
                 <LogoutIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                <span className="text-[9px] sm:text-sm uppercase">Salir</span>
              </button>
            </div>
          ) : currentUser ? (
            <div className="flex items-center gap-1 sm:gap-3 justify-end">
              
              {/* User Greeting - Restricting width heavily for mobile */}
              <div className="hidden xs:flex flex-col items-end leading-none text-right">
                <span className="text-[8px] sm:text-[10px] font-semibold text-gray-400">Hola,</span>
                <span className="text-[10px] sm:text-sm font-bold text-white truncate max-w-[45px] sm:max-w-[100px] leading-tight">{currentUser.username}</span>
              </div>

              {/* Balance */}
              {(userRole === 'client' || userRole === 'seller') && (
                <div className="flex flex-col items-center bg-cyan-900/40 border border-cyan-800/80 px-1.5 py-0.5 rounded-md min-w-[35px]">
                    <span className="text-[7px] text-gray-400 font-bold leading-none uppercase tracking-widest">Saldo</span>
                    <span className="text-[10px] sm:text-sm font-black text-cyan-300 leading-tight">Bs {Math.floor(currentUser.balance || 0)}</span>
                </div>
              )}

              {/* Tickets */}
              {userRole === 'client' && typeof userCartonCount !== 'undefined' && userCartonCount > 0 && (
                <div className="flex items-center gap-0.5 text-xs bg-purple-500/30 px-1.5 py-0.5 rounded-md border border-purple-500/40 shrink-0">
                    <TicketIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-300" />
                    <span className="font-bold text-white text-[9px] sm:text-xs">{userCartonCount}</span>
                </div>
              )}

              {/* Panel Button */}
              {userRole === 'seller' && onSellerPanelClick && (
                 <button
                    onClick={onSellerPanelClick}
                    className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg transition-colors shrink-0 text-white"
                >
                    <GearIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                    <span className="text-[7.5px] sm:text-sm font-bold uppercase tracking-wider">Mi Panel</span>
                </button>
              )}
              {userRole === 'client' && onClientPanelClick && (
                 <button
                    onClick={onClientPanelClick}
                    className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg transition-colors shrink-0 text-white"
                >
                    <GearIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                    <span className="text-[7.5px] sm:text-sm font-bold uppercase tracking-wider">Mi Panel</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogoutClick}
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-2 py-0.5 sm:px-4 sm:py-2 bg-red-600/90 border border-red-500/50 text-white rounded-lg hover:bg-red-500 transition-colors shrink-0"
              >
                 <LogoutIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                 <span className="font-bold text-[7.5px] sm:text-sm uppercase tracking-wider">Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onLoginClick}
                className="px-2 py-1.5 sm:px-6 sm:py-2 text-white font-semibold text-[10px] xs:text-xs sm:text-base rounded-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                Inicia sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-2 py-1.5 sm:px-6 sm:py-2 text-white font-bold text-[10px] xs:text-xs sm:text-base rounded-lg shadow-lg btn-gradient"
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