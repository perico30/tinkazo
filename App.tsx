import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import ClientPage from './pages/ClientPage';
import PurchaseCartonPage from './pages/PurchaseCartonPage';
import Notification from './components/Notification';
import type { View, AppConfig, UserRole, LegalLink, RegisteredUser, Jornada, Prediction, Carton, WithdrawalRequest, RechargeRequest } from './types';

// --- Componente de Modal Legal ---
const LegalModal: React.FC<{ content: LegalLink; onClose: () => void }> = ({ content, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div 
      className="bg-gray-800 rounded-2xl max-w-2xl w-full flex flex-col max-h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">{content.title}</h2>
        <button onClick={onClose} className="bg-gray-700 text-white rounded-full p-1.5 leading-none hover:bg-gray-600">&times;</button>
      </header>
      <div className="p-6 overflow-y-auto">
        <p className="whitespace-pre-wrap text-gray-300">{content.content}</p>
      </div>
       <footer className="p-4 border-t border-gray-700 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transition-colors">
            Cerrar
        </button>
      </footer>
    </div>
  </div>
);


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [legalModalContent, setLegalModalContent] = useState<LegalLink | null>(null);
  const [jornadaToPlay, setJornadaToPlay] = useState<Jornada | null>(null);
  const [resultNotificationCarton, setResultNotificationCarton] = useState<Carton | null>(null);
  const [notification, setNotification] = useState<string | null>(null);


  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: 'TINKAZO',
    theme: {
      backgroundColor: '#020617',
      textColor: '#ffffff',
      primaryColor: '#a855f7', // purple-500
      backgroundStyle: 'space',
    },
    logoUrl: '',
    welcomeMessage: {
      title: 'Desafía tu Suerte en TINKAZO',
      description: 'La arena definitiva para los pronosticadores más audaces. Domina las jornadas, crea tu jugada maestra y conquista premios legendarios.',
    },
    welcomePopup: {
      enabled: true,
      title: '¡Atención, Estratega!',
      text: 'Las jornadas de la Champions League están en su punto más álgido. ¡El tiempo se acaba! ¡Asegura tu predicción y no te quedes fuera de la gloria!',
      imageUrl: '',
    },
    jackpots: [
      {
        title: 'GRAN POZO',
        detail: 'GRAN POZO',
        amount: 'Bs 1,250,000',
        backgroundType: 'color',
        colors: { primary: '#22d3ee', backgroundColor: '#1f2937' }, // cyan-400, gray-800
        backgroundImage: '',
      },
      {
        title: 'SUPER POZO',
        detail: 'SUPER POZO',
        amount: 'Bs 300,000',
        backgroundType: 'color',
        colors: { primary: '#a855f7', backgroundColor: '#1f2937' }, // purple-500, gray-800
        backgroundImage: '',
      },
    ],
    carouselImages: [
        { id: '1', url: 'https://picsum.photos/seed/tinkazo1/920/430' },
        { id: '2', url: 'https://picsum.photos/seed/tinkazo2/920/430' },
        { id: '3', url: 'https://picsum.photos/seed/tinkazo3/920/430' },
    ],
    recharge: {
        qrCodeUrl: '',
    },
    adminWhatsappNumber: '+51987654321',
    sectionsOrder: ['jornadas', 'jackpots', 'carousel'],
    teams: [],
    jornadas: [],
    gorditoJornadaId: null,
    users: [],
    cartones: [],
    withdrawalRequests: [],
    rechargeRequests: [],
    footer: {
      copyright: '© 2024 TINKAZO. Todos los derechos reservados.',
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'tiktok', url: '#' },
        { platform: 'youtube', url: '#' },
        { platform: 'discord', url: '#' },
      ],
      legalLinks: [
        { title: 'Términos y Condiciones', content: 'Aquí va el contenido completo de los términos y condiciones del servicio...' },
        { title: 'Política de Privacidad', content: 'Aquí va el contenido completo de la política de privacidad de la aplicación...' },
      ],
    },
  });

  useEffect(() => {
    // Apply the correct background class to the body
    document.body.classList.remove('body-bg-space', 'body-bg-business');
    document.body.classList.add(`body-bg-${appConfig.theme.backgroundStyle}`);
    // Apply text color
    document.body.style.color = appConfig.theme.textColor;
  }, [appConfig.theme.backgroundStyle, appConfig.theme.textColor]);

  useEffect(() => {
    if (currentUser && userRole === 'client') {
      const cartonToNotify = appConfig.cartones.find(carton => {
        if (carton.userId !== currentUser.id || carton.resultNotified) {
          return false;
        }
        const jornada = appConfig.jornadas.find(j => j.id === carton.jornadaId);
        return jornada && jornada.resultsProcessed;
      });
      setResultNotificationCarton(cartonToNotify || null);
    } else {
        setResultNotificationCarton(null);
    }
  }, [currentUser, appConfig.cartones, appConfig.jornadas, userRole]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

  const navigateToLogin = useCallback(() => setCurrentView('login'), []);
  const navigateToRegister = useCallback(() => setCurrentView('register'), []);
  const navigateToHome = useCallback(() => {
    setCurrentView('home');
    setJornadaToPlay(null);
  }, []);
  const navigateToAdmin = useCallback(() => setCurrentView('admin'), []);
  const navigateToSellerPanel = useCallback(() => setCurrentView('seller'), []);
  const navigateToClientPanel = useCallback(() => {
    if (currentUser?.status === 'pending') {
        alert('Tu cuenta aún no ha sido activada. No puedes acceder a esta sección.');
        return;
    }
    setCurrentView('clientPanel')
  }, [currentUser]);

  const handleAdminLogin = useCallback(() => {
    setUserRole('admin');
    setCurrentUser(null);
    setCurrentView('admin');
  }, []);
  
  const handleUserLogin = useCallback((user: RegisteredUser) => {
    setCurrentUser(user);
    if (user.role === 'seller') {
      setUserRole('seller');
      setCurrentView('seller');
    } else {
      setUserRole('client');
      setCurrentView('home');
    }
  }, []);

  const handleRegister = useCallback((userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'>) => {
    const newUser: RegisteredUser = {
      ...userData,
      id: new Date().toISOString(),
      role: 'client',
      status: 'pending',
      assignedSellerId: null,
      balance: 0,
    };

    setAppConfig(prev => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    
    alert('¡Registro exitoso! Tu cuenta ha sido creada, pero necesita ser activada por un administrador para acceder a todas las funciones.');
    setCurrentView('login');

  }, []);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('home');
  }, []);
  
  const processJornadaResults = (config: AppConfig): AppConfig => {
    const newConfig = JSON.parse(JSON.stringify(config)); // Deep copy to avoid mutation issues
    
    newConfig.jornadas.forEach((jornada: Jornada, jornadaIndex: number) => {
        const allMatchesHaveResults = jornada.matches.length > 0 && jornada.matches.every(m => m.result);
        
        if (jornada.status === 'cerrada' && allMatchesHaveResults && !jornada.resultsProcessed) {
            console.log(`Processing results for jornada: ${jornada.name}`);
            
            // 1. Mark jornada as processed
            newConfig.jornadas[jornadaIndex].resultsProcessed = true;

            // 2. Find and update cartones
            newConfig.cartones = newConfig.cartones.map((carton: Carton) => {
                if (carton.jornadaId === jornada.id) {
                    let hits = 0;
                    jornada.matches.forEach(match => {
                        if (match.result && carton.predictions[match.id] === match.result) {
                            hits++;
                        }
                    });
                    return { ...carton, hits };
                }
                return carton;
            });

            // TODO: Winner prize distribution logic can be added here in the future
        }
    });

    return newConfig;
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    const processedConfig = processJornadaResults(newConfig);
    setAppConfig(processedConfig);
    showNotification('Se guardaron los cambios');
    // This explicitly keeps the user on the admin page, preventing the
    // reported redirect to the home page after saving.
    setCurrentView('admin');
  }
  
  const handleLegalClick = (link: LegalLink) => {
    setLegalModalContent(link);
  };
  
  const handleUpdateUser = useCallback((updatedUser: RegisteredUser) => {
    setAppConfig(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
    }));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showNotification('¡Datos actualizados!');
  }, [currentUser, showNotification]);

  const handlePlayJornada = useCallback((jornada: Jornada) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para poder jugar.');
      setCurrentView('login');
      return;
    }
    if (currentUser.status === 'pending') {
        alert('Tu cuenta debe ser activada por un administrador antes de poder jugar.');
        return;
    }

    const sortedMatches = [...jornada.matches].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    if (sortedMatches.length > 0) {
        const firstMatchDate = new Date(sortedMatches[0].dateTime);
        const now = new Date();
        if ((firstMatchDate.getTime() - now.getTime()) <= 10 * 60 * 1000) {
            alert('El tiempo para comprar un cartón para esta jornada ha expirado.');
            return;
        }
    }

    setJornadaToPlay(jornada);
    setCurrentView('purchaseCarton');
  }, [currentUser]);

  const handlePurchaseCarton = useCallback((jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number, botinPrediction: { localScore: number; visitorScore: number; } | null) => {
    if (!currentUser) {
      showNotification('Error: No se encontró el usuario.');
      return;
    }
    if ((currentUser.balance || 0) < price) {
      showNotification('Saldo insuficiente. Por favor, recarga tu cuenta.');
      return;
    }

    const newCarton: Carton = {
      id: new Date().toISOString(),
      userId: currentUser.id,
      jornadaId,
      predictions,
      purchaseDate: new Date().toISOString(),
      botinPrediction: botinPrediction,
    };
    
    const updatedUser = { ...currentUser, balance: (currentUser.balance || 0) - price };

    setAppConfig(prev => ({
      ...prev,
      cartones: [...prev.cartones, newCarton],
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u),
    }));
    
    setCurrentUser(updatedUser);
    showNotification('¡Cartón comprado con éxito!');
    navigateToHome();
  }, [currentUser, navigateToHome, showNotification]);

  const handleUpdateCarton = useCallback((cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number } | null) => {
    const carton = appConfig.cartones.find(c => c.id === cartonId);
    if (!carton) {
        alert('No se encontró el cartón.');
        return;
    }
    const jornada = appConfig.jornadas.find(j => j.id === carton.jornadaId);
    if (!jornada) {
        alert('No se encontró la jornada asociada.');
        return;
    }
    
    const now = new Date();
    const firstMatchDate = jornada.matches.length > 0 ? new Date(jornada.matches.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0].dateTime) : null;

    if (!firstMatchDate || (firstMatchDate.getTime() - now.getTime()) < 10 * 60 * 1000) {
        alert('El tiempo para editar este cartón ha expirado.');
        return;
    }

    setAppConfig(prev => ({
        ...prev,
        cartones: prev.cartones.map(c => c.id === cartonId ? { ...c, predictions: newPredictions, botinPrediction: newBotinPrediction } : c),
    }));

    alert('¡Cartón actualizado con éxito!');
  }, [appConfig.cartones, appConfig.jornadas]);

  const handleResultAcknowledged = useCallback((cartonId: string) => {
    setAppConfig(prev => ({
      ...prev,
      cartones: prev.cartones.map(c => 
        c.id === cartonId ? { ...c, resultNotified: true } : c
      ),
    }));
    setResultNotificationCarton(null);
  }, []);

  const handleRequestWithdrawal = useCallback((userId: string, amount: number, userQrCodeUrl: string) => {
      const user = appConfig.users.find(u => u.id === userId);
      if (!user) {
          alert('Error: Usuario no encontrado.');
          return;
      }
      if ((user.balance || 0) < amount) {
          alert('Error: Saldo insuficiente para realizar este retiro.');
          return;
      }

      const newRequest: WithdrawalRequest = {
          id: new Date().toISOString(),
          userId,
          amount,
          userQrCodeUrl,
          status: 'pending',
          requestDate: new Date().toISOString(),
      };

      setAppConfig(prev => ({
          ...prev,
          withdrawalRequests: [...prev.withdrawalRequests, newRequest],
      }));

      alert('Tu solicitud de retiro ha sido enviada. Será procesada por un administrador a la brevedad.');
  }, [appConfig.users]);

  const handleProcessWithdrawal = useCallback((requestId: string, action: 'approve' | 'reject') => {
      const request = appConfig.withdrawalRequests.find(r => r.id === requestId);
      if (!request) {
          alert('Error: Solicitud no encontrada.');
          return;
      }
      if (request.status !== 'pending') {
          alert('Error: Esta solicitud ya ha sido procesada.');
          return;
      }

      setAppConfig(prev => {
          const updatedRequests = prev.withdrawalRequests.map(r => {
              if (r.id === requestId) {
                const newStatus: WithdrawalRequest['status'] = action === 'approve' ? 'completed' : 'rejected';
                return { ...r, status: newStatus, processedDate: new Date().toISOString() };
              }
              return r;
            }
          );

          if (action === 'approve') {
              const updatedUsers = prev.users.map(u => {
                  if (u.id === request.userId) {
                      return { ...u, balance: (u.balance || 0) - request.amount };
                  }
                  return u;
              });
              return { ...prev, users: updatedUsers, withdrawalRequests: updatedRequests };
          }

          return { ...prev, withdrawalRequests: updatedRequests };
      });

      alert(`La solicitud ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
  }, [appConfig.withdrawalRequests]);

  // --- New Recharge Request Logic ---

  const handleRequestClientRecharge = useCallback((userId: string, amount: number, proofOfPaymentUrl: string) => {
    const newRequest: RechargeRequest = {
      id: new Date().toISOString(),
      userId,
      amount,
      requesterRole: 'client',
      status: 'pending',
      requestDate: new Date().toISOString(),
      proofOfPaymentUrl: proofOfPaymentUrl,
    };
    setAppConfig(prev => ({
      ...prev,
      rechargeRequests: [...prev.rechargeRequests, newRequest],
    }));
    alert('Solicitud de recarga enviada. Tu vendedor la revisará a la brevedad.');
  }, []);

  const handleRequestSellerRecharge = useCallback((userId: string, amount: number, proofOfPaymentUrl: string) => {
    const newRequest: RechargeRequest = {
      id: new Date().toISOString(),
      userId,
      amount,
      requesterRole: 'seller',
      status: 'pending',
      proofOfPaymentUrl,
      requestDate: new Date().toISOString(),
    };
    setAppConfig(prev => ({
      ...prev,
      rechargeRequests: [...prev.rechargeRequests, newRequest],
    }));
    alert('Solicitud de recarga enviada al administrador. Será procesada a la brevedad.');
  }, []);

  const handleProcessClientRecharge = useCallback((requestId: string, action: 'approve' | 'reject', sellerId: string) => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }

    setAppConfig(prev => {
      // FIX: Explicitly type the new status to satisfy the RechargeRequest['status'] type.
      const updatedRequests = prev.rechargeRequests.map(r => {
        if (r.id === requestId) {
            const newStatus: RechargeRequest['status'] = action === 'approve' ? 'approved' : 'rejected';
            return { ...r, status: newStatus, processedDate: new Date().toISOString(), processedBy: sellerId };
        }
        return r;
      });

      if (action === 'approve') {
        const seller = prev.users.find(u => u.id === sellerId);
        if (!seller || (seller.balance || 0) < request.amount) {
          alert('Error: Como vendedor, no tienes saldo suficiente para esta operación.');
          return prev;
        }

        const updatedUsers = prev.users.map(u => {
          if (u.id === sellerId) return { ...u, balance: (u.balance || 0) - request.amount };
          if (u.id === request.userId) return { ...u, balance: (u.balance || 0) + request.amount };
          return u;
        });

        return { ...prev, users: updatedUsers, rechargeRequests: updatedRequests };
      }
      
      return { ...prev, rechargeRequests: updatedRequests };
    });

    if (currentUser?.id === sellerId) {
       setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: (prevUser.balance || 0) - request.amount } : null);
    }
    
    alert(`La solicitud del cliente ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
  }, [appConfig.rechargeRequests, currentUser]);

  const handleProcessSellerRecharge = useCallback((requestId: string, action: 'approve' | 'reject') => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
     if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }

    setAppConfig(prev => {
      // FIX: Explicitly type the new status to satisfy the RechargeRequest['status'] type.
      const updatedRequests = prev.rechargeRequests.map(r => {
        if (r.id === requestId) {
            const newStatus: RechargeRequest['status'] = action === 'approve' ? 'approved' : 'rejected';
            return { ...r, status: newStatus, processedDate: new Date().toISOString(), processedBy: 'admin' };
        }
        return r;
      });

      if (action === 'approve') {
        const updatedUsers = prev.users.map(u => {
          if (u.id === request.userId) {
            return { ...u, balance: (u.balance || 0) + request.amount };
          }
          return u;
        });
        return { ...prev, users: updatedUsers, rechargeRequests: updatedRequests };
      }
      
      return { ...prev, rechargeRequests: updatedRequests };
    });

    alert(`La solicitud del vendedor ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
  }, [appConfig.rechargeRequests]);

  const renderView = () => {
    const userCartonCount = currentUser ? appConfig.cartones.filter(c => c.userId === currentUser.id).length : 0;
    
    switch (currentView) {
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} onRegister={handleRegister} primaryColor={appConfig.theme.primaryColor} />;
      case 'admin':
        return userRole === 'admin' ? <AdminPage initialConfig={appConfig} onSave={handleSaveConfig} onLogout={handleLogout} onExit={navigateToHome} onProcessWithdrawal={handleProcessWithdrawal} onProcessSellerRecharge={handleProcessSellerRecharge} /> : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} />;
      case 'seller':
        return userRole === 'seller' && currentUser ? (
            <SellerPage
              currentUser={currentUser}
              config={appConfig}
              onUpdateUser={handleUpdateUser}
              onRequestRecharge={handleRequestSellerRecharge}
              onProcessClientRecharge={handleProcessClientRecharge}
              onLogout={handleLogout}
              onExit={navigateToHome}
              onUpdateCarton={handleUpdateCarton}
            />
          ) : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} />;
      case 'clientPanel':
          if (userRole === 'client' && currentUser) {
              return (
                  <ClientPage
                      currentUser={currentUser}
                      config={appConfig}
                      onUpdateUser={handleUpdateUser}
                      onUpdateCarton={handleUpdateCarton}
                      onRequestWithdrawal={handleRequestWithdrawal}
                      onRequestRecharge={handleRequestClientRecharge}
                      onLogout={handleLogout}
                      onExit={navigateToHome}
                  />
              );
          }
          return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} />;
      case 'purchaseCarton':
        return jornadaToPlay && currentUser ? (
            <PurchaseCartonPage
                jornada={jornadaToPlay}
                teams={appConfig.teams}
                currentUser={currentUser}
                onPurchase={handlePurchaseCarton}
                onExit={navigateToHome}
            />
        ) : <HomePage
            appConfig={appConfig} userRole={userRole} currentUser={currentUser} userCartonCount={userCartonCount} onLoginClick={navigateToLogin} onRegisterClick={navigateToRegister} onHomeClick={navigateToHome} onAdminClick={navigateToAdmin} onSellerPanelClick={navigateToSellerPanel} onClientPanelClick={navigateToClientPanel} onLogoutClick={handleLogout} onLegalClick={handleLegalClick} onPlayJornada={handlePlayJornada} onResultAcknowledged={handleResultAcknowledged} resultNotificationCarton={resultNotificationCarton}
          />;
      case 'home':
      default:
        return (
          <HomePage
            appConfig={appConfig}
            userRole={userRole}
            currentUser={currentUser}
            userCartonCount={userCartonCount}
            onLoginClick={navigateToLogin}
            onRegisterClick={navigateToRegister}
            onHomeClick={navigateToHome}
            onAdminClick={navigateToAdmin}
            onSellerPanelClick={navigateToSellerPanel}
            onClientPanelClick={navigateToClientPanel}
            onLogoutClick={handleLogout}
            onLegalClick={handleLegalClick}
            onPlayJornada={handlePlayJornada}
            onResultAcknowledged={handleResultAcknowledged}
            resultNotificationCarton={resultNotificationCarton}
          />
        );
    }
  };

  return (
    <>
      <div className="min-h-screen">{renderView()}</div>
      {legalModalContent && <LegalModal content={legalModalContent} onClose={() => setLegalModalContent(null)} />}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </>
  );
};

export default App;