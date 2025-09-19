import React, { useState } from 'react';
import type { AppConfig, RegisteredUser, RechargeRequest } from '../types';
import LogoutIcon from '../components/icons/LogoutIcon';
import HomeIcon from '../components/icons/HomeIcon';
import UsersIcon from '../components/icons/UsersIcon';
import GearIcon from '../components/icons/GearIcon';
import WalletIcon from '../components/icons/WalletIcon';
import SellerDashboardTab from './seller/SellerDashboardTab';
import SellerClientsTab from './seller/SellerClientsTab';
import SellerSettingsTab from './seller/SellerSettingsTab';
import SellerRechargeTab from './seller/SellerRechargeTab';
import ClientRechargesTab from './seller/ClientRechargesTab';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';


interface SellerPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onRequestRecharge: (userId: string, amount: number, proofUrl: string) => void;
  onProcessClientRecharge: (requestId: string, action: 'approve' | 'reject', sellerId: string) => void;
  onLogout: () => void;
  onExit: () => void;
}

type SellerTab = 'dashboard' | 'clients' | 'client-recharges' | 'recharge' | 'settings';

const HeaderCard: React.FC<{ title: string; value: string; onRechargeClick?: () => void; onWithdrawClick?: () => void }> = ({ title, value, onRechargeClick, onWithdrawClick }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex-1">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
            <div className="flex gap-2">
                {onRechargeClick && <button onClick={onRechargeClick} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded hover:bg-green-500/40">Recargar</button>}
                {onWithdrawClick && <button onClick={onWithdrawClick} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded hover:bg-purple-500/40">Retirar</button>}
            </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);


const SellerPage: React.FC<SellerPageProps> = ({ currentUser, config, onUpdateUser, onRequestRecharge, onProcessClientRecharge, onLogout, onExit }) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('dashboard');
  
  const tabs: { id: SellerTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'clients', label: 'Mis Clientes', icon: UsersIcon },
    { id: 'client-recharges', label: 'Solicitudes de Clientes', icon: CheckCircleIcon },
    { id: 'recharge', label: 'Recargar Mi Saldo', icon: WalletIcon },
    { id: 'settings', label: 'Configuración', icon: GearIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <SellerDashboardTab currentUser={currentUser} config={config} />;
      case 'clients':
        return <SellerClientsTab currentUser={currentUser} config={config} />;
      case 'client-recharges':
        return <ClientRechargesTab currentUser={currentUser} config={config} onProcessClientRecharge={onProcessClientRecharge} />;
      case 'recharge':
        return <SellerRechargeTab config={config} currentUser={currentUser} onRequestRecharge={onRequestRecharge} />;
      case 'settings':
        return <SellerSettingsTab currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-cyan-400">Panel Vendedor</h1>
          <p className="text-sm text-gray-400">{currentUser.username}</p>
        </div>
        <nav className="flex-grow">
          <ul>
            {tabs.map(tab => (
              <li key={tab.id} className="mt-2">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700'}`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2">
           <button
             onClick={onExit}
             className="w-full text-left px-4 py-2 rounded-lg transition-colors hover:bg-gray-700"
            >
              Ver Página
           </button>
           <button
             onClick={onLogout}
             className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-400"
            >
             <LogoutIcon className="h-5 w-5"/>
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 space-y-6">
            {/* Header with metrics */}
            <div className="flex flex-col sm:flex-row gap-4">
                <HeaderCard 
                    title="Mi Saldo" 
                    value={`Bs ${(currentUser.balance || 0).toFixed(2)}`}
                    onRechargeClick={() => setActiveTab('recharge')}
                />
                <HeaderCard 
                    title="Ganancias (Comisiones)" 
                    value="Bs 0.00"
                />
            </div>

            {/* Tab content */}
            <div className="bg-gray-800/50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
                {renderTabContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default SellerPage;