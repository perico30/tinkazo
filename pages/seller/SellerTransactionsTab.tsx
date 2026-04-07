import React, { useMemo } from 'react';
import type { Transaction, RegisteredUser, RechargeRequest } from '../../types';

interface SellerTransactionsTabProps {
  currentUser: RegisteredUser;
  transactions: Transaction[];
  rechargeRequests: RechargeRequest[];
  users: RegisteredUser[];
}

const SellerTransactionsTab: React.FC<SellerTransactionsTabProps> = ({ currentUser, transactions, rechargeRequests, users }) => {
    
    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'recharge': return '💳';
            case 'withdrawal': return '🏦';
            case 'ticket_purchase': return '🎟️';
            case 'commission': return '💰';
            case 'transfer_in': return '⬇️';
            case 'transfer_out': return '⬆️';
            case 'prize': return '🏆';
            default: return '📄';
        }
    };

    const getTransactionLabel = (type: Transaction['type'] | string) => {
        switch (type) {
             case 'recharge': return 'Recarga de Cliente';
             case 'transfer_in': return 'Transf. Recibida M.';
             case 'transfer_out': return 'Transf. Enviada M.';
             case 'withdrawal': return 'Retiro de Saldo';
             case 'prize': return 'Premio de Cliente';
             case 'ticket_purchase': return 'Cartón de Cliente';
             case 'commission': return 'Tu Comisión';
             default: return 'Desconocido';
         }
    };

    const getTransactionColor = (amount: number, type: Transaction['type']) => {
        // Amount is mostly negative for out, positive for in, but we handle colors by sign
        if (amount > 0) return 'text-green-400';
        if (amount < 0) return 'text-red-400';
        return 'text-gray-300';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    };

    const historyItems = useMemo(() => {
        const items: any[] = [];
        // True transactions are always 'approved/completed'
        transactions.forEach(t => items.push({ 
            id: `tx-${t.id}`, 
            type: t.type, 
            amount: t.amount, 
            description: t.description || '-', 
            dateStr: t.createdAt, 
            dateMs: new Date(t.createdAt).getTime(),
            statusLabel: 'Aceptada',
            statusColor: 'bg-green-500/20 text-green-300'
        }));
        
        // Pending and Rejected requests
        rechargeRequests.filter(r => r.status !== 'approved').forEach(r => items.push({ 
            id: `req-${r.id}`, 
            type: 'recharge', 
            amount: r.amount, 
            description: `Solicitud de Recarga ${r.status === 'pending' ? 'en revisión' : 'rechazada'}`, 
            dateStr: r.requestDate, 
            dateMs: new Date(r.requestDate).getTime(),
            statusLabel: r.status === 'pending' ? 'Pendiente' : 'Cancelada',
            statusColor: r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-500'
        }));

        return items.sort((a, b) => b.dateMs - a.dateMs);
    }, [transactions, rechargeRequests]);

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
                                        {new Date(tx.dateMs).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                    <div className="truncate flex items-center gap-1">
                                        <span className="text-[10px]">{getTransactionIcon(tx.type)}</span>
                                        <p className="font-semibold text-gray-300 text-[10px] uppercase truncate">{getTransactionLabel(tx.type)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                                    <span className={`px-1 py-0.5 text-[8px] font-bold rounded uppercase ${tx.statusColor}`}>
                                        {tx.statusLabel}
                                    </span>
                                    <span className={`font-bold ${getTransactionColor(tx.amount, tx.type)} w-16 text-right inline-block text-[10px]`}>
                                        {tx.amount > 0 ? '+' : (tx.amount < 0 ? '-' : '')}{Math.floor(Math.abs(tx.amount))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
               )}
            </div>
        </details>
    );
};

export default SellerTransactionsTab;
