import React, { useState, useMemo, useEffect } from 'react';
import type { Carton, Jornada, Team, Prediction } from '../types';
import XIcon from './icons/XIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface CartonModalProps {
    carton: Carton;
    jornada: Jornada | null;
    teams: Team[];
    appName: string;
    logoUrl: string;
    onClose: () => void;
    onSave: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number; } | null) => void;
    isReadOnly?: boolean;
}

const CartonModal: React.FC<CartonModalProps> = ({ carton, jornada, teams, appName, logoUrl, onClose, onSave, isReadOnly = false }) => {
    const [predictions, setPredictions] = useState(carton.predictions);
    const [botinPrediction, setBotinPrediction] = useState(
        carton.botinPrediction
          ? { localScore: String(carton.botinPrediction.localScore), visitorScore: String(carton.botinPrediction.visitorScore) }
          : { localScore: '', visitorScore: '' }
    );

    const isEffectivelyEditable = useMemo(() => {
        if (isReadOnly) return false;
        if (!jornada || jornada.status !== 'abierta') return false;
        
        const now = new Date();
        const firstMatchDate = jornada.matches.length > 0 
            ? new Date(jornada.matches.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0].dateTime) 
            : null;

        if (!firstMatchDate) return false;
        
        // Allow editing if more than 10 minutes before the first match
        return (firstMatchDate.getTime() - now.getTime()) > 10 * 60 * 1000;
    }, [jornada, isReadOnly]);

    const sortedMatches = useMemo(() =>
        jornada ? [...jornada.matches].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) : [],
    [jornada]);
    
    const botinMatch = useMemo(() => 
        jornada?.botinMatchId ? jornada.matches.find(m => m.id === jornada.botinMatchId) : null
    , [jornada]);
    
    useEffect(() => {
        if (!isEffectivelyEditable || !botinMatch) return;

        const local = parseInt(botinPrediction.localScore, 10);
        const visitor = parseInt(botinPrediction.visitorScore, 10);

        if (!isNaN(local) && !isNaN(visitor)) {
             let result: Prediction;
             if (local > visitor) {
                 result = '1';
             } else if (local < visitor) {
                 result = '2';
             } else {
                 result = 'X';
             }
             if (predictions[botinMatch.id] !== result) {
                setPredictions(prev => ({ ...prev, [botinMatch.id]: result }));
             }
        }
    }, [botinPrediction, botinMatch, isEffectivelyEditable, predictions]);


    if (!jornada) {
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
                <div className="bg-gray-800 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
                    <p>Error: No se pudo cargar la información de la jornada.</p>
                </div>
            </div>
        );
    }
    
    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

    const handlePredictionChange = (matchId: string, prediction: Prediction) => {
        if (!isEffectivelyEditable) return;
        setPredictions(prev => ({
            ...prev,
            [matchId]: prediction,
        }));
    };
    
    const handleSave = () => {
        const finalBotinPrediction = botinMatch && botinPrediction.localScore !== '' && botinPrediction.visitorScore !== ''
            ? {
                localScore: parseInt(botinPrediction.localScore, 10),
                visitorScore: parseInt(botinPrediction.visitorScore, 10),
              }
            : null;
        onSave(carton.id, predictions, finalBotinPrediction);
        onClose();
    };

    const getPredictionClass = (prediction: Prediction | undefined, isButton: boolean = false) => {
        const base = isButton ? 'w-8 h-8 flex items-center justify-center font-bold rounded-md transition-all' : 'w-8 h-8 flex items-center justify-center font-bold rounded-md';
        if (!prediction) return `${base} bg-gray-600`;

        switch(prediction) {
            case '1': return `${base} bg-green-500 text-white`;
            case 'X': return `${base} bg-yellow-500 text-gray-900`;
            case '2': return `${base} bg-red-500 text-white`;
        }
    };
    
    const getButtonClass = (matchId: string, prediction: Prediction) => {
        const isSelected = predictions[matchId] === prediction;
        return `${getPredictionClass(prediction, true)} ${isEffectivelyEditable ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-700 ring-white' : ''}`;
    };

    const localBotinTeam = botinMatch ? getTeam(botinMatch.localTeamId) : null;
    const visitorBotinTeam = botinMatch ? getTeam(botinMatch.visitorTeamId) : null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-auto" />}
                        <h2 className="text-xl font-bold">{appName} - {jornada.name}</h2>
                    </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>
                
                <div className="p-6 overflow-y-auto space-y-3">
                    {sortedMatches.map(match => {
                        const localTeam = getTeam(match.localTeamId);
                        const visitorTeam = getTeam(match.visitorTeamId);
                        const currentPrediction = predictions[match.id];
                        const showResult = jornada.resultsProcessed && match.result;
                        const isCorrect = showResult && currentPrediction === match.result;
                        const isBotinMatchWithScore = botinMatch && match.id === botinMatch.id && (botinPrediction.localScore !== '' || botinPrediction.visitorScore !== '');

                        return (
                            <div key={match.id} className="bg-gray-700 p-3 rounded-lg">
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5 flex items-center gap-2">
                                        {localTeam && <img src={localTeam.logo} className="h-6 w-6 object-contain" />}
                                        <span className="text-sm font-semibold truncate">{localTeam?.name || 'N/A'}</span>
                                    </div>
                                    <div className="col-span-2 text-center text-gray-400">vs</div>
                                    <div className="col-span-5 flex items-center gap-2 justify-end text-right">
                                        <span className="text-sm font-semibold truncate">{visitorTeam?.name || 'N/A'}</span>
                                        {visitorTeam && <img src={visitorTeam.logo} className="h-6 w-6 object-contain" />}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-600/50">
                                    <div className="text-xs text-gray-400">
                                        {new Date(match.dateTime).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {showResult && (
                                            isCorrect 
                                                ? <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                                : <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center"><XIcon className="h-4 w-4 text-white" /></div>
                                        )}
                                        {isEffectivelyEditable ? (
                                            isBotinMatchWithScore ? (
                                                <div className="text-center">
                                                    <p className="text-xs text-purple-300">Auto-Predicción</p>
                                                    <div className={`${getPredictionClass(currentPrediction)} mx-auto mt-1`}>
                                                        {currentPrediction === 'X' ? <XIcon className="w-5 h-5"/> : currentPrediction}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => handlePredictionChange(match.id, '1')} className={getButtonClass(match.id, '1')}>1</button>
                                                    <button onClick={() => handlePredictionChange(match.id, 'X')} className={getButtonClass(match.id, 'X')}><XIcon className="w-4 h-4"/></button>
                                                    <button onClick={() => handlePredictionChange(match.id, '2')} className={getButtonClass(match.id, '2')}>2</button>
                                                </>
                                            )
                                        ) : (
                                            <div className={getPredictionClass(currentPrediction)}>
                                                {currentPrediction === 'X' ? <XIcon className="w-5 h-5"/> : currentPrediction}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {botinMatch && (
                        <div className="mt-4 border-t-2 border-dashed border-purple-600 pt-4 text-center">
                            <h4 className="text-lg font-bold text-purple-300 mb-2">🌟 Mi Pronóstico del Botín 🌟</h4>
                             <div className="bg-purple-900/30 p-3 rounded-lg flex items-center justify-around mb-2">
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    {localBotinTeam && <img src={localBotinTeam.logo} alt={localBotinTeam.name} className="h-8 w-8 object-contain"/>}
                                    <span className="text-sm font-semibold">{localBotinTeam?.name}</span>
                                </div>
                                <span className="text-gray-400 font-bold">VS</span>
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    {visitorBotinTeam && <img src={visitorBotinTeam.logo} alt={visitorBotinTeam.name} className="h-8 w-8 object-contain"/>}
                                    <span className="text-sm font-semibold">{visitorBotinTeam?.name}</span>
                                </div>
                            </div>
                            {isEffectivelyEditable ? (
                                <div className="flex items-center justify-center gap-3">
                                    <input type="number" min="0" value={botinPrediction.localScore} onChange={e => setBotinPrediction(p => ({...p, localScore: e.target.value}))} className="w-20 text-center bg-gray-700 p-2 rounded text-xl font-bold" placeholder="L"/>
                                    <span className="text-xl font-bold text-gray-400">-</span>
                                    <input type="number" min="0" value={botinPrediction.visitorScore} onChange={e => setBotinPrediction(p => ({...p, visitorScore: e.target.value}))} className="w-20 text-center bg-gray-700 p-2 rounded text-xl font-bold" placeholder="V"/>
                                </div>
                            ) : (
                                carton.botinPrediction ? (
                                    <p className="text-3xl font-bold text-white">{carton.botinPrediction.localScore} - {carton.botinPrediction.visitorScore}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No se participó por el botín.</p>
                                )
                            )}
                        </div>
                    )}
                </div>
                
                <footer className="p-4 mt-auto border-t border-gray-700 flex justify-between items-center">
                    <p className="text-sm text-cyan-300 italic">
                        {isEffectivelyEditable ? 'Puedes editar hasta 10min antes del primer partido.' : 'El tiempo para editar ha terminado.'}
                    </p>
                    {isEffectivelyEditable && (
                        <button onClick={handleSave} className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500">
                            Guardar Cambios
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default CartonModal;
