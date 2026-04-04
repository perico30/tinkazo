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
}

type SellerTab = 'dashboard' | 'clients' | 'my-tickets' | 'client-recharges' | 'transactions' | 'recharge' | 'settings';

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


const SellerPage: React.FC<SellerPageProps> = ({ currentUser, config, onUpdateUser, onRequestRecharge, onProcessClientRecharge, onTransferBalance, onLogout, onExit, onUpdateCarton }) => {
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
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'clients', label: 'Mis Clientes', icon: UsersIcon },
    { id: 'my-tickets', label: 'Mis Cartones', icon: TicketIcon },
    { id: 'client-recharges', label: 'Solicitudes de Clientes', icon: CheckCircleIcon },
    { id: 'transactions', label: 'Historial', icon: WalletIcon },
    { id: 'recharge', label: 'Recargar Mi Saldo', icon: WalletIcon },
    { id: 'settings', label: 'Configuración', icon: GearIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <SellerDashboardTab currentUser={currentUser} config={config} />;
      case 'clients':
        return <SellerClientsTab 
                  currentUser={currentUser} 
                  config={config} 
                  onViewClientTickets={handleViewClientTickets}
                  onTransferBalance={onTransferBalance}
                />;
      case 'my-tickets':
        return <SellerTicketsTab
            cartones={config.cartones.filter(c => c.userId === currentUser.id)}
            jornadas={config.jornadas}
            teams={config.teams}
            onViewCarton={handleViewCarton}
        />;
      case 'client-recharges':
        return <ClientRechargesTab currentUser={currentUser} config={config} onProcessClientRecharge={onProcessClientRecharge} />;
      case 'transactions':
        return <SellerTransactionsTab 
            currentUser={currentUser} 
            transactions={config.transactions.filter(t => t.userId === currentUser.id)} 
            rechargeRequests={config.rechargeRequests.filter(r => r.userId === currentUser.id)}
            users={config.users} 
        />;
      case 'recharge':
        return <SellerRechargeTab config={config} currentUser={currentUser} onRequestRecharge={onRequestRecharge} />;
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
                      title="Mi Saldo" 
                      value={`Bs ${Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}`}
                      onRechargeClick={() => setActiveTab('recharge')}
                  />
                  <HeaderCard 
                      title="Comisiones" 
                      value={`Bs ${Math.floor(config.transactions.filter(t => t.userId === currentUser.id && t.type === 'commission').reduce((sum, tx) => sum + tx.amount, 0)).toLocaleString('es-ES')}`}
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
           <div className="flex justify-around items-center h-16 px-2 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}
                 >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-[10px] font-medium leading-none truncate w-full text-center">{tab.label.split(' ')[0]}</span>
                 </button>
              ))}
           </div>
        </nav>
      </div>
    </>
  );
};

export default SellerPage;