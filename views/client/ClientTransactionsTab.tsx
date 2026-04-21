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
        return <span className={`font-bold ${colorClass} w-16 text-right inline-block text-[10px]`}>{sign}{Math.floor(Math.abs(amount))}</span>;
    };

    const getTransactionLabel = (type: string) => {
        switch (type) {
             case 'recharge': return 'Recarga';
             case 'transfer_in': return 'Recibido';
             case 'transfer_out': return 'Enviado';
             case 'withdrawal': return 'Retiro';
             case 'prize': return 'Premio';
             case 'ticket_purchase': return 'Cartón';
             case 'commission': return 'Comisión';
             default: return 'Otro';
         }
    };

    return (
        <details className="bg-gray-800 rounded-lg p-3 border border-gray-700/50 group">
            <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                <span>Historial de Movimientos ({historyItems.length})</span>
                <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            
            <div className="mt-3 bg-gray-900/50 rounded overflow-hidden border border-gray-700/50">
               {historyItems.length === 0 ? (
                    <p className="text-center text-gray-500 text-xs py-4">No hay transacciones registradas.</p>
               ) : (
                   <div className="flex flex-col divide-y divide-gray-700/50">
                        {historyItems.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center p-2 text-xs hover:bg-gray-700/30 transition-colors">
                                <div className="flex items-center gap-2 truncate pr-2">
                                    <span className="text-gray-500 text-[9px] w-8 flex-shrink-0">
                                        {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                    <div className="truncate">
                                        <p className="font-semibold text-gray-300 text-[10px] uppercase truncate">{getTransactionLabel(tx.type)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                                    <span className={`px-1 py-0.5 text-[8px] font-bold rounded uppercase ${tx.statusColor}`}>
                                        {tx.statusLabel}
                                    </span>
                                    {formatAmount(tx.amount, tx.type)}
                                </div>
                            </div>
                        ))}
                    </div>
               )}
            </div>
        </details>
    );
};

export default ClientTransactionsTab;
