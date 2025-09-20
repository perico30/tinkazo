import React, { useState } from 'react';
import type { AppConfig, RegisteredUser, Carton, Prediction, RechargeRequest } from '../types';
import LogoutIcon from '../components/icons/LogoutIcon';
import HomeIcon from '../components/icons/HomeIcon';
import GearIcon from '../components/icons/GearIcon';
import WalletIcon from '../components/icons/WalletIcon';
import TicketIcon from '../components/icons/TicketIcon';
import TrophyIcon from '../components/icons/TrophyIcon';
import ClientDashboardTab from './client/ClientDashboardTab';
import ClientRechargeTab from './client/ClientRechargeTab';
import ClientTicketsTab from './client/ClientTicketsTab';
import ClientGainsTab from './client/ClientGainsTab';
import ClientProfileTab from './client/ClientProfileTab';
import CartonModal from '../components/CartonModal';

interface ClientPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onUpdateCarton: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number; } | null) => void;
  onRequestWithdrawal: (userId: string, amount: number, userQrCodeUrl: string) => void;
  onRequestRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => void;
  onLogout: () => void;
  onExit: () => void;
}

type ClientTab = 'dashboard' | 'recharge' | 'tickets' | 'gains' | 'profile';

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

const ClientPage: React.FC<ClientPageProps> = ({ currentUser, config, onUpdateUser, onUpdateCarton, onRequestWithdrawal, onRequestRecharge, onLogout, onExit }) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard');
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);

  const handleViewCarton = (carton: Carton) => setViewingCarton(carton);
  const handleCloseCartonModal = () => setViewingCarton(null);

  const tabs: { id: ClientTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'recharge', label: 'Recargar / Retirar', icon: WalletIcon },
    { id: 'tickets', label: 'Mis Cartones', icon: TicketIcon },
    { id: 'gains', label: 'Mis Ganancias', icon: TrophyIcon },
    { id: 'profile', label: 'Mi Perfil', icon: GearIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <ClientDashboardTab currentUser={currentUser} />;
      case 'recharge':
        return <ClientRechargeTab 
                  currentUser={currentUser} 
                  config={config} 
                  onRequestWithdrawal={onRequestWithdrawal}
                  onRequestRecharge={onRequestRecharge}
               />;
      case 'tickets':
        return <ClientTicketsTab 
                  cartones={config.cartones.filter(c => c.userId === currentUser.id)}
                  jornadas={config.jornadas}
                  onViewCarton={handleViewCarton}
               />;
      case 'gains':
          return <ClientGainsTab />;
      case 'profile':
        return <ClientProfileTab currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      default:
        return null;
    }
  }

  return (
    <>
      {viewingCarton && (
        <CartonModal 
          carton={viewingCarton}
          jornada={config.jornadas.find(j => j.id === viewingCarton.jornadaId) || null}
          teams={config.teams}
          onClose={handleCloseCartonModal}
          onSave={onUpdateCarton}
          appName={config.appName}
          logoUrl={config.logoUrl}
        />
      )}
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 sidebar-bg p-4 flex flex-col">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-cyan-400">Mi Cuenta</h1>
            <p className="text-sm text-gray-400">{currentUser.username}</p>
          </div>
          <nav className="flex-grow">
            <ul>
              {tabs.map(tab => (
                <li key={tab.id} className="mt-2">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-sm ${
                      activeTab === tab.id
                        ? 'active-tab-gradient'
                        : 'inactive-tab'
                    }`}
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
                Volver a la Página
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
        <main className="flex-1 flex flex-col overflow-y-auto">
             <div className="p-6 space-y-6">
                 {/* Header with metrics */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <HeaderCard 
                        title="Saldo Actual" 
                        value={`Bs ${(currentUser.balance || 0).toFixed(2)}`}
                        onRechargeClick={() => setActiveTab('recharge')}
                        onWithdrawClick={() => setActiveTab('recharge')}
                    />
                    <HeaderCard 
                        title="Ganancias Totales" 
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
    </>
  );
};

export default ClientPage;