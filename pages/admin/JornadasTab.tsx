import React, { useState } from 'react';
import type { AppConfig, Jornada, Match, Team } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PencilIcon from '../../components/icons/PencilIcon';

interface JornadasTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const JornadaModal: React.FC<{
    jornada: Partial<Jornada> | null;
    onClose: () => void;
    onSave: (jornada: Jornada) => void;
}> = ({ jornada, onClose, onSave }) => {
    const [name, setName] = useState(jornada?.name || '');
    const [firstPrize, setFirstPrize] = useState(jornada?.firstPrize || '');
    const [secondPrize, setSecondPrize] = useState(jornada?.secondPrize || '');
    const [cartonPrice, setCartonPrice] = useState(jornada?.cartonPrice?.toString() || '');
    const [status, setStatus] = useState<'abierta' | 'cerrada' | 'cancelada'>(jornada?.status || 'abierta');
    const [flagIconUrl, setFlagIconUrl] = useState(jornada?.flagIconUrl || '');
    const [styling, setStyling] = useState(jornada?.styling || {
        textColor: '#ffffff',
        buttonColor: '#06b6d4',
        backgroundColor: '#1f2937',
        backgroundImage: '',
    });

    if (!jornada) return null;

    const handleSave = () => {
        if (!name || !firstPrize || !secondPrize || !cartonPrice) {
            alert('Por favor, complete todos los campos de la jornada, incluyendo el precio.');
            return;
        }
        onSave({
            id: jornada.id || new Date().toISOString(),
            name,
            firstPrize,
            secondPrize,
            cartonPrice: Number(cartonPrice),
            status,
            styling,
            flagIconUrl,
            matches: jornada.matches || [],
            botinMatchId: jornada.botinMatchId || null,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">{jornada.id ? 'Editar Jornada' : 'Añadir Jornada'}</h2>
                    <div className="space-y-4">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="Nombre de la Jornada" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={firstPrize} onChange={e => setFirstPrize(e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="Premio 1er Lugar" />
                            <input type="text" value={secondPrize} onChange={e => setSecondPrize(e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="Premio 2do Lugar" />
                        </div>
                        <input type="number" value={cartonPrice} onChange={e => setCartonPrice(e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="Precio del Cartón" min="0" step="0.01" />
                        <div className="flex items-center gap-4"><label>Estado</label><select value={status} onChange={e => setStatus(e.target.value as any)} className="bg-gray-700 p-2 rounded"><option value="abierta">Abierta</option><option value="cerrada">Cerrada</option><option value="cancelada">Cancelada</option></select></div>
                        <h3 className="font-semibold pt-2">Estilos de la Tarjeta</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between"><label>Color Texto</label><input type="color" value={styling.textColor} onChange={e => setStyling(s => ({...s, textColor: e.target.value}))} className="w-12 h-10 rounded bg-gray-700"/></div>
                            <div className="flex items-center justify-between"><label>Color Botón</label><input type="color" value={styling.buttonColor} onChange={e => setStyling(s => ({...s, buttonColor: e.target.value}))} className="w-12 h-10 rounded bg-gray-700"/></div>
                            <div className="flex items-center justify-between"><label>Color Fondo</label><input type="color" value={styling.backgroundColor} onChange={e => setStyling(s => ({...s, backgroundColor: e.target.value}))} className="w-12 h-10 rounded bg-gray-700"/></div>
                        </div>
                        <ImageUpload label="Bandera o Icono (Opcional)" imageUrl={flagIconUrl} onImageSelect={setFlagIconUrl} />
                        <ImageUpload label="Imagen de Fondo (Opcional)" imageUrl={styling.backgroundImage} onImageSelect={url => setStyling(s => ({...s, backgroundImage: url}))} />
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Guardar</button>
                </div>
            </div>
        </div>
    );
};


const MatchModal: React.FC<{
    match: Partial<Match> | null;
    jornadaId: string;
    teams: Team[];
    onClose: () => void;
    onSave: (jornadaId: string, match: Match) => void;
}> = ({ match, jornadaId, teams, onClose, onSave }) => {
    const [localTeamId, setLocalTeamId] = useState(match?.localTeamId || '');
    const [visitorTeamId, setVisitorTeamId] = useState(match?.visitorTeamId || '');
    const [dateTime, setDateTime] = useState(match?.dateTime ? new Date(match.dateTime).toISOString().slice(0, 16) : '');
    
    if (!match) return null;

    const handleSave = () => {
        if (!localTeamId || !visitorTeamId || !dateTime) {
            alert('Por favor, selecciona ambos equipos y la fecha/hora.');
            return;
        }
        if (localTeamId === visitorTeamId) {
            alert('El equipo local y visitante no pueden ser el mismo.');
            return;
        }
        onSave(jornadaId, {
            id: match.id || new Date().toISOString(),
            localTeamId,
            visitorTeamId,
            dateTime: new Date(dateTime).toISOString(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                 <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{match.id ? 'Editar Partido' : 'Añadir Partido'}</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block mb-1">Equipo Local</label><select value={localTeamId} onChange={e => setLocalTeamId(e.target.value)} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar...</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                            <div><label className="block mb-1">Equipo Visitante</label><select value={visitorTeamId} onChange={e => setVisitorTeamId(e.target.value)} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar...</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                        </div>
                        <div><label className="block mb-1">Fecha y Hora</label><input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="w-full bg-gray-700 p-2 rounded"/></div>
                    </div>
                </div>
                 <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Guardar Partido</button>
                </div>
            </div>
        </div>
    )
}

const JornadasTab: React.FC<JornadasTabProps> = ({ config, setConfig }) => {
    const [jornadaModal, setJornadaModal] = useState<Partial<Jornada> | null>(null);
    const [matchModal, setMatchModal] = useState<{jornadaId: string; match: Partial<Match>}| null>(null);

    const handleSaveJornada = (jornada: Jornada) => {
        setConfig(prev => {
            const exists = prev.jornadas.some(j => j.id === jornada.id);
            if (exists) {
                return { ...prev, jornadas: prev.jornadas.map(j => j.id === jornada.id ? jornada : j) };
            }
            return { ...prev, jornadas: [...prev.jornadas, jornada] };
        });
    };

    const handleDeleteJornada = (jornadaId: string) => {
        if(window.confirm('¿Eliminar esta jornada y todos sus partidos?')) {
            setConfig(prev => ({...prev, jornadas: prev.jornadas.filter(j => j.id !== jornadaId)}));
        }
    }

    const handleStatusChange = (jornadaId: string, status: Jornada['status']) => {
        setConfig(prev => ({
            ...prev,
            jornadas: prev.jornadas.map(j => j.id === jornadaId ? { ...j, status } : j)
        }));
    };
    
    const handleSaveMatch = (jornadaId: string, match: Match) => {
        setConfig(prev => {
            const newJornadas = prev.jornadas.map(j => {
                if (j.id === jornadaId) {
                    const matchExists = j.matches.some(m => m.id === match.id);
                    const newMatches = matchExists 
                        ? j.matches.map(m => m.id === match.id ? match : m) 
                        : [...j.matches, match];
                    return { ...j, matches: newMatches };
                }
                return j;
            });
            return { ...prev, jornadas: newJornadas };
        });
    };
    
    const handleDeleteMatch = (jornadaId: string, matchId: string) => {
        if(window.confirm('¿Eliminar este partido?')) {
            setConfig(prev => ({
                ...prev,
                jornadas: prev.jornadas.map(j => {
                     if (j.id === jornadaId) {
                        const newBotinMatchId = j.botinMatchId === matchId ? null : j.botinMatchId;
                        return { ...j, matches: j.matches.filter(m => m.id !== matchId), botinMatchId: newBotinMatchId };
                    }
                    return j;
                })
            }));
        }
    }

    const handleBotinMatchChange = (jornadaId: string, matchId: string | null) => {
        setConfig(prev => ({
            ...prev,
            jornadas: prev.jornadas.map(j => 
                j.id === jornadaId ? { ...j, botinMatchId: matchId || null } : j
            )
        }));
    };

    const handleGorditoJornadaChange = (jornadaId: string | null) => {
        setConfig(prev => ({
            ...prev,
            gorditoJornadaId: jornadaId || null,
        }));
    };

    const getTeam = (teamId: string) => config.teams.find(t => t.id === teamId);

    const statusStyles: { [key in Jornada['status']]: string } = {
        abierta: 'bg-green-500/20 text-green-300',
        cerrada: 'bg-gray-500/20 text-gray-400',
        cancelada: 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="max-w-7xl mx-auto">
            {jornadaModal && <JornadaModal jornada={jornadaModal} onClose={() => setJornadaModal(null)} onSave={handleSaveJornada} />}
            {matchModal && <MatchModal match={matchModal.match} jornadaId={matchModal.jornadaId} teams={config.teams} onClose={() => setMatchModal(null)} onSave={handleSaveMatch} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-xl">Gestión de Jornadas</h2>
                <button onClick={() => setJornadaModal({})} className="flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-3 py-2 rounded-lg hover:bg-cyan-400">
                    <PlusIcon className="h-5 w-5" />
                    Crear Jornada
                </button>
            </div>
            
             <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-2 text-purple-400">Configuración de Pozos</h3>
                <div>
                    <label htmlFor="gordito-jornada" className="block mb-1 text-sm font-medium text-gray-300">Jornada del Gordito</label>
                    <select
                        id="gordito-jornada"
                        value={config.gorditoJornadaId || ''} 
                        onChange={e => handleGorditoJornadaChange(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Ninguna</option>
                        {config.jornadas.map(j => (
                            <option key={j.id} value={j.id}>{j.name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Selecciona la jornada que participará por el premio "Gordito".</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {config.jornadas.map(jornada => (
                    <div key={jornada.id} className="bg-gray-800 rounded-lg shadow-lg flex flex-col">
                        {/* Card Header */}
                        <div className="p-4 border-b border-gray-700 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{jornada.name}</h3>
                                <span className={`mt-1 inline-block text-xs font-bold px-2 py-1 rounded-full uppercase ${statusStyles[jornada.status]}`}>
                                    {jornada.status}
                                </span>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-1">
                                <button onClick={() => setJornadaModal(jornada)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"><PencilIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDeleteJornada(jornada.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-gray-700"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-gray-400">1er Premio</p><p className="font-bold text-lg">{jornada.firstPrize}</p></div>
                                <div><p className="text-gray-400">2do Premio</p><p className="font-bold text-lg">{jornada.secondPrize}</p></div>
                                <div className="col-span-2"><p className="text-gray-400">Precio Cartón</p><p className="font-bold text-lg">Bs {(jornada.cartonPrice || 0).toFixed(2)}</p></div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Gestionar Estado</h4>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleStatusChange(jornada.id, 'abierta')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${jornada.status === 'abierta' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>Abierta</button>
                                    <button onClick={() => handleStatusChange(jornada.id, 'cerrada')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${jornada.status === 'cerrada' ? 'bg-gray-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>Cerrada</button>
                                    <button onClick={() => handleStatusChange(jornada.id, 'cancelada')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${jornada.status === 'cancelada' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>Cancelada</button>
                                </div>
                            </div>
                        </div>

                        {/* Matches List */}
                        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-300">Partidos ({jornada.matches.length})</h4>
                                <button onClick={() => setMatchModal({ jornadaId: jornada.id, match: {} })} className="text-cyan-400 text-sm font-semibold hover:text-cyan-300">Añadir</button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {jornada.matches.map(match => {
                                    const localTeam = getTeam(match.localTeamId);
                                    const visitorTeam = getTeam(match.visitorTeamId);
                                    return (
                                        <div key={match.id} className="flex items-center justify-between bg-gray-700/80 p-2 rounded-md">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                {localTeam && <img src={localTeam.logo} alt={localTeam.name} className="w-5 h-5 object-contain"/>}
                                                <span className="truncate max-w-[80px]">{localTeam?.name || 'N/A'}</span>
                                                <span className="text-gray-400 text-xs">vs</span>
                                                <span className="truncate max-w-[80px]">{visitorTeam?.name || 'N/A'}</span>
                                                {visitorTeam && <img src={visitorTeam.logo} alt={visitorTeam.name} className="w-5 h-5 object-contain"/>}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <button onClick={() => setMatchModal({ jornadaId: jornada.id, match })} className="text-gray-400 hover:text-white"><PencilIcon className="h-4 w-4"/></button>
                                                <button onClick={() => handleDeleteMatch(jornada.id, match.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="h-4 w-4"/></button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {jornada.matches.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No hay partidos en esta jornada.</p>}
                            </div>
                        </div>
                        {/* Botin Match Selector */}
                        <div className="p-4 border-t border-gray-700 mt-auto bg-gray-900/40 rounded-b-lg">
                           <label htmlFor={`botin-match-${jornada.id}`} className="block mb-1 text-sm font-medium text-cyan-300">Partido del Botín</label>
                            <select
                                id={`botin-match-${jornada.id}`}
                                value={jornada.botinMatchId || ''}
                                onChange={e => handleBotinMatchChange(jornada.id, e.target.value)}
                                className="w-full bg-gray-700 p-2 rounded text-sm disabled:opacity-50"
                                disabled={jornada.matches.length === 0}
                            >
                                <option value="">Ninguno</option>
                                {jornada.matches.map(match => {
                                    const local = getTeam(match.localTeamId);
                                    const visitor = getTeam(match.visitorTeamId);
                                    return (
                                        <option key={match.id} value={match.id}>
                                            {local?.name || 'N/A'} vs {visitor?.name || 'N/A'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                ))}
                 {config.jornadas.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No hay jornadas creadas. Haz clic en "Crear Jornada" para empezar.</p>}
            </div>
        </div>
    );
};

export default JornadasTab;