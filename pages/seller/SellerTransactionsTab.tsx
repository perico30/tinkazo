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
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Historial de Movimientos</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Fecha</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-center">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyItems.map(item => (
                            <tr key={item.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.dateStr)}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <span className="text-lg">{getTransactionIcon(item.type)}</span>
                                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                                </td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${item.statusColor}`}>
                                        {item.statusLabel}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${getTransactionColor(item.amount, item.type)}`}>
                                    {item.amount > 0 ? '+' : ''}Bs {Math.abs(item.amount).toLocaleString('es-ES')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {historyItems.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay transacciones registradas.</p>
                )}
            </div>
        </div>
    );
};

export default SellerTransactionsTab;
