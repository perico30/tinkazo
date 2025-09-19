import React, { useState, useMemo } from 'react';
import type { Carton, Jornada, Team, Prediction } from '../types';
import XIcon from './icons/XIcon';

interface CartonModalProps {
    carton: Carton;
    jornada: Jornada | null;
    teams: Team[];
    appName: string;
    logoUrl: string;
    onClose: () => void;
    onSave: (cartonId: string, newPredictions: { [matchId: string]: Prediction }) => void;
}

const CartonModal: React.FC<CartonModalProps> = ({ carton, jornada, teams, appName, logoUrl, onClose, onSave }) => {
    const [predictions, setPredictions] = useState(carton.predictions);

    const isEditable = useMemo(() => {
        if (!jornada || jornada.status !== 'abierta') return false;
        
        const now = new Date();
        const firstMatchDate = jornada.matches.length > 0 
            ? new Date(jornada.matches.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0].dateTime) 
            : null;

        if (!firstMatchDate) return false;
        
        // Allow editing if more than 10 minutes before the first match
        return (firstMatchDate.getTime() - now.getTime()) > 10 * 60 * 1000;
    }, [jornada]);

    if (!jornada) {
        // Handle case where jornada is not found (though unlikely)
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
        if (!isEditable) return;
        setPredictions(prev => ({
            ...prev,
            [matchId]: prediction,
        }));
    };
    
    const handleSave = () => {
        onSave(carton.id, predictions);
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
        return `${getPredictionClass(prediction, true)} ${isEditable ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-700 ring-white' : ''}`;
    };


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
                    {jornada.matches.map(match => {
                        const localTeam = getTeam(match.localTeamId);
                        const visitorTeam = getTeam(match.visitorTeamId);
                        const currentPrediction = predictions[match.id];

                        return (
                            <div key={match.id} className="bg-gray-700 p-3 rounded-lg grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5 flex items-center gap-2">
                                    {localTeam && <img src={localTeam.logo} className="h-6 w-6 object-contain" />}
                                    <span className="text-sm font-semibold truncate">{localTeam?.name || 'N/A'}</span>
                                </div>
                                <div className="col-span-2 text-center text-gray-400">vs</div>
                                 <div className="col-span-5 flex items-center gap-2 justify-end text-right">
                                    <span className="text-sm font-semibold truncate">{visitorTeam?.name || 'N/A'}</span>
                                    {visitorTeam && <img src={visitorTeam.logo} className="h-6 w-6 object-contain" />}
                                </div>
                                
                                <div className="col-span-12 border-t border-gray-600 my-2"></div>

                                <div className="col-span-12 flex justify-center items-center gap-4">
                                    {isEditable ? (
                                        <>
                                            <button onClick={() => handlePredictionChange(match.id, '1')} className={getButtonClass(match.id, '1')}>1</button>
                                            <button onClick={() => handlePredictionChange(match.id, 'X')} className={getButtonClass(match.id, 'X')}><XIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handlePredictionChange(match.id, '2')} className={getButtonClass(match.id, '2')}>2</button>
                                        </>
                                    ) : (
                                        <div className={getPredictionClass(currentPrediction)}>
                                            {currentPrediction === 'X' ? <XIcon className="w-5 h-5"/> : currentPrediction}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                <footer className="p-4 mt-auto border-t border-gray-700 flex justify-between items-center">
                    <p className="text-sm text-cyan-300 italic">Buena suerte.</p>
                    {isEditable && (
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
