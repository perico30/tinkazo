import React from 'react';
import type { RegisteredUser, AppConfig, Jornada } from '../../types';
import SoccerIcon from '../../components/icons/SoccerIcon';
import StarIcon from '../../components/icons/StarIcon';

// Helper function to handle alpha channels for custom background colors on cards
const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || hex.length < 7) hex = '#1f2937';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ClientDashboardTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onPlayJornada: (jornada: Jornada) => void;
}

const ClientDashboardTab: React.FC<ClientDashboardTabProps> = ({ currentUser, config, onPlayJornada }) => {
  const openJornadas = config.jornadas.filter(j => j.status === 'abierta');

  const isJornadaPlayable = (jornada: Jornada) => {
      if (jornada.status !== 'abierta') return false;
      const matchTimes = jornada.matches.map(m => new Date(m.dateTime).getTime());
      if (matchTimes.length === 0) return true;
      const firstMatchTime = Math.min(...matchTimes);
      const isPastLimit = Date.now() >= (firstMatchTime - 10 * 60 * 1000); // 10 minutes limit
      return !isPastLimit;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">¡Hola de nuevo, {currentUser.username}!</h2>
        <p className="text-gray-400">Aquí tienes un resumen de tu actividad y las próximas jornadas.</p>
      </div>

      <div>
          <h3 className="font-bold text-lg mb-6">Jornadas Disponibles</h3>
          {openJornadas.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2 pb-4">
                  {openJornadas.map(jornada => {
                      const isGordito = jornada.id === config.gorditoJornadaId;
                      const hasBotin = !!jornada.botinMatchId;
                      const playable = isJornadaPlayable(jornada);

                      return (
                          <div 
                              key={jornada.id} 
                              className={`jornada-card transition-transform ${playable ? 'cursor-pointer hover:shadow-cyan-500/20 shadow-xl active:scale-[0.98]' : 'opacity-75 grayscale'}`}
                              onClick={() => playable && onPlayJornada(jornada)}
                          >
                              {jornada.styling.backgroundImage && (
                                  <img src={jornada.styling.backgroundImage} alt={jornada.name} className="jornada-card-bg" />
                              )}
                              <div 
                                  className="jornada-card-overlay"
                                  style={{ backgroundColor: hexToRgba(jornada.styling.backgroundColor, 0.7) }}
                              ></div>

                              {(isGordito || hasBotin) && (
                                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[4]">
                                      {isGordito && (
                                          <div className="flex items-center gap-1 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                              <StarIcon className="h-3 w-3" />
                                              <span>Gordito Activado</span>
                                          </div>
                                      )}
                                      {hasBotin && (
                                          <div className="flex items-center gap-1 bg-yellow-400/90 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                              <StarIcon className="h-3 w-3" />
                                              <span>Botin Activado</span>
                                          </div>
                                      )}
                                  </div>
                              )}

                              <div className="jornada-card-content" style={{ color: jornada.styling.textColor }}>
                                  <header className="jornada-card-header">
                                      <div className="info">
                                          <SoccerIcon className="h-4 w-4" />
                                          <span>{jornada.matches.length} Partidos</span>
                                      </div>
                                      {jornada.flagIconUrl && <img src={jornada.flagIconUrl} alt="League" className="h-5 w-auto rounded" />}
                                  </header>
                                  <div className="jornada-card-body">
                                      <h3 className="jornada-card-title">{jornada.name}</h3>
                                  </div>
                                  <footer className="jornada-card-footer">
                                      <div className="bg-[#020617]/50 border border-white/10 rounded-full px-3 py-1.5 flex items-center justify-center gap-1.5 shadow-inner">
                                          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">1er:</span>
                                          <span className="text-[11px] font-black text-cyan-400">{jornada.firstPrize}</span>
                                          <span className="text-gray-600 font-bold">|</span>
                                          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">2do:</span>
                                          <span className="text-[11px] font-black text-indigo-400">{jornada.secondPrize}</span>
                                      </div>
                                      <button 
                                          className="jornada-button action disabled:bg-gray-600 disabled:cursor-not-allowed mx-auto block mt-4" 
                                          disabled={!playable}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              if (playable) onPlayJornada(jornada);
                                          }}
                                      >
                                          {playable ? 'Jugar Ahora' : 'Cerrada'}
                                      </button>
                                  </footer>
                              </div>
                          </div>
                      );
                  })}
              </div>
          ) : (
              <div className="bg-gray-700/50 p-6 rounded-lg text-center">
                  <p className="text-gray-400 py-8">No hay jornadas abiertas en este momento.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default ClientDashboardTab;