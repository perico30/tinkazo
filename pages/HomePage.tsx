import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { AppConfig, JackpotConfig, CarouselImage, UserRole, LegalLink, Jornada, Team, RegisteredUser, Carton } from '../types';

interface HomePageProps {
  appConfig: AppConfig;
  userRole: UserRole;
  currentUser: RegisteredUser | null;
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
          <button onClick={onClose} className="mt-6 w-full text-gray-900 font-bold py-2.5 rounded-lg transition-colors" style={{backgroundColor: primaryColor}}>
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
    <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
    <p className="text-lg text-gray-300 max-w-3xl mx-auto">{description}</p>
  </section>
);

const JackpotsSection: React.FC<{ jackpots: [JackpotConfig, JackpotConfig] }> = ({ jackpots }) => {
  return (
    <section className="grid md:grid-cols-2 gap-8">
      {jackpots.map((jackpot, index) => (
        <div
          key={index}
          className="jackpot-card p-8 rounded-2xl ring-1 text-center hover:scale-[1.03]"
          style={{
            '--glow-color': jackpot.colors.primary,
            backgroundColor: jackpot.colors.secondary,
            borderColor: jackpot.colors.primary,
            backgroundImage: jackpot.backgroundImage ? `url(${jackpot.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } as React.CSSProperties}
        >
          <h2 className="text-xl font-semibold mb-2 uppercase tracking-widest" style={{ color: jackpot.colors.primary }}>{jackpot.detail}</h2>
          <p className="text-5xl font-extrabold tracking-tighter" style={{ color: jackpot.colors.primary }}>{jackpot.amount}</p>
        </div>
      ))}
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
                    <div key={`${img.id}-${index}`} className="h-full flex-shrink-0 mx-4">
                        <img 
                            src={img.url} 
                            alt={`Slide ${index + 1}`} 
                            className="h-full w-auto object-cover rounded-lg aspect-[920/430]" 
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

const JornadasSection: React.FC<{ jornadas: Jornada[], teams: Team[], cartones: Carton[], currentUser: RegisteredUser | null, onPlayJornada: (jornada: Jornada) => void }> = ({ jornadas, teams, cartones, currentUser, onPlayJornada }) => {
  const openJornadas = jornadas.filter(j => j.status === 'abierta');

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
      <h2 className="text-4xl font-bold mb-8 text-center">Jornadas Disponibles</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openJornadas.map(jornada => (
          <div 
            key={jornada.id}
            className="rounded-lg p-6 flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-400/40"
            style={{
              color: jornada.styling.textColor,
              backgroundColor: jornada.styling.backgroundColor,
              backgroundImage: jornada.styling.backgroundImage ? `url(${jornada.styling.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={`text-center ${jornada.styling.backgroundImage ? 'bg-black/50 p-4 rounded-md' : ''}`}>
              <h3 className="text-xl font-bold">{jornada.name}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold">1er Lugar: <span className="font-extrabold text-2xl">{jornada.firstPrize}</span></p>
                <p className="text-md font-semibold">2do Lugar: <span className="font-bold text-xl">{jornada.secondPrize}</span></p>
                 <p className="text-sm font-semibold mt-2">Precio Cartón: <span className="font-bold text-lg">Bs {(jornada.cartonPrice || 0).toFixed(2)}</span></p>
              </div>
            </div>
            <button 
              onClick={() => onPlayJornada(jornada)}
              disabled={!currentUser}
              className="mt-6 w-full text-gray-900 font-bold py-2 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" 
              style={{ backgroundColor: jornada.styling.buttonColor }}
            >
              ¡Jugar ahora!
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};


const HomePage: React.FC<HomePageProps> = (props) => {
  const { appConfig, userRole, currentUser, onLoginClick, onRegisterClick, onHomeClick, onAdminClick, onSellerPanelClick, onClientPanelClick, onLogoutClick, onLegalClick, onPlayJornada } = props;
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
    jackpots: <JackpotsSection jackpots={appConfig.jackpots} />,
    carousel: <CarouselSection images={appConfig.carouselImages} />,
    jornadas: <JornadasSection jornadas={appConfig.jornadas} teams={appConfig.teams} cartones={appConfig.cartones} currentUser={currentUser} onPlayJornada={onPlayJornada} />,
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        appName={appConfig.appName}
        logoUrl={appConfig.logoUrl}
        userRole={userRole}
        currentUser={currentUser}
        primaryColor={appConfig.theme.primaryColor}
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
