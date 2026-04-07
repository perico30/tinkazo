import React, { useState, useEffect } from 'react';
import type { AppConfig, RegisteredUser, Carton } from '../types';
import DashboardTab from './admin/DashboardTab';
import ConfigurationTab from './admin/ConfigurationTab';
import JornadasTab from './admin/JornadasTab';
import UsersTab from './admin/UsersTab';
import AdminFinancialTab from './admin/AdminFinancialTab';
import AdminCartonesTab from './admin/AdminCartonesTab';
import SaveIcon from '../components/icons/SaveIcon';
import HomeIcon from '../components/icons/HomeIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import GearIcon from '../components/icons/GearIcon';
import UsersIcon from '../components/icons/UsersIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import UsersGroupIcon from '../components/icons/UsersGroupIcon';
import BanknotesIcon from '../components/icons/BanknotesIcon';
import CreditCardIcon from '../components/icons/CreditCardIcon';
import TicketIcon from '../components/icons/TicketIcon';
import AdminClientTicketsModal from './admin/AdminClientTicketsModal';
import CartonModal from '../components/CartonModal';
import MenuIcon from '../components/icons/MenuIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import Header from '../components/Header';


interface AdminPageProps {
  initialConfig: AppConfig;
  onSave: (newConfig: AppConfig) => Promise<void>;
  onLogout: () => void;
  onExit: () => void;
  onProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => void;
  onProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => void;
}

type AdminTab = 'dashboard' | 'config' | 'jornadas' | 'users' | 'financial' | 'cartones';

type SaveState = 'idle' | 'saving' | 'success';

const AdminPage: React.FC<AdminPageProps> = ({ initialConfig, onSave, onLogout, onExit, onProcessWithdrawal, onProcessSellerRecharge }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [draftConfig, setDraftConfig] = useState<AppConfig>(initialConfig);
  const [viewingClientTickets, setViewingClientTickets] = useState<RegisteredUser | null>(null);
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  
  useEffect(() => {
    setDraftConfig(initialConfig);
  }, [initialConfig]);
  
  const handleSave = () => {
    setSaveState('saving');
    onSave(draftConfig)
      .then(() => {
        setSaveState('success');
        setTimeout(() => setSaveState('idle'), 2000); // Revert button to idle after 2 seconds
      })
      .catch((e) => {
        console.error("Failed to save configuration:", e);
        // On error, the notification is shown by the parent component.
        // We just need to reset the button state.
        setSaveState('idle');
      });
  };

  const handleDraftActivateUser = (userId: string) => {
    setDraftConfig(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? { ...u, status: 'active' } : u)
    }));
    alert('¡Usuario activado! Recuerda guardar los cambios para que sea permanente.');
  };

  const handleDraftRechargeUser = (userId: string, amount: number) => {
    if (amount === 0 || isNaN(amount)) {
        alert('El monto a ajustar debe ser diferente de cero.');
        return;
    }
    setDraftConfig(prev => ({
        ...prev,
        users: prev.users.map(u => {
            if (u.id === userId) {
                const currentBalance = u.balance || 0;
                return { ...u, balance: currentBalance + amount };
            }
            return u;
        }),
    }));
    alert('¡Recarga exitosa! Recuerda guardar los cambios.');
  };

  const handleViewClientTickets = (client: RegisteredUser) => {
    setViewingClientTickets(client);
  };

  const handleViewCarton = (carton: Carton) => {
    setViewingCarton(carton);
  };

  const tabs: { id: AdminTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'jornadas', label: 'Jornadas', icon: CalendarIcon },
    { id: 'cartones', label: 'Cartones', icon: TicketIcon },
    { id: 'users', label: 'Usuarios', icon: UsersGroupIcon },
    { id: 'financial', label: 'Financiero', icon: BanknotesIcon },
    { id: 'config', label: 'Configuración', icon: GearIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardTab config={draftConfig} />;
      case 'cartones':
        return <AdminCartonesTab config={draftConfig} onViewCarton={handleViewCarton} />;
      case 'config':
        return <ConfigurationTab config={draftConfig} setConfig={setDraftConfig} />;
       case 'jornadas':
        return <JornadasTab config={draftConfig} setConfig={setDraftConfig} />;
      case 'users':
        return <UsersTab config={draftConfig} setConfig={setDraftConfig} onActivateUser={handleDraftActivateUser} onRechargeUser={handleDraftRechargeUser} onViewClientTickets={handleViewClientTickets} />;
      case 'financial':
        return <AdminFinancialTab config={draftConfig} onProcessWithdrawal={onProcessWithdrawal} onProcessSellerRecharge={onProcessSellerRecharge} />;
      default:
        return null;
    }
  }
  
  const renderSaveButtonContent = () => {
    switch (saveState) {
        case 'saving':
            return (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Guardando...</span>
                </>
            );
        case 'success':
            return (
                <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">¡Guardado!</span>
                </>
            );
        case 'idle':
        default:
            return (
                <>
                    <SaveIcon />
                    <span className="hidden sm:inline">Guardar Cambios</span>
                </>
            );
    }
  };

  const isConfigTabActive = ['config', 'jornadas', 'users'].includes(activeTab);

  return (
    <>
      {viewingClientTickets && (
        <AdminClientTicketsModal
          client={viewingClientTickets}
          cartones={draftConfig.cartones.filter(c => c.userId === viewingClientTickets.id)}
          jornadas={draftConfig.jornadas}
          onClose={() => setViewingClientTickets(null)}
          onViewCarton={handleViewCarton}
        />
      )}
      {viewingCarton && (
        <CartonModal
          carton={viewingCarton}
          jornada={draftConfig.jornadas.find(j => j.id === viewingCarton.jornadaId) || null}
          teams={draftConfig.teams}
          appName={draftConfig.appName}
          logoUrl={draftConfig.logoUrl}
          onClose={() => setViewingCarton(null)}
          onSave={() => { /* Admin can't edit tickets */ }}
          isReadOnly={true}
        />
      )}
      <div className="relative flex flex-col h-full bg-gray-900 text-white overflow-hidden">
        
        <Header 
          appName={draftConfig.appName}
          logoUrl={draftConfig.logoUrl}
          userRole="admin"
          currentUser={null} // Admins usually don't have a balance to show in this context
          primaryColor={draftConfig.theme.primaryColor}
          userCartonCount={0}
          onHomeClick={onExit}
          onLoginClick={() => {}}
          onRegisterClick={() => {}}
          onAdminClick={() => {}}
          onLogoutClick={onLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
            <div className="bg-gray-800/80 p-2 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center px-4">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{tabs.find(t => t.id === activeTab)?.label}</span>
                {isConfigTabActive && (
                    <button 
                      onClick={handleSave}
                      disabled={saveState !== 'idle'}
                      className={`flex shrink-0 items-center justify-center gap-2 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform text-xs sm:text-sm
                        ${saveState === 'success' ? 'bg-green-600' : 'btn-gradient'}
                        disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      {renderSaveButtonContent()}
                    </button>
                )}
            </div>
          
          <div className="p-4 overflow-y-auto">
            {renderTabContent()}
          </div>
        </main>

        {/* Bottom Nav */}
        <nav className="absolute bottom-6 left-4 right-4 bg-[#020617]/95 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] z-40 shadow-2xl shadow-cyan-900/20 overflow-hidden">
           <div className="flex justify-around items-center h-16 w-full px-1 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center min-w-[56px] h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'}`}
                 >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-[9px] font-medium leading-none truncate w-full text-center">{tab.label.split(' ')[0]}</span>
                 </button>
              ))}
           </div>
        </nav>
      </div>
    </>
  );
};

export default AdminPage;