import React, { useState, useEffect } from 'react';
import type { AppConfig, RegisteredUser, Carton } from '../types';
import DashboardTab from './admin/DashboardTab';
import ConfigurationTab from './admin/ConfigurationTab';
import TeamsTab from './admin/TeamsTab';
import JornadasTab from './admin/JornadasTab';
import UsersTab from './admin/UsersTab';
import WithdrawalsTab from './admin/WithdrawalsTab';
import RechargesTab from './admin/RechargesTab';
import SaveIcon from '../components/icons/SaveIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import GearIcon from '../components/icons/GearIcon';
import HomeIcon from '../components/icons/HomeIcon';
import UsersIcon from '../components/icons/UsersIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import UsersGroupIcon from '../components/icons/UsersGroupIcon';
import BanknotesIcon from '../components/icons/BanknotesIcon';
import CreditCardIcon from '../components/icons/CreditCardIcon';
import AdminClientTicketsModal from './admin/AdminClientTicketsModal';
import CartonModal from '../components/CartonModal';
import MenuIcon from '../components/icons/MenuIcon';
import CloseIcon from '../components/icons/CloseIcon';


interface AdminPageProps {
  initialConfig: AppConfig;
  onSave: (newConfig: AppConfig) => Promise<void>;
  onLogout: () => void;
  onExit: () => void;
  onProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => void;
  onProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => void;
}

type AdminTab = 'dashboard' | 'config' | 'teams' | 'jornadas' | 'users' | 'withdrawals' | 'recharges';

const AdminPage: React.FC<AdminPageProps> = ({ initialConfig, onSave, onLogout, onExit, onProcessWithdrawal, onProcessSellerRecharge }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [draftConfig, setDraftConfig] = useState<AppConfig>(initialConfig);
  const [viewingClientTickets, setViewingClientTickets] = useState<RegisteredUser | null>(null);
  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    setDraftConfig(initialConfig);
  }, [initialConfig]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draftConfig);
    } catch (e) {
      console.error("Failed to save configuration:", e);
      // Notification is handled upstream in App.tsx's onSave prop
    } finally {
      setIsSaving(false);
    }
  };

  const handleDraftActivateUser = (userId: string) => {
    setDraftConfig(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? { ...u, status: 'active' } : u)
    }));
    alert('¡Usuario activado! Recuerda guardar los cambios para que sea permanente.');
  };

  const handleDraftRechargeUser = (userId: string, amount: number) => {
    if (amount <= 0) {
        alert('El monto de la recarga debe ser positivo.');
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
    { id: 'config', label: 'Configuración', icon: GearIcon },
    { id: 'teams', label: 'Equipos', icon: UsersIcon },
    { id: 'jornadas', label: 'Jornadas', icon: CalendarIcon },
    { id: 'users', label: 'Usuarios', icon: UsersGroupIcon },
    { id: 'recharges', label: 'Recargas', icon: CreditCardIcon },
    { id: 'withdrawals', label: 'Retiros', icon: BanknotesIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardTab config={draftConfig} />;
      case 'config':
        return <ConfigurationTab config={draftConfig} setConfig={setDraftConfig} />;
      case 'teams':
        return <TeamsTab config={draftConfig} setConfig={setDraftConfig} />;
       case 'jornadas':
        return <JornadasTab config={draftConfig} setConfig={setDraftConfig} />;
      case 'users':
        return <UsersTab config={draftConfig} setConfig={setDraftConfig} onActivateUser={handleDraftActivateUser} onRechargeUser={handleDraftRechargeUser} onViewClientTickets={handleViewClientTickets} />;
      case 'recharges':
        return <RechargesTab config={draftConfig} onProcessSellerRecharge={onProcessSellerRecharge} />;
      case 'withdrawals':
        return <WithdrawalsTab config={draftConfig} onProcessWithdrawal={onProcessWithdrawal} />;
      default:
        return null;
    }
  }

  const isConfigTabActive = ['config', 'teams', 'jornadas', 'users'].includes(activeTab);

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
      <div className="relative flex h-screen bg-gray-900 text-white">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 sidebar-bg p-4 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-start mb-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-cyan-400">Panel Admin</h1>
              <p className="text-sm text-gray-400">{initialConfig.appName}</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white" aria-label="Cerrar menú">
                <CloseIcon className="h-6 w-6"/>
            </button>
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
          <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-300 hover:text-white" aria-label="Abrir menú">
                    <MenuIcon className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
            </div>
            {isConfigTabActive && (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 text-white font-bold px-4 py-2 rounded-lg btn-gradient disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Guardando...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      <span className="hidden sm:inline">Guardar Cambios</span>
                    </>
                  )}
                </button>
            )}
          </header>
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;