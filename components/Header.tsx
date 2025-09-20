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
      className="header-accent py-4 px-8 z-20 sticky top-0"
      style={{ '--glow-color': primaryColor } as React.CSSProperties}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={onHomeClick}
        >
          {logoUrl ? <img src={logoUrl} alt={`${appName} Logo`} className="h-10 w-auto" /> : <div className="h-10 w-10 bg-cyan-500 rounded-full"></div>}
          <span className="hidden sm:block text-2xl font-bold tracking-wider text-white">{appName}</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                <GearIcon className="h-5 w-5" />
                <span>Admin</span>
              </button>
               <button
                onClick={onLogoutClick}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
              >
                 <LogoutIcon className="h-5 w-5" />
                <span>Salir</span>
              </button>
            </>
          ) : currentUser ? (
            <>
              <span className="text-white font-semibold">
                Hola, {currentUser.username}
              </span>
              {userRole === 'client' && (
                <span className="text-sm font-bold text-cyan-300 bg-slate-700/50 px-3 py-1.5 rounded-full">
                    Saldo: Bs {Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}
                </span>
              )}
              {userRole === 'client' && typeof userCartonCount !== 'undefined' && userCartonCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm bg-purple-500/30 px-3 py-1.5 rounded-full" title={`${userCartonCount} cartones comprados`}>
                    <TicketIcon className="h-4 w-4 text-purple-300" />
                    <span className="font-bold text-white">{userCartonCount}</span>
                </div>
              )}
              {userRole === 'seller' && onSellerPanelClick && (
                 <button
                    onClick={onSellerPanelClick}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                    <GearIcon className="h-5 w-5" />
                    <span>Panel Vendedor</span>
                </button>
              )}
              {userRole === 'client' && onClientPanelClick && (
                 <button
                    onClick={onClientPanelClick}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                    <GearIcon className="h-5 w-5" />
                    <span>Mi Cuenta</span>
                </button>
              )}
              <button
                onClick={onLogoutClick}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
              >
                 <LogoutIcon className="h-5 w-5" />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-6 py-2 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Inicio de sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-6 py-2 text-white font-bold rounded-lg shadow-lg btn-gradient"
              >
                Registro
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;