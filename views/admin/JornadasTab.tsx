import React, { useState, useMemo } from 'react';
import type { AppConfig, Jornada, Match, Team, Prediction } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import SoccerIcon from '../../components/icons/SoccerIcon';
import ResultsModal from './ResultsModal';
import JornadaWizard from '../../components/admin/JornadaWizard';
import { fetchMatchResult, isMatchMatch } from '../../utils/apiDeportes';
import { useLiveScores } from '../../hooks/useLiveScores';

// Helper function
const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || hex.length < 7) hex = '#1f2937'; // Default to a dark color if invalid
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Preview Card Component
const JornadaAdminPreviewCard: React.FC<{ jornada: Jornada }> = ({ jornada }) => {
    return (
        <div className="jornada-card w-full">
            {jornada.styling.backgroundImage && (
                <img src={jornada.styling.backgroundImage} alt={jornada.name} className="jornada-card-bg" />
            )}
            <div
                className="jornada-card-overlay"
                style={{ backgroundColor: hexToRgba(jornada.styling.backgroundColor, 0.7) }}
            ></div>
            <div className="jornada-card-content" style={{ color: jornada.styling.textColor }}>
                <header className="jornada-card-header">
                    <div className="info">
                        <SoccerIcon className="h-4 w-4" />
                        <span>{jornada.matches.length} Partidos</span>
                    </div>
                    {jornada.flagIconUrl && <img src={jornada.flagIconUrl} alt="League" className="h-5 w-auto rounded" />}
                </header>
                <div className="jornada-card-body">
                    <h3 className="jornada-card-title">{jornada.name || 'Nombre Jornada'}</h3>
                </div>
                <footer className="jornada-card-footer">
                    <div className="bg-[#020617]/50 border border-white/10 rounded-full px-3 py-1.5 flex items-center justify-center gap-1.5 shadow-inner">
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">1er:</span>
                        <span className="text-[11px] font-black text-cyan-400">{jornada.firstPrize || 'Bs 1000'}</span>
                        <span className="text-gray-600 font-bold">|</span>
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">2do:</span>
                        <span className="text-[11px] font-black text-indigo-400">{jornada.secondPrize || 'Bs 500'}</span>
                    </div>
                    <button className="jornada-play-button" disabled>Jugar</button>
                </footer>
            </div>
        </div>
    );
};

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
    const [status, setStatus] = useState<Jornada['status']>(jornada?.status || 'abierta');
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
            id: jornada.id || crypto.randomUUID(),
            name,
            firstPrize,
            secondPrize,
            cartonPrice: Number(cartonPrice),
            status,
            styling,
            flagIconUrl,
            matches: jornada.matches || [],
            botinMatchId: jornada.botinMatchId || null,
            resultsProcessed: jornada.resultsProcessed || false,
        });
        onClose();
    };

    const statusButtonClass = (s: Jornada['status']) => {
        const base = 'px-4 py-2 rounded-lg font-semibold text-sm transition-colors';
        if (status === s) {
            return `${base} bg-cyan-500 text-gray-900`;
        }
        return `${base} bg-gray-600 hover:bg-gray-500`;
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
                        <input type="number" value={cartonPrice} onChange={e => setCartonPrice(e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="Precio del Cartón" min="0" step="1" />
                        <div className="flex items-center gap-4">
                            <label>Estado</label>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => setStatus('abierta')} className={statusButtonClass('abierta')}>Abierta</button>
                                <button type="button" onClick={() => setStatus('en_juego')} className={statusButtonClass('en_juego')}>En Juego</button>
                                <button type="button" onClick={() => setStatus('cerrada')} className={statusButtonClass('cerrada')}>Cerrada</button>
                                <button type="button" onClick={() => setStatus('cancelada')} className={statusButtonClass('cancelada')}>Cancelada</button>
                            </div>
                        </div>
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
    const [searchQuery, setSearchQuery] = useState('');
    
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
            id: match.id || crypto.randomUUID(),
            localTeamId,
            visitorTeamId,
            dateTime: new Date(dateTime).toISOString(),
        });
        onClose();
    };

    const filteredAndSortedTeams = useMemo(() => {
        return teams
            .filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [teams, searchQuery]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                 <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{match.id ? 'Editar Partido' : 'Añadir Partido'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm">Buscar Equipo</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-700 p-2 rounded"
                                placeholder="Escribe para filtrar..."
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block mb-1">Equipo Local</label><select value={localTeamId} onChange={e => setLocalTeamId(e.target.value)} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar...</option>{filteredAndSortedTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                            <div><label className="block mb-1">Equipo Visitante</label><select value={visitorTeamId} onChange={e => setVisitorTeamId(e.target.value)} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar...</option>{filteredAndSortedTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
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
    const [resultsModalJornada, setResultsModalJornada] = useState<Jornada | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const [checkingFT, setCheckingFT] = useState<string | null>(null);
    const [expandedJornadas, setExpandedJornadas] = useState<Set<string>>(new Set());
    const { liveEvents } = useLiveScores();

    const toggleJornada = (id: string) => {
        setExpandedJornadas(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleCheckFT = async (jornada: Jornada) => {
        setCheckingFT(jornada.id);
        try {
            let ftCount = 0;
            for (const match of jornada.matches) {
                const localTeam = config.teams.find(t => t.id === match.localTeamId);
                const visitorTeam = config.teams.find(t => t.id === match.visitorTeamId);
                const res = await fetchMatchResult(match.id, match.dateTime, localTeam?.name, visitorTeam?.name);
                if (res && (res.status === 'FT' || res.status === 'AET' || res.status === 'AP')) {
                    ftCount++;
                }
            }
            if (ftCount > 0) {
                alert(`¡Hay ${ftCount} partido(s) finalizado(s) en esta jornada!`);
            } else {
                alert('Aún no hay partidos finalizados en esta jornada.');
            }
        } catch (e) {
            console.error('Error al verificar FT', e);
            alert('Hubo un error al verificar los partidos.');
        } finally {
            setCheckingFT(null);
        }
    };

    const handleSaveJornada = (jornada: Jornada) => {
        setConfig(prev => {
            const exists = prev.jornadas.some(j => j.id === jornada.id);
            if (exists) {
                return { ...prev, jornadas: prev.jornadas.map(j => j.id === jornada.id ? jornada : j) };
            }
            return { ...prev, jornadas: [jornada, ...prev.jornadas] };
        });
    };

    const handleSaveWizard = (jornada: Jornada, newTeams: Team[]) => {
        setConfig(prev => {
            // Unir y evitar duplicados de equipos
            const existingTeamIds = new Set(prev.teams.map(t => t.id));
            const uniqueNewTeams = newTeams.filter(t => !existingTeamIds.has(t.id));
            
            return {
                ...prev,
                teams: [...prev.teams, ...uniqueNewTeams],
                jornadas: [jornada, ...prev.jornadas]
            };
        });
        setShowWizard(false);
    };

    const handleDeleteJornada = (jornadaId: string) => {
        if(window.confirm('¿Eliminar esta jornada y todos sus partidos?')) {
            setConfig(prev => ({...prev, jornadas: prev.jornadas.filter(j => j.id !== jornadaId)}));
        }
    }
    
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

    const handleSaveResults = (jornadaId: string, results: { [matchId: string]: Prediction }, botinResult?: string) => {
        setConfig(prev => {
            const newJornadas = prev.jornadas.map(j => {
                if (j.id === jornadaId) {
                    const newMatches = j.matches.map(m => ({
                        ...m,
                        result: results[m.id] || m.result, // Update result
                    }));
                    return { ...j, matches: newMatches, botinResult: botinResult || j.botinResult };
                }
                return j;
            });
            return { ...prev, jornadas: newJornadas };
        });
        setResultsModalJornada(null);
        alert('Resultados guardados. Presiona "Guardar Cambios" en la cabecera para procesar los ganadores.');
    };

    const sortedJornadas = useMemo(() => {
        return [...config.jornadas].sort((a, b) => {
            const statusOrder = { 'abierta': 1, 'en_juego': 2, 'cerrada': 3, 'cancelada': 4 };
            return statusOrder[a.status] - statusOrder[b.status];
        });
    }, [config.jornadas]);

    const getTeam = (teamId: string) => config.teams.find(t => t.id === teamId);

    const statusStyles: { [key in Jornada['status']]: string } = {
        abierta: 'bg-green-500/20 text-green-300',
        en_juego: 'bg-yellow-500/20 text-yellow-500 animate-pulse border border-yellow-500/30',
        cerrada: 'bg-gray-500/20 text-gray-400',
        cancelada: 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="max-w-7xl mx-auto">
            {jornadaModal && <JornadaModal jornada={jornadaModal} onClose={() => setJornadaModal(null)} onSave={handleSaveJornada} />}
            {matchModal && <MatchModal match={matchModal.match} jornadaId={matchModal.jornadaId} teams={config.teams} onClose={() => setMatchModal(null)} onSave={handleSaveMatch} />}
            {resultsModalJornada && (
                <ResultsModal 
                    jornada={resultsModalJornada}
                    teams={config.teams}
                    onClose={() => setResultsModalJornada(null)}
                    onSave={handleSaveResults}
                />
            )}
            {showWizard && (
                <JornadaWizard 
                    onCancel={() => setShowWizard(false)} 
                    onSave={handleSaveWizard}
                    isAdmin={true}
                />
            )}

            <div className="flex flex-col gap-3 mb-6">
                <h2 className="font-semibold text-xl text-center md:text-left">Gestión de Jornadas</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => setShowWizard(true)} className="flex justify-center items-center gap-2 btn-gradient text-white font-bold px-4 py-2.5 rounded-lg active:scale-95 shadow-lg w-full sm:w-auto">
                        <PlusIcon className="h-5 w-5" />
                        CREAR JORNADA
                    </button>
                </div>
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

            <div className="space-y-3">
                {sortedJornadas.map(jornada => {
                    const isExpanded = expandedJornadas.has(jornada.id);
                    return (
                    <div key={jornada.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Collapsed Header — always visible */}
                        <button
                            onClick={() => toggleJornada(jornada.id)}
                            className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${statusStyles[jornada.status]}`}>
                                    {jornada.status}
                                </span>
                                <span className="font-bold text-white truncate">{jornada.name}</span>
                                <span className="text-xs text-gray-500 shrink-0">{jornada.matches.length} partidos</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); setJornadaModal(jornada); }} className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-600"><PencilIcon className="h-4 w-4"/></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteJornada(jornada.id); }} className="p-1.5 text-red-500 hover:text-red-400 rounded-full hover:bg-gray-600"><TrashIcon className="h-4 w-4"/></button>
                                <span className={`text-gray-400 text-sm ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <>
                                <div className="p-4 bg-gray-900/30 border-t border-gray-700">
                                    <JornadaAdminPreviewCard jornada={jornada} />
                                </div>
                                <div className="p-3 border-t border-gray-700">
                                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                        <div><span className="text-gray-400 block">1er Premio</span><span className="font-bold text-white">{jornada.firstPrize}</span></div>
                                        <div><span className="text-gray-400 block">2do Premio</span><span className="font-bold text-white">{jornada.secondPrize}</span></div>
                                        <div><span className="text-gray-400 block">Precio</span><span className="font-bold text-white">Bs {Math.floor(jornada.cartonPrice || 0).toLocaleString('es-ES')}</span></div>
                                    </div>
                                </div>
                                {/* Matches */}
                                <div className="p-3 border-t border-gray-700 bg-gray-800/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-300 text-sm">Partidos ({jornada.matches.length})</h4>
                                        <div className="flex gap-3 items-center">
                                            <button onClick={() => handleCheckFT(jornada)} disabled={checkingFT === jornada.id} className="text-yellow-400 text-xs font-semibold hover:text-yellow-300 disabled:opacity-50">
                                                {checkingFT === jornada.id ? 'Buscando...' : 'Buscar FT'}
                                            </button>
                                            <button onClick={() => setMatchModal({ jornadaId: jornada.id, match: {} })} className="text-cyan-400 text-xs font-semibold hover:text-cyan-300">Añadir</button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                        {[...jornada.matches]
                                          .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                                          .map(match => {
                                            const localTeam = getTeam(match.localTeamId);
                                            const visitorTeam = getTeam(match.visitorTeamId);
                                            const liveMatch = liveEvents.find(e => isMatchMatch(e.id, e.team1.name, e.team2.name, match.id, localTeam?.name, visitorTeam?.name, e.startDate, match.dateTime));
                                            const isFinished = liveMatch && (liveMatch.status === 'FT' || liveMatch.status === 'AET' || liveMatch.status === 'AP');
                                            return (
                                                <div key={match.id} className="flex items-center justify-between bg-gray-700/60 p-2 rounded text-xs">
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                        {localTeam && <img src={localTeam.logo} alt="" className="w-4 h-4 object-contain"/>}
                                                        <span className="truncate">{localTeam?.name || 'N/A'}</span>
                                                        <span className="text-gray-500 mx-1">vs</span>
                                                        <span className="truncate">{visitorTeam?.name || 'N/A'}</span>
                                                        {visitorTeam && <img src={visitorTeam.logo} alt="" className="w-4 h-4 object-contain"/>}
                                                    </div>
                                                    {isFinished && <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0 mx-1">FT {liveMatch.score1}-{liveMatch.score2}</span>}
                                                    <button onClick={() => handleDeleteMatch(jornada.id, match.id)} className="text-red-500 hover:text-red-400 p-1 shrink-0"><TrashIcon className="h-3.5 w-3.5"/></button>
                                                </div>
                                            )
                                        })}
                                        {jornada.matches.length === 0 && <p className="text-gray-500 text-xs text-center py-3">No hay partidos.</p>}
                                    </div>
                                </div>
                                {/* Botin */}
                                <div className="p-3 border-t border-gray-700 bg-gray-900/40">
                                   <label htmlFor={`botin-match-${jornada.id}`} className="block mb-1 text-xs font-medium text-cyan-300">Partido del Botín</label>
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
                                            return <option key={match.id} value={match.id}>{local?.name || 'N/A'} vs {visitor?.name || 'N/A'}</option>;
                                        })}
                                    </select>
                                </div>
                                {/* Results */}
                                {(jornada.status === 'cerrada' || jornada.status === 'en_juego') && (
                                    <div className="p-3 border-t border-gray-700 bg-gray-900/40">
                                        {jornada.resultsProcessed ? (
                                            <p className="text-sm text-green-400 font-semibold text-center">Resultados procesados</p>
                                        ) : (
                                            <button
                                                onClick={() => setResultsModalJornada(jornada)}
                                                className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-400 text-sm"
                                            >
                                                {jornada.status === 'en_juego' ? 'Actualizar Resultados en Vivo' : 'Cargar Resultados Finales'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    );
                })}
                 {config.jornadas.length === 0 && <p className="text-center text-gray-500 py-8">No hay jornadas creadas. Haz clic en "Crear Jornada" para empezar.</p>}
            </div>
        </div>
    );
};

export default JornadasTab;
