import React, { useState, useCallback, useEffect, useRef } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import ClientPage from './pages/ClientPage';
import PurchaseCartonPage from './pages/PurchaseCartonPage';
import Notification from './components/Notification';
import type { View, AppConfig, UserRole, LegalLink, RegisteredUser, Jornada, Prediction, Carton, WithdrawalRequest, RechargeRequest, PrizeDetails, Team } from './types';
import { db } from './firebase';
// FIX: Removed Firebase v9 imports as logic is being switched to v8 syntax.
// import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';


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

const initialAppConfig: AppConfig = {
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
    gorditoJackpot: {
        title: 'GRAN POZO',
        detail: 'GRAN POZO',
        amount: 'Bs 1.250.000',
        backgroundType: 'color',
        colors: { primary: '#22d3ee', backgroundColor: '#1f2937' }, // cyan-400, gray-800
        backgroundImage: '',
    },
    botinJackpot: {
        title: 'POZO DEL BOTÍN',
        detail: 'POZO DEL BOTÍN',
        amount: '', // This will be overwritten by botinAmount
        backgroundType: 'color',
        colors: { primary: '#a855f7', backgroundColor: '#1f2937' }, // purple-500, gray-800
        backgroundImage: '',
    },
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
    botinAmount: 10000, // Initial Botin amount
    sellerCommissionPercentage: 10, // Default 10% commission for sellers
    footer: {
      copyright: '© 2024 TINKAZO. Todos los derechos reservados.',
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'tiktok', url: '#' },
        { platform: 'discord', url: '#' },
        { platform: 'snapchat', url: '#' },
        { platform: 'youtube', url: '#' },
        { platform: 'whatsapp', url: '#' },
        { platform: 'behance', url: '#' },
        { platform: 'threads', url: '#' },
        { platform: 'linkedin', url: '#' },
        { platform: 'dribbble', url: '#' },
        { platform: 'pinterest', url: '#' },
        { platform: 'twitch', url: '#' },
        { platform: 'telegram', url: '#' },
      ],
      legalLinks: [
        { title: 'Términos y Condiciones', content: 'Aquí va el contenido completo de los términos y condiciones del servicio...' },
        { title: 'Política de Privacidad', content: 'Aquí va el contenido completo de la política de privacidad de la aplicación...' },
      ],
    },
};

