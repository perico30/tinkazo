import React from 'react';
import type { Carton, Jornada, RegisteredUser } from '../../types';

interface ClientTicketsModalProps {
    client: RegisteredUser;
    cartones: Carton[];
    jornadas: Jornada[];
    onClose: () => void;
    onViewCarton: (carton: Carton) => void;
}

const ClientTicketsModal: React.FC<ClientTicketsModalProps> = ({ client, cartones, jornadas, onClose, onViewCarton }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Cartones de {client.username}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>
                <div className="p-6 overflow-y-auto space-y-4">
                    {cartones.length > 0 ? (
                        cartones.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(carton => {
                            const jornada = jornadas.find(j => j.id === carton.jornadaId);
                            return (
                                <div key={carton.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">{jornada ? jornada.name : 'Jornada Desconocida'}</p>
                                        <p className="text-sm text-gray-400">
                                            Comprado: {new Date(carton.purchaseDate).toLocaleString()}
                                        </p>
                                        {typeof carton.hits === 'number' && (
                                            <p className="text-sm font-bold text-cyan-300">Aciertos: {carton.hits}</p>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => onViewCarton(carton)}
                                        className="bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400"
                                    >
                                        Ver
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                         <div className="text-center py-8">
                            <p className="text-gray-400">Este cliente aún no ha comprado ningún cartón.</p>
                        </div>
                    )}
                </div>
                <footer className="p-4 mt-auto border-t border-gray-700 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cerrar</button>
                </footer>
            </div>
        </div>
    );
};

export default ClientTicketsModal;
