import React, { useState, useMemo } from 'react';
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
    const [subTab, setSubTab] = useState<'recharges' | 'withdrawals' | 'transactions'>('recharges');

    const allTransactions = useMemo(() => {
        return config.transactions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [config.transactions]);

    const getUserName = (userId: string) => {
        const user = config.users.find(u => u.id === userId);
        if (user) return user.username;
        const promoter = config.promoterProfiles.find(p => p.userId === userId);
        if (promoter) return promoter.displayName;
        return 'Desconocido';
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'recharge': '💳 Recarga',
            'commission': '💰 Comisión',
            'ticket_purchase': '🎫 Compra cartón',
            'purchase': '🎫 Compra cartón',
            'transfer_out': '📤 Transferencia enviada',
            'transfer_in': '📥 Transferencia recibida',
            'withdrawal': '🏦 Retiro',
            'prize': '🏆 Premio',
        };
        return labels[type] || type;
    };

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
                <button
                    onClick={() => setSubTab('transactions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${subTab === 'transactions' ? 'bg-cyan-500 text-gray-900 shadow-md transform scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                >
                    📝 Transacciones
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
                {subTab === 'transactions' && (
                    <div className="animate-fade-in">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h2 className="font-semibold text-lg mb-4">Historial de Transacciones ({allTransactions.length})</h2>
                            
                            {/* Mobile cards */}
                            <div className="md:hidden space-y-2">
                                {allTransactions.slice(0, 100).map(tx => (
                                    <div key={tx.id} className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="font-bold text-white text-xs">{getUserName(tx.userId)}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleString('es-ES')}</p>
                                            </div>
                                            <span className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.amount >= 0 ? '+' : ''}Bs {Math.floor(tx.amount).toLocaleString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{getTypeLabel(tx.type)}</span>
                                            <span className="text-[10px] text-gray-500 truncate">{tx.description}</span>
                                        </div>
                                    </div>
                                ))}
                                {allTransactions.length === 0 && <p className="text-center text-gray-500 py-8">No hay transacciones.</p>}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-300">
                                    <thead className="text-[11px] text-gray-300 uppercase tracking-wider bg-slate-800/80">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Fecha</th>
                                            <th scope="col" className="px-4 py-3">Usuario</th>
                                            <th scope="col" className="px-4 py-3">Tipo</th>
                                            <th scope="col" className="px-4 py-3">Descripción</th>
                                            <th scope="col" className="px-4 py-3 text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTransactions.slice(0, 200).map(tx => (
                                            <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(tx.createdAt).toLocaleString('es-ES')}</td>
                                                <td className="px-4 py-3 font-medium whitespace-nowrap">{getUserName(tx.userId)}</td>
                                                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{getTypeLabel(tx.type)}</span></td>
                                                <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">{tx.description}</td>
                                                <td className={`px-4 py-3 text-right font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {tx.amount >= 0 ? '+' : ''}Bs {Math.floor(tx.amount).toLocaleString('es-ES')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {allTransactions.length === 0 && <p className="text-center text-gray-500 py-8">No hay transacciones.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFinancialTab;