const getFirebaseErrorMessage = (error: any): string => {
    let message = 'Ocurrió un error desconocido. Revisa la consola para más detalles.';
    if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        console.error(`Firebase Error (${firebaseError.code}): ${firebaseError.message}`);
        switch (firebaseError.code) {
            case 'permission-denied':
                message = 'Error: Permiso denegado. Revisa tus Reglas de Seguridad en Firebase.';
                break;
            case 'unauthenticated':
                message = 'Error: No estás autenticado. Inicia sesión de nuevo.';
                break;
            case 'not-found':
                message = 'Error: El dato que intentas modificar no fue encontrado.';
                break;
            case 'invalid-argument':
                message = 'Error: Los datos enviados no son válidos. Revisa la consola.';
                break;
            default:
                message = `Error de Firebase: ${firebaseError.code}. Revisa la consola para detalles.`;
        }
    } else {
        console.error("Unknown error:", error);
    }
    return message;
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [legalModalContent, setLegalModalContent] = useState<LegalLink | null>(null);
  const [jornadaToPlay, setJornadaToPlay] = useState<Jornada | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const configDocRef = useRef(db.collection("tinkazoConfig").doc("main"));
  const teamsCollectionRef = useRef(db.collection("teams"));


  // Effect to listen for real-time config changes from Firestore
 useEffect(() => {
    let latestConfigData: Omit<AppConfig, 'teams'> | null = null;
    let latestTeamsData: Team[] | null = null;
    let configLoaded = false;
    let teamsLoaded = false;

    const reconstructAndSetState = () => {
      // Proceed only when both data sources have been loaded at least once
      if (configLoaded && teamsLoaded) {
        const fullConfig = { ...(latestConfigData as object), teams: latestTeamsData || [] } as AppConfig;
        
        // Sanitize and merge with defaults to avoid errors if some fields are missing
        const sanitizedConfig = JSON.parse(JSON.stringify(fullConfig));
        setAppConfig({ ...initialAppConfig, ...sanitizedConfig });

        if (!isConfigLoaded) {
          setIsConfigLoaded(true);
        }
      }
    };

    const unsubscribeConfig = configDocRef.current.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        latestConfigData = docSnap.data() as Omit<AppConfig, 'teams'>;
      } else {
        console.log("No config found, creating one.");
        // Create initial config, but without the 'teams' array
        const { teams, ...restConfig } = initialAppConfig;
        latestConfigData = restConfig;
        configDocRef.current.set(restConfig).catch(error => {
            console.error("Error creating initial config:", error);
        });
      }
      configLoaded = true;
      reconstructAndSetState();
    }, (error) => {
      console.error("Error listening to config changes:", error);
      const { teams, ...restConfig } = initialAppConfig;
      latestConfigData = restConfig;
      configLoaded = true;
      reconstructAndSetState();
    });

    const unsubscribeTeams = teamsCollectionRef.current.onSnapshot((querySnapshot) => {
      const teamsData: Team[] = [];
      querySnapshot.forEach((doc) => {
        teamsData.push(doc.data() as Team);
      });
      latestTeamsData = teamsData;
      teamsLoaded = true;
      reconstructAndSetState();
    }, (error) => {
      console.error("Error listening to teams collection:", error);
      latestTeamsData = []; // Fallback to empty array on error
      teamsLoaded = true;
      reconstructAndSetState();
    });

    return () => {
      unsubscribeConfig();
      unsubscribeTeams();
    };
  }, [isConfigLoaded]);


  useEffect(() => {
    // Apply the correct background class to the body
    document.body.classList.remove('body-bg-space', 'body-bg-business');
    document.body.classList.add(`body-bg-${appConfig.theme.backgroundStyle}`);
    // Apply text color
    document.body.style.color = appConfig.theme.textColor;
  }, [appConfig.theme.backgroundStyle, appConfig.theme.textColor]);

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
    const sanitizedUser = JSON.parse(JSON.stringify(user));
    setCurrentUser(sanitizedUser);
    if (sanitizedUser.role === 'seller') {
      setUserRole('seller');
      setCurrentView('seller');
    } else {
      setUserRole('client');
      setCurrentView('home');
    }
  }, []);

  const handleRegister = useCallback(async (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'>) => {
    const newUser: RegisteredUser = {
      ...userData,
      id: new Date().toISOString(),
      role: 'client',
      status: 'pending',
      assignedSellerId: null,
      balance: 0,
    };
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({
            users: [...appConfig.users, newUser]
        });
        alert('¡Registro exitoso! Tu cuenta ha sido creada, pero necesita ser activada por un administrador para acceder a todas las funciones.');
        setCurrentView('login');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.users, showNotification]);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('home');
  }, []);
  
