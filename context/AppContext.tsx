'use client';

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { View, AppConfig, UserRole, LegalLink, RegisteredUser, Jornada, Prediction, Carton, WithdrawalRequest, RechargeRequest, PrizeDetails, PromoterProfile } from '@/types';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/supabaseClient';

// --- INITIAL APP CONFIG (Exact copy from App.tsx) ---
const initialAppConfig: AppConfig = {
    appName: 'TINKAZO',
    theme: {
      backgroundColor: '#020617',
      textColor: '#ffffff',
      primaryColor: '#a855f7',
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
        colors: { primary: '#22d3ee', backgroundColor: '#1f2937' },
        backgroundImage: '',
    },
    botinJackpot: {
        title: 'POZO DEL BOTÍN',
        detail: 'POZO DEL BOTÍN',
        amount: '',
        backgroundType: 'color',
        colors: { primary: '#a855f7', backgroundColor: '#1f2937' },
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
    globalJackpot: 0,
    seedJackpot: 0,
    botinAmount: 0,
    teams: [],
    jornadas: [],
    gorditoJornadaId: null,
    users: [],
    cartones: [],
    withdrawalRequests: [],
    rechargeRequests: [],
    botinAmount: 10000,
    sellerCommissionPercentage: 10,
    transactions: [],
    promoterProfiles: [],
    footer: {
      copyright: '© 2024 TINKAZO. Todos los derechos reservados.',
      socialLinks: [
        { platform: 'facebook', url: '#' }, { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' }, { platform: 'tiktok', url: '#' },
        { platform: 'discord', url: '#' }, { platform: 'snapchat', url: '#' },
        { platform: 'youtube', url: '#' }, { platform: 'whatsapp', url: '#' },
        { platform: 'behance', url: '#' }, { platform: 'threads', url: '#' },
        { platform: 'linkedin', url: '#' }, { platform: 'dribbble', url: '#' },
        { platform: 'pinterest', url: '#' }, { platform: 'twitch', url: '#' },
        { platform: 'telegram', url: '#' },
      ],
      legalLinks: [
        { title: 'Términos y Condiciones', content: 'Aquí va el contenido completo de los términos y condiciones del servicio...' },
        { title: 'Política de Privacidad', content: 'Aquí va el contenido completo de la política de privacidad de la aplicación...' },
      ],
    },
};

// --- PROCESS JORNADA RESULTS (Exact copy from App.tsx) ---
const processJornadaResults = (config: AppConfig): AppConfig => {
    const newConfig = JSON.parse(JSON.stringify(config));
    const parsePrize = (prizeStr: string) => parseInt(prizeStr.replace(/[^0-9]/g, ""), 10) || 0;

    newConfig.jornadas.forEach((jornada: Jornada) => {
        const allMatchesHaveResults = jornada.matches.length > 0 && jornada.matches.every(m => m.result);

        if (jornada.status === 'cerrada' && allMatchesHaveResults && !jornada.resultsProcessed) {
            console.log(`Processing results for jornada: ${jornada.name}`);
            jornada.resultsProcessed = true;

            const cartonesForJornada = newConfig.cartones.filter((c: Carton) => c.jornadaId === jornada.id);
            if (cartonesForJornada.length === 0) return;

            cartonesForJornada.forEach((carton: Carton) => {
                carton.prizeWon = 0;
                carton.prizeDetails = {};
                
                let isCartonValid = true;
                if (carton.botinPrediction && jornada.botinResult) {
                    const [localStr, visitorStr] = jornada.botinResult.split('-');
                    const botinAdminResult = { local: parseInt(localStr, 10), visitor: parseInt(visitorStr, 10) };
                    const predictionIsWrong = isNaN(botinAdminResult.local) || isNaN(botinAdminResult.visitor) ||
                        carton.botinPrediction.localScore !== botinAdminResult.local ||
                        carton.botinPrediction.visitorScore !== botinAdminResult.visitor;
                    if (predictionIsWrong) isCartonValid = false;
                }

                if (isCartonValid) {
                    carton.hits = jornada.matches.reduce((hits, match) => 
                        (match.result && carton.predictions[match.id] === match.result) ? hits + 1 : hits, 0);
                } else {
                    carton.hits = 0;
                }
            });

            const isGorditoJornada = jornada.id === newConfig.gorditoJornadaId;
            const firstPrizeAmount = isGorditoJornada 
                ? parsePrize(newConfig.gorditoJackpot.amount)
                : parsePrize(jornada.firstPrize);
            const secondPrizeAmount = parsePrize(jornada.secondPrize);

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
                const totalJornadaSales = cartonesForJornada.length * jornada.cartonPrice;
                const botinContribution = totalJornadaSales * 0.70;
                newConfig.botinAmount = (newConfig.botinAmount || 0) + botinContribution;
            }

            if (secondPrizeWinners.length > 0) {
                const prizePerWinner = secondPrizeAmount / secondPrizeWinners.length;
                secondPrizeWinners.forEach((carton: Carton) => {
                    carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                    if (!carton.prizeDetails?.jornada) {
                       carton.prizeDetails!.jornada = { tier: 2, winnersCount: secondPrizeWinners.length };
                    }
                });
            }

            if (jornada.botinResult && newConfig.botinAmount > 0) {
                const [localStr, visitorStr] = jornada.botinResult.split('-');
                const botinResult = { local: parseInt(localStr, 10), visitor: parseInt(visitorStr, 10) };
                if (!isNaN(botinResult.local) && !isNaN(botinResult.visitor)) {
                    const botinWinners = cartonesForJornada.filter((c: any) => 
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
                        newConfig.botinAmount = 0;
                    }
                }
            }
            
            cartonesForJornada.forEach((carton: Carton) => {
                if (carton.prizeWon && carton.prizeWon > 0) {
                    const user = newConfig.users.find((u: RegisteredUser) => u.id === carton.userId);
                    if (user) user.balance = (user.balance || 0) + carton.prizeWon;
                }
                if (Object.keys(carton.prizeDetails || {}).length === 0) carton.prizeDetails = null;
            });

            newConfig.cartones = newConfig.cartones.map((originalCarton: Carton) => 
                cartonesForJornada.find((pc: any) => pc.id === originalCarton.id) || originalCarton);
        }
    });

    return newConfig;
};

// --- VIEW <-> ROUTE MAPPING ---
const viewToRoute: Record<View, string> = {
    'home': '/',
    'login': '/login',
    'register': '/register',
    'admin': '/admin',
    'seller': '/seller',
    'promoter': '/promoter',
    'clientPanel': '/client',
    'purchaseCarton': '/',
};

// --- CONTEXT TYPE ---
interface AppContextType {
    appConfig: AppConfig;
    updateConfig: (config: Partial<AppConfig>) => void;
    isLoading: boolean;
    isConfigLoaded: boolean;
    dataFetchError: boolean;
    currentUser: RegisteredUser | null;
    userRole: UserRole;
    notification: string | null;
    setNotification: (n: string | null) => void;
    showNotification: (msg: string) => void;
    legalModalContent: LegalLink | null;
    setLegalModalContent: (link: LegalLink | null) => void;
    jornadaToPlay: Jornada | null;
    showPurchaseSheet: boolean;
    setShowPurchaseSheet: (show: boolean) => void;
    // Navigation
    navigateToLogin: () => void;
    navigateToRegister: () => void;
    navigateToHome: () => void;
    navigateToAdmin: () => void;
    navigateToSellerPanel: () => void;
    navigateToPromoterPanel: () => void;
    navigateToClientPanel: () => void;
    navigateToView: (view: View) => void;
    // Auth
    handleAdminLogin: () => void;
    handleUserLogin: (user: RegisteredUser) => void;
    handleRegister: (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'> & { referralCode?: string }) => Promise<void>;
    handleLogout: () => void;
    // Business logic
    handleSaveConfig: (config: AppConfig) => Promise<void>;
    handleUpdateUser: (user: RegisteredUser) => Promise<void>;
    handlePlayJornada: (jornada: Jornada) => void;
    handlePurchaseCarton: (jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number, botinPrediction: { localScore: number; visitorScore: number } | null) => Promise<void>;
    handleUpdateCarton: (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number } | null) => Promise<void>;
    handleDeleteCarton: (cartonId: string) => Promise<void>;
    handleRequestWithdrawal: (userId: string, amount: number, userQrCodeUrl: string) => Promise<void>;
    handleProcessWithdrawal: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
    handleRequestClientRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => Promise<void>;
    handleRequestSellerRecharge: (userId: string, amount: number, proofOfPaymentUrl: string) => Promise<void>;
    handleProcessClientRecharge: (requestId: string, action: 'approve' | 'reject', sellerId: string) => Promise<void>;
    handleProcessSellerRecharge: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
    handleTransferBalance: (sellerId: string, clientId: string, amount: number) => Promise<void>;
    handleLegalClick: (link: LegalLink) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

// ==========================================
// === APP PROVIDER ===
// ==========================================
export function AppProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [userRole, setUserRole] = useState<UserRole>(null);
    const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
    const [legalModalContent, setLegalModalContent] = useState<LegalLink | null>(null);
    const [jornadaToPlay, setJornadaToPlay] = useState<Jornada | null>(null);
    const [showPurchaseSheet, setShowPurchaseSheet] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const { appConfig, updateConfig, isLoading, dataFetchError } = useSupabaseData(initialAppConfig);
    const isConfigLoaded = !isLoading;

    // --- Effect: Dynamic favicon ---
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

    // --- Effect: Rehydrate session from localStorage ---
    useEffect(() => {
        try {
            const savedRole = localStorage.getItem('tinkazoUserRole') as UserRole;
            const savedUserJSON = localStorage.getItem('tinkazoCurrentUser');
            const savedPath = localStorage.getItem('tinkazoCurrentPath');

            if (savedRole) {
                setUserRole(savedRole);
                if (savedUserJSON) {
                    setCurrentUser(JSON.parse(savedUserJSON));
                }
                if (savedPath) {
                    const allowedPaths: Record<string, string[]> = {
                        'admin': ['/admin'],
                        'seller': ['/seller'],
                        'promoter': ['/promoter'],
                        'client': ['/client', '/'],
                    };
                    if (allowedPaths[savedRole]?.includes(savedPath)) {
                        router.replace(savedPath);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to rehydrate session from localStorage:", error);
            localStorage.removeItem('tinkazoUserRole');
            localStorage.removeItem('tinkazoCurrentUser');
            localStorage.removeItem('tinkazoCurrentPath');
        }
    }, []);

    // --- Effect: Sync currentUser with real-time appConfig.users ---
    useEffect(() => {
        if (currentUser && appConfig.users.length > 0) {
            const freshUser = appConfig.users.find(u => u.id === currentUser.id);
            if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
                setCurrentUser(freshUser);
                localStorage.setItem('tinkazoCurrentUser', JSON.stringify(freshUser));
            }
        }
    }, [appConfig.users, currentUser]);

    // --- Effect: Apply body background class ---
    useEffect(() => {
        document.body.classList.remove('body-bg-space', 'body-bg-business');
        document.body.classList.add(`body-bg-${appConfig.theme.backgroundStyle}`);
        document.body.style.color = appConfig.theme.textColor;
    }, [appConfig.theme.backgroundStyle, appConfig.theme.textColor]);

    // --- Effect: Auto-Close Jornadas at < 10 Minutes ---
    useEffect(() => {
        if (!isConfigLoaded) return;
        const interval = setInterval(() => {
            const now = Date.now();
            appConfig.jornadas.forEach(async (j) => {
                if (j.status !== 'abierta') return;
                const matchTimes = j.matches.map(m => new Date(m.dateTime).getTime());
                if (matchTimes.length === 0) return;
                const firstMatchTime = Math.min(...matchTimes);
                if (now >= firstMatchTime - 10 * 60 * 1000) {
                    try {
                        if (userRole === 'admin') {
                            await supabase.from('jornadas').update({ status: 'cerrada' }).eq('id', j.id);
                            console.log(`Auto-closed Jornada: ${j.name}`);
                        }
                    } catch (err) {
                        console.error("Auto-close attempted without privileges:", err);
                    }
                }
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [appConfig.jornadas, isConfigLoaded, userRole]);

    // --- Effect: Save current path to localStorage ---
    useEffect(() => {
        if (userRole) {
            localStorage.setItem('tinkazoCurrentPath', pathname);
        }
    }, [pathname, userRole]);

    // --- Notification ---
    const showNotification = useCallback((message: string) => {
        setNotification(message);
    }, []);

    // --- Navigation (replaces setState-based navigation) ---
    const navigateToLogin = useCallback(() => router.push('/login'), [router]);
    const navigateToRegister = useCallback(() => router.push('/register'), [router]);
    const navigateToHome = useCallback(() => {
        setJornadaToPlay(null);
        setShowPurchaseSheet(false);
        router.push('/');
    }, [router]);
    const navigateToAdmin = useCallback(() => router.push('/admin'), [router]);
    const navigateToSellerPanel = useCallback(() => router.push('/seller'), [router]);
    const navigateToPromoterPanel = useCallback(() => router.push('/promoter'), [router]);
    const navigateToClientPanel = useCallback(() => {
        if (currentUser?.status === 'pending') {
            alert('Tu cuenta aún no ha sido activada. No puedes acceder a esta sección.');
            return;
        }
        router.push('/client');
    }, [currentUser, router]);

    const navigateToView = useCallback((view: View) => {
        if (view === 'purchaseCarton') {
            setShowPurchaseSheet(true);
            router.push('/');
        } else {
            const route = viewToRoute[view] || '/';
            router.push(route);
        }
    }, [router]);

    // --- Auth Handlers ---
    const handleAdminLogin = useCallback(() => {
        const role: UserRole = 'admin';
        setUserRole(role);
        setCurrentUser(null);
        localStorage.setItem('tinkazoUserRole', role);
        localStorage.setItem('tinkazoCurrentPath', '/admin');
        localStorage.removeItem('tinkazoCurrentUser');
        router.push('/admin');
    }, [router]);

    const handleUserLogin = useCallback((user: RegisteredUser) => {
        const sanitizedUser = JSON.parse(JSON.stringify(user));
        setCurrentUser(sanitizedUser);
        localStorage.setItem('tinkazoCurrentUser', JSON.stringify(sanitizedUser));

        let role: UserRole;
        let path: string;

        if (sanitizedUser.role === 'admin') {
            role = 'admin'; path = '/admin';
        } else if (sanitizedUser.role === 'seller') {
            role = 'seller'; path = '/seller';
        } else if (sanitizedUser.role === 'promoter') {
            role = 'promoter'; path = '/promoter';
        } else {
            role = 'client'; path = '/';
        }

        setUserRole(role);
        localStorage.setItem('tinkazoUserRole', role);
        localStorage.setItem('tinkazoCurrentPath', path);
        router.push(path);
    }, [router]);

    const handleRegister = useCallback(async (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'> & { referralCode?: string }) => {
        try {
            let referrerId: string | null = null;
            let assignedSellerId: string | null = null;
            let autoActivate = false;

            if (userData.referralCode) {
                const matchedPromoter = appConfig.promoterProfiles.find(
                  p => p.referralCode.toUpperCase() === userData.referralCode!.toUpperCase()
                );
                const matchedSeller = appConfig.users.find(
                  u => u.role === 'seller' && u.referralCode?.toUpperCase() === userData.referralCode!.toUpperCase()
                );

                if (matchedPromoter) {
                    referrerId = matchedPromoter.userId;
                    assignedSellerId = matchedPromoter.userId;
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
            router.push('/login');
        } catch (error: any) {
            showNotification(error.message || 'Error al registrar.');
        }
    }, [showNotification, appConfig.promoterProfiles, appConfig.users, router]);

    const handleLogout = useCallback(() => {
        setUserRole(null);
        setCurrentUser(null);
        localStorage.removeItem('tinkazoUserRole');
        localStorage.removeItem('tinkazoCurrentUser');
        localStorage.removeItem('tinkazoCurrentPath');
        router.push('/');
    }, [router]);

    // --- handleSaveConfig (Exact business logic from App.tsx) ---
    const handleSaveConfig = async (newConfig: AppConfig) => {
        try {
            const processedConfig = processJornadaResults(newConfig);
            
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

            for (const u of processedConfig.users) {
                const originalUser = appConfig.users.find((orig: RegisteredUser) => orig.id === u.id);
                if (!originalUser) continue;
                const updates: any = {};
                if (u.status !== originalUser.status) updates.status = u.status;
                if (u.assignedSellerId !== originalUser.assignedSellerId) updates.assigned_seller_id = u.assignedSellerId || null;
                if (u.username !== originalUser.username) updates.username = u.username;
                if (u.role !== originalUser.role) updates.role = u.role;
                if (u.phone !== originalUser.phone) updates.phone = u.phone;
                if (u.country !== originalUser.country) updates.country = u.country;
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

            const cartonesToUpdate = processedConfig.cartones.filter((c: any) => {
                const orig = appConfig.cartones.find((original: typeof c) => original.id === c.id);
                return !orig || c.hits !== orig.hits || c.prizeWon !== orig.prizeWon || JSON.stringify(c.prizeDetails) !== JSON.stringify(orig.prizeDetails);
            });
            
            for (const c of cartonesToUpdate) {
                await supabase.from('tickets').update({ hits: c.hits, prize_won: c.prizeWon, prize_details: c.prizeDetails }).eq('id', c.id);
            }

            const jornadasToUpsert = processedConfig.jornadas.map((j: any) => ({
                id: j.id, name: j.name, status: j.status,
                first_prize_amount: parseFloat(j.firstPrize.replace(/[^0-9]/g, "")) || 0,
                second_prize_amount: parseFloat(j.secondPrize.replace(/[^0-9]/g, "")) || 0,
                carton_price: j.cartonPrice || 0,
                botin_match_id: j.botinMatchId, botin_result: j.botinResult,
                flag_icon_url: j.flagIconUrl, styling: j.styling,
                results_processed: j.resultsProcessed,
                promoter_id: j.promoterId || null,
                visibility: j.visibility || 'public',
                access_code: j.accessCode || null
            }));

            if (jornadasToUpsert.length > 0) {
                const { error: jError } = await supabase.from('jornadas').upsert(jornadasToUpsert);
                if (jError) throw new Error(`Error guardando jornadas: ${jError.message}`);
            }

            const allMatchesToUpsert: any[] = [];
            const seenMatchIds = new Set<string>();
            processedConfig.jornadas.forEach((j: any) => {
                j.matches.forEach((m: any) => {
                    if (seenMatchIds.has(m.id)) m.id = crypto.randomUUID();
                    seenMatchIds.add(m.id);
                    allMatchesToUpsert.push({
                        id: m.id, jornada_id: j.id,
                        local_team_id: m.localTeamId, visitor_team_id: m.visitorTeamId,
                        date_time: m.dateTime, result: m.result || null
                    });
                });
            });

            if (allMatchesToUpsert.length > 0) {
                const { error: mError } = await supabase.from('matches').upsert(allMatchesToUpsert);
                if (mError) throw new Error(`Error guardando partidos: ${mError.message}`);
            }

            const { data: existingMatches } = await supabase.from('matches').select('id, jornada_id');
            if (existingMatches) {
                const currentJornadaIds = processedConfig.jornadas.map((j: any) => j.id);
                const currentMatchIds = allMatchesToUpsert.map((m: any) => m.id);
                const matchesToDelete = existingMatches.filter(em => currentJornadaIds.includes(em.jornada_id) && !currentMatchIds.includes(em.id));
                if (matchesToDelete.length > 0) {
                    const idsToDelete = matchesToDelete.map(m => m.id);
                    for (let i = 0; i < idsToDelete.length; i += 100) {
                        await supabase.from('matches').delete().in('id', idsToDelete.slice(i, i + 100));
                    }
                }
            }

            const { data: existingJornadas, error: fetchEJError } = await supabase.from('jornadas').select('id');
            if (existingJornadas && !fetchEJError) {
                const currentIds = processedConfig.jornadas.map((j: any) => j.id);
                const toDeleteIds = existingJornadas.filter(ej => !currentIds.includes(ej.id)).map(ej => ej.id);
                if (toDeleteIds.length > 0) {
                    for (let i = 0; i < toDeleteIds.length; i += 100) {
                        await supabase.from('jornadas').delete().in('id', toDeleteIds.slice(i, i + 100));
                    }
                }
            }

            updateConfig(processedConfig);
            showNotification('¡Cambios guardados con éxito!');
        } catch (error: any) {
            console.error("FATAL SAVE ERROR:", error);
            window.alert("ERROR CRITICO AL GUARDAR: " + (error.message || 'Error guardando en Supabase'));
        }
    };

    const handleLegalClick = (link: LegalLink) => {
        setLegalModalContent(link);
    };

    const handleUpdateUser = useCallback(async (updatedUser: RegisteredUser) => {
        try {
            const { error } = await supabase.from('users').update({
                username: updatedUser.username, phone: updatedUser.phone,
                country: updatedUser.country, status: updatedUser.status,
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
            if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
            showNotification('¡Datos actualizados!');
        } catch (error: any) {
            showNotification(error.message || 'Error al actualizar.');
        }
    }, [currentUser?.id, showNotification]);

    const handlePlayJornada = useCallback((jornada: Jornada) => {
        if (!currentUser) {
            alert('Debes iniciar sesión para poder jugar.');
            router.push('/login');
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
        setShowPurchaseSheet(true);
        // Navigate to home if not already there (for when called from client/seller panels)
        if (pathname !== '/') router.push('/');
    }, [currentUser, router, pathname]);

    const handlePurchaseCarton = useCallback(async (jornadaId: string, predictions: { [matchId: string]: Prediction }, price: number, botinPrediction: { localScore: number; visitorScore: number; } | null) => {
        if (!currentUser) { showNotification('Error: No se encontró el usuario.'); return; }
        if ((currentUser.balance || 0) < price) { showNotification('Saldo insuficiente. Por favor, recarga tu cuenta.'); return; }

        const jornada = appConfig.jornadas.find(j => j.id === jornadaId);
        if (!jornada) { showNotification('Error: Jornada no encontrada.'); return; }

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

        try {
            const { data: ticketId, error: rpcError } = await supabase.rpc('purchase_carton', {
                p_user_id: currentUser.id, p_jornada_id: jornadaId,
                p_predictions: predictions, p_botin_prediction: botinPrediction, p_price: price
            });
            if (rpcError) throw rpcError;

            const newBalance = (currentUser.balance || 0) - price;
            const newTicketId = ticketId || `temp-ticket-${Date.now()}`;
            setCurrentUser(prev => prev ? { ...prev, balance: newBalance } : null);
            const newCarton = {
                id: newTicketId, userId: currentUser.id, jornadaId: jornadaId,
                predictions: predictions, botinPrediction: botinPrediction,
                purchaseDate: new Date().toISOString()
            };
            const newTx = {
                id: `temp-tx-${Date.now()}`, userId: currentUser.id, amount: -price,
                type: 'ticket_purchase' as const, description: 'Compra de cartón para la jornada',
                createdAt: new Date().toISOString()
            };

            const newGlobalJackpot = (appConfig.globalJackpot || 0) + (price * 0.50);

            let updatedUsers = appConfig.users.map(u => u.id === currentUser.id ? { ...u, balance: newBalance } : u);
            const transactionsToUpdate = [newTx, ...appConfig.transactions];

            if (currentUser.referredBy) {
                const promoterUser = appConfig.users.find(u => u.id === currentUser.referredBy && u.role === 'promoter');
                if (promoterUser) {
                    const commissionAmount = price * 0.20;
                    updatedUsers = updatedUsers.map(u => 
                        u.id === promoterUser.id 
                        ? { ...u, balance: (u.balance || 0) + commissionAmount }
                        : u
                    );
                    const newCommissionTx = {
                        id: `temp-com-${Date.now()}`, 
                        userId: promoterUser.id, 
                        amount: commissionAmount,
                        type: 'commission' as const, 
                        description: `Comisión por venta de cartón a ${currentUser.username}`,
                        createdAt: new Date().toISOString()
                    };
                    transactionsToUpdate.unshift(newCommissionTx);
                }
            }

            updateConfig({
                ...appConfig,
                globalJackpot: newGlobalJackpot,
                users: updatedUsers,
                cartones: [newCarton, ...appConfig.cartones],
                transactions: transactionsToUpdate
            });

            showNotification('¡Cartón comprado con éxito!');
            navigateToHome();
        } catch (error: any) {
            console.error("Carton Purchase Error:", error);
            showNotification(error.message || 'Error al comprar cartón. Verifica tus datos.');
        }
    }, [currentUser, navigateToHome, showNotification, appConfig]);

    const handleUpdateCarton = useCallback(async (cartonId: string, newPredictions: { [matchId: string]: Prediction }, newBotinPrediction: { localScore: number; visitorScore: number } | null) => {
        const carton = appConfig.cartones.find(c => c.id === cartonId);
        if (!carton) { alert('No se encontró el cartón.'); return; }
        const jornada = appConfig.jornadas.find(j => j.id === carton.jornadaId);
        if (!jornada) { alert('No se encontró la jornada asociada.'); return; }
        const now = new Date();
        const firstMatchDate = jornada.matches.length > 0 ? new Date(jornada.matches.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0].dateTime) : null;
        if (!firstMatchDate || (firstMatchDate.getTime() - now.getTime()) < 10 * 60 * 1000) {
            alert('El tiempo para editar este cartón ha expirado.'); return;
        }
        try {
            const { error } = await supabase.from('tickets').update({ predictions: newPredictions, botin_prediction: newBotinPrediction }).eq('id', cartonId);
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
            updateConfig({ ...appConfig, cartones: appConfig.cartones.filter(c => c.id !== cartonId) });
            showNotification('Cartón eliminado con éxito.');
        } catch (error: any) {
            showNotification(error.message || 'Error al eliminar el cartón');
        }
    }, [appConfig, updateConfig, showNotification]);

    const handleRequestWithdrawal = useCallback(async (userId: string, amount: number, userQrCodeUrl: string) => {
        const user = appConfig.users.find(u => u.id === userId);
        if (!user) { alert('Error: Usuario no encontrado.'); return; }
        if ((user.balance || 0) < amount) { alert('Error: Saldo insuficiente para realizar este retiro.'); return; }
        try {
            const { error } = await supabase.from('withdrawal_requests').insert({ user_id: userId, amount, user_qr_code_url: userQrCodeUrl });
            if (error) throw error;
            showNotification('Tu solicitud de retiro ha sido enviada.');
        } catch (error: any) {
            showNotification(error.message || 'Error al solicitar retiro');
        }
    }, [appConfig.users, showNotification]);

    const handleProcessWithdrawal = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
        const request = appConfig.withdrawalRequests.find(r => r.id === requestId);
        if (!request) { alert('Error: Solicitud no encontrada.'); return; }
        if (request.status !== 'pending') { alert('Error: Esta solicitud ya ha sido procesada.'); return; }
        try {
            const newStatus = action === 'approve' ? 'completed' : 'rejected';
            const { error: reqError } = await supabase.from('withdrawal_requests').update({ status: newStatus, processed_date: new Date().toISOString() }).eq('id', requestId);
            if (reqError) throw reqError;
            if (action === 'approve') {
                const user = appConfig.users.find(u => u.id === request.userId);
                if (user) {
                    await supabase.from('users').update({ balance: (user.balance || 0) - request.amount }).eq('id', user.id);
                    await supabase.from('transactions').insert({ user_id: user.id, amount: -request.amount, type: 'withdrawal', reference_id: request.id, description: 'Retiro aprobado' });
                }
            }
            showNotification(`La solicitud ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
        } catch (error: any) {
            showNotification(error.message || 'Error procesando solicitud');
        }
    }, [appConfig.withdrawalRequests, appConfig.users, showNotification]);

    const handleRequestClientRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
        try {
            let finalProofUrl = proofOfPaymentUrl;
            if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
                const res = await fetch(proofOfPaymentUrl);
                const blob = await res.blob();
                const ext = blob.type.split('/')[1] || 'jpeg';
                const fileName = `recharges/${userId}_${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage.from('tinkazo_public').upload(fileName, blob, { contentType: blob.type, upsert: false });
                if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
                const { data: { publicUrl } } = supabase.storage.from('tinkazo_public').getPublicUrl(fileName);
                finalProofUrl = publicUrl;
            }
            const { error } = await supabase.from('recharge_requests').insert({ user_id: userId, amount, requester_role: 'client', proof_of_payment_url: finalProofUrl });
            if (error) throw error;
            showNotification('Solicitud de recarga enviada.');
        } catch (error: any) {
            showNotification(error.message || 'Error al enviar recarga');
        }
    }, [showNotification]);

    const handleRequestSellerRecharge = useCallback(async (userId: string, amount: number, proofOfPaymentUrl: string) => {
        try {
            let finalProofUrl = proofOfPaymentUrl;
            if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
                const res = await fetch(proofOfPaymentUrl);
                const blob = await res.blob();
                const ext = blob.type.split('/')[1] || 'jpeg';
                const fileName = `recharges/${userId}_${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage.from('tinkazo_public').upload(fileName, blob, { contentType: blob.type, upsert: false });
                if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
                const { data: { publicUrl } } = supabase.storage.from('tinkazo_public').getPublicUrl(fileName);
                finalProofUrl = publicUrl;
            }
            const { error } = await supabase.from('recharge_requests').insert({ user_id: userId, amount, requester_role: 'seller', proof_of_payment_url: finalProofUrl });
            if (error) throw error;
            showNotification('Solicitud de recarga enviada al administrador.');
        } catch (error: any) {
            showNotification(error.message || 'Error al enviar recarga');
        }
    }, [showNotification]);

    const handleProcessClientRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject', sellerId: string) => {
        const request = appConfig.rechargeRequests.find(r => r.id === requestId);
        if (!request || request.status !== 'pending') { alert('Error: La solicitud no es válida o ya fue procesada.'); return; }
        try {
            const { error: reqError } = await supabase.rpc('process_client_recharge', { p_request_id: requestId, p_seller_id: sellerId, p_action: action });
            if (reqError) {
                console.error("RPC Error:", reqError);
                if (reqError.message.includes('Insufficient seller balance')) throw new Error('Como vendedor, no tienes saldo suficiente para aprobar esta recarga.');
                throw new Error('Error de validación segura al verificar los saldos.');
            }
            if (action === 'approve' && currentUser?.id === sellerId) {
                const { data: updatedSeller } = await supabase.from('users').select('balance').eq('id', sellerId).single();
                if (updatedSeller) setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: parseFloat(updatedSeller.balance) } : null);
            }
            showNotification(`La solicitud del cliente ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'} exitosamente.`);
        } catch (error: any) {
            showNotification(error.message || 'Error procesando recarga');
        }
    }, [appConfig.rechargeRequests, currentUser, showNotification]);

    const handleProcessSellerRecharge = useCallback(async (requestId: string, action: 'approve' | 'reject') => {
        const request = appConfig.rechargeRequests.find(r => r.id === requestId);
        if (!request || request.status !== 'pending') { alert('Error: La solicitud no es válida o ya fue procesada.'); return; }
        try {
            const newStatus = action === 'approve' ? 'approved' : 'rejected';
            const { error: reqError } = await supabase.from('recharge_requests').update({ status: newStatus, processed_date: new Date().toISOString(), processed_by: currentUser?.id }).eq('id', requestId);
            if (reqError) throw reqError;
            if (action === 'approve') {
                const commissionPercentage = appConfig.sellerCommissionPercentage || 0;
                const commissionAmount = request.amount * (commissionPercentage / 100);
                const totalAmountToCredit = request.amount + commissionAmount;
                const seller = appConfig.users.find(u => u.id === request.userId);
                if (seller) {
                    await supabase.from('users').update({ balance: (seller.balance || 0) + totalAmountToCredit }).eq('id', seller.id);
                    await supabase.from('transactions').insert({ user_id: seller.id, amount: request.amount, type: 'recharge', reference_id: request.id, description: 'Recarga aprobada por admin' });
                    if (commissionAmount > 0) {
                        await supabase.from('transactions').insert({ user_id: seller.id, amount: commissionAmount, type: 'commission', reference_id: request.id, description: `Comisión por recarga (${commissionPercentage}%)` });
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
        if (!seller || !client) { showNotification('Error: Usuario no encontrado.'); return; }
        if (seller.role !== 'promoter' && (seller.balance || 0) < amount) { showNotification('Saldo insuficiente para transferir.'); return; }
        try {
            const { error: rpcError } = await supabase.rpc('transfer_balance', { p_seller_id: sellerId, p_client_id: clientId, p_amount: amount });
            if (rpcError) throw rpcError;
            const newSellerBalance = (seller.balance || 0) - amount;
            const newClientBalance = (client.balance || 0) + amount;
            if (currentUser?.id === sellerId) setCurrentUser(prev => prev ? { ...prev, balance: newSellerBalance } : null);
            const newTxOut = { id: `temp-${Date.now()}-out`, userId: sellerId, amount: -amount, type: 'transfer_out' as const, description: `Transferencia manual enviada a ${client.username}`, createdAt: new Date().toISOString() };
            const newTxIn = { id: `temp-${Date.now()}-in`, userId: clientId, amount: amount, type: 'transfer_in' as const, description: `Transferencia manual recibida de ${seller.username}`, createdAt: new Date().toISOString() };
            updateConfig({
                ...appConfig,
                users: appConfig.users.map(u => { if (u.id === sellerId) return { ...u, balance: newSellerBalance }; if (u.id === clientId) return { ...u, balance: newClientBalance }; return u; }),
                transactions: [newTxOut, newTxIn, ...appConfig.transactions]
            });
            showNotification(`Transferencia de Bs ${amount} a ${client.username} exitosa.`);
        } catch (error: any) {
            showNotification(error.message || 'Error al procesar la transferencia');
        }
    }, [appConfig, currentUser, showNotification, updateConfig]);

    const value: AppContextType = {
        appConfig, updateConfig, isLoading, isConfigLoaded, dataFetchError,
        currentUser, userRole,
        notification, setNotification, showNotification,
        legalModalContent, setLegalModalContent,
        jornadaToPlay, showPurchaseSheet, setShowPurchaseSheet,
        navigateToLogin, navigateToRegister, navigateToHome, navigateToAdmin,
        navigateToSellerPanel, navigateToPromoterPanel, navigateToClientPanel, navigateToView,
        handleAdminLogin, handleUserLogin, handleRegister, handleLogout,
        handleSaveConfig, handleUpdateUser, handlePlayJornada,
        handlePurchaseCarton, handleUpdateCarton, handleDeleteCarton,
        handleRequestWithdrawal, handleProcessWithdrawal,
        handleRequestClientRecharge, handleRequestSellerRecharge,
        handleProcessClientRecharge, handleProcessSellerRecharge,
        handleTransferBalance, handleLegalClick,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
