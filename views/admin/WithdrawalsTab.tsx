import React, { useState, useMemo } from 'react';
import type { AppConfig, WithdrawalRequest, RegisteredUser } from '../../types';

interface WithdrawalsTabProps {
  config: AppConfig;
  onProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => void;
}

const WithdrawalsTab: React.FC<WithdrawalsTabProps> = ({ config, onProcessWithdrawal }) => {
    const [viewingQr, setViewingQr] = useState<string | null>(null);

    const withdrawalHistory = useMemo(() => {
        return [...config.withdrawalRequests]
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [config.withdrawalRequests]);
    
    const getUser = (userId: string): RegisteredUser | undefined => {
        return config.users.find(u => u.id === userId);
    };

    const statusStyles: { [key in WithdrawalRequest['status']]: string } = {
        pending: 'bg-yellow-500/20 text-yellow-300',
        completed: 'bg-green-500/20 text-green-300',
        rejected: 'bg-red-500/20 text-red-400',
    };
    
    return (
        <div className="max-w-6xl mx-auto">
            {viewingQr && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setViewingQr(null)}>
                    <div className="bg-white p-2 rounded-lg" onClick={e => e.stopPropagation()}>
                        <img src={viewingQr} alt="User QR Code" className="max-w-xs w-full max-h-[80vh] object-contain" />
                    </div>
                     <button onClick={() => setViewingQr(null)} className="absolute top-4 right-4 bg-gray-900/50 text-white rounded-full p-2 leading-none">&times;</button>
                </div>
            )}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Historial de Retiros ({withdrawalHistory.length})</h2>
                {/* ═══ MOBILE CARDS (< md) ═══ */}
                <div className="md:hidden space-y-3">
                    {withdrawalHistory.map(req => {
                        const user = getUser(req.userId);
                        return (
                            <div key={req.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                                            {(user?.username || 'N').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{user?.username || 'N/A'}</p>
                                            <p className="text-[10px] text-gray-500">{new Date(req.requestDate).toLocaleDateString('es-ES')}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border capitalize ${
                                        req.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                        req.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                    }`}>{req.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/40 rounded-lg p-2.5 mb-3">
                                    <div>
                                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Monto</span>
                                        <p className="font-bold text-cyan-300">Bs {req.amount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">QR</span>
                                        <button onClick={() => setViewingQr(req.userQrCodeUrl)} className="text-cyan-400 text-xs font-semibold">Ver QR</button>
                                    </div>
                                </div>
                                {req.status === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => onProcessWithdrawal(req.id, 'approve')} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-500 transition">Aprobar</button>
                                        <button onClick={() => onProcessWithdrawal(req.id, 'reject')} className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition">Rechazar</button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic text-center">Procesado</p>
                                )}
                            </div>
                        );
                    })}
                    {withdrawalHistory.length === 0 && <p className="text-center text-gray-500 py-8">No hay solicitudes de retiro.</p>}
                </div>

                {/* ═══ DESKTOP TABLE (≥ md) ═══ */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-[11px] text-gray-300 uppercase tracking-wider bg-slate-800/80">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Monto</th>
                                <th scope="col" className="px-6 py-3">QR de Usuario</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawalHistory.map(req => {
                                const user = getUser(req.userId);
                                return (
                                    <tr key={req.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">{new Date(req.requestDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{user?.username || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">Bs {req.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setViewingQr(req.userQrCodeUrl)} className="text-cyan-400 hover:underline text-xs font-semibold">Ver QR</button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[req.status]}`}>{req.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                            {req.status === 'pending' ? (
                                                <>
                                                    <button onClick={() => onProcessWithdrawal(req.id, 'approve')} className="px-3 py-1 rounded bg-green-600 text-white font-bold text-xs hover:bg-green-500">Aprobar</button>
                                                    <button onClick={() => onProcessWithdrawal(req.id, 'reject')} className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-500">Rechazar</button>
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
                    {withdrawalHistory.length === 0 && <p className="text-center text-gray-500 py-8">No hay solicitudes de retiro.</p>}
                </div>
            </div>
        </div>
    );
};

export default WithdrawalsTab;