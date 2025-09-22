import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { AppConfig, JackpotConfig, CarouselImage, UserRole, LegalLink, Jornada, Team, RegisteredUser, Carton } from '../types';
import SoccerIcon from '../components/icons/SoccerIcon';
import StarIcon from '../components/icons/StarIcon';

// --- Helper Functions ---
const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex || hex.length < 7) hex = '#1f2937'; // Default to a dark color if invalid
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

// --- Componentes de sección (Ahora dinámicos) ---
const WelcomeMessage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <section className="text-center mb-16">
    <h1 className="text-5xl font-extrabold mb-4 gradient-text">{title}</h1>
    <p className="text-lg text-gray-300 max-w-3xl mx-auto">{description}</p>
  </section>
);

const JackpotsSection: React.FC<{ gorditoJackpot: JackpotConfig; botinJackpot: JackpotConfig; botinAmount: number; }> = ({ gorditoJackpot, botinJackpot, botinAmount }) => {
    
    // Create a render-specific Botin object with the dynamic amount
    const botinToRender: JackpotConfig = {
        ...botinJackpot,
        amount: `Bs ${Math.floor(botinAmount).toLocaleString('es-ES')}`,
    };
    
    const jackpotsToRender = [gorditoJackpot, botinToRender];

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
              backgroundColor: isImage ? 'transparent' : jackpot.colors.backgroundColor,
            } as React.CSSProperties}
          >
            {isImage && (
              <>
                <img src={jackpot.backgroundImage} alt={jackpot.title} className="jackpot-card-bg" />
                <div className="jackpot-card-overlay"></div>
              </>
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
    let animationDuration = `${images.length * 5}s`;
    if (images.length < 3) animationDuration = `${images.length * 8}s`;


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
    gorditoJornadaId?: string | null;
    onPlayJornada: (jornada: Jornada) => void 
}> = ({ jornadas, currentUser, onPlayJornada, gorditoJornadaId }) => {
  const openJornadas = jornadas.filter(j => j.status === 'abierta');
  
  const isJornadaPlayable = (jornada: Jornada) => {
    // Filter out matches that don't have a valid date. This makes the check more robust
    // against malformed data (e.g., a match saved without a date).
    const scheduledMatches = jornada.matches
      .filter(match => match.dateTime && !isNaN(new Date(match.dateTime).getTime()))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
    // If there are no valid, scheduled matches, the jornada is considered open for play.
    if (scheduledMatches.length === 0) return true;
    
    const firstMatchDate = new Date(scheduledMatches[0].dateTime);
    const now = new Date();

    // Disable if less than 10 minutes (600,000 milliseconds) before the first match
    return (firstMatchDate.getTime() - now.getTime()) > 10 * 60 * 1000;
  };


  if (openJornadas.length === 0) {
    return (
      <section>
        <h2 className="text-4xl font-bold mb-8 text-center">Jornadas Disponibles</h2>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No hay jornadas abiertas en este momento. ¡Vuelve pronto!</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-4xl font-bold mb-8 text-center gradient-text">Jornadas Disponibles</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {openJornadas.map(jornada => {
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
    </section>
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
                onPlayJornada={onPlayJornada}
                gorditoJornadaId={appConfig.gorditoJornadaId}
              />,
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

      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          
          <WelcomeMessage title={appConfig.welcomeMessage.title} description={appConfig.welcomeMessage.description} />
          
          <div className="space-y-16">
            {appConfig.sectionsOrder.map((sectionKey) => (
              <div key={sectionKey}>
                {sectionComponents[sectionKey]}
              </div>
            ))}
          </div>

        </div>
      </main>
      
      <Footer config={appConfig.footer} onLegalClick={onLegalClick} />
    </div>
  );
};

export default HomePage;
