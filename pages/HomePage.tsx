import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { AppConfig, JackpotConfig, CarouselImage, UserRole, LegalLink, Jornada, Team, RegisteredUser, Carton, VideoTutorial, PromoterProfile } from '../types';
import SoccerIcon from '../components/icons/SoccerIcon';
import StarIcon from '../components/icons/StarIcon';
import TicketIcon from '../components/icons/TicketIcon';
import PlayIcon from '../components/icons/PlayIcon';

// --- Helper Functions ---
const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || hex.length < 7) hex = '#1f2937'; // Default to a dark color if invalid
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (error) {
        console.error("Invalid video URL:", url, error);
        return null;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
};

const getYouTubeThumbnailUrl = (url: string): string | null => {
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (error) {
        // Not a valid URL, so no thumbnail can be extracted.
        return null;
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};


interface HomePageProps {
  appConfig: AppConfig;
  userRole: UserRole;
  currentUser: RegisteredUser | null;
  userCartonCount: number;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHomeClick: () => void;
  onAdminClick: () => void;
  onSellerPanelClick?: () => void;
  onClientPanelClick?: () => void;
  onLogoutClick: () => void;
  onLegalClick: (link: LegalLink) => void;
  onPlayJornada: (jornada: Jornada) => void;
}


// --- Componente de Pop-up ---
const WelcomePopup: React.FC<{ config: AppConfig['welcomePopup']; onClose: () => void; primaryColor: string; }> = ({ config, onClose, primaryColor }) => {
  if (!config.enabled) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {config.imageUrl && <img src={config.imageUrl} alt="Bienvenida" className="w-full h-48 object-cover rounded-t-2xl" />}
          <button onClick={onClose} className="absolute top-2 right-2 bg-gray-900/50 text-white rounded-full p-1.5 hover:bg-gray-700">&times;</button>
        </div>
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-3">{config.title}</h2>
          <p className="text-gray-300">{config.text}</p>
          <button onClick={onClose} className="mt-6 w-full text-white font-bold py-2.5 rounded-lg transition-colors btn-gradient">
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Video Modal Component ---
const VideoModal: React.FC<{ videoUrl: string; onClose: () => void; }> = ({ videoUrl, onClose }) => {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);

    if (!embedUrl) {
        onClose();
        return null;
    }
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                <iframe
                    className="w-full h-full rounded-lg shadow-2xl"
                    src={embedUrl}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <button onClick={onClose} className="absolute -top-10 right-0 bg-gray-900/50 text-white rounded-full p-2 text-2xl leading-none hover:bg-gray-700">&times;</button>
            </div>
        </div>
    );
};


// --- Componente de Contador (Nuevo) ---
const CountdownTimer: React.FC<{ firstMatchDateStr: string }> = ({ firstMatchDateStr }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const targetDate = new Date(firstMatchDateStr);
        // Jornada closes 10 min before first match starts
        const closingTime = targetDate.getTime() - 10 * 60 * 1000;
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = closingTime - now;

            if (distance <= 0) {
                setTimeLeft('Cerrado');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else {
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [firstMatchDateStr]);

    return (
        <div className="absolute top-2 right-2 z-[4] flex items-center gap-1 bg-black/60 text-white text-xs font-mono font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/10">
            ⏳ {timeLeft || '--:--:--'}
        </div>
    );
};

// Inline version (no absolute positioning) - returns just the time text
const CountdownTimerInline: React.FC<{ firstMatchDateStr: string }> = ({ firstMatchDateStr }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const targetDate = new Date(firstMatchDateStr);
        const closingTime = targetDate.getTime() - 10 * 60 * 1000;
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = closingTime - now;
            if (distance <= 0) { setTimeLeft('Cerrado'); return; }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(days > 0 ? `${days}d ${hours}h` : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [firstMatchDateStr]);

    return <span>{timeLeft || '--:--:--'}</span>;
};


const WelcomeMessage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <section className="text-center mb-8 sm:mb-16 mt-4 sm:mt-0">
    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6 gradient-text leading-tight">{title}</h1>
    <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4 leading-snug">{description}</p>
  </section>
);

