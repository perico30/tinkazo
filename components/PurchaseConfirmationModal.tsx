import React from 'react';
import type { Jornada, Team, RegisteredUser, Prediction } from '../types';
import XIcon from './icons/XIcon';

interface PurchaseConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jornada: Jornada;
    teams: Team[];
    currentUser: RegisteredUser;
    predictions: { [matchId: string]: Prediction };
    botinPrediction: { localScore: string; visitorScore: string; };
    playBotin: boolean;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jornada,
    teams,
    currentUser,
    predictions,
    botinPrediction,
    playBotin
}) => {
    if (!isOpen) return null;

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);
    const sortedMatches = [...jornada.matches].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    const botinMatch = jornada.botinMatchId ? jornada.matches.find(m => m.id === jornada.botinMatchId) : null;

    const remainingBalance = (currentUser.balance || 0) - jornada.cartonPrice;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-cyan-400">Confirmar tu Jugada</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>

                <div className="p-6 overflow-y-auto space-y-4">
                    <p className="text-gray-300">Revisa tus pronósticos antes de confirmar la compra.</p>
                    
                    <div className="space-y-2">
                        {sortedMatches.map(match => {
                            const localTeam = getTeam(match.localTeamId);
                            const visitorTeam = getTeam(match.visitorTeamId);
                            const prediction = predictions[match.id];
                            return (
                                <div key={match.id} className="bg-gray-700/50 p-3 rounded-md flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-semibold w-24 truncate text-right">{localTeam?.name || 'N/A'}</span>
                                        <span className="text-gray-400">vs</span>
                                        <span className="font-semibold w-24 truncate text-left">{visitorTeam?.name || 'N/A'}</span>
                                    </div>
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold rounded ${
                                        prediction === '1' ? 'bg-green-500 text-white' :
                                        prediction === 'X' ? 'bg-yellow-500 text-gray-900' :
                                        prediction === '2' ? 'bg-red-500 text-white' : 'bg-gray-600'
                                    }`}>
                                        {prediction === 'X' ? <XIcon className="w-4 h-4" /> : prediction}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {playBotin && botinMatch && (
                        <div className="border-t border-purple-700 pt-4 mt-4">
                            <h3 className="font-bold text-lg text-purple-300 text-center mb-2">🌟 Predicción del Botín 🌟</h3>
                             <div className="text-center text-2xl font-bold">
                                <span>{getTeam(botinMatch.localTeamId)?.name} </span>
                                <span className="text-cyan-400">{botinPrediction.localScore || '0'}</span>
                                <span> - </span>
                                <span className="text-cyan-400">{botinPrediction.visitorScore || '0'}</span>
                                <span> {getTeam(botinMatch.visitorTeamId)?.name}</span>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Costo del Cartón:</span> <span className="font-semibold">Bs {Math.floor(jornada.cartonPrice).toLocaleString('es-ES')}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Saldo Actual:</span> <span className="font-semibold">Bs {Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}</span></div>
                        <div className="flex justify-between text-base"><span className="text-gray-300">Saldo Restante:</span> <span className={`font-bold ${remainingBalance < 0 ? 'text-red-500' : 'text-green-400'}`}>Bs {Math.floor(remainingBalance).toLocaleString('es-ES')}</span></div>
                    </div>
                </div>

                <footer className="p-4 mt-auto border-t border-gray-700 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancelar</button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg font-bold text-white btn-gradient"
                    >
                        Confirmar Compra
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PurchaseConfirmationModal;