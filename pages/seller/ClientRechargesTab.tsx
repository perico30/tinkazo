import React, { useState, useMemo } from 'react';
import type { AppConfig, RegisteredUser, RechargeRequest } from '../../types';

interface ClientRechargesTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onProcessClientRecharge: (requestId: string, action: 'approve' | 'reject', sellerId: string) => void;
}

const ClientRechargesTab: React.FC<ClientRechargesTabProps> = ({ currentUser, config, onProcessClientRecharge }) => {
    const [viewingProof, setViewingProof] = useState<string | null>(null);
    
    const myClientIds = useMemo(() => {
        return config.users.filter(u => u.assignedSellerId === currentUser.id).map(c => c.id);
    }, [config.users, currentUser.id]);

    const pendingRequests = useMemo(() => {
        return config.rechargeRequests
            .filter(r => r.status === 'pending' && r.requesterRole === 'client' && myClientIds.includes(r.userId))
            .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
    }, [config.rechargeRequests, myClientIds]);

    const getUser = (userId: string): RegisteredUser | undefined => {
        return config.users.find(u => u.id === userId);
    };

    return (
        <>
            {viewingProof && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
                    <div className="bg-white p-2 rounded-lg" onClick={e => e.stopPropagation()}>
                        <img src={viewingProof} alt="Proof of Payment" className="max-w-xs w-full max-h-[80vh] object-contain" />
                    </div>
                     <button onClick={() => setViewingProof(null)} className="absolute top-4 right-4 bg-gray-900/50 text-white rounded-full p-2 leading-none">&times;</button>
                </div>
            )}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Solicitudes de Recarga de Clientes ({pendingRequests.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Monto</th>
                                <th scope="col" className="px-6 py-3">Comprobante</th>
                                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(req => {
                                const user = getUser(req.userId);
                                return (
                                    <tr key={req.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4">{new Date(req.requestDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{user?.username || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">${req.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setViewingProof(req.proofOfPaymentUrl || null)}
                                                className="text-cyan-400 hover:underline text-xs font-semibold disabled:text-gray-500 disabled:no-underline"
                                                disabled={!req.proofOfPaymentUrl}
                                            >
                                                Ver
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                            <button onClick={() => onProcessClientRecharge(req.id, 'approve', currentUser.id)} className="px-3 py-1 rounded bg-green-600 text-white font-bold text-xs hover:bg-green-500">
                                                Aprobar
                                            </button>
                                            <button onClick={() => onProcessClientRecharge(req.id, 'reject', currentUser.id)} className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-500">
                                                Rechazar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {pendingRequests.length === 0 && <p className="text-center text-gray-500 py-8">No hay solicitudes de clientes pendientes.</p>}
                </div>
            </div>
        </>
    );
};

export default ClientRechargesTab;