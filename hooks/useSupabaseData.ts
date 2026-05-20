import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { AppConfig, RegisteredUser, Jornada, Carton, WithdrawalRequest, RechargeRequest, Transaction, PromoterProfile } from '../types';

// Omit functions and handle just the state fetching and realtime
export function useSupabaseData(initialAppConfig: AppConfig) {
  const [appConfig, setAppConfig] = useState<AppConfig>(initialAppConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetchError, setDataFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      setIsLoading(false);
      setDataFetchError(true);
      return;
    }

    async function loadData() {
      try {
        const [
          { data: configData },
          { data: usersData },
          { data: jornadasData },
          { data: ticketsData },
          { data: withdrawalData },
          { data: rechargeData },
          { data: sellerProfilesData },
          { data: transactionsData },
          { data: promoterProfilesData }
        ] = await Promise.all([
          supabase.from('app_config').select('*').eq('id', 'main').single(),
          supabase.from('users').select('*'),
          supabase.from('jornadas').select('*'),
          supabase.from('tickets').select('*'),
          supabase.from('withdrawal_requests').select('*'),
          supabase.from('recharge_requests').select('*'),
          supabase.from('seller_profiles').select('*'),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('promoter_profiles').select('*')
        ]);

        if (!isMounted) return;

        // Map Supabase models to the AppConfig expected by the frontend
        const mergedConfig: AppConfig = {
          ...initialAppConfig,
          ...(configData ? {
            appName: configData.app_name,
            theme: configData.theme,
            logoUrl: configData.theme?.logoUrl || initialAppConfig.logoUrl,
            botinAmount: parseFloat(configData.botin_amount ?? initialAppConfig.botinAmount.toString()),
            sellerCommissionPercentage: parseFloat(configData.seller_commission_percentage ?? initialAppConfig.sellerCommissionPercentage.toString()),
            adminWhatsappNumber: configData.admin_whatsapp,
            welcomeMessage: configData.welcome_message || initialAppConfig.welcomeMessage,
            welcomePopup: configData.welcome_popup || initialAppConfig.welcomePopup,
            gorditoJackpot: configData.jackpots?.gordito || initialAppConfig.gorditoJackpot,
            botinJackpot: configData.jackpots?.botin || initialAppConfig.botinJackpot,
            globalJackpot: parseFloat(configData.global_jackpot ?? initialAppConfig.globalJackpot.toString()),
            seedJackpot: parseFloat(configData.seed_jackpot ?? initialAppConfig.seedJackpot.toString()),
            gorditoJornadaId: configData.jackpots?.gorditoJornadaId || initialAppConfig.gorditoJornadaId,
            videoTutorials: configData.video_tutorials || initialAppConfig.videoTutorials,
            carouselImages: configData.carousel_images || initialAppConfig.carouselImages,
            recharge: { qrCodeUrl: configData.recharge_qr_url || '' },
            socialLinks: configData.social_links || [],
            footer: {
              copyright: configData.footer_text,
              socialLinks: configData.social_links || [],
              legalLinks: configData.legal_links || []
            },
            sectionsOrder: configData.sections_order || initialAppConfig.sectionsOrder,
            teams: configData.teams || []
          } : {}),
          // Map users and join with seller_profiles
          users: (usersData || []).map(u => {
            const sp = (sellerProfilesData || []).find(s => s.user_id === u.id);
            return {
              id: u.id,
              username: u.username,
              email: u.email,
              phone: u.phone,
              country: u.country,
              role: u.role,
              status: u.status,
              assignedSellerId: u.assigned_seller_id,
              balance: parseFloat(u.balance),
              sellerQrCodeUrl: sp?.qr_code_url,
              sellerWhatsappNumber: sp?.whatsapp_number,
              referralCode: u.referral_code || null,
              referredBy: u.referred_by || null
            };
          }),
          jornadas: (jornadasData || []).map(j => {
            // Find the promoter's display name if this jornada belongs to one
            const promoterProfile = j.promoter_id ? (promoterProfilesData || []).find(p => p.user_id === j.promoter_id) : null;
            return {
              id: j.id,
              name: j.name,
              status: j.status,
              firstPrize: j.first_prize_amount.toString(),
              secondPrize: j.second_prize_amount.toString(),
              cartonPrice: parseFloat(j.carton_price),
              botinMatchId: j.botin_match_id,
              botinResult: j.botin_result,
              flagIconUrl: j.flag_icon_url,
              styling: j.styling || { textColor: '#fff', buttonColor: '#000', backgroundColor: '#333', backgroundImage: '' },
              resultsProcessed: j.results_processed,
              globalPrizeProcessed: j.global_prize_processed,
              promoterId: j.promoter_id || null,
              promoterName: promoterProfile?.display_name || undefined,
              visibility: j.visibility || 'public',
              accessCode: j.access_code || null,
              matches: [] // Loaded separately below
            };
          }),
          cartones: (ticketsData || []).map(t => ({
            id: t.id,
            userId: t.user_id,
            jornadaId: t.jornada_id,
            predictions: t.predictions,
            botinPrediction: t.botin_prediction,
            purchaseDate: t.purchase_date,
            hits: t.hits,
            prizeWon: parseFloat(t.prize_won),
            prizeDetails: t.prize_details,
            resultNotified: t.result_notified
          })),
          withdrawalRequests: (withdrawalData || []).map(w => ({
            id: w.id,
            userId: w.user_id,
            amount: parseFloat(w.amount),
            userQrCodeUrl: w.user_qr_code_url,
            status: w.status,
            requestDate: w.request_date,
            processedDate: w.processed_date
          })),
          rechargeRequests: (rechargeData || []).map(r => ({
            id: r.id,
            userId: r.user_id,
            amount: parseFloat(r.amount),
            requesterRole: r.requester_role,
            status: r.status,
            requestDate: r.request_date,
            proofOfPaymentUrl: r.proof_of_payment_url,
            processedDate: r.processed_date,
            processedBy: r.processed_by
          })),
          transactions: (transactionsData || []).map(tx => ({
            id: tx.id,
            userId: tx.user_id,
            amount: parseFloat(tx.amount),
            type: tx.type,
            referenceId: tx.reference_id,
            description: tx.description,
            createdAt: tx.created_at
          })),
          promoterProfiles: (promoterProfilesData || []).map(p => ({
            id: p.id,
            userId: p.user_id,
            displayName: p.display_name,
            adminCommissionPct: parseFloat(p.admin_commission_pct),
            referralCode: p.referral_code,
            guaranteeBalance: parseFloat(p.guarantee_balance || '0'),
            status: p.status,
            createdAt: p.created_at,
            qrImageUrl: p.qr_image_url || '',
            whatsappNumber: p.whatsapp_number || ''
          }))
        };

        // We also need matches for jornadas
        const { data: matchesData } = await supabase.from('matches').select('*');
        if (matchesData) {
          mergedConfig.jornadas.forEach((j: any) => {
             j.matches = matchesData.filter(m => m.jornada_id === j.id).map(m => ({
                 id: m.id, localTeamId: m.local_team_id, visitorTeamId: m.visitor_team_id, dateTime: m.date_time, result: m.result
             }));
          });
        }

        setAppConfig(mergedConfig);
        setDataFetchError(false); // Clear error on success
      } catch (error) {
        console.error("Error loading initial data from Supabase:", error);
        setDataFetchError(true); // Flag that an error occurred preventing full load
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    // Supabase Realtime subscriptions to update individual slices of `appConfig` state
    const channel = supabase.channel('schema-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
         loadData(); // Simplest way to ensure consistency is triggering a targeted refetch, or full refetch if small. For now we just full refetch on any change to mimic Firebase.
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jornadas' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recharge_requests' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promoter_profiles' }, () => loadData())
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Update function to manually patch config (for parts not fully migrated yet)
  const updateConfig = (newConfig: Partial<AppConfig>) => {
      setAppConfig(prev => ({ ...prev, ...newConfig }));
  };

  return { appConfig, setAppConfig, updateConfig, isLoading, dataFetchError };
}
