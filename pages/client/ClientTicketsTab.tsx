import React from 'react';
import type { Carton, Jornada } from '../../types';

interface ClientTicketsTabProps {
    cartones: Carton[];
    jornadas: Jornada[];
    onViewCarton: (carton: Carton) => void;
}

const ClientTicketsTab: React.FC<ClientTicketsTabProps> = ({ cartones, jornadas, onViewCarton }) => {
    if (cartones.length === 0) {
        return (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
                <h2 className="text-xl font-bold mb-4">Mis Cartones</h2>
                <p className="text-gray-400">
                    Aún no has comprado ningún cartón. ¡Anímate a jugar en una de las jornadas disponibles!
                </p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
             <h2 className="text-xl font-bold mb-4">Mis Cartones Comprados</h2>
            {cartones.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(carton => {
                const jornada = jornadas.find(j => j.id === carton.jornadaId);
                return (
                    <div key={carton.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">{jornada ? jornada.name : 'Jornada Desconocida'}</p>
                            <p className="text-sm text-gray-400">
                                Comprado el: {new Date(carton.purchaseDate).toLocaleString()}
                            </p>
                            {typeof carton.hits === 'number' && (
                                <p className="mt-1 text-base font-bold text-cyan-300">Aciertos: {carton.hits}</p>
                            )}
                        </div>
                        <button 
                            onClick={() => onViewCarton(carton)}
                            className="bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400"
                        >
                            Ver/Editar Cartón
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ClientTicketsTab;