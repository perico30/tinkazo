import React, { useState, useEffect } from 'react';
import { ExternalMatch, searchLiveScoreEvents, fetchLiveScoreEvents } from '../../utils/apiDeportes';
import type { Jornada, Match, Team } from '../../types';
import ImageUpload from './ImageUpload';
import PlusIcon from '../icons/PlusIcon';
import TeamLogo, { getCachedLogoUrl } from './TeamLogo';

interface JornadaWizardProps {
  onCancel: () => void;
  onSave: (jornada: Jornada, newTeams: Team[]) => void;
}

const JornadaWizard: React.FC<JornadaWizardProps> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Fechas por defecto: desde hoy hasta +7 días
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [externalMatches, setExternalMatches] = useState<ExternalMatch[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<ExternalMatch[]>([]);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Form fields
  const [name, setName] = useState('');
  const [firstPrize, setFirstPrize] = useState('');
  const [secondPrize, setSecondPrize] = useState('');
  const [cartonPrice, setCartonPrice] = useState('');
  const [botinMatchId, setBotinMatchId] = useState<string | null>(null);
  const [flagIconUrl, setFlagIconUrl] = useState('');
  const [styling, setStyling] = useState({
    textColor: '#ffffff',
    buttonColor: '#06b6d4',
    backgroundColor: '#1f2937',
    backgroundImage: '',
  });
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    // Solo recargar si tenemos ambas fechas válidas
    if (startDate && endDate) {
      handleSearch();
    }
  }, [startDate, endDate]);

  const handleSearch = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    let data;
    if (searchQuery) {
      data = await searchLiveScoreEvents(searchQuery, startDate, endDate);
    } else {
      data = await fetchLiveScoreEvents(startDate, endDate);
    }
    // Filtrar para que solo aparezcan partidos que NO han empezado (NS = Not Started)
    data = data.filter(match => match.status === 'NS');
    setExternalMatches(data);
    setLoading(false);
  };

  const toggleMatchSelection = (match: ExternalMatch) => {
    if (selectedMatches.find(m => m.id === match.id)) {
      setSelectedMatches(selectedMatches.filter(m => m.id !== match.id));
    } else {
      setSelectedMatches([...selectedMatches, match]);
    }
  };

  const handleNextStep1 = () => {
    if (selectedMatches.length < 3) {
      alert('Debes seleccionar al menos 3 partidos para crear una jornada.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!name || !firstPrize || !secondPrize || !cartonPrice) {
      alert('Por favor completa todos los campos de precios y premios.');
      return;
    }
    setStep(3);
  };

  const handleFinish = async () => {
    // Al guardar, intentamos obtener los logos almacenados en cache (o re-fetch si es rápido)
    // Para guardarlos en la BD y que los clientes no tengan que buscarlos
    const newTeams: Team[] = [];

    // Función auxiliar para obtener equipos sin depender de bloqueos pesados
    const resolveTeam = async (id: string, name: string, fallbackUrl: string | undefined) => {
      let logo = await getCachedLogoUrl(name);
      if (!logo) logo = fallbackUrl || '';
      if (!newTeams.find(t => t.id === id)) {
        newTeams.push({ id, name, logo });
      }
    };

    // Generar Partidos y Equipos
    const matches: Match[] = [];

    for (const em of selectedMatches) {
      await resolveTeam(em.team1.id, em.team1.name, em.logo1);
      await resolveTeam(em.team2.id, em.team2.name, em.logo2);

      matches.push({
        id: crypto.randomUUID(),
        localTeamId: em.team1.id,
        visitorTeamId: em.team2.id,
        dateTime: em.startDate,
      });
    }

    const newJornada: Jornada = {
      id: crypto.randomUUID(),
      name,
      status: 'abierta',
      firstPrize,
      secondPrize,
      cartonPrice: Number(cartonPrice),
      matches,
      botinMatchId,
      flagIconUrl,
      styling,
      resultsProcessed: false,
      visibility,
      accessCode: visibility === 'private' ? (accessCode || crypto.randomUUID().slice(0, 8).toUpperCase()) : null,
    };

    onSave(newJornada, newTeams);
  };

  const toggleCountry = (country: string) => {
    const newSet = new Set(expandedCountries);
    if (newSet.has(country)) newSet.delete(country);
    else newSet.add(country);
    setExpandedCountries(newSet);
  };

  const toggleLeague = (leagueId: string) => {
    const newSet = new Set(expandedLeagues);
    if (newSet.has(leagueId)) newSet.delete(leagueId);
    else newSet.add(leagueId);
    setExpandedLeagues(newSet);
  };

  // Agrupar los partidos
  const groupedMatches = React.useMemo(() => {
    const groups: Record<string, Record<string, ExternalMatch[]>> = {};
    externalMatches.forEach(match => {
      const country = match.countryName || 'Internacional';
      const league = match.competitionName || 'Otras Ligas';
      if (!groups[country]) groups[country] = {};
      if (!groups[country][league]) groups[country][league] = [];
      groups[country][league].push(match);
    });
    // Sort logic (optional)
    return groups;
  }, [externalMatches]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-cyan-500 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center">
              {step}
            </span>
            Creador de Jornadas
          </h2>
          <div className="flex gap-2">
            <span className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-gray-600'}`}></span>
            <span className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-gray-600'}`}></span>
            <span className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-cyan-500' : 'bg-gray-600'}`}></span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Paso 1: Filtra los Partidos Disponibles</h3>
              <div className="flex flex-col md:flex-row gap-2 mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 font-semibold">Desde:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="bg-gray-700 p-2 rounded-lg border border-gray-600 focus:border-cyan-500 outline-none text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 font-semibold">Hasta:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="bg-gray-700 p-2 rounded-lg border border-gray-600 focus:border-cyan-500 outline-none text-sm w-full"
                      min={startDate}
                    />
                  </div>
                </div>
                <div className="flex flex-1 gap-2 mt-2 md:mt-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar equipo, liga o país..."
                    className="flex-1 bg-gray-700 p-2 rounded-lg border border-gray-600 focus:border-cyan-500 outline-none text-sm"
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-lg flex items-center justify-center font-bold text-sm transition"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10 text-gray-400 animate-pulse">Cargando partidos desde API Oficial...</div>
              ) : Object.keys(groupedMatches).length === 0 ? (
                <div className="text-center py-10 text-gray-500">No se encontraron partidos para la fecha/búsqueda.</div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(groupedMatches).map(([country, leagues]) => (
                    <div key={country} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCountry(country)}
                        className="w-full bg-gray-800 p-3 flex justify-between items-center hover:bg-gray-700 transition"
                      >
                        <span className="font-bold text-gray-200">{country}</span>
                        <span className="text-xl">{expandedCountries.has(country) ? '▼' : '▶'}</span>
                      </button>

                      {expandedCountries.has(country) && (
                        <div className="bg-gray-900 border-t border-gray-700 p-2 space-y-2">
                          {Object.entries(leagues).map(([league, matches]) => {
                            const leagueId = `${country}-${league}`;
                            return (
                              <div key={leagueId} className="border border-gray-700/50 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggleLeague(leagueId)}
                                  className="w-full bg-gray-800/80 p-2 flex justify-between items-center hover:bg-gray-700/80 transition text-sm"
                                >
                                  <span className="font-semibold text-cyan-300">{league} ({matches.length})</span>
                                  <span>{expandedLeagues.has(leagueId) ? '▼' : '▶'}</span>
                                </button>

                                {expandedLeagues.has(leagueId) && (
                                  <div className="p-2 grid grid-cols-1 xl:grid-cols-2 gap-2 bg-gray-900/50">
                                    {matches.map(match => {
                                      const isSelected = selectedMatches.some(m => m.id === match.id);
                                      return (
                                        <div
                                          key={match.id}
                                          onClick={() => toggleMatchSelection(match)}
                                          className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-center ${isSelected ? 'border-cyan-500 bg-cyan-900/40' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                            }`}
                                        >
                                          <div className="text-xs text-center text-gray-400 mb-2 border-b border-gray-700/50 pb-1">
                                            {new Date(match.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} • {new Date(match.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                          </div>
                                          <div className="flex justify-between items-center gap-2">
                                            <div className="flex-1 flex flex-col items-center text-center gap-1">
                                              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center p-1">
                                                <TeamLogo teamName={match.team1.name} fallbackUrl={match.logo1} />
                                              </div>
                                              <span className="font-semibold text-sm leading-tight">{match.team1.name}</span>
                                            </div>
                                            <div className="px-2 text-gray-500 font-bold text-xs">VS</div>
                                            <div className="flex-1 flex flex-col items-center text-center gap-1">
                                              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center p-1">
                                                <TeamLogo teamName={match.team2.name} fallbackUrl={match.logo2} />
                                              </div>
                                              <span className="font-semibold text-sm leading-tight">{match.team2.name}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Paso 2: Configuración Comercial</h3>
              <p className="text-gray-400 text-sm mb-4">Has seleccionado {selectedMatches.length} partidos para esta jornada.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Nombre de la Jornada</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600" placeholder="Ej: Jornada Fin de Semana" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Premio 1er Lugar</label>
                    <input type="text" value={firstPrize} onChange={e => setFirstPrize(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600" placeholder="Ej: Bs 20.000" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Premio 2do Lugar</label>
                    <input type="text" value={secondPrize} onChange={e => setSecondPrize(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600" placeholder="Ej: Bs 5.000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Precio del Cartón (Bs)</label>
                  <input type="number" value={cartonPrice} onChange={e => setCartonPrice(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600" placeholder="Ej: 50" min="0" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Visibilidad de la Jornada</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibility('public')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${visibility === 'public' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}
                    >
                      🌍 Pública
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility('private')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${visibility === 'private' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}
                    >
                      🔒 Privada
                    </button>
                  </div>
                  {visibility === 'private' && (
                    <div className="mt-2 bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
                      <p className="text-xs text-yellow-300">Solo los jugadores que tengan tu código de referido podrán ver esta jornada.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Paso 3: Detalles Finales y Estilos</h3>

              <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
                <label className="block text-sm mb-2 text-yellow-500 font-bold">¿Qué partido aplicará para el Pozo "Gordito"?</label>
                <select
                  value={botinMatchId || ''}
                  onChange={e => setBotinMatchId(e.target.value)}
                  className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600"
                >
                  <option value="">Ninguno</option>
                  {selectedMatches.map(m => (
                    <option key={m.id} value={m.id}>{m.team1.name} vs {m.team2.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-2">Los jugadores tendrán que acertar el marcador exacto de este partido para llevarse el Pozo Gordito.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Color de Fondo</label>
                  <input type="color" value={styling.backgroundColor} onChange={e => setStyling(s => ({ ...s, backgroundColor: e.target.value }))} className="w-full h-12 rounded bg-gray-700 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Color del Botón</label>
                  <input type="color" value={styling.buttonColor} onChange={e => setStyling(s => ({ ...s, buttonColor: e.target.value }))} className="w-full h-12 rounded bg-gray-700 cursor-pointer" />
                </div>
              </div>

              <div className="mt-4">
                <ImageUpload label="Bandera o Logo de la Liga" imageUrl={flagIconUrl} onImageSelect={setFlagIconUrl} />
              </div>
              <div className="mt-4">
                <ImageUpload label="Imagen de Fondo (Opcional)" imageUrl={styling.backgroundImage} onImageSelect={url => setStyling(s => ({ ...s, backgroundImage: url }))} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-between rounded-b-lg">
          <button
            onClick={step === 1 ? onCancel : () => setStep((step - 1) as 1 | 2)}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>

          {step === 1 && (
            <button
              onClick={handleNextStep1}
              className="px-6 py-2 rounded-lg font-bold bg-cyan-500 text-gray-900 hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              Continuar ({selectedMatches.length} Partidos)
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleNextStep2}
              className="px-6 py-2 rounded-lg font-bold bg-cyan-500 text-gray-900 hover:bg-cyan-400 transition-colors"
            >
              Siguiente Paso
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleFinish}
              className="px-8 py-2 rounded-lg font-bold bg-green-500 text-gray-900 hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            >
              Crear Jornada Ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JornadaWizard;
