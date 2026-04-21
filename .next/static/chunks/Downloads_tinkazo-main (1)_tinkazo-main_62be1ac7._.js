(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xvrdcdodtgfvyppvklpt.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cmRjZG9kdGdmdnlwcHZrbHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzA3MjMsImV4cCI6MjA4OTU0NjcyM30.E61NhCh_StmfdRP6vTya7T8yuQWuVWiVHlg0k7EsU4Q");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/hooks/useSupabaseData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSupabaseData",
    ()=>useSupabaseData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/supabaseClient.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useSupabaseData(initialAppConfig) {
    _s();
    const [appConfig, setAppConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialAppConfig);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [dataFetchError, setDataFetchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSupabaseData.useEffect": ()=>{
            let isMounted = true;
            async function loadData() {
                try {
                    var _configData_theme, _configData_jackpots, _configData_jackpots1, _configData_jackpots2;
                    const [{ data: configData }, { data: usersData }, { data: jornadasData }, { data: ticketsData }, { data: withdrawalData }, { data: rechargeData }, { data: sellerProfilesData }, { data: transactionsData }, { data: promoterProfilesData }] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('app_config').select('*').eq('id', 'main').single(),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('jornadas').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('tickets').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('withdrawal_requests').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recharge_requests').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('seller_profiles').select('*'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('transactions').select('*').order('created_at', {
                            ascending: false
                        }),
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('promoter_profiles').select('*')
                    ]);
                    if (!isMounted) return;
                    var _configData_botin_amount, _configData_seller_commission_percentage;
                    // Map Supabase models to the AppConfig expected by the frontend
                    const mergedConfig = {
                        ...initialAppConfig,
                        ...configData ? {
                            appName: configData.app_name,
                            theme: configData.theme,
                            logoUrl: ((_configData_theme = configData.theme) === null || _configData_theme === void 0 ? void 0 : _configData_theme.logoUrl) || initialAppConfig.logoUrl,
                            botinAmount: parseFloat((_configData_botin_amount = configData.botin_amount) !== null && _configData_botin_amount !== void 0 ? _configData_botin_amount : initialAppConfig.botinAmount.toString()),
                            sellerCommissionPercentage: parseFloat((_configData_seller_commission_percentage = configData.seller_commission_percentage) !== null && _configData_seller_commission_percentage !== void 0 ? _configData_seller_commission_percentage : initialAppConfig.sellerCommissionPercentage.toString()),
                            adminWhatsappNumber: configData.admin_whatsapp,
                            welcomeMessage: configData.welcome_message || initialAppConfig.welcomeMessage,
                            welcomePopup: configData.welcome_popup || initialAppConfig.welcomePopup,
                            gorditoJackpot: ((_configData_jackpots = configData.jackpots) === null || _configData_jackpots === void 0 ? void 0 : _configData_jackpots.gordito) || initialAppConfig.gorditoJackpot,
                            botinJackpot: ((_configData_jackpots1 = configData.jackpots) === null || _configData_jackpots1 === void 0 ? void 0 : _configData_jackpots1.botin) || initialAppConfig.botinJackpot,
                            gorditoJornadaId: ((_configData_jackpots2 = configData.jackpots) === null || _configData_jackpots2 === void 0 ? void 0 : _configData_jackpots2.gorditoJornadaId) || initialAppConfig.gorditoJornadaId,
                            videoTutorials: configData.video_tutorials || initialAppConfig.videoTutorials,
                            carouselImages: configData.carousel_images || initialAppConfig.carouselImages,
                            recharge: {
                                qrCodeUrl: configData.recharge_qr_url || ''
                            },
                            socialLinks: configData.social_links || [],
                            footer: {
                                copyright: configData.footer_text,
                                socialLinks: configData.social_links || [],
                                legalLinks: configData.legal_links || []
                            },
                            sectionsOrder: configData.sections_order || initialAppConfig.sectionsOrder,
                            teams: configData.teams || []
                        } : {},
                        // Map users and join with seller_profiles
                        users: (usersData || []).map({
                            "useSupabaseData.useEffect.loadData": (u)=>{
                                const sp = (sellerProfilesData || []).find({
                                    "useSupabaseData.useEffect.loadData.sp": (s)=>s.user_id === u.id
                                }["useSupabaseData.useEffect.loadData.sp"]);
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
                                    sellerQrCodeUrl: sp === null || sp === void 0 ? void 0 : sp.qr_code_url,
                                    sellerWhatsappNumber: sp === null || sp === void 0 ? void 0 : sp.whatsapp_number,
                                    referralCode: u.referral_code || null,
                                    referredBy: u.referred_by || null
                                };
                            }
                        }["useSupabaseData.useEffect.loadData"]),
                        jornadas: (jornadasData || []).map({
                            "useSupabaseData.useEffect.loadData": (j)=>{
                                // Find the promoter's display name if this jornada belongs to one
                                const promoterProfile = j.promoter_id ? (promoterProfilesData || []).find({
                                    "useSupabaseData.useEffect.loadData": (p)=>p.user_id === j.promoter_id
                                }["useSupabaseData.useEffect.loadData"]) : null;
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
                                    styling: j.styling || {
                                        textColor: '#fff',
                                        buttonColor: '#000',
                                        backgroundColor: '#333',
                                        backgroundImage: ''
                                    },
                                    resultsProcessed: j.results_processed,
                                    promoterId: j.promoter_id || null,
                                    promoterName: (promoterProfile === null || promoterProfile === void 0 ? void 0 : promoterProfile.display_name) || undefined,
                                    visibility: j.visibility || 'public',
                                    accessCode: j.access_code || null,
                                    matches: [] // Loaded separately below
                                };
                            }
                        }["useSupabaseData.useEffect.loadData"]),
                        cartones: (ticketsData || []).map({
                            "useSupabaseData.useEffect.loadData": (t)=>({
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
                                })
                        }["useSupabaseData.useEffect.loadData"]),
                        withdrawalRequests: (withdrawalData || []).map({
                            "useSupabaseData.useEffect.loadData": (w)=>({
                                    id: w.id,
                                    userId: w.user_id,
                                    amount: parseFloat(w.amount),
                                    userQrCodeUrl: w.user_qr_code_url,
                                    status: w.status,
                                    requestDate: w.request_date,
                                    processedDate: w.processed_date
                                })
                        }["useSupabaseData.useEffect.loadData"]),
                        rechargeRequests: (rechargeData || []).map({
                            "useSupabaseData.useEffect.loadData": (r)=>({
                                    id: r.id,
                                    userId: r.user_id,
                                    amount: parseFloat(r.amount),
                                    requesterRole: r.requester_role,
                                    status: r.status,
                                    requestDate: r.request_date,
                                    proofOfPaymentUrl: r.proof_of_payment_url,
                                    processedDate: r.processed_date,
                                    processedBy: r.processed_by
                                })
                        }["useSupabaseData.useEffect.loadData"]),
                        transactions: (transactionsData || []).map({
                            "useSupabaseData.useEffect.loadData": (tx)=>({
                                    id: tx.id,
                                    userId: tx.user_id,
                                    amount: parseFloat(tx.amount),
                                    type: tx.type,
                                    referenceId: tx.reference_id,
                                    description: tx.description,
                                    createdAt: tx.created_at
                                })
                        }["useSupabaseData.useEffect.loadData"]),
                        promoterProfiles: (promoterProfilesData || []).map({
                            "useSupabaseData.useEffect.loadData": (p)=>({
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
                                })
                        }["useSupabaseData.useEffect.loadData"])
                    };
                    // We also need matches for jornadas
                    const { data: matchesData } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('matches').select('*');
                    if (matchesData) {
                        mergedConfig.jornadas.forEach({
                            "useSupabaseData.useEffect.loadData": (j)=>{
                                j.matches = matchesData.filter({
                                    "useSupabaseData.useEffect.loadData": (m)=>m.jornada_id === j.id
                                }["useSupabaseData.useEffect.loadData"]).map({
                                    "useSupabaseData.useEffect.loadData": (m)=>({
                                            id: m.id,
                                            localTeamId: m.local_team_id,
                                            visitorTeamId: m.visitor_team_id,
                                            dateTime: m.date_time,
                                            result: m.result
                                        })
                                }["useSupabaseData.useEffect.loadData"]);
                            }
                        }["useSupabaseData.useEffect.loadData"]);
                    }
                    setAppConfig(mergedConfig);
                    setDataFetchError(false); // Clear error on success
                } catch (error) {
                    console.error("Error loading initial data from Supabase:", error);
                    setDataFetchError(true); // Flag that an error occurred preventing full load
                } finally{
                    if (isMounted) setIsLoading(false);
                }
            }
            loadData();
            // Supabase Realtime subscriptions to update individual slices of `appConfig` state
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel('schema-changes').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'users'
            }, {
                "useSupabaseData.useEffect.channel": (payload)=>{
                    loadData(); // Simplest way to ensure consistency is triggering a targeted refetch, or full refetch if small. For now we just full refetch on any change to mimic Firebase.
                }
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'app_config'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tickets'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'jornadas'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'matches'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'withdrawal_requests'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'recharge_requests'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'transactions'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'promoter_profiles'
            }, {
                "useSupabaseData.useEffect.channel": ()=>loadData()
            }["useSupabaseData.useEffect.channel"]).subscribe();
            return ({
                "useSupabaseData.useEffect": ()=>{
                    isMounted = false;
                    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                }
            })["useSupabaseData.useEffect"];
        }
    }["useSupabaseData.useEffect"], []);
    // Update function to manually patch config (for parts not fully migrated yet)
    const updateConfig = (newConfig)=>{
        setAppConfig((prev)=>({
                ...prev,
                ...newConfig
            }));
    };
    return {
        appConfig,
        setAppConfig,
        updateConfig,
        isLoading,
        dataFetchError
    };
}
_s(useSupabaseData, "MIADfWXiRWccwsJ4Ky+P+W7FHPY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$hooks$2f$useSupabaseData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/hooks/useSupabaseData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/supabaseClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// --- INITIAL APP CONFIG (Exact copy from App.tsx) ---
const initialAppConfig = {
    appName: 'TINKAZO',
    theme: {
        backgroundColor: '#020617',
        textColor: '#ffffff',
        primaryColor: '#a855f7',
        backgroundStyle: 'space'
    },
    logoUrl: '',
    welcomeMessage: {
        title: 'Desafía tu Suerte en TINKAZO',
        description: 'La arena definitiva para los pronosticadores más audaces. Domina las jornadas, crea tu jugada maestra y conquista premios legendarios.'
    },
    welcomePopup: {
        enabled: true,
        title: '¡Atención, Estratega!',
        text: 'Las jornadas de la Champions League están en su punto más álgido. ¡El tiempo se acaba! ¡Asegura tu predicción y no te quedes fuera de la gloria!',
        imageUrl: ''
    },
    gorditoJackpot: {
        title: 'GRAN POZO',
        detail: 'GRAN POZO',
        amount: 'Bs 1.250.000',
        backgroundType: 'color',
        colors: {
            primary: '#22d3ee',
            backgroundColor: '#1f2937'
        },
        backgroundImage: ''
    },
    botinJackpot: {
        title: 'POZO DEL BOTÍN',
        detail: 'POZO DEL BOTÍN',
        amount: '',
        backgroundType: 'color',
        colors: {
            primary: '#a855f7',
            backgroundColor: '#1f2937'
        },
        backgroundImage: ''
    },
    carouselImages: [
        {
            id: '1',
            url: 'https://picsum.photos/seed/tinkazo1/920/430'
        },
        {
            id: '2',
            url: 'https://picsum.photos/seed/tinkazo2/920/430'
        },
        {
            id: '3',
            url: 'https://picsum.photos/seed/tinkazo3/920/430'
        }
    ],
    recharge: {
        qrCodeUrl: ''
    },
    adminWhatsappNumber: '+51987654321',
    sectionsOrder: [
        'jornadas',
        'jackpots',
        'carousel',
        'tutorials'
    ],
    videoTutorials: [
        {
            id: 'vid1',
            title: 'Cómo Jugar tu Primera Jornada',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
            id: 'vid2',
            title: 'Entendiendo el Pozo del Botín',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
            id: 'vid3',
            title: 'Cómo Recargar Saldo',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
    ],
    tutorialsSectionTitle: 'Tutoriales',
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
            {
                platform: 'facebook',
                url: '#'
            },
            {
                platform: 'twitter',
                url: '#'
            },
            {
                platform: 'instagram',
                url: '#'
            },
            {
                platform: 'tiktok',
                url: '#'
            },
            {
                platform: 'discord',
                url: '#'
            },
            {
                platform: 'snapchat',
                url: '#'
            },
            {
                platform: 'youtube',
                url: '#'
            },
            {
                platform: 'whatsapp',
                url: '#'
            },
            {
                platform: 'behance',
                url: '#'
            },
            {
                platform: 'threads',
                url: '#'
            },
            {
                platform: 'linkedin',
                url: '#'
            },
            {
                platform: 'dribbble',
                url: '#'
            },
            {
                platform: 'pinterest',
                url: '#'
            },
            {
                platform: 'twitch',
                url: '#'
            },
            {
                platform: 'telegram',
                url: '#'
            }
        ],
        legalLinks: [
            {
                title: 'Términos y Condiciones',
                content: 'Aquí va el contenido completo de los términos y condiciones del servicio...'
            },
            {
                title: 'Política de Privacidad',
                content: 'Aquí va el contenido completo de la política de privacidad de la aplicación...'
            }
        ]
    }
};
// --- PROCESS JORNADA RESULTS (Exact copy from App.tsx) ---
const processJornadaResults = (config)=>{
    const newConfig = JSON.parse(JSON.stringify(config));
    const parsePrize = (prizeStr)=>parseInt(prizeStr.replace(/[^0-9]/g, ""), 10) || 0;
    newConfig.jornadas.forEach((jornada)=>{
        const allMatchesHaveResults = jornada.matches.length > 0 && jornada.matches.every((m)=>m.result);
        if (jornada.status === 'cerrada' && allMatchesHaveResults && !jornada.resultsProcessed) {
            console.log("Processing results for jornada: ".concat(jornada.name));
            jornada.resultsProcessed = true;
            const cartonesForJornada = newConfig.cartones.filter((c)=>c.jornadaId === jornada.id);
            if (cartonesForJornada.length === 0) return;
            cartonesForJornada.forEach((carton)=>{
                carton.prizeWon = 0;
                carton.prizeDetails = {};
                let isCartonValid = true;
                if (carton.botinPrediction && jornada.botinResult) {
                    const [localStr, visitorStr] = jornada.botinResult.split('-');
                    const botinAdminResult = {
                        local: parseInt(localStr, 10),
                        visitor: parseInt(visitorStr, 10)
                    };
                    const predictionIsWrong = isNaN(botinAdminResult.local) || isNaN(botinAdminResult.visitor) || carton.botinPrediction.localScore !== botinAdminResult.local || carton.botinPrediction.visitorScore !== botinAdminResult.visitor;
                    if (predictionIsWrong) isCartonValid = false;
                }
                if (isCartonValid) {
                    carton.hits = jornada.matches.reduce((hits, match)=>match.result && carton.predictions[match.id] === match.result ? hits + 1 : hits, 0);
                } else {
                    carton.hits = 0;
                }
            });
            const isGorditoJornada = jornada.id === newConfig.gorditoJornadaId;
            const firstPrizeAmount = isGorditoJornada ? parsePrize(newConfig.gorditoJackpot.amount) : parsePrize(jornada.firstPrize);
            const secondPrizeAmount = parsePrize(jornada.secondPrize);
            const firstPrizeHits = jornada.matches.length;
            const secondPrizeHits = jornada.matches.length - 1;
            const firstPrizeWinners = cartonesForJornada.filter((c)=>c.hits === firstPrizeHits);
            const secondPrizeWinners = cartonesForJornada.filter((c)=>c.hits === secondPrizeHits);
            if (firstPrizeWinners.length > 0) {
                const prizePerWinner = firstPrizeAmount / firstPrizeWinners.length;
                firstPrizeWinners.forEach((carton)=>{
                    carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                    const prizeDetailKey = isGorditoJornada ? 'gordito' : 'jornada';
                    carton.prizeDetails[prizeDetailKey] = {
                        tier: 1,
                        winnersCount: firstPrizeWinners.length
                    };
                });
            } else if (!isGorditoJornada) {
                const totalJornadaSales = cartonesForJornada.length * jornada.cartonPrice;
                const botinContribution = totalJornadaSales * 0.70;
                newConfig.botinAmount = (newConfig.botinAmount || 0) + botinContribution;
            }
            if (secondPrizeWinners.length > 0) {
                const prizePerWinner = secondPrizeAmount / secondPrizeWinners.length;
                secondPrizeWinners.forEach((carton)=>{
                    var _carton_prizeDetails;
                    carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                    if (!((_carton_prizeDetails = carton.prizeDetails) === null || _carton_prizeDetails === void 0 ? void 0 : _carton_prizeDetails.jornada)) {
                        carton.prizeDetails.jornada = {
                            tier: 2,
                            winnersCount: secondPrizeWinners.length
                        };
                    }
                });
            }
            if (jornada.botinResult && newConfig.botinAmount > 0) {
                const [localStr, visitorStr] = jornada.botinResult.split('-');
                const botinResult = {
                    local: parseInt(localStr, 10),
                    visitor: parseInt(visitorStr, 10)
                };
                if (!isNaN(botinResult.local) && !isNaN(botinResult.visitor)) {
                    const botinWinners = cartonesForJornada.filter((c)=>c.botinPrediction && c.botinPrediction.localScore === botinResult.local && c.botinPrediction.visitorScore === botinResult.visitor);
                    if (botinWinners.length > 0) {
                        const prizePerWinner = newConfig.botinAmount / botinWinners.length;
                        botinWinners.forEach((carton)=>{
                            carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner;
                            carton.prizeDetails.botin = {
                                winnersCount: botinWinners.length
                            };
                        });
                        newConfig.botinAmount = 0;
                    }
                }
            }
            cartonesForJornada.forEach((carton)=>{
                if (carton.prizeWon && carton.prizeWon > 0) {
                    const user = newConfig.users.find((u)=>u.id === carton.userId);
                    if (user) user.balance = (user.balance || 0) + carton.prizeWon;
                }
                if (Object.keys(carton.prizeDetails || {}).length === 0) carton.prizeDetails = null;
            });
            newConfig.cartones = newConfig.cartones.map((originalCarton)=>cartonesForJornada.find((pc)=>pc.id === originalCarton.id) || originalCarton);
        }
    });
    return newConfig;
};
// --- VIEW <-> ROUTE MAPPING ---
const viewToRoute = {
    'home': '/',
    'login': '/login',
    'register': '/register',
    'admin': '/admin',
    'seller': '/seller',
    'promoter': '/promoter',
    'clientPanel': '/client',
    'purchaseCarton': '/'
};
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useApp() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
_s(useApp, "/dMy7t63NXD4eYACoT93CePwGrg=");
function AppProvider(param) {
    let { children } = param;
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [legalModalContent, setLegalModalContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jornadaToPlay, setJornadaToPlay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPurchaseSheet, setShowPurchaseSheet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { appConfig, updateConfig, isLoading, dataFetchError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$hooks$2f$useSupabaseData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSupabaseData"])(initialAppConfig);
    const isConfigLoaded = !isLoading;
    // --- Effect: Dynamic favicon ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (appConfig.logoUrl) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = appConfig.logoUrl;
            }
        }
    }["AppProvider.useEffect"], [
        appConfig.logoUrl
    ]);
    // --- Effect: Rehydrate session from localStorage ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            try {
                const savedRole = localStorage.getItem('tinkazoUserRole');
                const savedUserJSON = localStorage.getItem('tinkazoCurrentUser');
                const savedPath = localStorage.getItem('tinkazoCurrentPath');
                if (savedRole) {
                    setUserRole(savedRole);
                    if (savedUserJSON) {
                        setCurrentUser(JSON.parse(savedUserJSON));
                    }
                    if (savedPath) {
                        var _allowedPaths_savedRole;
                        const allowedPaths = {
                            'admin': [
                                '/admin'
                            ],
                            'seller': [
                                '/seller'
                            ],
                            'promoter': [
                                '/promoter'
                            ],
                            'client': [
                                '/client',
                                '/'
                            ]
                        };
                        if ((_allowedPaths_savedRole = allowedPaths[savedRole]) === null || _allowedPaths_savedRole === void 0 ? void 0 : _allowedPaths_savedRole.includes(savedPath)) {
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
        }
    }["AppProvider.useEffect"], []);
    // --- Effect: Sync currentUser with real-time appConfig.users ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (currentUser && appConfig.users.length > 0) {
                const freshUser = appConfig.users.find({
                    "AppProvider.useEffect.freshUser": (u)=>u.id === currentUser.id
                }["AppProvider.useEffect.freshUser"]);
                if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
                    setCurrentUser(freshUser);
                    localStorage.setItem('tinkazoCurrentUser', JSON.stringify(freshUser));
                }
            }
        }
    }["AppProvider.useEffect"], [
        appConfig.users,
        currentUser
    ]);
    // --- Effect: Apply body background class ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            document.body.classList.remove('body-bg-space', 'body-bg-business');
            document.body.classList.add("body-bg-".concat(appConfig.theme.backgroundStyle));
            document.body.style.color = appConfig.theme.textColor;
        }
    }["AppProvider.useEffect"], [
        appConfig.theme.backgroundStyle,
        appConfig.theme.textColor
    ]);
    // --- Effect: Auto-Close Jornadas at < 10 Minutes ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (!isConfigLoaded) return;
            const interval = setInterval({
                "AppProvider.useEffect.interval": ()=>{
                    const now = Date.now();
                    appConfig.jornadas.forEach({
                        "AppProvider.useEffect.interval": async (j)=>{
                            if (j.status !== 'abierta') return;
                            const matchTimes = j.matches.map({
                                "AppProvider.useEffect.interval.matchTimes": (m)=>new Date(m.dateTime).getTime()
                            }["AppProvider.useEffect.interval.matchTimes"]);
                            if (matchTimes.length === 0) return;
                            const firstMatchTime = Math.min(...matchTimes);
                            if (now >= firstMatchTime - 10 * 60 * 1000) {
                                try {
                                    if (userRole === 'admin') {
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('jornadas').update({
                                            status: 'cerrada'
                                        }).eq('id', j.id);
                                        console.log("Auto-closed Jornada: ".concat(j.name));
                                    }
                                } catch (err) {
                                    console.error("Auto-close attempted without privileges:", err);
                                }
                            }
                        }
                    }["AppProvider.useEffect.interval"]);
                }
            }["AppProvider.useEffect.interval"], 60000);
            return ({
                "AppProvider.useEffect": ()=>clearInterval(interval)
            })["AppProvider.useEffect"];
        }
    }["AppProvider.useEffect"], [
        appConfig.jornadas,
        isConfigLoaded,
        userRole
    ]);
    // --- Effect: Save current path to localStorage ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (userRole) {
                localStorage.setItem('tinkazoCurrentPath', pathname);
            }
        }
    }["AppProvider.useEffect"], [
        pathname,
        userRole
    ]);
    // --- Notification ---
    const showNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[showNotification]": (message)=>{
            setNotification(message);
        }
    }["AppProvider.useCallback[showNotification]"], []);
    // --- Navigation (replaces setState-based navigation) ---
    const navigateToLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToLogin]": ()=>router.push('/login')
    }["AppProvider.useCallback[navigateToLogin]"], [
        router
    ]);
    const navigateToRegister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToRegister]": ()=>router.push('/register')
    }["AppProvider.useCallback[navigateToRegister]"], [
        router
    ]);
    const navigateToHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToHome]": ()=>{
            setJornadaToPlay(null);
            setShowPurchaseSheet(false);
            router.push('/');
        }
    }["AppProvider.useCallback[navigateToHome]"], [
        router
    ]);
    const navigateToAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToAdmin]": ()=>router.push('/admin')
    }["AppProvider.useCallback[navigateToAdmin]"], [
        router
    ]);
    const navigateToSellerPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToSellerPanel]": ()=>router.push('/seller')
    }["AppProvider.useCallback[navigateToSellerPanel]"], [
        router
    ]);
    const navigateToPromoterPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToPromoterPanel]": ()=>router.push('/promoter')
    }["AppProvider.useCallback[navigateToPromoterPanel]"], [
        router
    ]);
    const navigateToClientPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToClientPanel]": ()=>{
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.status) === 'pending') {
                alert('Tu cuenta aún no ha sido activada. No puedes acceder a esta sección.');
                return;
            }
            router.push('/client');
        }
    }["AppProvider.useCallback[navigateToClientPanel]"], [
        currentUser,
        router
    ]);
    const navigateToView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[navigateToView]": (view)=>{
            if (view === 'purchaseCarton') {
                setShowPurchaseSheet(true);
                router.push('/');
            } else {
                const route = viewToRoute[view] || '/';
                router.push(route);
            }
        }
    }["AppProvider.useCallback[navigateToView]"], [
        router
    ]);
    // --- Auth Handlers ---
    const handleAdminLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleAdminLogin]": ()=>{
            const role = 'admin';
            setUserRole(role);
            setCurrentUser(null);
            localStorage.setItem('tinkazoUserRole', role);
            localStorage.setItem('tinkazoCurrentPath', '/admin');
            localStorage.removeItem('tinkazoCurrentUser');
            router.push('/admin');
        }
    }["AppProvider.useCallback[handleAdminLogin]"], [
        router
    ]);
    const handleUserLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleUserLogin]": (user)=>{
            const sanitizedUser = JSON.parse(JSON.stringify(user));
            setCurrentUser(sanitizedUser);
            localStorage.setItem('tinkazoCurrentUser', JSON.stringify(sanitizedUser));
            let role;
            let path;
            if (sanitizedUser.role === 'admin') {
                role = 'admin';
                path = '/admin';
            } else if (sanitizedUser.role === 'seller') {
                role = 'seller';
                path = '/seller';
            } else if (sanitizedUser.role === 'promoter') {
                role = 'promoter';
                path = '/promoter';
            } else {
                role = 'client';
                path = '/';
            }
            setUserRole(role);
            localStorage.setItem('tinkazoUserRole', role);
            localStorage.setItem('tinkazoCurrentPath', path);
            router.push(path);
        }
    }["AppProvider.useCallback[handleUserLogin]"], [
        router
    ]);
    const handleRegister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleRegister]": async (userData)=>{
            try {
                let referrerId = null;
                let assignedSellerId = null;
                let autoActivate = false;
                if (userData.referralCode) {
                    const matchedPromoter = appConfig.promoterProfiles.find({
                        "AppProvider.useCallback[handleRegister].matchedPromoter": (p)=>p.referralCode.toUpperCase() === userData.referralCode.toUpperCase()
                    }["AppProvider.useCallback[handleRegister].matchedPromoter"]);
                    const matchedSeller = appConfig.users.find({
                        "AppProvider.useCallback[handleRegister].matchedSeller": (u)=>{
                            var _u_referralCode;
                            return u.role === 'seller' && ((_u_referralCode = u.referralCode) === null || _u_referralCode === void 0 ? void 0 : _u_referralCode.toUpperCase()) === userData.referralCode.toUpperCase();
                        }
                    }["AppProvider.useCallback[handleRegister].matchedSeller"]);
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
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
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
                if (data === null || data === void 0 ? void 0 : data.user) {
                    await new Promise({
                        "AppProvider.useCallback[handleRegister]": (resolve)=>setTimeout(resolve, 500)
                    }["AppProvider.useCallback[handleRegister]"]);
                    const { error: upsertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').upsert({
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
                    }, {
                        onConflict: 'id'
                    });
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
            } catch (error) {
                showNotification(error.message || 'Error al registrar.');
            }
        }
    }["AppProvider.useCallback[handleRegister]"], [
        showNotification,
        appConfig.promoterProfiles,
        appConfig.users,
        router
    ]);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleLogout]": ()=>{
            setUserRole(null);
            setCurrentUser(null);
            localStorage.removeItem('tinkazoUserRole');
            localStorage.removeItem('tinkazoCurrentUser');
            localStorage.removeItem('tinkazoCurrentPath');
            router.push('/');
        }
    }["AppProvider.useCallback[handleLogout]"], [
        router
    ]);
    // --- handleSaveConfig (Exact business logic from App.tsx) ---
    const handleSaveConfig = async (newConfig)=>{
        try {
            const processedConfig = processJornadaResults(newConfig);
            const { error: configError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('app_config').update({
                app_name: processedConfig.appName,
                theme: {
                    ...processedConfig.theme,
                    logoUrl: processedConfig.logoUrl
                },
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
            for (const u of processedConfig.users){
                const originalUser = appConfig.users.find((orig)=>orig.id === u.id);
                if (!originalUser) continue;
                const updates = {};
                if (u.status !== originalUser.status) updates.status = u.status;
                if (u.assignedSellerId !== originalUser.assignedSellerId) updates.assigned_seller_id = u.assignedSellerId || null;
                if (u.username !== originalUser.username) updates.username = u.username;
                if (u.role !== originalUser.role) updates.role = u.role;
                if (u.phone !== originalUser.phone) updates.phone = u.phone;
                if (u.country !== originalUser.country) updates.country = u.country;
                if (u.balance !== originalUser.balance) {
                    const delta = (u.balance || 0) - (originalUser.balance || 0);
                    if (delta !== 0) {
                        const { data: latestUser } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('balance').eq('id', u.id).single();
                        if (latestUser) {
                            updates.balance = Number(latestUser.balance) + delta;
                        } else {
                            updates.balance = u.balance;
                        }
                    }
                }
                if (Object.keys(updates).length > 0) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').update(updates).eq('id', u.id);
                }
            }
            const cartonesToUpdate = processedConfig.cartones.filter((c)=>{
                const orig = appConfig.cartones.find((original)=>original.id === c.id);
                return !orig || c.hits !== orig.hits || c.prizeWon !== orig.prizeWon || JSON.stringify(c.prizeDetails) !== JSON.stringify(orig.prizeDetails);
            });
            for (const c of cartonesToUpdate){
                await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('tickets').update({
                    hits: c.hits,
                    prize_won: c.prizeWon,
                    prize_details: c.prizeDetails
                }).eq('id', c.id);
            }
            const jornadasToUpsert = processedConfig.jornadas.map((j)=>({
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
                const { error: jError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('jornadas').upsert(jornadasToUpsert);
                if (jError) throw new Error("Error guardando jornadas: ".concat(jError.message));
            }
            const allMatchesToUpsert = [];
            const seenMatchIds = new Set();
            processedConfig.jornadas.forEach((j)=>{
                j.matches.forEach((m)=>{
                    if (seenMatchIds.has(m.id)) m.id = crypto.randomUUID();
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
                const { error: mError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('matches').upsert(allMatchesToUpsert);
                if (mError) throw new Error("Error guardando partidos: ".concat(mError.message));
            }
            const { data: existingMatches } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('matches').select('id, jornada_id');
            if (existingMatches) {
                const currentJornadaIds = processedConfig.jornadas.map((j)=>j.id);
                const currentMatchIds = allMatchesToUpsert.map((m)=>m.id);
                const matchesToDelete = existingMatches.filter((em)=>currentJornadaIds.includes(em.jornada_id) && !currentMatchIds.includes(em.id));
                if (matchesToDelete.length > 0) {
                    const idsToDelete = matchesToDelete.map((m)=>m.id);
                    for(let i = 0; i < idsToDelete.length; i += 100){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('matches').delete().in('id', idsToDelete.slice(i, i + 100));
                    }
                }
            }
            const { data: existingJornadas, error: fetchEJError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('jornadas').select('id');
            if (existingJornadas && !fetchEJError) {
                const currentIds = processedConfig.jornadas.map((j)=>j.id);
                const toDeleteIds = existingJornadas.filter((ej)=>!currentIds.includes(ej.id)).map((ej)=>ej.id);
                if (toDeleteIds.length > 0) {
                    for(let i = 0; i < toDeleteIds.length; i += 100){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('jornadas').delete().in('id', toDeleteIds.slice(i, i + 100));
                    }
                }
            }
            updateConfig(processedConfig);
            showNotification('¡Cambios guardados con éxito!');
        } catch (error) {
            console.error("FATAL SAVE ERROR:", error);
            window.alert("ERROR CRITICO AL GUARDAR: " + (error.message || 'Error guardando en Supabase'));
        }
    };
    const handleLegalClick = (link)=>{
        setLegalModalContent(link);
    };
    const handleUpdateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleUpdateUser]": async (updatedUser)=>{
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                    username: updatedUser.username,
                    phone: updatedUser.phone,
                    country: updatedUser.country,
                    status: updatedUser.status,
                    assigned_seller_id: updatedUser.assignedSellerId,
                    balance: updatedUser.balance
                }).eq('id', updatedUser.id);
                if (error) throw error;
                if (updatedUser.role === 'seller') {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('seller_profiles').upsert({
                        user_id: updatedUser.id,
                        qr_code_url: updatedUser.sellerQrCodeUrl,
                        whatsapp_number: updatedUser.sellerWhatsappNumber
                    });
                }
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === updatedUser.id) setCurrentUser(updatedUser);
                showNotification('¡Datos actualizados!');
            } catch (error) {
                showNotification(error.message || 'Error al actualizar.');
            }
        }
    }["AppProvider.useCallback[handleUpdateUser]"], [
        currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
        showNotification
    ]);
    const handlePlayJornada = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handlePlayJornada]": (jornada)=>{
            if (!currentUser) {
                alert('Debes iniciar sesión para poder jugar.');
                router.push('/login');
                return;
            }
            if (currentUser.status === 'pending') {
                alert('Tu cuenta debe ser activada por un administrador antes de poder jugar.');
                return;
            }
            const sortedMatches = [
                ...jornada.matches
            ].sort({
                "AppProvider.useCallback[handlePlayJornada].sortedMatches": (a, b)=>new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            }["AppProvider.useCallback[handlePlayJornada].sortedMatches"]);
            if (sortedMatches.length > 0) {
                const firstMatchDate = new Date(sortedMatches[0].dateTime);
                const now = new Date();
                if (firstMatchDate.getTime() - now.getTime() <= 10 * 60 * 1000) {
                    alert('El tiempo para comprar un cartón para esta jornada ha expirado.');
                    return;
                }
            }
            setJornadaToPlay(jornada);
            setShowPurchaseSheet(true);
            // Navigate to home if not already there (for when called from client/seller panels)
            if (pathname !== '/') router.push('/');
        }
    }["AppProvider.useCallback[handlePlayJornada]"], [
        currentUser,
        router,
        pathname
    ]);
    const handlePurchaseCarton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handlePurchaseCarton]": async (jornadaId, predictions, price, botinPrediction)=>{
            if (!currentUser) {
                showNotification('Error: No se encontró el usuario.');
                return;
            }
            if ((currentUser.balance || 0) < price) {
                showNotification('Saldo insuficiente. Por favor, recarga tu cuenta.');
                return;
            }
            const jornada = appConfig.jornadas.find({
                "AppProvider.useCallback[handlePurchaseCarton].jornada": (j)=>j.id === jornadaId
            }["AppProvider.useCallback[handlePurchaseCarton].jornada"]);
            if (!jornada) {
                showNotification('Error: Jornada no encontrada.');
                return;
            }
            const sortedMatches = [
                ...jornada.matches
            ].sort({
                "AppProvider.useCallback[handlePurchaseCarton].sortedMatches": (a, b)=>new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            }["AppProvider.useCallback[handlePurchaseCarton].sortedMatches"]);
            if (sortedMatches.length > 0) {
                const firstMatchDate = new Date(sortedMatches[0].dateTime);
                const now = new Date();
                if (firstMatchDate.getTime() - now.getTime() <= 10 * 60 * 1000) {
                    showNotification('El tiempo para comprar un cartón ha expirado. (Se cierra 10 minutos antes del primer partido)');
                    navigateToHome();
                    return;
                }
            }
            try {
                const { data: ticketId, error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('purchase_carton', {
                    p_user_id: currentUser.id,
                    p_jornada_id: jornadaId,
                    p_predictions: predictions,
                    p_botin_prediction: botinPrediction,
                    p_price: price
                });
                if (rpcError) throw rpcError;
                const newBalance = (currentUser.balance || 0) - price;
                const newTicketId = ticketId || "temp-ticket-".concat(Date.now());
                setCurrentUser({
                    "AppProvider.useCallback[handlePurchaseCarton]": (prev)=>prev ? {
                            ...prev,
                            balance: newBalance
                        } : null
                }["AppProvider.useCallback[handlePurchaseCarton]"]);
                const newCarton = {
                    id: newTicketId,
                    userId: currentUser.id,
                    jornadaId: jornadaId,
                    predictions: predictions,
                    botinPrediction: botinPrediction,
                    purchaseDate: new Date().toISOString()
                };
                const newTx = {
                    id: "temp-tx-".concat(Date.now()),
                    userId: currentUser.id,
                    amount: -price,
                    type: 'ticket_purchase',
                    description: 'Compra de cartón para la jornada',
                    createdAt: new Date().toISOString()
                };
                updateConfig({
                    ...appConfig,
                    users: appConfig.users.map({
                        "AppProvider.useCallback[handlePurchaseCarton]": (u)=>u.id === currentUser.id ? {
                                ...u,
                                balance: newBalance
                            } : u
                    }["AppProvider.useCallback[handlePurchaseCarton]"]),
                    cartones: [
                        newCarton,
                        ...appConfig.cartones
                    ],
                    transactions: [
                        newTx,
                        ...appConfig.transactions
                    ]
                });
                showNotification('¡Cartón comprado con éxito!');
                navigateToHome();
            } catch (error) {
                console.error("Carton Purchase Error:", error);
                showNotification(error.message || 'Error al comprar cartón. Verifica tus datos.');
            }
        }
    }["AppProvider.useCallback[handlePurchaseCarton]"], [
        currentUser,
        navigateToHome,
        showNotification,
        appConfig
    ]);
    const handleUpdateCarton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleUpdateCarton]": async (cartonId, newPredictions, newBotinPrediction)=>{
            const carton = appConfig.cartones.find({
                "AppProvider.useCallback[handleUpdateCarton].carton": (c)=>c.id === cartonId
            }["AppProvider.useCallback[handleUpdateCarton].carton"]);
            if (!carton) {
                alert('No se encontró el cartón.');
                return;
            }
            const jornada = appConfig.jornadas.find({
                "AppProvider.useCallback[handleUpdateCarton].jornada": (j)=>j.id === carton.jornadaId
            }["AppProvider.useCallback[handleUpdateCarton].jornada"]);
            if (!jornada) {
                alert('No se encontró la jornada asociada.');
                return;
            }
            const now = new Date();
            const firstMatchDate = jornada.matches.length > 0 ? new Date(jornada.matches.sort({
                "AppProvider.useCallback[handleUpdateCarton]": (a, b)=>new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            }["AppProvider.useCallback[handleUpdateCarton]"])[0].dateTime) : null;
            if (!firstMatchDate || firstMatchDate.getTime() - now.getTime() < 10 * 60 * 1000) {
                alert('El tiempo para editar este cartón ha expirado.');
                return;
            }
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('tickets').update({
                    predictions: newPredictions,
                    botin_prediction: newBotinPrediction
                }).eq('id', cartonId);
                if (error) throw error;
                showNotification('¡Cartón actualizado con éxito!');
            } catch (error) {
                showNotification(error.message || 'Error al actualizar cartón');
            }
        }
    }["AppProvider.useCallback[handleUpdateCarton]"], [
        appConfig.cartones,
        appConfig.jornadas,
        showNotification
    ]);
    const handleDeleteCarton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleDeleteCarton]": async (cartonId)=>{
            if (!window.confirm('¿Estás seguro de que deseas eliminar este cartón perdido? Esta acción no se puede deshacer.')) return;
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('tickets').delete().eq('id', cartonId);
                if (error) throw error;
                updateConfig({
                    ...appConfig,
                    cartones: appConfig.cartones.filter({
                        "AppProvider.useCallback[handleDeleteCarton]": (c)=>c.id !== cartonId
                    }["AppProvider.useCallback[handleDeleteCarton]"])
                });
                showNotification('Cartón eliminado con éxito.');
            } catch (error) {
                showNotification(error.message || 'Error al eliminar el cartón');
            }
        }
    }["AppProvider.useCallback[handleDeleteCarton]"], [
        appConfig,
        updateConfig,
        showNotification
    ]);
    const handleRequestWithdrawal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleRequestWithdrawal]": async (userId, amount, userQrCodeUrl)=>{
            const user = appConfig.users.find({
                "AppProvider.useCallback[handleRequestWithdrawal].user": (u)=>u.id === userId
            }["AppProvider.useCallback[handleRequestWithdrawal].user"]);
            if (!user) {
                alert('Error: Usuario no encontrado.');
                return;
            }
            if ((user.balance || 0) < amount) {
                alert('Error: Saldo insuficiente para realizar este retiro.');
                return;
            }
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('withdrawal_requests').insert({
                    user_id: userId,
                    amount,
                    user_qr_code_url: userQrCodeUrl
                });
                if (error) throw error;
                showNotification('Tu solicitud de retiro ha sido enviada.');
            } catch (error) {
                showNotification(error.message || 'Error al solicitar retiro');
            }
        }
    }["AppProvider.useCallback[handleRequestWithdrawal]"], [
        appConfig.users,
        showNotification
    ]);
    const handleProcessWithdrawal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleProcessWithdrawal]": async (requestId, action)=>{
            const request = appConfig.withdrawalRequests.find({
                "AppProvider.useCallback[handleProcessWithdrawal].request": (r)=>r.id === requestId
            }["AppProvider.useCallback[handleProcessWithdrawal].request"]);
            if (!request) {
                alert('Error: Solicitud no encontrada.');
                return;
            }
            if (request.status !== 'pending') {
                alert('Error: Esta solicitud ya ha sido procesada.');
                return;
            }
            try {
                const newStatus = action === 'approve' ? 'completed' : 'rejected';
                const { error: reqError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('withdrawal_requests').update({
                    status: newStatus,
                    processed_date: new Date().toISOString()
                }).eq('id', requestId);
                if (reqError) throw reqError;
                if (action === 'approve') {
                    const user = appConfig.users.find({
                        "AppProvider.useCallback[handleProcessWithdrawal].user": (u)=>u.id === request.userId
                    }["AppProvider.useCallback[handleProcessWithdrawal].user"]);
                    if (user) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                            balance: (user.balance || 0) - request.amount
                        }).eq('id', user.id);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('transactions').insert({
                            user_id: user.id,
                            amount: -request.amount,
                            type: 'withdrawal',
                            reference_id: request.id,
                            description: 'Retiro aprobado'
                        });
                    }
                }
                showNotification("La solicitud ha sido ".concat(action === 'approve' ? 'aprobada' : 'rechazada', "."));
            } catch (error) {
                showNotification(error.message || 'Error procesando solicitud');
            }
        }
    }["AppProvider.useCallback[handleProcessWithdrawal]"], [
        appConfig.withdrawalRequests,
        appConfig.users,
        showNotification
    ]);
    const handleRequestClientRecharge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleRequestClientRecharge]": async (userId, amount, proofOfPaymentUrl)=>{
            try {
                let finalProofUrl = proofOfPaymentUrl;
                if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
                    const res = await fetch(proofOfPaymentUrl);
                    const blob = await res.blob();
                    const ext = blob.type.split('/')[1] || 'jpeg';
                    const fileName = "recharges/".concat(userId, "_").concat(Date.now(), ".").concat(ext);
                    const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('tinkazo_public').upload(fileName, blob, {
                        contentType: blob.type,
                        upsert: false
                    });
                    if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
                    const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('tinkazo_public').getPublicUrl(fileName);
                    finalProofUrl = publicUrl;
                }
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recharge_requests').insert({
                    user_id: userId,
                    amount,
                    requester_role: 'client',
                    proof_of_payment_url: finalProofUrl
                });
                if (error) throw error;
                showNotification('Solicitud de recarga enviada.');
            } catch (error) {
                showNotification(error.message || 'Error al enviar recarga');
            }
        }
    }["AppProvider.useCallback[handleRequestClientRecharge]"], [
        showNotification
    ]);
    const handleRequestSellerRecharge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleRequestSellerRecharge]": async (userId, amount, proofOfPaymentUrl)=>{
            try {
                let finalProofUrl = proofOfPaymentUrl;
                if (proofOfPaymentUrl && proofOfPaymentUrl.startsWith('data:image')) {
                    const res = await fetch(proofOfPaymentUrl);
                    const blob = await res.blob();
                    const ext = blob.type.split('/')[1] || 'jpeg';
                    const fileName = "recharges/".concat(userId, "_").concat(Date.now(), ".").concat(ext);
                    const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('tinkazo_public').upload(fileName, blob, {
                        contentType: blob.type,
                        upsert: false
                    });
                    if (uploadError) throw new Error("Error subiendo imagen comprobante: " + uploadError.message);
                    const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('tinkazo_public').getPublicUrl(fileName);
                    finalProofUrl = publicUrl;
                }
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recharge_requests').insert({
                    user_id: userId,
                    amount,
                    requester_role: 'seller',
                    proof_of_payment_url: finalProofUrl
                });
                if (error) throw error;
                showNotification('Solicitud de recarga enviada al administrador.');
            } catch (error) {
                showNotification(error.message || 'Error al enviar recarga');
            }
        }
    }["AppProvider.useCallback[handleRequestSellerRecharge]"], [
        showNotification
    ]);
    const handleProcessClientRecharge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleProcessClientRecharge]": async (requestId, action, sellerId)=>{
            const request = appConfig.rechargeRequests.find({
                "AppProvider.useCallback[handleProcessClientRecharge].request": (r)=>r.id === requestId
            }["AppProvider.useCallback[handleProcessClientRecharge].request"]);
            if (!request || request.status !== 'pending') {
                alert('Error: La solicitud no es válida o ya fue procesada.');
                return;
            }
            try {
                const { error: reqError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('process_client_recharge', {
                    p_request_id: requestId,
                    p_seller_id: sellerId,
                    p_action: action
                });
                if (reqError) {
                    console.error("RPC Error:", reqError);
                    if (reqError.message.includes('Insufficient seller balance')) throw new Error('Como vendedor, no tienes saldo suficiente para aprobar esta recarga.');
                    throw new Error('Error de validación segura al verificar los saldos.');
                }
                if (action === 'approve' && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === sellerId) {
                    const { data: updatedSeller } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('balance').eq('id', sellerId).single();
                    if (updatedSeller) setCurrentUser({
                        "AppProvider.useCallback[handleProcessClientRecharge]": (prevUser)=>prevUser ? {
                                ...prevUser,
                                balance: parseFloat(updatedSeller.balance)
                            } : null
                    }["AppProvider.useCallback[handleProcessClientRecharge]"]);
                }
                showNotification("La solicitud del cliente ha sido ".concat(action === 'approve' ? 'aprobada' : 'rechazada', " exitosamente."));
            } catch (error) {
                showNotification(error.message || 'Error procesando recarga');
            }
        }
    }["AppProvider.useCallback[handleProcessClientRecharge]"], [
        appConfig.rechargeRequests,
        currentUser,
        showNotification
    ]);
    const handleProcessSellerRecharge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleProcessSellerRecharge]": async (requestId, action)=>{
            const request = appConfig.rechargeRequests.find({
                "AppProvider.useCallback[handleProcessSellerRecharge].request": (r)=>r.id === requestId
            }["AppProvider.useCallback[handleProcessSellerRecharge].request"]);
            if (!request || request.status !== 'pending') {
                alert('Error: La solicitud no es válida o ya fue procesada.');
                return;
            }
            try {
                const newStatus = action === 'approve' ? 'approved' : 'rejected';
                const { error: reqError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('recharge_requests').update({
                    status: newStatus,
                    processed_date: new Date().toISOString(),
                    processed_by: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
                }).eq('id', requestId);
                if (reqError) throw reqError;
                if (action === 'approve') {
                    const commissionPercentage = appConfig.sellerCommissionPercentage || 0;
                    const commissionAmount = request.amount * (commissionPercentage / 100);
                    const totalAmountToCredit = request.amount + commissionAmount;
                    const seller = appConfig.users.find({
                        "AppProvider.useCallback[handleProcessSellerRecharge].seller": (u)=>u.id === request.userId
                    }["AppProvider.useCallback[handleProcessSellerRecharge].seller"]);
                    if (seller) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
                            balance: (seller.balance || 0) + totalAmountToCredit
                        }).eq('id', seller.id);
                        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('transactions').insert({
                            user_id: seller.id,
                            amount: request.amount,
                            type: 'recharge',
                            reference_id: request.id,
                            description: 'Recarga aprobada por admin'
                        });
                        if (commissionAmount > 0) {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('transactions').insert({
                                user_id: seller.id,
                                amount: commissionAmount,
                                type: 'commission',
                                reference_id: request.id,
                                description: "Comisión por recarga (".concat(commissionPercentage, "%)")
                            });
                        }
                    }
                }
                showNotification("La solicitud del vendedor ha sido ".concat(action === 'approve' ? 'aprobada' : 'rechazada', "."));
            } catch (error) {
                showNotification(error.message || 'Error procesando recarga admin');
            }
        }
    }["AppProvider.useCallback[handleProcessSellerRecharge]"], [
        appConfig.rechargeRequests,
        appConfig.users,
        appConfig.sellerCommissionPercentage,
        currentUser,
        showNotification
    ]);
    const handleTransferBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[handleTransferBalance]": async (sellerId, clientId, amount)=>{
            if (amount <= 0) return;
            const seller = appConfig.users.find({
                "AppProvider.useCallback[handleTransferBalance].seller": (u)=>u.id === sellerId
            }["AppProvider.useCallback[handleTransferBalance].seller"]);
            const client = appConfig.users.find({
                "AppProvider.useCallback[handleTransferBalance].client": (u)=>u.id === clientId
            }["AppProvider.useCallback[handleTransferBalance].client"]);
            if (!seller || !client) {
                showNotification('Error: Usuario no encontrado.');
                return;
            }
            if ((seller.balance || 0) < amount) {
                showNotification('Saldo insuficiente para transferir.');
                return;
            }
            try {
                const { error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('transfer_balance', {
                    p_seller_id: sellerId,
                    p_client_id: clientId,
                    p_amount: amount
                });
                if (rpcError) throw rpcError;
                const newSellerBalance = (seller.balance || 0) - amount;
                const newClientBalance = (client.balance || 0) + amount;
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === sellerId) setCurrentUser({
                    "AppProvider.useCallback[handleTransferBalance]": (prev)=>prev ? {
                            ...prev,
                            balance: newSellerBalance
                        } : null
                }["AppProvider.useCallback[handleTransferBalance]"]);
                const newTxOut = {
                    id: "temp-".concat(Date.now(), "-out"),
                    userId: sellerId,
                    amount: -amount,
                    type: 'transfer_out',
                    description: "Transferencia manual enviada a ".concat(client.username),
                    createdAt: new Date().toISOString()
                };
                const newTxIn = {
                    id: "temp-".concat(Date.now(), "-in"),
                    userId: clientId,
                    amount: amount,
                    type: 'transfer_in',
                    description: "Transferencia manual recibida de ".concat(seller.username),
                    createdAt: new Date().toISOString()
                };
                updateConfig({
                    ...appConfig,
                    users: appConfig.users.map({
                        "AppProvider.useCallback[handleTransferBalance]": (u)=>{
                            if (u.id === sellerId) return {
                                ...u,
                                balance: newSellerBalance
                            };
                            if (u.id === clientId) return {
                                ...u,
                                balance: newClientBalance
                            };
                            return u;
                        }
                    }["AppProvider.useCallback[handleTransferBalance]"]),
                    transactions: [
                        newTxOut,
                        newTxIn,
                        ...appConfig.transactions
                    ]
                });
                showNotification("Transferencia de Bs ".concat(amount, " a ").concat(client.username, " exitosa."));
            } catch (error) {
                showNotification(error.message || 'Error al procesar la transferencia');
            }
        }
    }["AppProvider.useCallback[handleTransferBalance]"], [
        appConfig,
        currentUser,
        showNotification,
        updateConfig
    ]);
    const value = {
        appConfig,
        updateConfig,
        isLoading,
        isConfigLoaded,
        dataFetchError,
        currentUser,
        userRole,
        notification,
        setNotification,
        showNotification,
        legalModalContent,
        setLegalModalContent,
        jornadaToPlay,
        showPurchaseSheet,
        setShowPurchaseSheet,
        navigateToLogin,
        navigateToRegister,
        navigateToHome,
        navigateToAdmin,
        navigateToSellerPanel,
        navigateToPromoterPanel,
        navigateToClientPanel,
        navigateToView,
        handleAdminLogin,
        handleUserLogin,
        handleRegister,
        handleLogout,
        handleSaveConfig,
        handleUpdateUser,
        handlePlayJornada,
        handlePurchaseCarton,
        handleUpdateCarton,
        handleDeleteCarton,
        handleRequestWithdrawal,
        handleProcessWithdrawal,
        handleRequestClientRecharge,
        handleRequestSellerRecharge,
        handleProcessClientRecharge,
        handleProcessSellerRecharge,
        handleTransferBalance,
        handleLegalClick
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/context/AppContext.tsx",
        lineNumber: 964,
        columnNumber: 12
    }, this);
}
_s1(AppProvider, "MuQCDnMLwflotSE0tknrlXEW98s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$hooks$2f$useSupabaseData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSupabaseData"]
    ];
});
_c = AppProvider;
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/icons/CheckCircleIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const CheckCircleIcon = (param)=>{
    let { className = 'h-6 w-6' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/icons/CheckCircleIcon.tsx",
            lineNumber: 12,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/icons/CheckCircleIcon.tsx",
        lineNumber: 4,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CheckCircleIcon;
const __TURBOPACK__default__export__ = CheckCircleIcon;
var _c;
__turbopack_context__.k.register(_c, "CheckCircleIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$icons$2f$CheckCircleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/icons/CheckCircleIcon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const Notification = (param)=>{
    let { message, onClose } = param;
    _s();
    const [isExiting, setIsExiting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Notification.useEffect": ()=>{
            const exitTimer = setTimeout({
                "Notification.useEffect.exitTimer": ()=>{
                    setIsExiting(true);
                    const unmountTimer = setTimeout(onClose, 300); // Wait for fade-out to finish
                    return ({
                        "Notification.useEffect.exitTimer": ()=>clearTimeout(unmountTimer)
                    })["Notification.useEffect.exitTimer"];
                }
            }["Notification.useEffect.exitTimer"], 3000); // 3 seconds visible
            return ({
                "Notification.useEffect": ()=>clearTimeout(exitTimer)
            })["Notification.useEffect"];
        }
    }["Notification.useEffect"], [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-8 left-1/2 -translate-x-1/2 transform transition-all duration-300 ease-out z-50 ".concat(isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'),
        role: "alert",
        "aria-live": "assertive",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4 bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-2xl border border-gray-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$icons$2f$CheckCircleIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "h-6 w-6 text-green-400"
                }, void 0, false, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: message
                }, void 0, false, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Notification, "vtNV9DxZsgDt7gK06brhGivvR+0=");
