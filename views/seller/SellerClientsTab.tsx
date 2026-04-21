import React, { useMemo, useState } from 'react';
import type { AppConfig, RegisteredUser, Carton } from '../../types';
import { COUNTRIES } from '../../constants/countries';
import TransferModal from './TransferModal';

interface SellerClientsTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onViewClientTickets: (client: RegisteredUser) => void;
  onTransferBalance: (sellerId: string, clientId: string, amount: number) => void;
}

const SellerClientsTab: React.FC<SellerClientsTabProps> = ({ currentUser, config, onViewClientTickets, onTransferBalance }) => {
    const [transferClient, setTransferClient] = useState<RegisteredUser | null>(null);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const myClients = useMemo(() => {
        return config.users.filter(u => u.role === 'client' && u.assignedSellerId === currentUser.id);
    }, [config.users, currentUser.id]);

    const filteredClients = useMemo(() => {
        if (!searchQuery) return myClients;
        const q = searchQuery.toLowerCase();
        return myClients.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [myClients, searchQuery]);

    const getCountryName = (countryCode: string) => {
        return COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
    }

    const handleConfirmTransfer = (amount: number) => {
        if (transferClient) {
            onTransferBalance(currentUser.id, transferClient.id, amount);
            setTransferClient(null);
        }
    };

    const toggleExpand = (userId: string) => {
        setExpandedUserId(prev => prev === userId ? null : userId);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            {transferClient && (
                <TransferModal
                    client={transferClient}
                    sellerBalance={currentUser.balance || 0}
                    onClose={() => setTransferClient(null)}
                    onConfirm={handleConfirmTransfer}
                />
            )}
            <h2 className="font-semibold text-lg mb-3">Mis Clientes Asignados ({myClients.length})</h2>
            
            <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/80 border border-slate-600 p-2.5 rounded-lg mb-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-colors text-sm"
            />

            {/* ═══ MOBILE LIST (< md) ═══ */}
            <div className="md:hidden space-y-1">
                {filteredClients.map(user => {
                    const isExpanded = expandedUserId === user.id;
                    const cartonCount = config.cartones.filter(c => c.userId === user.id).length;
                    return (
                        <div key={user.id} className="rounded-lg overflow-hidden">
                            {/* Compact Row - Always visible */}
                            <button
                                onClick={() => toggleExpand(user.id)}
                                className={`w-full flex items-center gap-2.5 p-2.5 text-left transition-colors ${isExpanded ? 'bg-slate-700/70' : 'bg-slate-800/50 hover:bg-slate-700/40'}`}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm truncate">{user.username}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                                </div>
                                <span className="text-xs text-cyan-300 font-bold shrink-0">Bs {Math.floor(user.balance || 0).toLocaleString('es-ES')}</span>
                                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="bg-slate-700/40 border-t border-slate-600/50 p-3 space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-900/40 rounded-lg p-2">
                                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Saldo</span>
                                            <p className="font-bold text-cyan-300">Bs {Math.floor(user.balance || 0).toLocaleString('es-ES')}</p>
                                        </div>
                                        <div className="bg-slate-900/40 rounded-lg p-2">
                                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">País</span>
                                            <p className="font-semibold text-white">{getCountryName(user.country)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); setTransferClient(user); }} className="flex-1 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-500/30 font-bold text-xs hover:bg-green-600/30 transition">Transferir</button>
                                        <button onClick={(e) => { e.stopPropagation(); onViewClientTickets(user); }} className="flex-1 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-600/30 transition">Cartones ({cartonCount})</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredClients.length === 0 && <p className="text-center text-gray-500 py-8">{searchQuery ? 'No se encontraron resultados.' : 'No tienes clientes asignados.'}</p>}
            </div>

            {/* ═══ DESKTOP TABLE (≥ md) ═══ */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-[11px] text-gray-300 uppercase tracking-wider bg-slate-800/80">
                        <tr>
                            <th scope="col" className="px-6 py-3">Usuario</th>
                            <th scope="col" className="px-6 py-3">Correo</th>
                            <th scope="col" className="px-6 py-3">País</th>
                            <th scope="col" className="px-6 py-3">Saldo</th>
                            <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(user => {
                            const cartonCount = config.cartones.filter(c => c.userId === user.id).length;
                            return (
                                <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{getCountryName(user.country)}</td>
                                    <td className="px-6 py-4 font-semibold">Bs {Math.floor(user.balance || 0).toLocaleString('es-ES')}</td>
                                    <td className="px-6 py-4 text-right flex flex-col sm:flex-row justify-end gap-2">
                                        <button onClick={() => setTransferClient(user)} className="font-medium text-green-400 hover:underline" title="Transferir saldo">Transferir</button>
                                        <button onClick={() => onViewClientTickets(user)} className="font-medium text-cyan-400 hover:underline" title={`Ver los ${cartonCount} cartones`}>Ver Cartones</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredClients.length === 0 && <p className="text-center text-gray-500 py-8">{searchQuery ? 'No se encontraron resultados.' : 'No tienes clientes asignados.'}</p>}
            </div>
        </div>
    );
};

export default SellerClientsTab;