import React, { useState } from 'react';
import type { RegisteredUser } from '../../types';
import CloseIcon from '../../components/icons/CloseIcon';

interface TransferModalProps {
  client: RegisteredUser;
  sellerBalance: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ client, sellerBalance, onClose, onConfirm }) => {
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof amount === 'number' && amount > 0) {
        if (amount <= sellerBalance) {
            onConfirm(amount);
        } else {
            alert('No tienes saldo suficiente para esta transferencia.');
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 relative">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Transferir Saldo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Cerrar modal">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Destinatario:</p>
                <p className="text-lg font-semibold text-white">{client.username}</p>
            </div>
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Tu Saldo Disponible:</span>
                <span className="font-bold text-green-400">Bs {Math.floor(sellerBalance).toLocaleString('es-ES')}</span>
            </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Monto a Transferir (Bs)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || '')}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              required
              min="1"
              max={sellerBalance}
              step="1"
              placeholder="Ej. 50"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white font-bold py-3 rounded-lg shadow-lg btn-gradient disabled:opacity-50"
            disabled={!amount || amount <= 0 || amount > sellerBalance}
          >
            Confirmar Transferencia
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