_c = Notification;
const __TURBOPACK__default__export__ = Notification;
var _c;
__turbopack_context__.k.register(_c, "Notification");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/context/AppContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// --- SVG Icons (22px optimized) ---
const HomeIcon = (param)=>{
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 10,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "9,22 9,12 15,12 15,22"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 11,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = HomeIcon;
const TargetIcon = (param)=>{
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "6"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 18,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 19,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = TargetIcon;
const TicketIcon = (param)=>{
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 25,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 5v2"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 26,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 17v2"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 27,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 11v2"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = TicketIcon;
const UserIcon = (param)=>{
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = UserIcon;
const PlusIcon = (param)=>{
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 3,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = PlusIcon;
const NAV_ITEMS = [
    {
        id: 'home',
        label: 'Inicio',
        icon: HomeIcon
    },
    {
        id: 'jornadas',
        label: 'Jornadas',
        icon: TargetIcon
    },
    {
        id: 'play',
        label: 'JUGAR',
        icon: PlusIcon,
        isCenter: true
    },
    {
        id: 'tickets',
        label: 'Cartones',
        icon: TicketIcon
    },
    {
        id: 'profile',
        label: 'Perfil',
        icon: UserIcon
    }
];
function BottomNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { currentUser, userRole, navigateToHome, navigateToClientPanel, showPurchaseSheet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    // --- Visibility: ONLY for logged-in clients on non-panel pages ---
    const hiddenPaths = [
        '/admin',
        '/seller',
        '/promoter',
        '/login',
        '/register'
    ];
    const isClient = currentUser && userRole === 'client';
    const isOnHiddenPath = hiddenPaths.some((p)=>pathname.startsWith(p));
    if (!isClient || isOnHiddenPath || showPurchaseSheet) return null;
    // --- Active state ---
    const getIsActive = (id)=>{
        switch(id){
            case 'home':
                return pathname === '/';
            case 'jornadas':
                return false; // will link to jornadas section
            case 'tickets':
                return pathname === '/client';
            case 'profile':
                return false;
            default:
                return false;
        }
    };
    // --- Click handlers ---
    const getOnClick = (id)=>{
        switch(id){
            case 'home':
                return navigateToHome;
            case 'jornadas':
                return navigateToHome; // scrolls to jornadas on home
            case 'play':
                return navigateToHome; // opens jornada play
            case 'tickets':
                return navigateToClientPanel;
            case 'profile':
                return navigateToClientPanel;
            default:
                return navigateToHome;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed left-4 right-4 z-[999] md:left-1/2 md:-translate-x-1/2 md:max-w-[420px] md:w-full md:mx-auto",
        style: {
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.5)] h-[68px] flex items-center justify-around px-2",
            children: NAV_ITEMS.map((item)=>{
                // --- Central JUGAR button ---
                if (item.isCenter) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: getOnClick(item.id),
                        className: "flex flex-col items-center justify-center -mt-6 flex-1 min-h-0",
                        "aria-label": "Jugar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[52px] h-[52px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 ring-4 ring-slate-900 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.4),0_8px_20px_rgba(139,92,246,0.3)] flex items-center justify-center active:scale-90 transition-transform",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusIcon, {
                                    className: "w-7 h-7 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                                    lineNumber: 116,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                                lineNumber: 115,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9px] uppercase font-black tracking-widest text-cyan-400 mt-1 leading-none",
                                children: "JUGAR"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                                lineNumber: 118,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                        lineNumber: 109,
                        columnNumber: 15
                    }, this);
                }
                // --- Regular nav item ---
                const isActive = getIsActive(item.id);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: getOnClick(item.id),
                    className: "flex flex-col items-center justify-center gap-0.5 flex-1 min-h-0 transition-all duration-200 ".concat(isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'),
                    "aria-label": item.label,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                            className: "w-[22px] h-[22px]"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                            lineNumber: 138,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[9px] uppercase font-black tracking-widest leading-none",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                            lineNumber: 139,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.id, true, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
                    lineNumber: 128,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(BottomNav, "M8QOCXaEVcIkJ8QhVAluwJwoDxA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c5 = BottomNav;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "HomeIcon");
__turbopack_context__.k.register(_c1, "TargetIcon");
__turbopack_context__.k.register(_c2, "TicketIcon");
__turbopack_context__.k.register(_c3, "UserIcon");
__turbopack_context__.k.register(_c4, "PlusIcon");
__turbopack_context__.k.register(_c5, "BottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$Notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/Notification.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/BottomNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// --- Legal Modal (moved from App.tsx) ---
const LegalModal = (param)=>{
    let { content, onClose } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-800 rounded-2xl max-w-2xl w-full flex flex-col max-h-[80vh]",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "p-4 border-b border-gray-700 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold",
                            children: content.title
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                            lineNumber: 18,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "bg-gray-700 text-white rounded-full p-1.5 leading-none hover:bg-gray-600",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                            lineNumber: 19,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                    lineNumber: 17,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 overflow-y-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "whitespace-pre-wrap text-gray-300",
                        children: content.content
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                    lineNumber: 21,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "p-4 border-t border-gray-700 text-right",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "px-4 py-2 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400 transition-colors",
                        children: "Cerrar"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                    lineNumber: 24,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
            lineNumber: 13,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = LegalModal;
function AppShell(param) {
    let { children } = param;
    _s();
    const { appConfig, isConfigLoaded, notification, setNotification, legalModalContent, setLegalModalContent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const renderMainContent = ()=>{
        if (!isConfigLoaded) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#020617] flex-1 flex flex-col justify-center items-center z-50",
                children: [
                    appConfig.logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: appConfig.logoUrl,
                        alt: "Tinkazo Logo",
                        className: "h-16 w-auto mb-6 animate-pulse opacity-50 relative z-10"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 45,
                        columnNumber: 16
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mb-4 relative z-10"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 47,
                        columnNumber: 12
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-cyan-400 font-medium uppercase tracking-[0.2em] text-xs relative z-10",
                        children: "Conectando..."
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 48,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this);
        }
        return children;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#020617] flex justify-center items-center fixed inset-0 w-full h-full overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "w-full h-[100dvh] relative overflow-hidden shadow-2xl flex flex-col body-bg-space safe-top",
                style: appConfig.theme.backgroundImageUrl ? {
                    backgroundImage: "linear-gradient(to bottom, rgba(2,6,23,0.75), rgba(2,6,23,0.85)), url(".concat(appConfig.theme.backgroundImageUrl, ")"),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                } : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto no-scrollbar relative overscroll-none",
                        children: renderMainContent()
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    legalModalContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LegalModal, {
                        content: legalModalContent,
                        onClose: ()=>setLegalModalContent(null)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 70,
                        columnNumber: 31
                    }, this),
                    notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$Notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        message: notification,
                        onClose: ()=>setNotification(null)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                        lineNumber: 71,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/AppShell.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(AppShell, "c/nHtBCfeWW1MT15GLbUUu4+CYQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c1 = AppShell;
var _c, _c1;
__turbopack_context__.k.register(_c, "LegalModal");
__turbopack_context__.k.register(_c1, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PWAUpdater
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function PWAUpdater() {
    _s();
    const [showUpdate, setShowUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [registration, setRegistration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PWAUpdater.useEffect": ()=>{
            if ("object" === 'undefined' || !('serviceWorker' in navigator)) return;
            navigator.serviceWorker.register('/sw.js').then({
                "PWAUpdater.useEffect": (reg)=>{
                    console.log('[PWA] Service Worker registered:', reg.scope);
                    setRegistration(reg);
                    // Check for updates periodically
                    setInterval({
                        "PWAUpdater.useEffect": ()=>{
                            reg.update();
                        }
                    }["PWAUpdater.useEffect"], 60 * 60 * 1000); // Every hour
                    reg.addEventListener('updatefound', {
                        "PWAUpdater.useEffect": ()=>{
                            const newWorker = reg.installing;
                            if (!newWorker) return;
                            newWorker.addEventListener('statechange', {
                                "PWAUpdater.useEffect": ()=>{
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New version available
                                        setShowUpdate(true);
                                    }
                                }
                            }["PWAUpdater.useEffect"]);
                        }
                    }["PWAUpdater.useEffect"]);
                }
            }["PWAUpdater.useEffect"]).catch({
                "PWAUpdater.useEffect": (err)=>{
                    console.error('[PWA] SW registration failed:', err);
                }
            }["PWAUpdater.useEffect"]);
        }
    }["PWAUpdater.useEffect"], []);
    const handleUpdate = ()=>{
        if (registration === null || registration === void 0 ? void 0 : registration.waiting) {
            registration.waiting.postMessage({
                type: 'SKIP_WAITING'
            });
        }
        setShowUpdate(false);
        window.location.reload();
    };
    if (!showUpdate) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-4 left-4 right-4 z-[9999] flex justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-card rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl max-w-md w-full border border-cyan-500/30",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white font-semibold text-sm",
                            children: "¡Nueva versión disponible!"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-xs",
                            children: "Actualiza para obtener las últimas mejoras."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleUpdate,
                    className: "btn-gradient px-4 py-2 rounded-lg text-white font-bold text-sm whitespace-nowrap",
                    children: "Actualizar"
                }, void 0, false, {
                    fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/components/PWAUpdater.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(PWAUpdater, "/fjtVSqsxvIcn15NHZp9S/XuiM0=");
_c = PWAUpdater;
var _c;
__turbopack_context__.k.register(_c, "PWAUpdater");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_tinkazo-main%20%281%29_tinkazo-main_62be1ac7._.js.map