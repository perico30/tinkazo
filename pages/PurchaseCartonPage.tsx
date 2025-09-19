import React, { useState, useMemo } from 'react';
import type { Jornada, Team, RegisteredUser, Prediction } from '../types';
import XIcon from '../components/icons/XIcon';

interface PurchaseCartonPageProps {
    jornada: Jornada;
    teams: Team[];
    currentUser: RegisteredUser;
    onPurchase: (jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number) => void;
    onExit: () => void;
}

const PurchaseCartonPage: React.FC<PurchaseCartonPageProps> = ({ jornada, teams, currentUser, onPurchase, onExit }) => {
    const [predictions, setPredictions] = useState<{ [matchId: string]: Prediction }>({});

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

    const handlePredictionChange = (matchId: string, prediction: Prediction) => {
        setPredictions(prev => ({
            ...prev,
            [matchId]: prediction,
        }));
    };

    const allPredictionsMade = useMemo(() => {
        return jornada.matches.length > 0 && jornada.matches.every(match => predictions[match.id]);
    }, [jornada.matches, predictions]);

    const handleSubmit = () => {
        if (allPredictionsMade) {
            onPurchase(jornada.id, predictions, jornada.cartonPrice);
        } else {
            alert('Debes realizar un pronóstico para todos los partidos.');
        }
    };

    const getPredictionButtonClass = (matchId: string, prediction: Prediction) => {
        const base = 'w-10 h-10 flex items-center justify-center font-bold text-lg rounded-md transition-all';
        const isSelected = predictions[matchId] === prediction;

        if (isSelected) {
            switch(prediction) {
                case '1': return `${base} bg-green-500 text-white ring-2 ring-white`;
                case 'X': return `${base} bg-yellow-500 text-gray-900 ring-2 ring-white`;
                case '2': return `${base} bg-red-500 text-white ring-2 ring-white`;
            }
        }
        return `${base} bg-gray-600 hover:bg-gray-500`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-400">{jornada.name}</h1>
                        <p className="text-gray-400">Realiza tus pronósticos</p>
                    </div>
                    <button onClick={onExit} className="text-gray-400 hover:text-white">&times; Salir</button>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="space-y-4">
                        {jornada.matches.map(match => {
                            const localTeam = getTeam(match.localTeamId);
                            const visitorTeam = getTeam(match.visitorTeamId);
                            return (
                                <div key={match.id} className="bg-gray-700/50 p-4 rounded-lg grid grid-cols-3 gap-4 items-center">
                                    {/* Teams */}
                                    <div className="col-span-2 flex items-center justify-between text-center">
                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                            {localTeam && <img src={localTeam.logo} alt={localTeam.name} className="h-10 w-10 object-contain" />}
                                            <span className="text-sm font-semibold">{localTeam?.name || 'N/A'}</span>
                                        </div>
                                        <span className="text-gray-400 font-bold">VS</span>
                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                            {visitorTeam && <img src={visitorTeam.logo} alt={visitorTeam.name} className="h-10 w-10 object-contain" />}
                                            <span className="text-sm font-semibold">{visitorTeam?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Predictions */}
                                    <div className="col-span-1 flex justify-end items-center gap-2">
                                        <button onClick={() => handlePredictionChange(match.id, '1')} className={getPredictionButtonClass(match.id, '1')}>1</button>
                                        <button onClick={() => handlePredictionChange(match.id, 'X')} className={getPredictionButtonClass(match.id, 'X')}><XIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handlePredictionChange(match.id, '2')} className={getPredictionButtonClass(match.id, '2')}>2</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-lg">Costo del Cartón: <span className="font-bold text-cyan-400">Bs {jornada.cartonPrice.toFixed(2)}</span></p>
                        <p className="text-sm">Tu saldo actual: <span className="font-semibold">Bs {(currentUser.balance || 0).toFixed(2)}</span></p>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={!allPredictionsMade || (currentUser.balance || 0) < jornada.cartonPrice}
                        className="w-full sm:w-auto bg-green-600 text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                        { (currentUser.balance || 0) < jornada.cartonPrice ? 'Saldo Insuficiente' : 'Comprar Cartón' }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCartonPage;