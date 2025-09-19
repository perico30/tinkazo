import React, { useState, useMemo } from 'react';
import type { AppConfig, RegisteredUser, RechargeRequest } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';

interface SellerRechargeTabProps {
  config: AppConfig;
  currentUser: RegisteredUser;
  onRequestRecharge: (userId: string, amount: number, proofUrl: string) => void;
}

const SellerRechargeTab: React.FC<SellerRechargeTabProps> = ({ config, currentUser, onRequestRecharge }) => {
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [proofOfPaymentUrl, setProofOfPaymentUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(rechargeAmount);
        if (!amount || amount <= 0) {
            alert('Por favor, ingrese un monto válido.');
            return;
        }
        if (!proofOfPaymentUrl) {
            alert('Por favor, suba un comprobante de pago.');
            return;
        }
        onRequestRecharge(currentUser.id, amount, proofOfPaymentUrl);
        setRechargeAmount('');
        setProofOfPaymentUrl('');
    };
    
    const rechargeHistory = useMemo(() => {
        return config.rechargeRequests
            .filter(r => r.userId === currentUser.id)
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [config.rechargeRequests, currentUser.id]);

    const statusStyles: { [key in RechargeRequest['status']]: string } = {
        pending: 'bg-yellow-500/20 text-yellow-300',
        approved: 'bg-green-500/20 text-green-300',
        rejected: 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Solicitar Recarga */}
            <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                <h2 className="font-bold text-xl text-cyan-400">Solicitar Recarga de Saldo</h2>
                <p className="text-gray-300 text-sm">
                    Realiza el pago a la cuenta del administrador y sube el comprobante aquí para que tu saldo sea acreditado.
                </p>
                 <div className="flex flex-col items-center justify-center pt-2 space-y-4">
                    {config.recharge.qrCodeUrl ? (
                        <img src={config.recharge.qrCodeUrl} alt="Código QR de pago del Admin" className="w-48 h-48 rounded-lg bg-white p-2"/>
                    ) : (
                        <div className="w-48 h-48 rounded-lg bg-gray-600 flex items-center justify-center text-center p-4">
                            <p className="text-sm text-gray-400">El administrador no ha configurado un QR.</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Monto Pagado</label>
                        <input 
                            type="number"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            className="w-full bg-gray-600 p-2 rounded border border-gray-500"
                            placeholder="Ej. 100.00"
                            min="0.01" step="0.01" required
                        />
                    </div>
                     <ImageUpload 
                        label="Comprobante de Pago"
                        imageUrl={proofOfPaymentUrl}
                        onImageSelect={setProofOfPaymentUrl}
                    />
                    <button 
                        type="submit"
                        className="w-full text-center bg-cyan-500 text-gray-900 font-bold py-2 rounded-lg hover:bg-cyan-400 transition-colors"
                        disabled={!rechargeAmount || !proofOfPaymentUrl}
                    >
                        Enviar Solicitud
                    </button>
                </form>
            </div>
             {/* Historial */}
            <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Mi Historial de Recargas</h3>
                 {rechargeHistory.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {rechargeHistory.map(req => (
                            <div key={req.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-bold">${req.amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">{new Date(req.requestDate).toLocaleString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[req.status]}`}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 pt-8">No tienes solicitudes de recarga.</p>
                )}
            </div>
        </div>
    );
};

export default SellerRechargeTab;