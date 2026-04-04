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
import ClientTransactionsTab from './client/ClientTransactionsTab';
import ClientProfileTab from './client/ClientProfileTab';
import CartonModal from '../components/CartonModal';
import MenuIcon from '../components/icons/MenuIcon';
import CloseIcon from '../components/icons/CloseIcon';

interface ClientPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onUpdateCarton: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number; } | null) => void;
  onRequestWithdrawal: (userId: string, amount: number, userQrCodeUrl: string) => void;
  onRequestRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => void;
  onLogout: () => void;
  onExit: () => void;
  onPlayJornada: (jornada: any) => void;
}

type ClientTab = 'dashboard' | 'recharge' | 'tickets' | 'transactions' | 'gains' | 'profile';

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

const ClientPage: React.FC<ClientPageProps> = ({ currentUser, config, onUpdateUser, onUpdateCarton, onRequestWithdrawal, onRequestRecharge, onLogout, onExit, onPlayJornada }) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard');
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewCarton = (carton: Carton) => setViewingCarton(carton);
  const handleCloseCartonModal = () => setViewingCarton(null);

  const tabs: { id: ClientTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'recharge', label: 'Recargar / Retirar', icon: WalletIcon },
    { id: 'tickets', label: 'Mis Cartones', icon: TicketIcon },
    { id: 'transactions', label: 'Historial', icon: WalletIcon },
    { id: 'gains', label: 'Mis Ganancias', icon: TrophyIcon },
    { id: 'profile', label: 'Mi Perfil', icon: GearIcon },
  ];

  const myCartones = config.cartones.filter(c => c.userId === currentUser.id);
  const totalWinnings = myCartones.reduce((sum, carton) => sum + (carton.prizeWon || 0), 0);
  const winningCartones = myCartones.filter(c => c.prizeWon && c.prizeWon > 0);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <ClientDashboardTab currentUser={currentUser} config={config} onPlayJornada={onPlayJornada} />;
      case 'recharge':
        return <ClientRechargeTab 
                  currentUser={currentUser} 
                  config={config} 
                  onRequestWithdrawal={onRequestWithdrawal}
                  onRequestRecharge={onRequestRecharge}
               />;
      case 'tickets':
        return <ClientTicketsTab 
                  cartones={myCartones}
                  jornadas={config.jornadas}
                  teams={config.teams}
                  onViewCarton={handleViewCarton}
               />;
      case 'transactions':
        return <ClientTransactionsTab 
                  transactions={config.transactions}
                  rechargeRequests={config.rechargeRequests}
                  userId={currentUser.id}
               />;
      case 'gains':
          return <ClientGainsTab winningCartones={winningCartones} jornadas={config.jornadas} />;
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
      <div className="relative flex flex-col h-full bg-gray-900 text-white overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
            <header className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-10 p-4 border-b border-gray-800 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-cyan-400 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <button
                onClick={onLogout}
                className="p-2 rounded-full active:scale-90 transition-transform bg-gray-800/80 text-gray-400 border border-gray-700"
                >
                <LogoutIcon className="h-4 w-4"/>
              </button>
            </header>

            <div className="p-4 space-y-4">
                 {/* Header with metrics */}
                <div className="flex gap-2">
                    <HeaderCard 
                        title="Saldo Actual" 
                        value={`Bs ${Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}`}
                        onRechargeClick={() => setActiveTab('recharge')}
                    />
                    <HeaderCard 
                        title="Tus Ganancias" 
                        value={`Bs ${Math.floor(totalWinnings).toLocaleString('es-ES')}`}
                    />
                </div>

                {/* Tab content */}
                <div className="bg-transparent rounded-lg">
                    {renderTabContent()}
                </div>
            </div>
        </main>
        
        {/* Bottom Nav */}
        <nav className="absolute bottom-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-slate-800 pb-safe z-40">
           <div className="flex justify-around items-center h-16 px-2">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}
                 >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium leading-none truncate w-full text-center">{tab.label.split(' ')[0]}</span>
                 </button>
              ))}
           </div>
        </nav>
      </div>
    </>
  );
};

export default ClientPage;