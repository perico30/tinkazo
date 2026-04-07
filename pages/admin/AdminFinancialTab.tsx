import React, { useState } from 'react';
import type { AppConfig } from '../../types';
import RechargesTab from './RechargesTab';
import WithdrawalsTab from './WithdrawalsTab';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import BanknotesIcon from '../../components/icons/BanknotesIcon';

interface AdminFinancialTabProps {
  config: AppConfig;
  onProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => void;
  onProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => void;
}

const AdminFinancialTab: React.FC<AdminFinancialTabProps> = ({ config, onProcessWithdrawal, onProcessSellerRecharge }) => {
    const [subTab, setSubTab] = useState<'recharges' | 'withdrawals'>('recharges');

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Área Financiera</h2>
            
            {/* Sub-navigation */}
            <div className="flex gap-2 p-1 bg-gray-800/80 backdrop-blur-sm rounded-xl justify-start inline-flex overflow-x-auto w-full sm:w-auto shadow-inner border border-gray-700/50">
                <button
                    onClick={() => setSubTab('recharges')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${subTab === 'recharges' ? 'bg-cyan-500 text-gray-900 shadow-md transform scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                >
                    <CreditCardIcon className="h-4 w-4" />
                    Recargas
                </button>
                <button
                    onClick={() => setSubTab('withdrawals')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${subTab === 'withdrawals' ? 'bg-cyan-500 text-gray-900 shadow-md transform scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                >
                    <BanknotesIcon className="h-4 w-4" />
                    Retiros
                </button>
            </div>

            {/* Content Container */}
            <div className="bg-gray-900/40 p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur-sm min-h-[500px]">
                {subTab === 'recharges' && (
                    <div className="animate-fade-in">
                        <RechargesTab config={config} onProcessSellerRecharge={onProcessSellerRecharge} />
                    </div>
                )}
                {subTab === 'withdrawals' && (
                    <div className="animate-fade-in">
                        <WithdrawalsTab config={config} onProcessWithdrawal={onProcessWithdrawal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFinancialTab;
