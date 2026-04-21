import React, { useState } from 'react';
import type { AppConfig, RegisteredUser, Carton, Prediction } from '../types';
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
import SellerTransactionsTab from './seller/SellerTransactionsTab';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ClientTicketsModal from './seller/ClientTicketsModal';
import CartonModal from '../components/CartonModal';
import TicketIcon from '../components/icons/TicketIcon';
import SellerTicketsTab from './seller/SellerTicketsTab';
import MenuIcon from '../components/icons/MenuIcon';
import CloseIcon from '../components/icons/CloseIcon';
import Header from '../components/Header';


interface SellerPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onRequestRecharge: (userId: string, amount: number, proofUrl: string) => void;
  onProcessClientRecharge: (requestId: string, action: 'approve' | 'reject', sellerId: string) => void;
  onTransferBalance: (sellerId: string, clientId: string, amount: number) => void;
  onLogout: () => void;
  onExit: () => void;
  onUpdateCarton: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number; } | null) => void;
  onPlayJornada: (jornada: any) => void;
}

type SellerTab = 'dashboard' | 'clients' | 'finance' | 'my-tickets' | 'settings';

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


const SellerPage: React.FC<SellerPageProps> = ({ currentUser, config, onUpdateUser, onRequestRecharge, onProcessClientRecharge, onTransferBalance, onLogout, onExit, onUpdateCarton, onPlayJornada }) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('dashboard');
  const [viewingClientTickets, setViewingClientTickets] = useState<RegisteredUser | null>(null);
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewClientTickets = (client: RegisteredUser) => {
    setViewingClientTickets(client);
  };

  const handleViewCarton = (carton: Carton) => {
    setViewingCarton(carton);
  };

  const tabs: { id: SellerTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Inicio', icon: HomeIcon },
    { id: 'clients', label: 'Clientes', icon: UsersIcon },
    { id: 'finance', label: 'Financiero', icon: WalletIcon },
    { id: 'my-tickets', label: 'Mis cartones', icon: TicketIcon },
    { id: 'settings', label: 'Configuración', icon: GearIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <SellerDashboardTab currentUser={currentUser} config={config} onPlayJornada={onPlayJornada} />;
      case 'clients':
        return <SellerClientsTab 
                  currentUser={currentUser} 
                  config={config} 
                  onViewClientTickets={handleViewClientTickets}
                  onTransferBalance={onTransferBalance}
                />;
      case 'finance':
        return (
            <div className="space-y-6">
                <SellerRechargeTab config={config} currentUser={currentUser} onRequestRecharge={onRequestRecharge} />
                <ClientRechargesTab currentUser={currentUser} config={config} onProcessClientRecharge={onProcessClientRecharge} />
                <SellerTransactionsTab 
                    currentUser={currentUser} 
                    transactions={config.transactions.filter(t => t.userId === currentUser.id)} 
                    rechargeRequests={config.rechargeRequests.filter(r => r.userId === currentUser.id)}
                    users={config.users} 
                />
            </div>
        );
      case 'my-tickets':
        return <SellerTicketsTab
            cartones={config.cartones.filter(c => c.userId === currentUser.id)}
            jornadas={config.jornadas}
            teams={config.teams}
            onViewCarton={handleViewCarton}
        />;
      case 'settings':
        return <SellerSettingsTab currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      default:
        return null;
    }
  }

  return (
    <>
      {viewingClientTickets && (
          <ClientTicketsModal
              client={viewingClientTickets}
              cartones={config.cartones.filter(c => c.userId === viewingClientTickets.id)}
              jornadas={config.jornadas}
              onClose={() => setViewingClientTickets(null)}
              onViewCarton={handleViewCarton}
          />
      )}
      {viewingCarton && (
          <CartonModal
              carton={viewingCarton}
              jornada={config.jornadas.find(j => j.id === viewingCarton.jornadaId) || null}
              teams={config.teams}
              appName={config.appName}
              logoUrl={config.logoUrl}
              onClose={() => setViewingCarton(null)}
              onSave={onUpdateCarton}
              isReadOnly={viewingCarton.userId !== currentUser.id}
          />
      )}      <div className="relative flex flex-col h-full bg-gray-900 text-white overflow-hidden">
        
        <Header 
          appName={config.appName}
          logoUrl={config.logoUrl}
          userRole="seller"
          currentUser={currentUser}
          primaryColor={config.theme.primaryColor}
          userCartonCount={0}
          onHomeClick={onExit}
          onLoginClick={() => {}}
          onRegisterClick={() => {}}
          onAdminClick={() => {}}
          onSellerPanelClick={() => {}}
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
                      title="Mi Saldo" 
                      value={`Bs ${Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}`}
                      accentClass="stat-card-cyan"
                      onRechargeClick={() => setActiveTab('finance')}
                  />
                  <HeaderCard 
                      title="Comisiones" 
                      value={`Bs ${Math.floor(config.transactions.filter(t => t.userId === currentUser.id && t.type === 'commission').reduce((sum, tx) => sum + tx.amount, 0)).toLocaleString('es-ES')}`}
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
        <nav className="absolute left-3 right-3 bg-[#020617]/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl z-40 shadow-2xl shadow-cyan-900/20 overflow-hidden" style={{ bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}>
           <div className="flex justify-around items-center h-16 w-full px-1 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}
                 >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-[9px] font-medium leading-tight text-center px-1 break-words">{tab.label}</span>
                 </button>
              ))}
           </div>
        </nav>
      </div>
    </>
  );
};

export default SellerPage;