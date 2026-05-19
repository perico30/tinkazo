import React, { useState, useEffect } from 'react';
import type { Jornada, JackpotConfig } from '../types';
import StarIcon from './icons/StarIcon';

interface ActiveJornadaHeroProps {
    jornada: Jornada;
    globalJackpot: number;
    gorditoAmount: number;
    onPlayClick: (jornada: Jornada) => void;
}

const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-4 justify-center items-center mt-6 mb-8 text-center text-white">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 w-20 shadow-[0_0_15px_rgba(34,211,238,0.3)] border border-cyan-500/30">
                <span className="text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-wider block text-gray-400 mt-1">Días</span>
            </div>
            <span className="text-2xl font-bold text-gray-500 animate-pulse">:</span>
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 w-20 shadow-[0_0_15px_rgba(34,211,238,0.3)] border border-cyan-500/30">
                <span className="text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-wider block text-gray-400 mt-1">Hrs</span>
            </div>
            <span className="text-2xl font-bold text-gray-500 animate-pulse">:</span>
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 w-20 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/30">
                <span className="text-3xl font-bold font-mono text-purple-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-wider block text-gray-400 mt-1">Min</span>
            </div>
            <span className="text-2xl font-bold text-gray-500 animate-pulse">:</span>
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-3 w-20 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/30">
                <span className="text-3xl font-bold font-mono text-purple-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-wider block text-gray-400 mt-1">Seg</span>
            </div>
        </div>
    );
};

const ActiveJornadaHero: React.FC<ActiveJornadaHeroProps> = ({ jornada, globalJackpot, gorditoAmount, onPlayClick }) => {
    
    // Calculate the close time: 10 minutes before the first match
    const scheduledMatches = jornada.matches
        .filter(match => match.dateTime && !isNaN(new Date(match.dateTime).getTime()))
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    let closeDate: Date | null = null;
    if (scheduledMatches.length > 0) {
        closeDate = new Date(new Date(scheduledMatches[0].dateTime).getTime() - 10 * 60 * 1000);
    }

    const isClosed = closeDate ? closeDate.getTime() <= new Date().getTime() : false;

    return (
        <section className="relative overflow-hidden rounded-3xl mb-16 shadow-2xl">
            {jornada.styling.backgroundImage ? (
                <img src={jornada.styling.backgroundImage} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800"></div>
            )}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 px-6 py-12 md:py-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="inline-block bg-cyan-500/20 text-cyan-300 font-bold px-4 py-1.5 rounded-full mb-6 text-sm md:text-base border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    🔥 JORNADA ACTIVA 🔥
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-sm uppercase tracking-tight">
                    {jornada.name}
                </h1>

                {/* Pot summary for this active jornada */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
                    {/* Always show Global Jackpot */}
                    <div className="text-center bg-gray-900/40 p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-sm">
                        <p className="text-xs sm:text-sm text-cyan-300 font-bold tracking-widest uppercase mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                            <StarIcon className="w-4 h-4" />
                            Gran Pozo Acumulado
                            <StarIcon className="w-4 h-4" />
                        </p>
                        <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                           style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>
                            Bs {Math.floor(globalJackpot || 0).toLocaleString('de-DE')}
                        </p>
                    </div>

                    {/* Show Gordito if applicable (based on botinMatchId in backend) */}
                    {jornada.botinMatchId && (
                        <div className="text-center bg-gray-900/40 p-4 sm:p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-sm">
                            <p className="text-xs text-purple-300 font-bold tracking-widest uppercase mb-2 drop-shadow-lg">
                                Premio Extra: El Gordito
                            </p>
                            <p className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                Bs {Math.floor(gorditoAmount || 0).toLocaleString('de-DE')}
                            </p>
                        </div>
                    )}
                </div>

                {closeDate && !isClosed && (
                    <div className="w-full">
                        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2">Cierre de Ventas en:</p>
                        <CountdownTimer targetDate={closeDate} />
                    </div>
                )}
                {isClosed && (
                    <div className="mt-8 mb-4 inline-block bg-red-500/20 text-red-400 font-bold px-6 py-2 rounded-full border border-red-500/30">
                        ESTA JORNADA ESTÁ CERRADA O EN JUEGO
                    </div>
                )}

                <button 
                    onClick={() => onPlayClick(jornada)}
                    disabled={isClosed}
                    className="mt-4 px-10 py-5 text-xl font-black uppercase tracking-wider rounded-xl btn-gradient shadow-[0_10px_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300"
                >
                    {isClosed ? 'Ventas Cerradas' : 'Jugar Ahora'}
                </button>
            </div>
        </section>
    );
};

export default ActiveJornadaHero;
