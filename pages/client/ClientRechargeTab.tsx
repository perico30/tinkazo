import React, { useState, useMemo } from 'react';
import type { RegisteredUser, AppConfig, WithdrawalRequest, RechargeRequest } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';

interface ClientRechargeTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onRequestWithdrawal: (userId: string, amount: number, userQrCodeUrl: string) => void;
  onRequestRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => void;
}

const ClientRechargeTab: React.FC<ClientRechargeTabProps> = ({ currentUser, config, onRequestWithdrawal, onRequestRecharge }) => {
    // State for recharge form
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [rechargeProofUrl, setRechargeProofUrl] = useState('');

    // State for withdrawal form
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [withdrawalQrCodeUrl, setWithdrawalQrCodeUrl] = useState('');

    const assignedSeller = config.users.find(u => u.id === currentUser.assignedSellerId);
    
    // Determine which QR and WhatsApp to use
    const qrCodeUrl = assignedSeller?.sellerQrCodeUrl || config.recharge.qrCodeUrl;
    const whatsappNumber = assignedSeller?.sellerWhatsappNumber || config.adminWhatsappNumber;
    const sellerName = assignedSeller?.username || 'el administrador';

    const handleRechargeRequest = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(rechargeAmount);
        if (amount > 0 && rechargeProofUrl) {
            onRequestRecharge(currentUser.id, amount, rechargeProofUrl);
            setRechargeAmount('');
            setRechargeProofUrl('');
        } else {
            alert('Por favor, ingrese un monto válido y suba su comprobante.');
        }
    };

    const rechargeWhatsappMessage = `Hola ${sellerName}, he registrado una solicitud de recarga por Bs ${rechargeAmount}. Mi usuario es: ${currentUser.username}. Quedo a la espera de la aprobación.`;
    const rechargeWhatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(rechargeWhatsappMessage)}`;

    const handleWithdrawalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(withdrawalAmount);
        if (!amount || amount <= 0) {
            alert('Por favor, ingrese un monto válido.');
            return;
        }
        if (!withdrawalQrCodeUrl) {
            alert('Por favor, suba su código QR para recibir el pago.');
            return;
        }
        onRequestWithdrawal(currentUser.id, amount, withdrawalQrCodeUrl);
        setWithdrawalAmount('');
        setWithdrawalQrCodeUrl('');
    };

    const withdrawalHistory = useMemo(() => {
        return config.withdrawalRequests
            .filter(r => r.userId === currentUser.id)
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [config.withdrawalRequests, currentUser.id]);

    const rechargeHistory = useMemo(() => {
        return config.rechargeRequests
            .filter(r => r.userId === currentUser.id)
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [config.rechargeRequests, currentUser.id]);

    const statusStylesWithdrawal: { [key in WithdrawalRequest['status']]: string } = {
        pending: 'bg-yellow-500/20 text-yellow-300',
        completed: 'bg-green-500/20 text-green-300',
        rejected: 'bg-red-500/20 text-red-400',
    };
    
     const statusStylesRecharge: { [key in RechargeRequest['status']]: string } = {
        pending: 'bg-yellow-500/20 text-yellow-300',
        approved: 'bg-green-500/20 text-green-300',
        rejected: 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Recargar Saldo */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-4 flex flex-col">
                <h2 className="font-bold text-xl text-cyan-400">Recargar Saldo</h2>
                <p className="text-gray-300 text-sm">
                    Realiza tu pago usando el QR, luego registra tu solicitud aquí y envía el comprobante por WhatsApp a <span className="font-semibold text-white">{sellerName}</span>.
                </p>
                <div className="flex justify-center pt-2">
                    {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="Código QR de pago" className="w-48 h-48 rounded-lg bg-white p-2"/>
                    ) : (
                        <div className="w-48 h-48 rounded-lg bg-gray-700 flex items-center justify-center text-center p-4">
                            <p className="text-sm text-gray-400">Tu vendedor no ha configurado un QR. Contacta al administrador.</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleRechargeRequest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Monto Pagado</label>
                        <input 
                            type="number"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            className="w-full bg-gray-700 p-2 rounded"
                            placeholder="Ej. 50.00"
                            min="0.01" step="0.01" required
                        />
                    </div>
                    <ImageUpload
                      label="Tu Comprobante de Pago"
                      imageUrl={rechargeProofUrl}
                      onImageSelect={setRechargeProofUrl}
                    />
                    <button 
                        type="submit" 
                        className="w-full text-white font-bold py-2 rounded-lg btn-gradient disabled:bg-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:filter-none disabled:shadow-none"
                        disabled={!rechargeAmount || !rechargeProofUrl}
                    >
                        1. Registrar Solicitud de Recarga
                    </button>
                    <a 
                        href={rechargeWhatsappLink}
                        target="_blank" rel="noopener noreferrer"
                        className={`block w-full text-center font-bold py-2 rounded-lg transition-colors ${!rechargeAmount ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-400'}`}
                        onClick={(e) => !rechargeAmount && e.preventDefault()}
                     >
                        2. Notificar por WhatsApp
                    </a>
                </form>
                {rechargeHistory.length > 0 && (
                    <div className="border-t border-gray-700 pt-4 mt-auto">
                        <h3 className="font-semibold text-base mb-2">Historial de Recargas</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                            {rechargeHistory.map(req => (
                                <div key={req.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-bold">Bs {req.amount.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">{new Date(req.requestDate).toLocaleString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStylesRecharge[req.status]}`}>{req.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Solicitar Retiro */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-4 flex flex-col">
                <h2 className="font-bold text-xl text-purple-400">Solicitar Retiro</h2>
                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                     <p className="text-gray-300 text-sm">Completa el formulario para solicitar un retiro de tu saldo. Tu saldo actual es: <span className="font-bold text-white">Bs {(currentUser.balance || 0).toFixed(2)}</span></p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Monto a Retirar</label>
                        <input 
                            type="number"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            className="w-full bg-gray-700 p-2 rounded"
                            placeholder="Ej. 100.00"
                            min="0.01" step="0.01" max={currentUser.balance || 0} required
                        />
                    </div>
                    <ImageUpload 
                        label="Tu Código QR para Recibir el Pago"
                        imageUrl={withdrawalQrCodeUrl}
                        onImageSelect={setWithdrawalQrCodeUrl}
                    />
                    <button 
                        type="submit"
                        className="w-full text-center text-white font-bold py-3 rounded-lg btn-gradient-purple disabled:bg-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:filter-none disabled:shadow-none"
                        disabled={!withdrawalAmount || !withdrawalQrCodeUrl || parseFloat(withdrawalAmount) > (currentUser.balance || 0)}
                    >
                        Solicitar Retiro
                    </button>
                </form>
                {withdrawalHistory.length > 0 && (
                    <div className="border-t border-gray-700 pt-4 mt-auto">
                        <h3 className="font-semibold text-base mb-2">Historial de Retiros</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {withdrawalHistory.map(req => (
                                <div key={req.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-bold">Bs {req.amount.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">{new Date(req.requestDate).toLocaleString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStylesWithdrawal[req.status]}`}>{req.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientRechargeTab;