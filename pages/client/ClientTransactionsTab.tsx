import React, { useMemo } from 'react';
import type { Transaction, RechargeRequest } from '../../types';
import ArrowUpIcon from '../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import TrophyIcon from '../../components/icons/TrophyIcon';
import TicketIcon from '../../components/icons/TicketIcon';

interface ClientTransactionsTabProps {
    transactions: Transaction[];
    rechargeRequests: RechargeRequest[];
    userId: string;
}

const ClientTransactionsTab: React.FC<ClientTransactionsTabProps> = ({ transactions, rechargeRequests, userId }) => {
    
    const historyItems = useMemo(() => {
        const items: any[] = [];
        
        // Add all completed transactions
        transactions
            .filter(t => t.userId === userId)
            .forEach(t => items.push({
                id: `tx-${t.id}`,
                type: t.type,
                amount: t.amount,
                description: t.description,
                createdAt: t.createdAt,
                dateMs: new Date(t.createdAt).getTime(),
                statusLabel: 'Aceptada',
                statusColor: 'bg-green-500/20 text-green-300'
            }));

        // Add pending and rejected recharge requests
        rechargeRequests
            .filter(r => r.userId === userId && r.status !== 'approved')
            .forEach(r => items.push({
                id: `req-${r.id}`,
                type: 'recharge',
                amount: r.amount,
                description: `Solicitud de Recarga ${r.status === 'pending' ? 'en revisión' : 'rechazada'}`,
                createdAt: r.requestDate,
                dateMs: new Date(r.requestDate).getTime(),
                statusLabel: r.status === 'pending' ? 'Pendiente' : 'Cancelada',
                statusColor: r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-500'
            }));

        return items.sort((a, b) => b.dateMs - a.dateMs);
    }, [transactions, rechargeRequests, userId]);

    const formatAmount = (amount: number, type: string) => {
        const isPositive = ['recharge', 'transfer_in', 'prize'].includes(type);
        const sign = isPositive ? '+' : '-';
        const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
        return <span className={`font-bold ${colorClass}`}>{sign} Bs {Math.floor(Math.abs(amount)).toLocaleString('es-ES')}</span>;
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'recharge':
            case 'transfer_in':
                return <div className="p-2 bg-green-500/20 text-green-400 rounded-full"><ArrowDownIcon className="h-5 w-5" /></div>;
            case 'withdrawal':
            case 'transfer_out':
                return <div className="p-2 bg-red-500/20 text-red-400 rounded-full"><ArrowUpIcon className="h-5 w-5" /></div>;
            case 'prize':
                return <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-full"><TrophyIcon className="h-5 w-5" /></div>;
            case 'ticket_purchase':
                return <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-full"><TicketIcon className="h-5 w-5" /></div>;
            default:
                return <div className="p-2 bg-gray-500/20 text-gray-400 rounded-full"><div className="h-5 w-5 rounded-full bg-gray-500"></div></div>;
        }
    };

    const getTransactionLabel = (type: string) => {
        switch (type) {
             case 'recharge': return 'Recarga de Saldo';
             case 'transfer_in': return 'Transf. Recibida (Manual)';
             case 'transfer_out': return 'Transf. Enviada (Manual)';
             case 'withdrawal': return 'Retiro de Saldo';
             case 'prize': return 'Premio Ganado';
             case 'ticket_purchase': return 'Compra de Cartón';
             case 'commission': return 'Comisión (Vendedor)';
             default: return 'Desconocido';
         }
    }

    if (historyItems.length === 0) {
        return (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
                <h2 className="text-xl font-bold mb-4">Historial de Movimientos</h2>
                <p className="text-gray-400">
                    Aún no tienes movimientos en tu cuenta. Realiza una recarga o compra un cartón para comenzar.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Historial de Movimientos</h2>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-900/50 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2">Fecha</div>
                    <div className="col-span-3">Tipo</div>
                    <div className="col-span-3">Descripción</div>
                    <div className="col-span-2 text-center">Estado</div>
                    <div className="col-span-2 text-right">Monto</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                    {historyItems.map((tx) => (
                         // Mobile View
                        <div key={tx.id} className="block md:hidden p-4 hover:bg-gray-700/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                   {getTransactionIcon(tx.type)}
                                   <div>
                                       <p className="font-bold">{getTransactionLabel(tx.type)}</p>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                                            {new Date(tx.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                        </p>
                                   </div>
                                </div>
                                <div className="text-right">
                                    {formatAmount(tx.amount, tx.type)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${tx.statusColor}`}>
                                    {tx.statusLabel}
                                </span>
                            </div>
                            {tx.description && (
                                <p className="text-sm text-gray-500 mt-2 bg-gray-900/40 p-2 rounded-md border border-gray-700/50 border-l-2 border-l-cyan-500/50">
                                    {tx.description}
                                </p>
                            )}
                        </div>
                    ))}
                    {historyItems.map((tx) => (
                        // Desktop View
                         <div key={`${tx.id}-desktop`} className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-700/30 transition-colors">
                             <div className="col-span-2 text-sm text-gray-400">
                                 {new Date(tx.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                             </div>
                             <div className="col-span-3 flex items-center gap-3">
                                  {getTransactionIcon(tx.type)}
                                 <span className="font-semibold">{getTransactionLabel(tx.type)}</span>
                             </div>
                             <div className="col-span-3 text-sm text-gray-300">
                                  {tx.description || <span className="text-gray-600 italic">Sin descripción</span>}
                             </div>
                             <div className="col-span-2 text-center">
                                 <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${tx.statusColor}`}>
                                     {tx.statusLabel}
                                 </span>
                             </div>
                             <div className="col-span-2 text-right">
                                 {formatAmount(tx.amount, tx.type)}
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientTransactionsTab;
