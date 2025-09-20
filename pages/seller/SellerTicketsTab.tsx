import React from 'react';
import type { Carton, Jornada } from '../../types';

interface SellerTicketsTabProps {
    cartones: Carton[];
    jornadas: Jornada[];
    onViewCarton: (carton: Carton) => void;
}

const SellerTicketsTab: React.FC<SellerTicketsTabProps> = ({ cartones, jornadas, onViewCarton }) => {
    if (cartones.length === 0) {
        return (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
                <h2 className="text-xl font-bold mb-4">Mis Cartones Personales</h2>
                <p className="text-gray-400">
                    Aún no has comprado ningún cartón para ti. ¡Anímate a participar!
                </p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
             <h2 className="text-xl font-bold mb-4">Mis Cartones Comprados</h2>
            {cartones.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(carton => {
                const jornada = jornadas.find(j => j.id === carton.jornadaId);
                const resultsProcessed = jornada?.resultsProcessed;
                const isWinner = carton.prizeWon && carton.prizeWon > 0;
                
                let statusElement = null;
                if (resultsProcessed) {
                    if (isWinner) {
                        const details = carton.prizeDetails;
                        const prizeTexts: string[] = [];

                        if (details?.gordito) {
                            prizeTexts.push('EL GORDITO');
                        } else if (details?.jornada) {
                            prizeTexts.push(details.jornada.tier === 1 ? '1ER PREMIO' : '2DO PREMIO');
                        }

                        if (details?.botin) {
                            prizeTexts.push('EL BOTÍN');
                        }

                        let prizeText = prizeTexts.join(' + ');

                        if (prizeText !== '') {
                            prizeText = `GANASTE ${prizeText}`;
                        } else if (details?.botin) {
                            prizeText = 'GANASTE EL BOTÍN';
                        } else {
                            prizeText = 'GANADOR';
                        }

                        statusElement = (
                            <span className="text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                {prizeText}
                            </span>
                        );
                    } else {
                        statusElement = (
                            <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                                NO GANADOR
                            </span>
                        );
                    }
                }

                return (
                    <div key={carton.id} className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-grow w-full">
                            <p className="font-bold text-lg">{jornada ? jornada.name : 'Jornada Desconocida'}</p>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-400">
                                    Comprado: {new Date(carton.purchaseDate).toLocaleString()}
                                </p>
                                {statusElement}
                            </div>
                            {typeof carton.hits === 'number' && (
                                <p className="mt-1 text-base font-bold text-cyan-300">Aciertos: {carton.hits}</p>
                            )}
                        </div>
                        <button 
                            onClick={() => onViewCarton(carton)}
                            className="w-full sm:w-auto flex-shrink-0 bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400"
                        >
                            Ver/Editar Cartón
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default SellerTicketsTab;