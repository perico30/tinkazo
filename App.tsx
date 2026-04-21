// @ts-nocheck
import React, { useState, useCallback, useEffect, useRef } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import PromoterPage from './pages/PromoterPage';
import ClientPage from './pages/ClientPage';
import PurchaseCartonPage from './pages/PurchaseCartonPage';
import Notification from './components/Notification';
import BottomSheet from './components/BottomSheet';
import type { View, AppConfig, UserRole, LegalLink, RegisteredUser, Jornada, Prediction, Carton, WithdrawalRequest, RechargeRequest, PrizeDetails, PromoterProfile } from './types';
import { useSupabaseData } from './hooks/useSupabaseData';
import { supabase } from './supabaseClient';
import TicketIcon from './components/icons/TicketIcon';

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
    sectionsOrder: ['jornadas', 'jackpots', 'carousel', 'tutorials'],
    videoTutorials: [
      { id: 'vid1', title: 'Cómo Jugar tu Primera Jornada', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'vid2', title: 'Entendiendo el Pozo del Botín', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'vid3', title: 'Cómo Recargar Saldo', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
    tutorialsSectionTitle: 'Tutoriales',
    teams: [],
    jornadas: [],
    gorditoJornadaId: null,
    users: [],
    cartones: [],
    withdrawalRequests: [],
    rechargeRequests: [],
    botinAmount: 10000, // Initial Botin amount
    sellerCommissionPercentage: 10, // Default 10% commission for sellers
    transactions: [],
    promoterProfiles: [],
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
  const { appConfig, updateConfig, isLoading, dataFetchError } = useSupabaseData(initialAppConfig);
  const isConfigLoaded = !isLoading;

  // Effect to update the favicon dynamically based on the configured logo
  useEffect(() => {
    if (appConfig.logoUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = appConfig.logoUrl;
    }
  }, [appConfig.logoUrl]);

  // Effect to rehydrate session from localStorage on initial app load
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('tinkazoUserRole') as UserRole;
      const savedUserJSON = localStorage.getItem('tinkazoCurrentUser');
      const savedView = localStorage.getItem('tinkazoCurrentView') as View;

      if (savedRole) {
        setUserRole(savedRole);
        
        if (savedUserJSON) {
          setCurrentUser(JSON.parse(savedUserJSON));
        }

        if (savedView) {
            // Restore view, ensuring it's valid for the user's role
            if ((savedRole === 'admin' && savedView === 'admin') ||
                (savedRole === 'seller' && savedView === 'seller') ||
                (savedRole === 'promoter' && savedView === 'promoter') ||
                (savedRole === 'client' && ['clientPanel', 'purchaseCarton', 'home'].includes(savedView))) {
              setCurrentView(savedView);
            }
        }
      }
    } catch (error) {
      console.error("Failed to rehydrate session from localStorage:", error);
      // Clear potentially corrupt data on error
      localStorage.removeItem('tinkazoUserRole');
      localStorage.removeItem('tinkazoCurrentUser');
      localStorage.removeItem('tinkazoCurrentView');
    }
  }, []);

  // Sync currentUser with real-time appConfig.users to ensure balance and status are always fresh
  useEffect(() => {
      if (currentUser && appConfig.users.length > 0) {
          const freshUser = appConfig.users.find(u => u.id === currentUser.id);
          if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
              setCurrentUser(freshUser);
              localStorage.setItem('tinkazoCurrentUser', JSON.stringify(freshUser));
          }
      }
  }, [appConfig.users, currentUser]);

  // The real-time syncing is now handled entirely by useSupabaseData.


  useEffect(() => {
    // Apply the correct background class to the body
    document.body.classList.remove('body-bg-space', 'body-bg-business');
    document.body.classList.add(`body-bg-${appConfig.theme.backgroundStyle}`);
    // Apply text color
    document.body.style.color = appConfig.theme.textColor;
  }, [appConfig.theme.backgroundStyle, appConfig.theme.textColor]);

  // Interval Cron: Auto-Close Jornadas at < 10 Minutes
  useEffect(() => {
    if (!isConfigLoaded) return;
    const interval = setInterval(() => {
        const now = Date.now();
        
        appConfig.jornadas.forEach(async (j) => {
             if (j.status !== 'abierta') return;
             
             const matchTimes = j.matches.map(m => new Date(m.dateTime).getTime());
             if (matchTimes.length === 0) return;
             
             const firstMatchTime = Math.min(...matchTimes);
             // If 10 minutes or less remain
             if (now >= firstMatchTime - 10 * 60 * 1000) {
                 try {
                     // Since only Admins can mutate `jornadas`, we quietly attempt it. 
                     // It will only execute if an Admin has the window open (Acting as our decentralized server).
                     if (userRole === 'admin') {
                         await supabase.from('jornadas').update({ status: 'cerrada' }).eq('id', j.id);
                         console.log(`Auto-closed Jornada: ${j.name}`);
                     }
                 } catch (err) {
                     console.error("Auto-close attempted without privileges:", err);
                 }
             }
        });
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [appConfig.jornadas, isConfigLoaded, userRole]);

  // Effect to save the current view to localStorage when it changes for a logged-in user
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('tinkazoCurrentView', currentView);
    }
  }, [currentView, userRole]);

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
  const navigateToPromoterPanel = useCallback(() => setCurrentView('promoter'), []);
  const navigateToClientPanel = useCallback(() => {
    if (currentUser?.status === 'pending') {
        alert('Tu cuenta aún no ha sido activada. No puedes acceder a esta sección.');
        return;
    }
    setCurrentView('clientPanel')
  }, [currentUser]);

  const handleAdminLogin = useCallback(() => {
    const role: UserRole = 'admin';
    const view: View = 'admin';
    setUserRole(role);
    setCurrentUser(null);
    setCurrentView(view);
    localStorage.setItem('tinkazoUserRole', role);
    localStorage.setItem('tinkazoCurrentView', view);
    localStorage.removeItem('tinkazoCurrentUser');
  }, []);
  
  const handleUserLogin = useCallback((user: RegisteredUser) => {
    const sanitizedUser = JSON.parse(JSON.stringify(user));
    setCurrentUser(sanitizedUser);
    localStorage.setItem('tinkazoCurrentUser', JSON.stringify(sanitizedUser));
    
    if (sanitizedUser.role === 'admin') {
      const role: UserRole = 'admin';
      const view: View = 'admin';
      setUserRole(role);
      setCurrentView(view);
      localStorage.setItem('tinkazoUserRole', role);
      localStorage.setItem('tinkazoCurrentView', view);
    } else if (sanitizedUser.role === 'seller') {
      const role: UserRole = 'seller';
      const view: View = 'seller';
      setUserRole(role);
      setCurrentView(view);
      localStorage.setItem('tinkazoUserRole', role);
      localStorage.setItem('tinkazoCurrentView', view);
    } else if (sanitizedUser.role === 'promoter') {
      const role: UserRole = 'promoter';
      const view: View = 'promoter';
      setUserRole(role);
      setCurrentView(view);
      localStorage.setItem('tinkazoUserRole', role);
      localStorage.setItem('tinkazoCurrentView', view);
    } else {
      const role: UserRole = 'client';
      const view: View = 'home';
      setUserRole(role);
      setCurrentView(view);
      localStorage.setItem('tinkazoUserRole', role);
      localStorage.setItem('tinkazoCurrentView', view);
    }
  }, []);

  const handleRegister = useCallback(async (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'> & { referralCode?: string }) => {
    try {
        // Validate referral code if provided
        let referrerId: string | null = null;
        let assignedSellerId: string | null = null;
        let autoActivate = false;

        if (userData.referralCode) {
            // Check if it matches a promoter's referral code
            const matchedPromoter = appConfig.promoterProfiles.find(
              p => p.referralCode.toUpperCase() === userData.referralCode!.toUpperCase()
            );
            // Check if it matches a seller's referral code (from users table)
            const matchedSeller = appConfig.users.find(
              u => u.role === 'seller' && u.referralCode?.toUpperCase() === userData.referralCode!.toUpperCase()
            );

            if (matchedPromoter) {
                referrerId = matchedPromoter.userId;
                assignedSellerId = matchedPromoter.userId; // Promoter acts as the seller for this client
                autoActivate = true;
            } else if (matchedSeller) {
                referrerId = matchedSeller.id;
                assignedSellerId = matchedSeller.id;
                autoActivate = true;
            } else {
                showNotification('Código de referido no válido. Verifica e intenta de nuevo.');
                return;
            }
        }

        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password || 'Tinkazo123!',
            options: {
                data: {
                    username: userData.username,
                    role: 'client',
                    phone: userData.phone,
                    country: userData.country
                }
            }
        });
        
        if (error) throw error;

        if (data?.user) {
             // Small delay to let the trigger finish inserting first
             await new Promise(resolve => setTimeout(resolve, 500));
             
             const { error: upsertError } = await supabase.from('users').upsert({
                id: data.user.id,
                username: userData.username,
                email: userData.email,
                role: 'client',
                phone: userData.phone,
                country: userData.country,
                status: autoActivate ? 'active' : 'pending',
                balance: 0,
                assigned_seller_id: assignedSellerId,
                referred_by: referrerId,
                referral_code: null
             }, { onConflict: 'id' });
             if (upsertError) {
                 console.error("Error upsert public.users:", upsertError);
             }
        }

        if (autoActivate) {
            alert('¡Registro exitoso! Tu cuenta ha sido activada automáticamente. Ya puedes iniciar sesión.');
        } else {
            alert('¡Registro exitoso! Tu cuenta ha sido creada, pero necesita ser activada por un administrador para acceder a todas las funciones.');
        }
        setCurrentView('login');
    } catch (error: any) {
        showNotification(error.message || 'Error al registrar.');
    }
  }, [showNotification, appConfig.promoterProfiles, appConfig.users]);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('home');
    localStorage.removeItem('tinkazoUserRole');
    localStorage.removeItem('tinkazoCurrentUser');
    localStorage.removeItem('tinkazoCurrentView');
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
        
        // 1. Update app_config
        const { error: configError } = await supabase.from('app_config').update({
            app_name: processedConfig.appName,
            theme: { ...processedConfig.theme, logoUrl: processedConfig.logoUrl },
            botin_amount: processedConfig.botinAmount,
            seller_commission_percentage: processedConfig.sellerCommissionPercentage,
            admin_whatsapp: processedConfig.adminWhatsappNumber,
            welcome_message: processedConfig.welcomeMessage,
            welcome_popup: processedConfig.welcomePopup,
            jackpots: { 
                gordito: processedConfig.gorditoJackpot, 
                botin: processedConfig.botinJackpot,
                gorditoJornadaId: processedConfig.gorditoJornadaId || null
            },
            video_tutorials: processedConfig.videoTutorials,
            carousel_images: processedConfig.carouselImages,
            recharge_qr_url: processedConfig.recharge.qrCodeUrl,
            social_links: processedConfig.footer.socialLinks,
            legal_links: processedConfig.footer.legalLinks,
            sections_order: processedConfig.sectionsOrder,
            teams: processedConfig.teams,
            footer_text: processedConfig.footer.copyright
        }).eq('id', 'main');

        if (configError) throw configError;

        // 2. Only update the modified components (Simplified for drop-in replacement)
        // Let's do users balances and other admin-editable fields
        for (const u of processedConfig.users) {
            const originalUser = appConfig.users.find((orig: RegisteredUser) => orig.id === u.id);
            if (!originalUser) continue;
            
            const updates: any = {};
            
            // Updates explicitly made by Admin
            if (u.status !== originalUser.status) updates.status = u.status;
            if (u.assignedSellerId !== originalUser.assignedSellerId) updates.assigned_seller_id = u.assignedSellerId || null;
            if (u.username !== originalUser.username) updates.username = u.username;
            if (u.role !== originalUser.role) updates.role = u.role;
            if (u.phone !== originalUser.phone) updates.phone = u.phone;
            if (u.country !== originalUser.country) updates.country = u.country;
            
            // Fix Balance Overwrite Bug:
            // If the balance changed during processJornadaResults or Admin recharge, apply the DELTA to the LATEST DB balance.
            // This prevents overwriting a ticket purchase that happened while the admin was typing!
            if (u.balance !== originalUser.balance) {
                const delta = (u.balance || 0) - (originalUser.balance || 0);
                if (delta !== 0) {
                    const { data: latestUser } = await supabase.from('users').select('balance').eq('id', u.id).single();
                    if (latestUser) {
                        updates.balance = Number(latestUser.balance) + delta;
                    } else {
                        updates.balance = u.balance;
                    }
                }
            }
            
            if (Object.keys(updates).length > 0) {
                await supabase.from('users').update(updates).eq('id', u.id);
            }
        }
        // 3. Optimize Ticket (Cartones) updates
        // Only update tickets that actually changed (e.g. after a jornada closes)
        const cartonesToUpdate = processedConfig.cartones.filter(c => {
            const orig = appConfig.cartones.find((original: typeof c) => original.id === c.id);
            return !orig || c.hits !== orig.hits || c.prizeWon !== orig.prizeWon || JSON.stringify(c.prizeDetails) !== JSON.stringify(orig.prizeDetails);
        });
        
        for (const c of cartonesToUpdate) {
            await supabase.from('tickets').update({ hits: c.hits, prize_won: c.prizeWon, prize_details: c.prizeDetails }).eq('id', c.id);
        }
        
        // 4. Sync Jornadas via Bulk Upsert
        const jornadasToUpsert = processedConfig.jornadas.map(j => ({
            id: j.id,
            name: j.name,
            status: j.status,
            first_prize_amount: parseFloat(j.firstPrize.replace(/[^0-9]/g, "")) || 0,
            second_prize_amount: parseFloat(j.secondPrize.replace(/[^0-9]/g, "")) || 0,
            carton_price: j.cartonPrice || 0,
            botin_match_id: j.botinMatchId,
            botin_result: j.botinResult,
            flag_icon_url: j.flagIconUrl,
            styling: j.styling,
            results_processed: j.resultsProcessed,
            promoter_id: j.promoterId || null,
            visibility: j.visibility || 'public',
            access_code: j.accessCode || null
        }));

        if (jornadasToUpsert.length > 0) {
            const { error: jError } = await supabase.from('jornadas').upsert(jornadasToUpsert);
            if (jError) {
                console.error("Error upserting jornadas:", jError);
                throw new Error(`Error guardando jornadas: ${jError.message}`);
            }
        }
        
        // 5. Sync Matches via Bulk Upsert
        const allMatchesToUpsert: any[] = [];
        const seenMatchIds = new Set<string>();

        processedConfig.jornadas.forEach(j => {
            j.matches.forEach(m => {
                // Prevenir conflictos de Primary Key si el mismo partido externo se metió en dos jornadas distintas
                if (seenMatchIds.has(m.id)) {
                    m.id = crypto.randomUUID(); 
                }
                seenMatchIds.add(m.id);

                allMatchesToUpsert.push({
                    id: m.id,
                    jornada_id: j.id,
                    local_team_id: m.localTeamId,
                    visitor_team_id: m.visitorTeamId,
                    date_time: m.dateTime,
                    result: m.result || null
                });
            });
        });

        if (allMatchesToUpsert.length > 0) {
            const { error: mError } = await supabase.from('matches').upsert(allMatchesToUpsert);
            if (mError) {
                console.error("Error upserting matches:", mError);
                throw new Error(`Error guardando partidos: ${mError.message}`);
            }
        }
            
        // 6. Handle Match Deletions
        const { data: existingMatches } = await supabase.from('matches').select('id, jornada_id');
        if (existingMatches) {
            const currentJornadaIds = processedConfig.jornadas.map(j => j.id);
            const currentMatchIds = allMatchesToUpsert.map(m => m.id);
            
            // Only care about matches from jornadas that still exist, but aren't in the new list
            const matchesToDelete = existingMatches.filter(em => currentJornadaIds.includes(em.jornada_id) && !currentMatchIds.includes(em.id));
            
            if (matchesToDelete.length > 0) {
                const idsToDelete = matchesToDelete.map(m => m.id);
                // Supabase limit for .in() is usually generous but let's be safe
                for (let i = 0; i < idsToDelete.length; i += 100) {
                    await supabase.from('matches').delete().in('id', idsToDelete.slice(i, i + 100));
                }
            }
        }
        
        // 7. Handle Jornada Deletions
        const { data: existingJornadas, error: fetchEJError } = await supabase.from('jornadas').select('id');
        if (existingJornadas && !fetchEJError) {
            const currentIds = processedConfig.jornadas.map(j => j.id);
            const toDeleteIds = existingJornadas.filter(ej => !currentIds.includes(ej.id)).map(ej => ej.id);
            
            if (toDeleteIds.length > 0) {
                for (let i = 0; i < toDeleteIds.length; i += 100) {
                    await supabase.from('jornadas').delete().in('id', toDeleteIds.slice(i, i + 100));
                }
            }
        }

        updateConfig(processedConfig); // optimistic
        showNotification('¡Cambios guardados con éxito!');
    } catch (error: any) {
        console.error("FATAL SAVE ERROR:", error);
        window.alert("ERROR CRITICO AL GUARDAR: " + (error.message || 'Error guardando en Supabase'));
    }
  }
  
  const handleLegalClick = (link: LegalLink) => {
    setLegalModalContent(link);
  };
  
  const handleUpdateUser = useCallback(async (updatedUser: RegisteredUser) => {
    try {
        const { error } = await supabase.from('users').update({
            username: updatedUser.username,
            phone: updatedUser.phone,
            country: updatedUser.country,
            status: updatedUser.status,
            assigned_seller_id: updatedUser.assignedSellerId,
            balance: updatedUser.balance
        }).eq('id', updatedUser.id);

        if (error) throw error;

        if (updatedUser.role === 'seller') {
            await supabase.from('seller_profiles').upsert({
                user_id: updatedUser.id,
                qr_code_url: updatedUser.sellerQrCodeUrl,
                whatsapp_number: updatedUser.sellerWhatsappNumber
            });
        }

        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
        showNotification('¡Datos actualizados!');
    } catch (error: any) {
        showNotification(error.message || 'Error al actualizar.');
    }
  }, [currentUser?.id, showNotification]);

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

    const jornada = appConfig.jornadas.find(j => j.id === jornadaId);
    if (!jornada) {
        showNotification('Error: Jornada no encontrada.');
        return;
    }

    const sortedMatches = [...jornada.matches].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    if (sortedMatches.length > 0) {
        const firstMatchDate = new Date(sortedMatches[0].dateTime);
        const now = new Date();
        if ((firstMatchDate.getTime() - now.getTime()) <= 10 * 60 * 1000) {
            showNotification('El tiempo para comprar un cartón ha expirado. (Se cierra 10 minutos antes del primer partido)');
            navigateToHome();
            return;
        }
    }

    // FIX: Using Secure Supabase RPC
    try {
        const { data: ticketId, error: rpcError } = await supabase.rpc('purchase_carton', {
            p_user_id: currentUser.id,
            p_jornada_id: jornadaId,
            p_predictions: predictions,
            p_botin_prediction: botinPrediction,
            p_price: price
        });
        
        if (rpcError) throw rpcError;

        // --- ACTUALIZACIÓN OPTIMISTA ---
        const newBalance = (currentUser.balance || 0) - price;
        const newTicketId = ticketId || `temp-ticket-${Date.now()}`;
        
        setCurrentUser(prev => prev ? { ...prev, balance: newBalance } : null);
        
        const newCarton = {
             id: newTicketId,
             userId: currentUser.id,
             jornadaId: jornadaId,
             predictions: predictions,
             botinPrediction: botinPrediction,
             purchaseDate: new Date().toISOString()
        };
        
        const newTx = {
            id: `temp-tx-${Date.now()}`,
            userId: currentUser.id,
            amount: -price,
            type: 'ticket_purchase' as const,
            description: 'Compra de cartón para la jornada',
            createdAt: new Date().toISOString()
        };

        updateConfig({
            ...appConfig,
            users: appConfig.users.map(u => u.id === currentUser.id ? { ...u, balance: newBalance } : u),
            cartones: [newCarton, ...appConfig.cartones],
            transactions: [newTx, ...appConfig.transactions]
        });
        // --------------------------------

        showNotification('¡Cartón comprado con éxito!');
        navigateToHome();
    } catch (error: any) {
        console.error("Carton Purchase Error:", error);
        showNotification(error.message || 'Error al comprar cartón. Verifica tus datos.');
    }
  }, [currentUser, navigateToHome, showNotification, appConfig.jornadas]);

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
    
    // FIX: Using Supabase
    try {
        const { error } = await supabase.from('tickets').update({
            predictions: newPredictions,
            botin_prediction: newBotinPrediction
        }).eq('id', cartonId);
        
        if (error) throw error;
        showNotification('¡Cartón actualizado con éxito!');
    } catch (error: any) {
        showNotification(error.message || 'Error al actualizar cartón');
    }
  }, [appConfig.cartones, appConfig.jornadas, showNotification]);

  const handleDeleteCarton = useCallback(async (cartonId: string) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este cartón perdido? Esta acción no se puede deshacer.')) return;
      try {
          const { error } = await supabase.from('tickets').delete().eq('id', cartonId);
          if (error) throw error;
          
          updateConfig({
              ...appConfig,
              cartones: appConfig.cartones.filter(c => c.id !== cartonId)
          });
          showNotification('Cartón eliminado con éxito.');
      } catch (error: any) {
          showNotification(error.message || 'Error al eliminar el cartón');
      }
  }, [appConfig, updateConfig, showNotification]);

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

      // FIX: Using Supabase
      try {
          const { error } = await supabase.from('withdrawal_requests').insert({
              user_id: userId,
              amount,
              user_qr_code_url: userQrCodeUrl
          });
          if (error) throw error;
          showNotification('Tu solicitud de retiro ha sido enviada.');
      } catch (error: any) {
          showNotification(error.message || 'Error al solicitar retiro');
      }
  }, [appConfig.users, showNotification]);

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

      // FIX: Using Supabase
      try {
          const newStatus = action === 'approve' ? 'completed' : 'rejected';
          const { error: reqError } = await supabase.from('withdrawal_requests').update({
              status: newStatus,
              processed_date: new Date().toISOString()
          }).eq('id', requestId);
          
          if (reqError) throw reqError;

          if (action === 'approve') {
               const user = appConfig.users.find(u => u.id === request.userId);
               if (user) {
                   await supabase.from('users').update({ balance: (user.balance || 0) - request.amount }).eq('id', user.id);
                   await supabase.from('transactions').insert({
                       user_id: user.id,
                       amount: -request.amount,
                       type: 'withdrawal',
                       reference_id: request.id,
                       description: 'Retiro aprobado'
                   });
               }
          }
          showNotification(`La solicitud ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
      } catch(error: any) {
          showNotification(error.message || 'Error procesando solicitud');
      }
  }, [appConfig.withdrawalRequests, appConfig.users, showNotification]);

  // --- New Recharge Request Logic ---

  const handleRequestClientRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
    // FIX: Using Supabase Storage for Base64 Images
    try {
        let finalProofUrl = proofOfPaymentUrl;
        if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
            const res = await fetch(proofOfPaymentUrl);
            const blob = await res.blob();
            const ext = blob.type.split('/')[1] || 'jpeg';
            const fileName = `recharges/${userId}_${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from('tinkazo_public').upload(fileName, blob, {
                contentType: blob.type,
                upsert: false
            });
            if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
            const { data: { publicUrl } } = supabase.storage.from('tinkazo_public').getPublicUrl(fileName);
            finalProofUrl = publicUrl;
        }

        const { error } = await supabase.from('recharge_requests').insert({
            user_id: userId,
            amount,
            requester_role: 'client',
            proof_of_payment_url: finalProofUrl
        });
        if (error) throw error;
        showNotification('Solicitud de recarga enviada.');
    } catch (error: any) {
        showNotification(error.message || 'Error al enviar recarga');
    }
  }, [showNotification]);

  const handleRequestSellerRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
    // FIX: Using Supabase Storage for Base64 Images
    try {
        let finalProofUrl = proofOfPaymentUrl;
        if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
            const res = await fetch(proofOfPaymentUrl);
            const blob = await res.blob();
            const ext = blob.type.split('/')[1] || 'jpeg';
            const fileName = `recharges/${userId}_${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from('tinkazo_public').upload(fileName, blob, {
                contentType: blob.type,
                upsert: false
            });
            if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
            const { data: { publicUrl } } = supabase.storage.from('tinkazo_public').getPublicUrl(fileName);
            finalProofUrl = publicUrl;
        }

        const { error } = await supabase.from('recharge_requests').insert({
            user_id: userId,
            amount,
            requester_role: 'seller',
            proof_of_payment_url: finalProofUrl
        });
        if (error) throw error;
        showNotification('Solicitud de recarga enviada al administrador.');
    } catch (error: any) {
        showNotification(error.message || 'Error al enviar recarga');
    }
  }, [showNotification]);

  const handleProcessClientRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject', sellerId: string) => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }
    
    // FIX: Using Secure RPC for Atomic Financial Transfers
    try {
        const { error: reqError, data } = await supabase.rpc('process_client_recharge', {
            p_request_id: requestId,
            p_seller_id: sellerId,
            p_action: action
        });
        
        if (reqError) {
             console.error("RPC Error:", reqError);
             if (reqError.message.includes('Insufficient seller balance')) {
                 throw new Error('Como vendedor, no tienes saldo suficiente para aprobar esta recarga.');
             }
             throw new Error('Error de validación segura al verificar los saldos.');
        }

        // On success, forcefully refetch the latest user profile balance
        if (action === 'approve' && currentUser?.id === sellerId) {
             const { data: updatedSeller } = await supabase.from('users').select('balance').eq('id', sellerId).single();
             if (updatedSeller) {
                 setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: parseFloat(updatedSeller.balance) } : null);
             }
        }

        showNotification(`La solicitud del cliente ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'} exitosamente.`);
    } catch (error: any) {
        showNotification(error.message || 'Error procesando recarga');
    }
  }, [appConfig.rechargeRequests, appConfig.users, currentUser, showNotification]);

  const handleProcessSellerRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
    const request = appConfig.rechargeRequests.find(r => r.id === requestId);
     if (!request || request.status !== 'pending') {
      alert('Error: La solicitud no es válida o ya fue procesada.');
      return;
    }

    // FIX: Using Supabase
    try {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        const { error: reqError } = await supabase.from('recharge_requests').update({
            status: newStatus,
            processed_date: new Date().toISOString(),
            processed_by: currentUser?.id
        }).eq('id', requestId);
        
        if (reqError) throw reqError;

        if (action === 'approve') {
             const commissionPercentage = appConfig.sellerCommissionPercentage || 0;
             const commissionAmount = request.amount * (commissionPercentage / 100);
             const totalAmountToCredit = request.amount + commissionAmount;
             
             const seller = appConfig.users.find(u => u.id === request.userId);
             if (seller) {
                 await supabase.from('users').update({ balance: (seller.balance || 0) + totalAmountToCredit }).eq('id', seller.id);
                 
                 // Registrar recarga
                 await supabase.from('transactions').insert({
                     user_id: seller.id,
                     amount: request.amount,
                     type: 'recharge',
                     reference_id: request.id,
                     description: 'Recarga aprobada por admin'
                 });
                 // Registrar comisión
                 if (commissionAmount > 0) {
                     await supabase.from('transactions').insert({
                         user_id: seller.id,
                         amount: commissionAmount,
                         type: 'commission',
                         reference_id: request.id,
                         description: `Comisión por recarga (${commissionPercentage}%)`
                     });
                 }
             }
        }
        showNotification(`La solicitud del vendedor ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
    } catch (error: any) {
        showNotification(error.message || 'Error procesando recarga admin');
    }
  }, [appConfig.rechargeRequests, appConfig.users, appConfig.sellerCommissionPercentage, currentUser, showNotification]);

  const handleTransferBalance = useCallback(async (sellerId: string, clientId: string, amount: number) => {
    if (amount <= 0) return;
    const seller = appConfig.users.find(u => u.id === sellerId);
    const client = appConfig.users.find(u => u.id === clientId);
    if (!seller || !client) {
        showNotification('Error: Usuario no encontrado.');
        return;
    }
    if ((seller.balance || 0) < amount) {
        showNotification('Saldo insuficiente para transferir.');
        return;
    }

    try {
        const { error: rpcError } = await supabase.rpc('transfer_balance', {
            p_seller_id: sellerId,
            p_client_id: clientId,
            p_amount: amount
        });

        if (rpcError) throw rpcError;

        // Actualización optimista de estado para que se refleje de inmediato
        const newSellerBalance = (seller.balance || 0) - amount;
        const newClientBalance = (client.balance || 0) + amount;
        
        if (currentUser?.id === sellerId) {
            setCurrentUser(prev => prev ? { ...prev, balance: newSellerBalance } : null);
        }
        
        const newTxOut = {
            id: `temp-${Date.now()}-out`,
            userId: sellerId,
            amount: -amount,
            type: 'transfer_out' as const,
            description: `Transferencia manual enviada a ${client.username}`,
            createdAt: new Date().toISOString()
        };
        
        const newTxIn = {
            id: `temp-${Date.now()}-in`,
            userId: clientId,
            amount: amount,
            type: 'transfer_in' as const,
            description: `Transferencia manual recibida de ${seller.username}`,
            createdAt: new Date().toISOString()
        };

        updateConfig({
            ...appConfig,
            users: appConfig.users.map(u => {
                if (u.id === sellerId) return { ...u, balance: newSellerBalance };
                if (u.id === clientId) return { ...u, balance: newClientBalance };
                return u;
            }),
            transactions: [newTxOut, newTxIn, ...appConfig.transactions]
        });

        showNotification(`Transferencia de Bs ${amount} a ${client.username} exitosa.`);
    } catch (error: any) {
        showNotification(error.message || 'Error al procesar la transferencia');
    }
  }, [appConfig.users, currentUser, showNotification]);

  const renderView = () => {
    const userCartonCount = currentUser ? appConfig.cartones.filter(c => c.userId === currentUser.id).length : 0;
    
    switch (currentView) {
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} onRegister={handleRegister} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'admin':
        return userRole === 'admin' ? (
          <AdminPage
            initialConfig={appConfig}
            onSave={handleSaveConfig}
            onLogout={handleLogout}
            onExit={navigateToHome}
            onProcessWithdrawal={handleProcessWithdrawal}
            onProcessSellerRecharge={handleProcessSellerRecharge}
            dataFetchError={dataFetchError}
          />
        ) : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'seller':
        return userRole === 'seller' && currentUser ? (
            <SellerPage
              currentUser={currentUser}
              config={appConfig}
              onUpdateUser={handleUpdateUser}
              onRequestRecharge={handleRequestSellerRecharge}
              onProcessClientRecharge={handleProcessClientRecharge}
              onTransferBalance={handleTransferBalance}
              onLogout={handleLogout}
              onExit={navigateToHome}
              onUpdateCarton={handleUpdateCarton}
              onPlayJornada={handlePlayJornada}
            />
          ) : <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'promoter':
        return userRole === 'promoter' && currentUser ? (
            <PromoterPage
              currentUser={currentUser}
              config={appConfig}
              onSave={handleSaveConfig}
              onUpdateUser={handleUpdateUser}
              onTransferBalance={handleTransferBalance}
              onLogout={handleLogout}
              onExit={navigateToHome}
              onPlayJornada={handlePlayJornada}
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
                      onDeleteCarton={handleDeleteCarton}
                      onRequestWithdrawal={handleRequestWithdrawal}
                      onRequestRecharge={handleRequestClientRecharge}
                      onLogout={handleLogout}
                      onExit={navigateToHome}
                      onPlayJornada={handlePlayJornada}
                  />
              );
          }
          return <LoginPage setCurrentView={setCurrentView} onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} users={appConfig.users} primaryColor={appConfig.theme.primaryColor} appName={appConfig.appName} logoUrl={appConfig.logoUrl} />;
      case 'purchaseCarton':
      case 'home':
      default:
        return (
          <>
            <HomePage
              appConfig={appConfig}
              userRole={userRole}
              currentUser={currentUser}
              userCartonCount={userCartonCount}
              onLoginClick={navigateToLogin}
              onRegisterClick={navigateToRegister}
              onHomeClick={navigateToHome}
              onAdminClick={navigateToAdmin}
              onSellerPanelClick={userRole === 'promoter' ? navigateToPromoterPanel : navigateToSellerPanel}
              onClientPanelClick={navigateToClientPanel}
              onLogoutClick={handleLogout}
              onLegalClick={handleLegalClick}
              onPlayJornada={handlePlayJornada}
            />
            <BottomSheet 
               isOpen={currentView === 'purchaseCarton'} 
               onClose={navigateToHome}
            >
               {jornadaToPlay && currentUser && (
                  <PurchaseCartonPage
                      jornada={jornadaToPlay}
                      teams={appConfig.teams}
                      currentUser={currentUser}
                      onPurchase={handlePurchaseCarton}
                      onExit={navigateToHome}
                  />
               )}
            </BottomSheet>
          </>
        );
    }
  };

  const renderMainContent = () => {
    if (!isConfigLoaded) {
      return (
        <div className="bg-[#020617] flex-1 flex flex-col justify-center items-center z-50">
           {appConfig.logoUrl && (
               <img src={appConfig.logoUrl} alt="Tinkazo Logo" className="h-16 w-auto mb-6 animate-pulse opacity-50 relative z-10" />
           )}
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mb-4 relative z-10"></div>
           <p className="text-cyan-400 font-medium uppercase tracking-[0.2em] text-xs relative z-10">Conectando...</p>
        </div>
      );
    }
    return renderView();
  };

  return (
    <div className="bg-[#020617] flex justify-center items-center fixed inset-0 w-full h-full overflow-hidden">
      <main 
        className="w-full h-[100dvh] relative overflow-hidden shadow-2xl flex flex-col body-bg-space"
        style={appConfig.theme.backgroundImageUrl ? {
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,0.75), rgba(2,6,23,0.85)), url(${appConfig.theme.backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : undefined}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {renderMainContent()}
        </div>
        
        {/* FAB Global */}
        {currentView === 'home' && currentUser && (
            <button 
                onClick={() => navigateToClientPanel()} 
                className="absolute bottom-24 right-4 md:right-10 md:bottom-10 w-14 h-14 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.4)] flex justify-center items-center active:scale-90 hover:scale-105 transition-transform z-50">
                <TicketIcon className="text-white h-7 w-7" />
                {(appConfig.cartones.filter(c => c.userId === currentUser.id).length) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border border-[#020617]">
                        {appConfig.cartones.filter(c => c.userId === currentUser.id).length}
                    </span>
                )}
            </button>
        )}
        
        {legalModalContent && <LegalModal content={legalModalContent} onClose={() => setLegalModalContent(null)} />}
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </main>
    </div>
  );
};

export default App;