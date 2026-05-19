import React, { useState, useMemo, useEffect } from 'react';
import type { Jornada, Team, Prediction } from '../../types';
import XIcon from '../../components/icons/XIcon';
import { fetchMatchResult } from '../../utils/apiDeportes';

interface ResultsModalProps {
    jornada: Jornada;
    teams: Team[];
    onClose: () => void;
    onSave: (jornadaId: string, results: { [matchId: string]: Prediction }, botinResult?: string) => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ jornada, teams, onClose, onSave }) => {
    const [results, setResults] = useState<{ [matchId: string]: Prediction }>(() => {
        const initialResults: { [matchId: string]: Prediction } = {};
        jornada.matches.forEach(match => {
            if (match.result) {
                initialResults[match.id] = match.result;
            }
        });
        return initialResults;
    });

    const [botinScores, setBotinScores] = useState<{ local: string, visitor: string }>(() => {
        if (jornada.botinResult) {
            const [local, visitor] = jornada.botinResult.split('-');
            return { local: local || '', visitor: visitor || '' };
        }
        return { local: '', visitor: '' };
    });

    useEffect(() => {
        const botinMatchId = jornada.botinMatchId;
        if (!botinMatchId) {
            return;
        }

        const localScore = parseInt(botinScores.local, 10);
        const visitorScore = parseInt(botinScores.visitor, 10);

        if (!isNaN(localScore) && !isNaN(visitorScore)) {
            let result: Prediction;
            if (localScore > visitorScore) {
                result = '1';
            } else if (visitorScore > localScore) {
                result = '2';
            } else {
                result = 'X';
            }

            setResults(prevResults => {
                if (prevResults[botinMatchId] !== result) {
                    return { ...prevResults, [botinMatchId]: result };
                }
                return prevResults;
            });
        }
    }, [botinScores, jornada.botinMatchId, setResults]);

    const sortedMatches = useMemo(() =>
        [...jornada.matches].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
        [jornada.matches]);

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

    const handleResultChange = (matchId: string, result: Prediction) => {
        setResults(prev => ({
            ...prev,
            [matchId]: result,
        }));
    };

    const isBotinJornada = !!jornada.botinMatchId;
    const allResultsEntered = sortedMatches.every(match => results[match.id]);
    const botinResultEntered = !isBotinJornada || (botinScores.local !== '' && botinScores.visitor !== '');
    const canSave = allResultsEntered && botinResultEntered;

    const handleSave = () => {
        if (canSave) {
            const botinResultString = isBotinJornada ? `${botinScores.local}-${botinScores.visitor}` : undefined;
            onSave(jornada.id, results, botinResultString);
        } else {
            alert('Debes ingresar el resultado para todos los partidos, incluyendo el marcador exacto del Gordito si aplica.');
        }
    };

    const [isAutoFilling, setIsAutoFilling] = useState(false);

    const handleAutoFill = async () => {
        setIsAutoFilling(true);
        try {
            const newResults = { ...results };
            let newBotinLocal = botinScores.local;
            let newBotinVisitor = botinScores.visitor;
            let encontrados = 0;
            let finalizados = 0;
            let report = '';

            for (const match of sortedMatches) {
                const localTeam = getTeam(match.localTeamId);
                const visitorTeam = getTeam(match.visitorTeamId);
                const res = await fetchMatchResult(match.id, match.dateTime, localTeam?.name, visitorTeam?.name);
                console.log(`AutoFill -> Partido ID: ${match.id}`, res);
                if (res) {
                    encontrados++;
                    if (res.status === 'FT' || res.status === 'AET' || res.status === 'AP') {
                        finalizados++;
                        let pred: Prediction;
                        if (res.score1 > res.score2) pred = '1';
                        else if (res.score1 < res.score2) pred = '2';
                        else pred = 'X';

                        newResults[match.id] = pred;

                        if (match.id === jornada.botinMatchId) {
                            newBotinLocal = res.score1.toString();
                            newBotinVisitor = res.score2.toString();
                        }
                    } else {
                        report += `\n- El partido ${match.id} se encontró pero su estado es: ${res.status} (No está finalizado).`;
                    }
                } else {
                    report += `\n- El partido ${match.id} no arrojó resultados desde la API (Probablemente problema de proxy o fecha).`;
                }
            }

            setResults(newResults);
            setBotinScores({ local: newBotinLocal, visitor: newBotinVisitor });

            alert(`Proceso completado.\n- Partidos en la jornada: ${sortedMatches.length}\n- Datos encontrados en API: ${encontrados}\n- Partidos marcados como Finalizados: ${finalizados}${report ? '\nDetalles:' + report : ''}`);
        } catch (e) {
            console.error("Error auto-filling", e);
            alert("Hubo un error de conexión al autocompletar resultados.");
        }
        setIsAutoFilling(false);
    };

    const getButtonClass = (matchId: string, result: Prediction) => {
        const isSelected = results[matchId] === result;
        const base = 'w-10 h-10 flex items-center justify-center font-bold text-lg rounded-md transition-all cursor-pointer';
        let colorClass = 'bg-gray-600 hover:bg-gray-500';
        if (isSelected) {
            switch (result) {
                case '1': colorClass = `bg-green-500 text-white ring-2 ring-white`; break;
                case 'X': colorClass = `bg-yellow-500 text-gray-900 ring-2 ring-white`; break;
                case '2': colorClass = `bg-red-500 text-white ring-2 ring-white`; break;
            }
        }
        return `${base} ${colorClass}`;
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Resultados para: {jornada.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </header>

                <div className="p-6 overflow-y-auto space-y-4">
                    {sortedMatches.map(match => {
                        const localTeam = getTeam(match.localTeamId);
                        const visitorTeam = getTeam(match.visitorTeamId);
                        const isBotinMatch = match.id === jornada.botinMatchId;
                        return (
                            <div key={match.id} className={`p-4 rounded-lg ${isBotinMatch ? 'bg-purple-900/50 border border-purple-600' : 'bg-gray-700/50'}`}>
                                <div className="grid grid-cols-3 gap-4 items-center">
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
                                    <div className="col-span-1 flex justify-end items-center gap-2">
                                        <button onClick={() => handleResultChange(match.id, '1')} className={getButtonClass(match.id, '1')}>1</button>
                                        <button onClick={() => handleResultChange(match.id, 'X')} className={getButtonClass(match.id, 'X')}><XIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleResultChange(match.id, '2')} className={getButtonClass(match.id, '2')}>2</button>
                                    </div>
                                </div>
                                {isBotinMatch && (
                                    <div className="mt-4 pt-4 border-t border-purple-700 text-center">
                                        <h4 className="text-sm font-semibold text-purple-300 mb-2">🌟 Resultado Exacto (Gordito) 🌟</h4>
                                        <div className="flex items-center justify-center gap-3">
                                            <input type="number" min="0" value={botinScores.local} onChange={e => setBotinScores(p => ({ ...p, local: e.target.value }))} className="w-20 text-center bg-gray-700 p-2 rounded text-xl font-bold" placeholder="L" />
                                            <span className="text-xl font-bold text-gray-400">-</span>
                                            <input type="number" min="0" value={botinScores.visitor} onChange={e => setBotinScores(p => ({ ...p, visitor: e.target.value }))} className="w-20 text-center bg-gray-700 p-2 rounded text-xl font-bold" placeholder="V" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <footer className="p-4 mt-auto border-t border-gray-700 flex justify-between items-center">
                    <button
                        onClick={handleAutoFill}
                        disabled={isAutoFilling}
                        className="text-cyan-400 font-bold px-4 py-2 rounded-lg border border-cyan-600 hover:bg-cyan-900/30 disabled:opacity-50 transition"
                    >
                        {isAutoFilling ? '↻ Buscando...' : '✨ Auto-Completar Resultados'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="text-white font-bold px-6 py-2 rounded-lg btn-gradient disabled:bg-none disabled:bg-gray-600"
                    >
                        Guardar Resultados
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ResultsModal;