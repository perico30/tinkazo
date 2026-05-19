import React from 'react';
import type { Carton, Jornada, Team } from '../../types';
import { useLiveScores } from '../../hooks/useLiveScores';
import { isMatchMatch } from '../../utils/apiDeportes';

interface ClientTicketsTabProps {
    cartones: Carton[];
    jornadas: Jornada[];
    teams: Team[];
    onViewCarton: (carton: Carton) => void;
    onDeleteCarton: (cartonId: string) => void;
}

const ClientTicketsTab: React.FC<ClientTicketsTabProps> = ({ cartones, jornadas, teams, onViewCarton, onDeleteCarton }) => {
    const { liveEvents } = useLiveScores();
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
                const resultsProcessed = jornada?.resultsProcessed;
                const isWinner = carton.prizeWon && carton.prizeWon > 0;
                
                let statusElement: any = null;
                let liveHits = 0;
                let misses = 0;
                let matchesWithResult = 0;
                let earlyLost = false;
                
                if (jornada) {
                    jornada.matches.forEach(match => {
                        let finalResult = match.result;

                        if (!resultsProcessed && !finalResult) {
                            const localTeam = teams.find(t => t.id === match.localTeamId);
                            const visitorTeam = teams.find(t => t.id === match.visitorTeamId);
                            const liveMatch = liveEvents.find(e => isMatchMatch(e.id, e.team1.name, e.team2.name, match.id, localTeam?.name, visitorTeam?.name, e.startDate, match.dateTime));
                            if (liveMatch && (liveMatch.status === 'FT' || liveMatch.status === 'AET' || liveMatch.status === 'AP')) {
                                if (liveMatch.score1! > liveMatch.score2!) finalResult = '1';
                                else if (liveMatch.score1! < liveMatch.score2!) finalResult = '2';
                                else finalResult = 'X';
                            }
                        }

                        if (finalResult) {
                            matchesWithResult++;
                            if (carton.predictions[match.id] === finalResult) {
                                liveHits++;
                            } else {
                                misses++;
                            }
                        }
                    });

                    const maxAllowedMisses = parseFloat(jornada.secondPrize || '0') > 0 ? 1 : 0;
                    if (misses > maxAllowedMisses) {
                        earlyLost = true;
                    }
                }

                const totalMatches = jornada?.matches.length || 0;
                let displayHits = liveHits;
                let displayMisses = misses;
                let displayFinished = matchesWithResult;

                if (resultsProcessed && typeof carton.hits === 'number') {
                    displayHits = carton.hits;
                    displayMisses = Math.max(0, totalMatches - carton.hits);
                    displayFinished = totalMatches;
                } else if (jornada) {
                    let allFinished = true;
                    const now = new Date().getTime();
                    jornada.matches.forEach(m => {
                        if (new Date(m.dateTime).getTime() + 2 * 60 * 60 * 1000 > now) allFinished = false;
                    });
                    if (allFinished) displayFinished = totalMatches;
                }

                if (resultsProcessed || earlyLost) {
                    if (isWinner && !earlyLost) {
                        const details = carton.prizeDetails;
                        const prizeTexts: string[] = [];

                        if (details?.gordito) {
                            prizeTexts.push('EL GORDITO');
                        } else if (details?.jornada) {
                            prizeTexts.push(details.jornada.tier === 1 ? '1ER PREMIO' : '2DO PREMIO');
                        }

                        if (details?.botin) {
                            prizeTexts.push('EL GORDITO');
                        }

                        let prizeText = prizeTexts.join(' + ');

                        if (prizeText !== '') {
                            prizeText = `GANASTE ${prizeText}`;
                        } else if (details?.botin) {
                            prizeText = 'GANASTE EL GORDITO';
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
                            <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                                PERDIDO
                            </span>
                        );
                    }
                } else if (jornada?.status === 'en_juego' || (!resultsProcessed && !earlyLost)) {
                    statusElement = (
                        <span className="text-xs font-bold bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full animate-pulse border border-yellow-500/30">
                            EN JUEGO
                        </span>
                    );
                }

                const isDeletable = earlyLost || (resultsProcessed && !isWinner);
                
                return (
                    <div key={carton.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-grow w-full">
                            <p className="font-bold text-lg">{jornada ? jornada.name : 'Jornada Desconocida'}</p>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-400">
                                    Comprado: {new Date(carton.purchaseDate).toLocaleString()}
                                </p>
                                {statusElement}
                            </div>
                            <div className="mt-3 flex items-center">
                                <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-700/50 shadow-inner overflow-hidden">
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs font-bold border-r border-gray-700/50">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        {displayHits} Aciertos
                                    </div>
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs font-bold border-r border-gray-700/50">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        {displayMisses} Fallos
                                    </div>
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {displayFinished} / {totalMatches} finalizados
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto flex sm:flex-col gap-2 flex-shrink-0">
                            {isDeletable && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteCarton(carton.id); }}
                                    className="flex-1 sm:flex-none bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-2 rounded-lg hover:bg-red-500/40 text-sm"
                                >
                                    Eliminar
                                </button>
                            )}
                            <button 
                                onClick={() => onViewCarton(carton)}
                                className="flex-1 sm:flex-none bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 text-sm w-full"
                            >
                                Ver Cartón
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ClientTicketsTab;