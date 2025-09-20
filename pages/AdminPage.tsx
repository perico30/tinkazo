import React, { useState, useEffect } from 'react';
import type { AppConfig } from '../types';
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


interface AdminPageProps {
  initialConfig: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onLogout: () => void;
  onExit: () => void;
  onProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => void;
  onProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => void;
}

type AdminTab = 'dashboard' | 'config' | 'teams' | 'jornadas' | 'users' | 'withdrawals' | 'recharges';

const AdminPage: React.FC<AdminPageProps> = ({ initialConfig, onSave, onLogout, onExit, onProcessWithdrawal, onProcessSellerRecharge }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [draftConfig, setDraftConfig] = useState<AppConfig>(initialConfig);
  
  useEffect(() => {
    setDraftConfig(initialConfig);
  }, [initialConfig]);
  
  const handleSave = () => {
    onSave(draftConfig);
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
        return <DashboardTab />;
      case 'config':
        return <ConfigurationTab config={draftConfig} setConfig={setDraftConfig} />;
      case 'teams':
        return <TeamsTab config={draftConfig} setConfig={setDraftConfig} />;
       case 'jornadas':
        return <JornadasTab config={draftConfig} setConfig={setDraftConfig} />;
      case 'users':
        return <UsersTab config={draftConfig} setConfig={setDraftConfig} onActivateUser={handleDraftActivateUser} onRechargeUser={handleDraftRechargeUser} />;
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-cyan-400">Panel Admin</h1>
          <p className="text-sm text-gray-400">{initialConfig.appName}</p>
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
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
           {isConfigTabActive && (
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors"
              >
                <SaveIcon />
                Guardar Cambios
              </button>
           )}
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;