const JackpotsSection: React.FC<{ gorditoJackpot: JackpotConfig; botinJackpot: JackpotConfig; botinAmount: number; }> = ({ gorditoJackpot, botinJackpot, botinAmount }) => {
    
    // Create a render-specific Botin object with the dynamic amount
    const botinToRender: JackpotConfig = {
        ...botinJackpot,
        amount: `Bs ${Math.floor(botinAmount).toLocaleString('es-ES')}`,
    };
    
    // Ensure Gordito has 'Bs' prefix and correct formatting if it is numeric
    const cleanGorditoNumber = gorditoJackpot.amount.replace(/[^0-9]/g, '');
    const formattedGorditoAmount = cleanGorditoNumber 
        ? `Bs ${Number(cleanGorditoNumber).toLocaleString('es-ES')}` 
        : gorditoJackpot.amount;

    const gorditoToRender: JackpotConfig = {
        ...gorditoJackpot,
        amount: formattedGorditoAmount
    };

    const jackpotsToRender = [gorditoToRender, botinToRender];

    return (
    <section className="grid md:grid-cols-2 gap-8">
      {jackpotsToRender.map((jackpot, index) => {
        const isImage = jackpot.backgroundType === 'image' && jackpot.backgroundImage;
        return (
          <div
            key={index}
            className="jackpot-card"
            style={{
              '--glow-color': jackpot.colors.primary,
              backgroundColor: jackpot.colors.backgroundColor, // Always keep the gradient/color!
            } as React.CSSProperties}
          >
            {isImage && (
              <img src={jackpot.backgroundImage} alt={jackpot.title} className="jackpot-card-bg" />
            )}
            <div className="jackpot-card-content">
              <h2 className="text-xl font-semibold mb-2 uppercase tracking-widest" style={{ color: jackpot.colors.primary }}>
                {jackpot.detail}
              </h2>
              <p className="text-5xl font-extrabold tracking-tighter" style={{ color: jackpot.colors.primary }}>
                {jackpot.amount}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};


const CarouselSection: React.FC<{ images: CarouselImage[] }> = ({ images }) => {
    if (!images || images.length === 0) return <section className="text-center p-8 bg-gray-800 rounded-lg">El carrusel está vacío.</section>;
    
    // Duration based on number of images to keep speed consistent. 5s per image.
    // FIX: Changed const to let to allow reassignment.
    let animationDuration = `${images.length * 2.5}s`;
    if (images.length < 3) animationDuration = `${images.length * 4}s`;


    return (
        <section className="w-full h-[250px] overflow-hidden relative group rounded-2xl [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div 
                className="flex h-full animate-scroll"
                style={{ '--animation-duration': animationDuration } as React.CSSProperties}
            >
                {[...images, ...images].map((img, index) => (
                    <div key={`${img.id}-${index}`} className="h-full flex-shrink-0 mx-4 w-[80vw] sm:w-[45vw] md:w-[30vw] xl:w-[450px]">
                        <img 
                            src={img.url} 
                            alt={`Slide ${index + 1}`} 
                            className="h-full w-full object-cover rounded-lg" 
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

const JornadasSection: React.FC<{ 
    jornadas: Jornada[], 
    teams: Team[], 
    cartones: Carton[], 
    currentUser: RegisteredUser | null, 
    promoterProfiles: PromoterProfile[],
    gorditoJornadaId?: string | null;
    onPlayJornada: (jornada: Jornada) => void 
}> = ({ jornadas, currentUser, onPlayJornada, gorditoJornadaId, promoterProfiles }) => {
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [unlockedPromoterIds, setUnlockedPromoterIds] = useState<Set<string>>(new Set());

  // Check if there are any private jornadas at all
  const hasPrivateJornadas = jornadas.some(j => j.visibility === 'private' && j.status !== 'cancelada');

  // Filter: show public jornadas + private ones the user has unlocked or owns
  const visibleJornadas = jornadas.filter(j => {
    if (j.status === 'cancelada' || j.status === 'cerrada' || j.resultsProcessed) return false;
    if (!j.visibility || j.visibility === 'public') return true;
    if (j.visibility === 'private') {
      if (currentUser && j.promoterId === currentUser.id) return true;
      // Show if user unlocked this promoter's jornadas
      if (j.promoterId && unlockedPromoterIds.has(j.promoterId)) return true;
      // Show if the user was referred by this promoter
      if (currentUser && j.promoterId && currentUser.referredBy === j.promoterId) return true;
      return false;
    }
    return true;
  });

  // Handle access code: match against promoter referral codes to unlock ALL their jornadas
  const handleAccessCode = () => {
    if (!accessCodeInput.trim()) return;
    const matchedPromoter = promoterProfiles.find(
      p => p.referralCode.toUpperCase() === accessCodeInput.trim().toUpperCase()
    );
    if (matchedPromoter) {
      setUnlockedPromoterIds(prev => new Set([...prev, matchedPromoter.userId]));
      setAccessCodeInput('');
      alert(`¡Acceso desbloqueado! Ahora puedes ver todas las jornadas de ${matchedPromoter.displayName}.`);
    } else {
      alert('Código no válido. Solicita el código correcto a tu promotor.');
    }
  };
  
  const isJornadaPlayable = (jornada: Jornada) => {
    const scheduledMatches = jornada.matches
      .filter(match => match.dateTime && !isNaN(new Date(match.dateTime).getTime()))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
    if (scheduledMatches.length === 0) return true;
    
    const firstMatchDate = new Date(scheduledMatches[0].dateTime);
    const now = new Date();
    return (firstMatchDate.getTime() - now.getTime()) > 10 * 60 * 1000;
  };
  
  const getFirstMatchDateStr = (jornada: Jornada) => {
     const scheduledMatches = jornada.matches
      .filter(match => match.dateTime && !isNaN(new Date(match.dateTime).getTime()))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      if (scheduledMatches.length === 0) return null;
      return scheduledMatches[0].dateTime;
  };

  const sortedJornadas = [...visibleJornadas].sort((a, b) => {
      const isPlayableA = isJornadaPlayable(a);
      const isPlayableB = isJornadaPlayable(b);

      if (isPlayableA && !isPlayableB) return -1;
      if (!isPlayableA && isPlayableB) return 1;

      const dateAStr = getFirstMatchDateStr(a);
      const dateBStr = getFirstMatchDateStr(b);
      
      const timeA = dateAStr ? new Date(dateAStr).getTime() : Infinity;
      const timeB = dateBStr ? new Date(dateBStr).getTime() : Infinity;

      return timeA - timeB;
  });

  return (
    <section className="mb-8">
      <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-center gradient-text">Jornadas Disponibles</h2>
      
      {/* Access Code Input - only show when private jornadas exist */}
      {hasPrivateJornadas && (
        <div className="flex gap-2 max-w-md mx-auto mb-6">
          <input
            type="text"
            value={accessCodeInput}
            onChange={e => setAccessCodeInput(e.target.value.toUpperCase())}
            placeholder="Código de promotor"
            className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none font-mono tracking-wider text-center"
          />
          <button
            onClick={handleAccessCode}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold text-sm transition"
          >
            Acceder
          </button>
        </div>
      )}

      {sortedJornadas.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-gray-400">No hay jornadas disponibles en este momento. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedJornadas.map(jornada => {
            const playable = isJornadaPlayable(jornada);
            const isGordito = jornada.id === gorditoJornadaId;
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
                  <header className="jornada-card-header items-start">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {playable ? (
                          <div className="flex items-center gap-1 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Disponible
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                            Cerrada
                          </div>
                        )}
                        <div className="info">
                          <SoccerIcon className="h-4 w-4" />
                          <span>{jornada.matches.length} Partidos</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-cyan-400/30 w-fit">
                          <TicketIcon className="h-3 w-3" />
                          <span>Bs. {Math.floor(jornada.cartonPrice).toLocaleString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {jornada.flagIconUrl && <img src={jornada.flagIconUrl} alt="League" className="h-5 w-auto rounded" />}
                      {getFirstMatchDateStr(jornada) && playable && (
                        <div className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/10">
                          ⏳ <CountdownTimerInline firstMatchDateStr={getFirstMatchDateStr(jornada)!} />
                        </div>
                      )}
                    </div>
                  </header>
                  <div className="jornada-card-body">
                    <h3 className="jornada-card-title">{jornada.name}</h3>
                    {jornada.promoterName && (
                      <div className="flex items-center gap-1 bg-purple-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-1 backdrop-blur-sm border border-purple-400/30">
                        🎪 {jornada.promoterName}
                      </div>
                    )}
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
                        onClick={() => onPlayJornada(jornada)}
                        disabled={!currentUser || !playable}
                        className="jornada-play-button"
                        style={{ color: jornada.styling.backgroundColor }}
                        title={!currentUser ? 'Debes iniciar sesión para jugar' : !playable ? 'La venta para esta jornada ha cerrado' : `Jugar por Bs ${Math.floor(jornada.cartonPrice).toLocaleString('es-ES')}`}
                    >
                        {!playable ? 'Cerrado' : 'Jugar'}
                    </button>
                  </footer>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const TutorialsSection: React.FC<{ videos: VideoTutorial[]; title: string; }> = ({ videos, title }) => {
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

    if (!videos || videos.length === 0) {
        return null; // Don't render the section if there are no videos
    }

    return (
        <>
            {selectedVideoUrl && <VideoModal videoUrl={selectedVideoUrl} onClose={() => setSelectedVideoUrl(null)} />}
            <section>
                <h2 className="text-4xl font-bold mb-8 text-center gradient-text">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {videos.map(video => {
                        const thumbnailUrl = getYouTubeThumbnailUrl(video.videoUrl);
                        return (
                            <div 
                                key={video.id}
                                className="relative group cursor-pointer aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                                onClick={() => setSelectedVideoUrl(video.videoUrl)}
                                title={`Ver: ${video.title}`}
                            >
                                {thumbnailUrl ? (
                                    <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <SoccerIcon className="w-16 h-16 text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                    <PlayIcon className="h-16 w-16 text-white/80 drop-shadow-lg" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="font-bold text-white truncate">{video.title}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
};


const HomePage: React.FC<HomePageProps> = (props) => {
  const { appConfig, userRole, currentUser, userCartonCount, onLoginClick, onRegisterClick, onHomeClick, onAdminClick, onSellerPanelClick, onClientPanelClick, onLogoutClick, onLegalClick, onPlayJornada } = props;
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Popup se muestra cada vez que se carga la página de inicio
    if (appConfig.welcomePopup.enabled) {
      setIsPopupVisible(true);
    }
  }, [appConfig.welcomePopup.enabled]);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const sectionComponents = {
    jackpots: <JackpotsSection gorditoJackpot={appConfig.gorditoJackpot} botinJackpot={appConfig.botinJackpot} botinAmount={appConfig.botinAmount} />,
    carousel: <CarouselSection images={appConfig.carouselImages} />,
    jornadas: <JornadasSection 
                jornadas={appConfig.jornadas} 
                teams={appConfig.teams} 
                cartones={appConfig.cartones} 
                currentUser={currentUser} 
                promoterProfiles={appConfig.promoterProfiles}
                onPlayJornada={onPlayJornada}
                gorditoJornadaId={appConfig.gorditoJornadaId}
              />,
    tutorials: <TutorialsSection videos={appConfig.videoTutorials} title={appConfig.tutorialsSectionTitle} />,
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        appName={appConfig.appName}
        logoUrl={appConfig.logoUrl}
        userRole={userRole}
        currentUser={currentUser}
        primaryColor={appConfig.theme.primaryColor}
        userCartonCount={userCartonCount}
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick} 
        onHomeClick={onHomeClick}
        onAdminClick={onAdminClick}
        onSellerPanelClick={onSellerPanelClick}
        onClientPanelClick={onClientPanelClick}
        onLogoutClick={onLogoutClick}
      />
      
      {isPopupVisible && <WelcomePopup config={appConfig.welcomePopup} onClose={closePopup} primaryColor={appConfig.theme.primaryColor} />}

      <main className="flex-grow pt-16 sm:pt-24">
        <div className="container mx-auto px-4 py-2 sm:py-8">
          
          <WelcomeMessage title={appConfig.welcomeMessage.title} description={appConfig.welcomeMessage.description} />
          
          <div className="space-y-16">
            {appConfig.sectionsOrder.map((sectionKey) => {
               if (appConfig.theme.hiddenSections?.includes(sectionKey)) return null;
               return (
                  <div key={sectionKey}>
                    {sectionComponents[sectionKey]}
                  </div>
               );
            })}
          </div>

        </div>
      </main>
      
      <Footer config={appConfig.footer} onLegalClick={onLegalClick} />
    </div>
  );
};

export default HomePage;