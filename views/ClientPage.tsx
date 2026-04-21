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
import Header from '../components/Header';

interface ClientPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onUpdateCarton: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number; } | null) => void;
  onDeleteCarton: (cartonId: string) => void;
  onRequestWithdrawal: (userId: string, amount: number, userQrCodeUrl: string) => void;
  onRequestRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => void;
  onLogout: () => void;
  onExit: () => void;
  onPlayJornada: (jornada: any) => void;
}

type ClientTab = 'dashboard' | 'finance' | 'tickets' | 'profile';

const HeaderCard: React.FC<{ title: string; value: string; accentClass?: string; onRechargeClick?: () => void; onWithdrawClick?: () => void }> = ({ title, value, accentClass = '', onRechargeClick, onWithdrawClick }) => (
    <div className={`stat-card ${accentClass} flex-1`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{title}</h3>
            <div className="flex gap-2">
                {onRechargeClick && <button onClick={onRechargeClick} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded hover:bg-green-500/40">Recargar</button>}
                {onWithdrawClick && <button onClick={onWithdrawClick} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded hover:bg-purple-500/40">Retirar</button>}
            </div>
        </div>
        <p className="text-3xl font-black text-white stat-value">{value}</p>
    </div>
);

const ClientPage: React.FC<ClientPageProps> = ({ currentUser, config, onUpdateUser, onUpdateCarton, onDeleteCarton, onRequestWithdrawal, onRequestRecharge, onLogout, onExit, onPlayJornada }) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard');
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewCarton = (carton: Carton) => setViewingCarton(carton);
  const handleCloseCartonModal = () => setViewingCarton(null);

  const tabs: { id: ClientTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Inicio', icon: HomeIcon },
    { id: 'finance', label: 'Financiero', icon: WalletIcon },
    { id: 'tickets', label: 'Mis cartones', icon: TicketIcon },
    { id: 'profile', label: 'Configuración', icon: GearIcon },
  ];

  const myCartones = config.cartones.filter(c => c.userId === currentUser.id);
  const totalWinnings = myCartones.reduce((sum, carton) => sum + (carton.prizeWon || 0), 0);
  const winningCartones = myCartones.filter(c => c.prizeWon && c.prizeWon > 0);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <ClientDashboardTab currentUser={currentUser} config={config} onPlayJornada={onPlayJornada} />;
      case 'finance':
        return (
            <div className="space-y-6">
               <ClientRechargeTab 
                  currentUser={currentUser} 
                  config={config} 
                  onRequestWithdrawal={onRequestWithdrawal}
                  onRequestRecharge={onRequestRecharge}
               />
               <ClientTransactionsTab 
                  transactions={config.transactions}
                  rechargeRequests={config.rechargeRequests}
                  userId={currentUser.id}
               />
            </div>
        );
      case 'tickets':
        return <ClientTicketsTab 
                  cartones={myCartones}
                  jornadas={config.jornadas}
                  teams={config.teams}
                  onViewCarton={handleViewCarton}
                  onDeleteCarton={onDeleteCarton}
               />;
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
        
        <Header 
          appName={config.appName}
          logoUrl={config.logoUrl}
          userRole="client"
          currentUser={currentUser}
          primaryColor={config.theme.primaryColor}
          userCartonCount={myCartones.length}
          onHomeClick={onExit}
          onLoginClick={() => {}}
          onRegisterClick={() => {}}
          onAdminClick={() => {}}
          onClientPanelClick={() => {}}
          onLogoutClick={onLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
            <div className="bg-gray-800/80 p-2 text-center border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{tabs.find(t => t.id === activeTab)?.label}</span>
            </div>

            <div className="p-4 space-y-4">
                 {/* Header with metrics */}
                <div className="flex gap-3">
                    <HeaderCard 
                        title="Saldo Actual" 
                        value={`Bs ${Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}`}
                        accentClass="stat-card-cyan"
                        onRechargeClick={() => setActiveTab('finance')}
                    />
                    <HeaderCard 
                        title="Tus Ganancias" 
                        value={`Bs ${Math.floor(totalWinnings).toLocaleString('es-ES')}`}
                        accentClass="stat-card-green"
                    />
                </div>

                {/* Tab content */}
                <div className="bg-transparent rounded-lg">
                    {renderTabContent()}
                </div>
            </div>
        </main>
        
        {/* Bottom Nav */}
        <nav className="absolute left-4 right-4 bg-[#020617]/95 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] z-40 shadow-2xl shadow-cyan-900/20 overflow-hidden bottom-nav-safe" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
           <div className="flex justify-around items-center h-16 px-2">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}
                 >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-[9px] font-medium leading-tight text-center px-1 break-words">{tab.label}</span>
                 </button>
              ))}
           </div>
        </nav>
      </div>
    </>
  );
};

export default ClientPage;