import React from 'react';
import type { Carton, Jornada, Team } from '../../types';
import { useLiveScores } from '../../hooks/useLiveScores';
import { isMatchMatch } from '../../utils/apiDeportes';

interface ClientTicketsTabProps {
    cartones: Carton[];
    jornadas: Jornada[];
    teams: Team[];
    onViewCarton: (carton: Carton) => void;
}

const ClientTicketsTab: React.FC<ClientTicketsTabProps> = ({ cartones, jornadas, teams, onViewCarton }) => {
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
                
                let statusElement = null;
                let liveHits = 0;
                let earlyLost = false;
                
                let misses = 0;
                
                // Calculate live hits and early lost
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
                            {typeof carton.hits === 'number' ? (
                                <p className="mt-1 text-base font-bold text-cyan-300">Aciertos: {carton.hits}</p>
                            ) : jornada?.status === 'en_juego' ? (
                                <p className="mt-1 text-sm font-semibold text-yellow-400">Aciertos en vivo: {liveHits}/{jornada.matches.length}</p>
                            ) : null}
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

export default ClientTicketsTab;