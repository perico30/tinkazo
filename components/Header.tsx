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
  onHomeClick, 
  onLoginClick, 
  onRegisterClick,
  onAdminClick,
  onSellerPanelClick,
  onClientPanelClick,
  onLogoutClick,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm py-4 px-8 z-20 border-b border-gray-700/50">
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
                className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
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
                <span className="text-sm font-bold text-cyan-300 bg-gray-700/50 px-3 py-1.5 rounded-full">
                    Saldo: Bs {(currentUser.balance || 0).toFixed(2)}
                </span>
              )}
              {userRole === 'seller' && onSellerPanelClick && (
                 <button
                    onClick={onSellerPanelClick}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <GearIcon className="h-5 w-5" />
                    <span>Panel Vendedor</span>
                </button>
              )}
              {userRole === 'client' && onClientPanelClick && (
                 <button
                    onClick={onClientPanelClick}
                    className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
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
                className="px-6 py-2 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Inicio de sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-6 py-2 text-gray-900 font-bold rounded-lg transition-colors shadow-lg"
                style={{ backgroundColor: primaryColor, filter: 'brightness(1.1)' }}
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