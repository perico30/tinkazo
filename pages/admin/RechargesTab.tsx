import React, { useState, useMemo } from 'react';
import type { AppConfig, RechargeRequest, RegisteredUser } from '../../types';

interface RechargesTabProps {
  config: AppConfig;
  onProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => void;
}

const RechargesTab: React.FC<RechargesTabProps> = ({ config, onProcessSellerRecharge }) => {
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    const rechargeHistory = useMemo(() => {
        return config.rechargeRequests
            .filter(r => r.requesterRole === 'seller')
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [config.rechargeRequests]);
    
    const getUser = (userId: string): RegisteredUser | undefined => {
        return config.users.find(u => u.id === userId);
    };

    const statusStyles: { [key in RechargeRequest['status']]: string } = {
        pending: 'bg-yellow-500/20 text-yellow-300',
        approved: 'bg-green-500/20 text-green-300',
        rejected: 'bg-red-500/20 text-red-400',
    };
    
    return (
        <div className="max-w-6xl mx-auto">
            {viewingProof && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
                    <div className="bg-white p-2 rounded-lg" onClick={e => e.stopPropagation()}>
                        <img src={viewingProof} alt="Proof of Payment" className="max-w-xs w-full max-h-[80vh] object-contain" />
                    </div>
                     <button onClick={() => setViewingProof(null)} className="absolute top-4 right-4 bg-gray-900/50 text-white rounded-full p-2 leading-none">&times;</button>
                </div>
            )}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Historial de Recargas de Vendedores ({rechargeHistory.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Vendedor</th>
                                <th scope="col" className="px-6 py-3">Monto</th>
                                <th scope="col" className="px-6 py-3">Comprobante</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rechargeHistory.map(req => {
                                const user = getUser(req.userId);
                                return (
                                    <tr key={req.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4">{new Date(req.requestDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{user?.username || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">Bs {req.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => setViewingProof(req.proofOfPaymentUrl || null)}
                                                className="text-cyan-400 hover:underline text-xs font-semibold disabled:text-gray-500 disabled:no-underline"
                                                disabled={!req.proofOfPaymentUrl}
                                            >
                                                Ver Comprobante
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[req.status]}`}>{req.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                            {req.status === 'pending' ? (
                                                <>
                                                    <button onClick={() => onProcessSellerRecharge(req.id, 'approve')} className="px-3 py-1 rounded bg-green-600 text-white font-bold text-xs hover:bg-green-500">
                                                        Aprobar
                                                    </button>
                                                    <button onClick={() => onProcessSellerRecharge(req.id, 'reject')} className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-500">
                                                        Rechazar
                                                    </button>
                                                </>
                                            ) : (
                                                 <span className="text-xs text-gray-500 italic">Procesado</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {rechargeHistory.length === 0 && <p className="text-center text-gray-500 py-8">No hay solicitudes de recarga.</p>}
                </div>
            </div>
        </div>
    );
};

export default RechargesTab;