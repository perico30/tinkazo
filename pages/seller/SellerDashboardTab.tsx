import React from 'react';
import type { AppConfig, RegisteredUser } from '../../types';
import SoccerIcon from '../../components/icons/SoccerIcon';
import StarIcon from '../../components/icons/StarIcon';

// --- Helper Functions ---
const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || hex.length < 7) hex = '#1f2937';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SellerDashboardTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
}


const SellerDashboardTab: React.FC<SellerDashboardTabProps> = ({ currentUser, config }) => {
    const openJornadas = config.jornadas.filter(j => j.status === 'abierta');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-lg mb-2">Resumen</h3>
                 <p className="text-gray-400">Bienvenido a tu panel, {currentUser.username}. Desde aquí puedes gestionar a tus clientes y ver las jornadas activas.</p>
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-4">Jornadas Disponibles</h3>
                {openJornadas.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2 pb-4">
                        {openJornadas.map(jornada => {
                          const isGordito = jornada.id === config.gorditoJornadaId;
                          const hasBotin = !!jornada.botinMatchId;

                          return (
                            <div key={jornada.id} className="jornada-card">
                                {jornada.styling.backgroundImage && (
                                    <img src={jornada.styling.backgroundImage} alt={jornada.name} className="jornada-card-bg" />
                                )}
                                <div 
                                    className="jornada-card-overlay"
                                    style={{ backgroundColor: hexToRgba(jornada.styling.backgroundColor, 0.7) }}
                                ></div>

                                {(isGordito || hasBotin) && (
                                    <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-[4]">
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
                                        <div className="jornada-prize">
                                            <p className="jornada-prize-label">1er Lugar</p>
                                            <p className="jornada-prize-amount">{jornada.firstPrize}</p>
                                        </div>
                                        <div className="jornada-prize">
                                            <p className="jornada-prize-label">2do Lugar</p>
                                            <p className="jornada-prize-amount">{jornada.secondPrize}</p>
                                        </div>
                                        {/* Status indicator instead of play button for sellers */}
                                        <div className="w-full text-center mt-3 pt-3 border-t border-white/20">
                                            <span className="text-white font-bold bg-white/20 px-4 py-1.5 rounded-full text-sm shadow-md backdrop-blur-sm">
                                                ABIERTA PARA VENTA
                                            </span>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                          );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">No hay jornadas abiertas en este momento.</p>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardTab;