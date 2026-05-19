import React, { useState, useMemo, useEffect } from 'react';
import type { Jornada, Team, RegisteredUser, Prediction } from '../types';
import XIcon from '../components/icons/XIcon';
import PurchaseConfirmationModal from '../components/PurchaseConfirmationModal';

interface PurchaseCartonPageProps {
    jornada: Jornada;
    teams: Team[];
    currentUser: RegisteredUser;
    onPurchase: (jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number, botinPrediction: { localScore: number; visitorScore: number; } | null) => void;
    onExit: () => void;
}

const PurchaseCartonPage: React.FC<PurchaseCartonPageProps> = ({ jornada, teams, currentUser, onPurchase, onExit }) => {
    const [predictions, setPredictions] = useState<{ [matchId: string]: Prediction }>({});
    const [playBotin, setPlayBotin] = useState(false);
    const [botinPrediction, setBotinPrediction] = useState({ localScore: '', visitorScore: '' });
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);
    
    const sortedMatches = useMemo(() => 
        [...jornada.matches].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    [jornada.matches]);

    const botinMatch = useMemo(() => 
        jornada.botinMatchId ? jornada.matches.find(m => m.id === jornada.botinMatchId) : null
    , [jornada.botinMatchId, jornada.matches]);

    const handlePredictionChange = (matchId: string, prediction: Prediction) => {
        setPredictions(prev => ({
            ...prev,
            [matchId]: prediction,
        }));
    };
    
    useEffect(() => {
        if (playBotin && botinMatch) {
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
                // Automatically set the prediction for the botin match
                if (predictions[botinMatch.id] !== result) {
                    handlePredictionChange(botinMatch.id, result);
                }
            } else {
                // If scores are cleared, remove the automatic prediction
                if (predictions[botinMatch.id]) {
                    setPredictions(prev => {
                        const newPreds = { ...prev };
                        delete newPreds[botinMatch.id];
                        return newPreds;
                    });
                }
            }
        }
    }, [playBotin, botinPrediction, botinMatch]);


    const allPredictionsMade = useMemo(() => {
        return jornada.matches.length > 0 && jornada.matches.every(match => predictions[match.id]);
    }, [jornada.matches, predictions]);

    const handleAttemptPurchase = () => {
        if (!allPredictionsMade) {
            alert('Debes realizar un pronóstico para todos los partidos.');
            return;
        }
        setIsConfirmationModalVisible(true);
    };
    
    const handleConfirmPurchase = () => {
        const finalBotinPrediction = playBotin && botinMatch && botinPrediction.localScore !== '' && botinPrediction.visitorScore !== ''
            ? {
                localScore: parseInt(botinPrediction.localScore, 10),
                visitorScore: parseInt(botinPrediction.visitorScore, 10),
              }
            : null;
        onPurchase(jornada.id, predictions, jornada.cartonPrice, finalBotinPrediction);
        setIsConfirmationModalVisible(false);
    };


    const getPredictionButtonClass = (matchId: string, prediction: Prediction) => {
        const base = 'w-[40px] h-[20px] md:w-[45px] md:h-[22px] flex items-center justify-center font-bold text-[10px] md:text-xs rounded-full transition-all border';
        const isSelected = predictions[matchId] === prediction;

        if (isSelected) {
            return `${base} bg-[#357427] border-[#357427] text-white shadow-md`;
        }
        return `${base} bg-white border-[#d7d7d7] text-gray-400 hover:bg-[#e6e6e6] hover:text-gray-600 shadow-sm`;
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-cyan-400">{jornada.name}</h1>
                            <p className="text-[11px] sm:text-base text-gray-400">Realiza tus pronósticos</p>
                        </div>
                        <button onClick={onExit} className="text-xs sm:text-base text-gray-400 hover:text-white transition">&times; Salir</button>
                    </div>
                    
                    {botinMatch && (
                        <div className="mb-5 bg-purple-900/40 border border-purple-600/60 rounded-lg shadow-md p-3 sm:p-5 relative overflow-hidden">
                            <h3 className="text-sm sm:text-xl font-bold text-center text-purple-300 mb-1">🌟 ¡El Gordito! 🌟</h3>
                            <p className="text-center text-[10px] sm:text-sm text-gray-300 mb-3 leading-tight max-w-sm mx-auto">
                                Acierta el resultado exacto. ¡No extra costo!
                            </p>
                            
                            <div className="bg-gray-800/60 p-2 sm:p-4 rounded-lg flex flex-row items-center justify-center gap-2 sm:gap-6 text-center max-w-md mx-auto relative z-10">
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    {getTeam(botinMatch.localTeamId) && <img src={getTeam(botinMatch.localTeamId)?.logo} alt="" className="h-6 w-6 sm:h-10 sm:w-10 object-contain drop-shadow-md" />}
                                    <span className="font-semibold text-[9px] sm:text-sm leading-tight text-white line-clamp-2">{getTeam(botinMatch.localTeamId)?.name}</span>
                                </div>
                                <span className="text-gray-400 font-bold text-xs sm:text-base">VS</span>
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    {getTeam(botinMatch.visitorTeamId) && <img src={getTeam(botinMatch.visitorTeamId)?.logo} alt="" className="h-6 w-6 sm:h-10 sm:w-10 object-contain drop-shadow-md" />}
                                    <span className="font-semibold text-[9px] sm:text-sm leading-tight text-white line-clamp-2">{getTeam(botinMatch.visitorTeamId)?.name}</span>
                                </div>
                            </div>
                            
                            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 relative z-10">
                                <div className="flex items-center gap-2 bg-gray-800/40 py-1 px-3 rounded-full border border-gray-600/30">
                                    <input
                                        id="playBotin"
                                        type="checkbox"
                                        checked={playBotin}
                                        onChange={e => setPlayBotin(e.target.checked)}
                                        className="h-3 w-3 sm:h-4 sm:w-4 rounded text-purple-500 focus:ring-purple-500 bg-gray-700 border-gray-600"
                                    />
                                    <label htmlFor="playBotin" className="font-bold text-purple-200 text-[10px] sm:text-sm cursor-pointer select-none">Participar</label>
                                </div>
                                
                                {playBotin && (
                                    <div className="flex items-center gap-2 bg-gray-800/60 p-1.5 rounded-lg border border-purple-500/30">
                                        <input
                                            type="number"
                                            min="0"
                                            value={botinPrediction.localScore}
                                            onChange={e => setBotinPrediction(p => ({...p, localScore: e.target.value}))}
                                            className="w-8 sm:w-12 text-center bg-gray-700 p-0.5 sm:p-1.5 rounded text-sm sm:text-lg font-bold border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            placeholder="L"
                                        />
                                        <span className="text-sm sm:text-xl font-bold text-purple-400">-</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={botinPrediction.visitorScore}
                                            onChange={e => setBotinPrediction(p => ({...p, visitorScore: e.target.value}))}
                                            className="w-8 sm:w-12 text-center bg-gray-700 p-0.5 sm:p-1.5 rounded text-sm sm:text-lg font-bold border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            placeholder="V"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                            {sortedMatches.map(match => {
                                const localTeam = getTeam(match.localTeamId);
                                const visitorTeam = getTeam(match.visitorTeamId);
                                const isBotinMatchAndPlaying = playBotin && botinMatch && match.id === botinMatch.id;
                                
                                return (
                                    <div key={match.id} className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            {/* Local Team */}
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[70px]">
                                                {localTeam && <img src={localTeam.logo} alt={localTeam.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />}
                                                <span className="text-[9px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">{localTeam?.name || 'N/A'}</span>
                                            </div>

                                            {/* VS + Date */}
                                            <div className="flex flex-col items-center justify-center flex-shrink-0">
                                                <span className="text-gray-400 font-bold text-xs sm:text-sm">VS</span>
                                                <span className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
                                                    {new Date(match.dateTime).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Visitor Team */}
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[70px]">
                                                {visitorTeam && <img src={visitorTeam.logo} alt={visitorTeam.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />}
                                                <span className="text-[9px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">{visitorTeam?.name || 'N/A'}</span>
                                            </div>

                                            {/* Predictions */}
                                            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                                                {isBotinMatchAndPlaying ? (
                                                    <div className="text-center">
                                                        <p className="text-[8px] sm:text-xs text-purple-300">Auto</p>
                                                        <div className={`${getPredictionButtonClass(match.id, predictions[match.id])} mx-auto mt-0.5 cursor-default`}>
                                                            {predictions[match.id]}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handlePredictionChange(match.id, '1')} className={getPredictionButtonClass(match.id, '1')}>1</button>
                                                        <button onClick={() => handlePredictionChange(match.id, 'X')} className={getPredictionButtonClass(match.id, 'X')}>X</button>
                                                        <button onClick={() => handlePredictionChange(match.id, '2')} className={getPredictionButtonClass(match.id, '2')}>2</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-lg">Costo del Cartón: <span className="font-bold text-cyan-400">Bs {Math.floor(jornada.cartonPrice).toLocaleString('es-ES')}</span></p>
                            <p className="text-sm">Tu saldo actual: <span className="font-semibold">Bs {Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}</span></p>
                        </div>
                        <button 
                            onClick={handleAttemptPurchase}
                            disabled={!allPredictionsMade || (currentUser.balance || 0) < jornada.cartonPrice}
                            className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-lg text-lg btn-gradient disabled:bg-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:transform-none disabled:filter-none disabled:shadow-none"
                        >
                            { (currentUser.balance || 0) < jornada.cartonPrice ? 'Saldo Insuficiente' : 'Comprar Cartón' }
                        </button>
                    </div>
                </div>
            </div>
            <PurchaseConfirmationModal
                isOpen={isConfirmationModalVisible}
                onClose={() => setIsConfirmationModalVisible(false)}
                onConfirm={handleConfirmPurchase}
                jornada={jornada}
                teams={teams}
                currentUser={currentUser}
                predictions={predictions}
                botinPrediction={botinPrediction}
                playBotin={playBotin}
            />
        </>
    );
};

export default PurchaseCartonPage;