const processJornadaResults = (config: AppConfig): AppConfig => {
    const newConfig = JSON.parse(JSON.stringify(config)); // Deep copy
    const parsePrize = (prizeStr: string) => parseInt(prizeStr.replace(/[^0-9]/g, ""), 10) || 0;

    newConfig.jornadas.forEach((jornada: Jornada) => {
        const allMatchesHaveResults = jornada.matches.length > 0 && jornada.matches.every(m => m.result);

        if (jornada.status === 'cerrada' && allMatchesHaveResults && !jornada.resultsProcessed) {
            console.log(`Processing results for jornada: ${jornada.name}`);
            jornada.resultsProcessed = true;

            const cartonesForJornada = newConfig.cartones.filter((c: Carton) => c.jornadaId === jornada.id);
            if (cartonesForJornada.length === 0) return;

            // 1. Calculate hits, invalidating cartons with wrong "Botin" predictions
            cartonesForJornada.forEach((carton: Carton) => {
                carton.prizeWon = 0;
                carton.prizeDetails = {};
                
                let isCartonValid = true;
                // If user played for the Botin, their prediction MUST be correct.
                if (carton.botinPrediction && jornada.botinResult) {
                    const [localStr, visitorStr] = jornada.botinResult.split('-');
                    const botinAdminResult = { local: parseInt(localStr, 10), visitor: parseInt(visitorStr, 10) };

                    const predictionIsWrong = isNaN(botinAdminResult.local) || isNaN(botinAdminResult.visitor) ||
                        carton.botinPrediction.localScore !== botinAdminResult.local ||
                        carton.botinPrediction.visitorScore !== botinAdminResult.visitor;

                    if (predictionIsWrong) {
                        // The user played for the Botin and failed. The entire carton is lost.
                        isCartonValid = false;
                    }
                }

                // Calculate hits only if the carton is valid
                if (isCartonValid) {
                    carton.hits = jornada.matches.reduce((hits, match) => 
                        (match.result && carton.predictions[match.id] === match.result) ? hits + 1 : hits, 0);
                } else {
                    // If invalid, hits are 0, so it cannot win any prize.
                    carton.hits = 0; 
                }
            });

            // 2. Determine Prize Amounts (Handle Gordito)
            const isGorditoJornada = jornada.id === newConfig.gorditoJornadaId;
            const firstPrizeAmount = isGorditoJornada 
                ? parsePrize(newConfig.gorditoJackpot.amount)
                : parsePrize(jornada.firstPrize);
            const secondPrizeAmount = parsePrize(jornada.secondPrize);

            // 3. Distribute Jornada Prizes
            const firstPrizeHits = jornada.matches.length;
            const secondPrizeHits = jornada.matches.length - 1;

            const firstPrizeWinners = cartonesForJornada.filter((c: Carton) => c.hits === firstPrizeHits);
            const secondPrizeWinners = cartonesForJornada.filter((c: Carton) => c.hits === secondPrizeHits);

            if (firstPrizeWinners.length > 0) {
                const prizePerWinner = firstPrizeAmount / firstPrizeWinners.length;
                firstPrizeWinners.forEach((carton: Carton) => {
                    carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                    const prizeDetailKey = isGorditoJornada ? 'gordito' : 'jornada';
                    carton.prizeDetails![prizeDetailKey as 'gordito' | 'jornada'] = { tier: 1, winnersCount: firstPrizeWinners.length };
                });
            } else if (!isGorditoJornada) {
                // No first prize winners, 70% of sales go to Botin
                const totalJornadaSales = cartonesForJornada.length * jornada.cartonPrice;
                const botinContribution = totalJornadaSales * 0.70;
                newConfig.botinAmount = (newConfig.botinAmount || 0) + botinContribution;
            }

            if (secondPrizeWinners.length > 0) {
                const prizePerWinner = secondPrizeAmount / secondPrizeWinners.length;
                secondPrizeWinners.forEach((carton: Carton) => {
                    carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                    if (!carton.prizeDetails?.jornada) { // Don't overwrite if they won 1st prize
                       carton.prizeDetails!.jornada = { tier: 2, winnersCount: secondPrizeWinners.length };
                    }
                });
            }

            // 4. Distribute Botin Prize
            if (jornada.botinResult && newConfig.botinAmount > 0) {
                const [localStr, visitorStr] = jornada.botinResult.split('-');
                const botinResult = { local: parseInt(localStr, 10), visitor: parseInt(visitorStr, 10) };

                if (!isNaN(botinResult.local) && !isNaN(botinResult.visitor)) {
                    const botinWinners = cartonesForJornada.filter(c => 
                        c.botinPrediction &&
                        c.botinPrediction.localScore === botinResult.local &&
                        c.botinPrediction.visitorScore === botinResult.visitor
                    );
                    
                    if (botinWinners.length > 0) {
                        const prizePerWinner = newConfig.botinAmount / botinWinners.length;
                        botinWinners.forEach((carton: Carton) => {
                            carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                            carton.prizeDetails!.botin = { winnersCount: botinWinners.length };
                        });
                        newConfig.botinAmount = 0; // Reset botin pot after it's won
                    }
                }
            }
            
            // 5. Update user balances based on total prizeWon
            cartonesForJornada.forEach((carton: Carton) => {
                if (carton.prizeWon && carton.prizeWon > 0) {
                    const user = newConfig.users.find((u: RegisteredUser) => u.id === carton.userId);
                    if (user) {
                        user.balance = (user.balance || 0) + carton.prizeWon;
                    }
                }
                // Cleanup empty prizeDetails object
                if (Object.keys(carton.prizeDetails || {}).length === 0) {
                    carton.prizeDetails = null;
                }
            });

            // 6. Update the main cartones array in newConfig
            newConfig.cartones = newConfig.cartones.map((originalCarton: Carton) => 
                cartonesForJornada.find(pc => pc.id === originalCarton.id) || originalCarton);
        }
    });

    return newConfig;
};

  const handleSaveConfig = async (newConfig: AppConfig) => {
    try {
        const processedConfig = processJornadaResults(newConfig);
        const { teams: newTeams, ...restConfig } = processedConfig;

        // --- Save non-team config parts ---
        // Using set to overwrite the entire document with the new state
        await configDocRef.current.set(restConfig);

        // --- Sync the teams collection ---
        const currentTeamsSnapshot = await teamsCollectionRef.current.get();
        const currentTeams: Team[] = [];
        currentTeamsSnapshot.forEach(doc => currentTeams.push(doc.data() as Team));

        const batch = db.batch();
        const newTeamIds = new Set(newTeams.map(t => t.id));
        const currentTeamIds = new Set(currentTeams.map(t => t.id));

        // Add or update teams
        newTeams.forEach(newTeam => {
            const currentTeam = currentTeams.find(t => t.id === newTeam.id);
            // We write if the team is new or if it has been changed.
            // A simple JSON.stringify is a good enough check for changes.
            if (!currentTeam || JSON.stringify(currentTeam) !== JSON.stringify(newTeam)) {
                const teamRef = teamsCollectionRef.current.doc(newTeam.id);
                batch.set(teamRef, newTeam);
            }
        });

        // Delete teams that are no longer in the new config
        currentTeams.forEach(currentTeam => {
            if (!newTeamIds.has(currentTeam.id)) {
                const teamRef = teamsCollectionRef.current.doc(currentTeam.id);
                batch.delete(teamRef);
            }
        });

        await batch.commit();
        
        showNotification('¡Cambios guardados con éxito!');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }
  
  const handleLegalClick = (link: LegalLink) => {
    setLegalModalContent(link);
  };
  
  const handleUpdateUser = useCallback(async (updatedUser: RegisteredUser) => {
    const sanitizedUser = JSON.parse(JSON.stringify(updatedUser));
    const updatedUsers = appConfig.users.map(u => u.id === sanitizedUser.id ? sanitizedUser : u);
    
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({ users: updatedUsers });
        if (currentUser?.id === sanitizedUser.id) {
            setCurrentUser(sanitizedUser);
        }
        showNotification('¡Datos actualizados!');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.users, currentUser?.id, showNotification]);

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

  const handlePurchaseCarton = useCallback(async (jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number, botinPrediction: { localScore: number; visitorScore: number; } | null) => {
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
    const updatedCartones = [...appConfig.cartones, newCarton];
    const updatedUsers = appConfig.users.map(u => u.id === currentUser.id ? updatedUser : u);
    
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({
            cartones: updatedCartones,
            users: updatedUsers
        });
        setCurrentUser(updatedUser);
        showNotification('¡Cartón comprado con éxito!');
        navigateToHome();
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [currentUser, appConfig.cartones, appConfig.users, navigateToHome, showNotification]);

  const handleUpdateCarton = useCallback(async (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number } | null) => {
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
    
    const updatedCartones = appConfig.cartones.map(c => c.id === cartonId ? { ...c, predictions: newPredictions, botinPrediction: newBotinPrediction } : c);
    
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({ cartones: updatedCartones });
        showNotification('¡Cartón actualizado con éxito!');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.cartones, appConfig.jornadas, showNotification]);

  const handleRequestWithdrawal = useCallback(async (userId: string, amount: number, userQrCodeUrl: string) => {
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
      
      // FIX: Using Firebase v8 syntax.
      try {
          await configDocRef.current.update({
              withdrawalRequests: [...appConfig.withdrawalRequests, newRequest]
          });
          showNotification('Tu solicitud de retiro ha sido enviada.');
      } catch (error) {
          showNotification(getFirebaseErrorMessage(error));
      }
  }, [appConfig.users, appConfig.withdrawalRequests, showNotification]);

  const handleProcessWithdrawal = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
      const request = appConfig.withdrawalRequests.find(r => r.id === requestId);
      if (!request) {
          alert('Error: Solicitud no encontrada.');
          return;
      }
      if (request.status !== 'pending') {
          alert('Error: Esta solicitud ya ha sido procesada.');
          return;
      }

      // FIX: Explicitly type the new status to prevent TypeScript from widening it to 'string'.
      const newStatus: WithdrawalRequest['status'] = action === 'approve' ? 'completed' : 'rejected';
      const updatedRequests = appConfig.withdrawalRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: newStatus, processedDate: new Date().toISOString() } 
          : r
      );
      
      let updatePayload: Partial<Omit<AppConfig, 'teams'>> = { withdrawalRequests: updatedRequests };

      if (action === 'approve') {
          const updatedUsers = appConfig.users.map(u => 
            u.id === request.userId 
              ? { ...u, balance: (u.balance || 0) - request.amount } 
              : u
          );
          updatePayload.users = updatedUsers;
      }
      
      // FIX: Using Firebase v8 syntax.
      try {
          await configDocRef.current.update(updatePayload);
          showNotification(`La solicitud ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
      } catch(error) {
          showNotification(getFirebaseErrorMessage(error));
      }
  }, [appConfig.withdrawalRequests, appConfig.users, showNotification]);

  // --- New Recharge Request Logic ---

  const handleRequestClientRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
    const newRequest: RechargeRequest = {
      id: new Date().toISOString(),
      userId,
      amount,
      requesterRole: 'client',
      status: 'pending',
      requestDate: new Date().toISOString(),
      proofOfPaymentUrl: proofOfPaymentUrl,
    };
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({
            rechargeRequests: [...appConfig.rechargeRequests, newRequest]
        });
        showNotification('Solicitud de recarga enviada.');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.rechargeRequests, showNotification]);

  const handleRequestSellerRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
    const newRequest: RechargeRequest = {
      id: new Date().toISOString(),
      userId,
      amount,
      requesterRole: 'seller',
      status: 'pending',
      proofOfPaymentUrl,
      requestDate: new Date().toISOString(),
    };
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update({
            rechargeRequests: [...appConfig.rechargeRequests, newRequest]
        });
        showNotification('Solicitud de recarga enviada al administrador.');
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.rechargeRequests, showNotification]);

  const handleProcessClientRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject', sellerId: string) => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }
    
    // FIX: Explicitly type the new status to prevent TypeScript from widening it to 'string'.
    const newStatus: RechargeRequest['status'] = action === 'approve' ? 'approved' : 'rejected';
    const updatedRequests = appConfig.rechargeRequests.map(r => 
      r.id === requestId
        ? { ...r, status: newStatus, processedDate: new Date().toISOString(), processedBy: sellerId }
        : r
    );

    let updatePayload: Partial<Omit<AppConfig, 'teams'>> = { rechargeRequests: updatedRequests };
    let newSellerBalance = currentUser?.balance;

    if (action === 'approve') {
        const seller = appConfig.users.find(u => u.id === sellerId);
        if (!seller || (seller.balance || 0) < request.amount) {
          alert('Error: Como vendedor, no tienes saldo suficiente para esta operación.');
          return;
        }

        const updatedUsers = appConfig.users.map(u => {
          if (u.id === sellerId) {
            newSellerBalance = (u.balance || 0) - request.amount;
            return { ...u, balance: newSellerBalance };
          }
          if (u.id === request.userId) return { ...u, balance: (u.balance || 0) + request.amount };
          return u;
        });
        updatePayload.users = updatedUsers;
    }
    
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update(updatePayload);
        if (action === 'approve' && currentUser?.id === sellerId && typeof newSellerBalance === 'number') {
            setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: newSellerBalance } : null);
        }
        showNotification(`La solicitud del cliente ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.rechargeRequests, appConfig.users, currentUser, showNotification]);

  const handleProcessSellerRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
     if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }

    // FIX: Explicitly type the new status to prevent TypeScript from widening it to 'string'.
    const newStatus: RechargeRequest['status'] = action === 'approve' ? 'approved' : 'rejected';
    const updatedRequests = appConfig.rechargeRequests.map(r => 
        r.id === requestId 
        ? { ...r, status: newStatus, processedDate: new Date().toISOString(), processedBy: 'admin' }
        : r
    );

    let updatePayload: Partial<Omit<AppConfig, 'teams'>> = { rechargeRequests: updatedRequests };

    if (action === 'approve') {
      const commissionPercentage = appConfig.sellerCommissionPercentage || 0;
      const commissionAmount = request.amount * (commissionPercentage / 100);
      const totalAmountToCredit = request.amount + commissionAmount;

      const updatedUsers = appConfig.users.map(u => 
        u.id === request.userId
          ? { ...u, balance: (u.balance || 0) + totalAmountToCredit }
          : u
      );
      updatePayload.users = updatedUsers;
    }
    
    // FIX: Using Firebase v8 syntax.
    try {
        await configDocRef.current.update(updatePayload);
        showNotification(`La solicitud del vendedor ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
    } catch (error) {
        showNotification(getFirebaseErrorMessage(error));
    }
  }, [appConfig.rechargeRequests, appConfig.users, appConfig.sellerCommissionPercentage, showNotification]);

  const renderView = () => {
    const userCartonCount = currentUser ? appConfig.cartones.filter(c => c.userId === currentUser.id).length : 0;
    
    switch (currentView) {
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} onRegister={handleRegister} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'admin':
        return userRole === 'admin' ? <AdminPage initialConfig={appConfig} onSave={handleSaveConfig} onLogout={handleLogout} onExit={navigateToHome} onProcessWithdrawal={handleProcessWithdrawal} onProcessSellerRecharge={handleProcessSellerRecharge} /> : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
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
          ) : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
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
          return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
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
            appConfig={appConfig} userRole={userRole} currentUser={currentUser} userCartonCount={userCartonCount} onLoginClick={navigateToLogin} onRegisterClick={navigateToRegister} onHomeClick={navigateToHome} onAdminClick={navigateToAdmin} onSellerPanelClick={navigateToSellerPanel} onClientPanelClick={navigateToClientPanel} onLogoutClick={handleLogout} onLegalClick={handleLegalClick} onPlayJornada={handlePlayJornada}
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