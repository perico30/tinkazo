import React, { useState, useMemo } from 'react';
import type { Jornada, Team, Prediction } from '../../types';
import XIcon from '../../components/icons/XIcon';

interface ResultsModalProps {
    jornada: Jornada;
    teams: Team[];
    onClose: () => void;
    onSave: (jornadaId: string, results: { [matchId: string]: Prediction }) => void;
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

    const allResultsEntered = sortedMatches.every(match => results[match.id]);

    const handleSave = () => {
        if (allResultsEntered) {
            onSave(jornada.id, results);
        } else {
            alert('Debes ingresar el resultado para todos los partidos.');
        }
    };
    
    const getButtonClass = (matchId: string, result: Prediction) => {
        const isSelected = results[matchId] === result;
        const base = 'w-10 h-10 flex items-center justify-center font-bold text-lg rounded-md transition-all cursor-pointer';
        let colorClass = 'bg-gray-600 hover:bg-gray-500';
        if (isSelected) {
            switch(result) {
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
                        return (
                            <div key={match.id} className="bg-gray-700/50 p-4 rounded-lg grid grid-cols-3 gap-4 items-center">
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
                                    <button onClick={() => handleResultChange(match.id, 'X')} className={getButtonClass(match.id, 'X')}><XIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleResultChange(match.id, '2')} className={getButtonClass(match.id, '2')}>2</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="p-4 mt-auto border-t border-gray-700 text-right">
                    <button 
                        onClick={handleSave}
                        disabled={!allResultsEntered}
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
