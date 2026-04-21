module.exports = [
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/utils/apiDeportes.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/apiDeportes.ts
__turbopack_context__.s([
    "fetchLiveScoreEvents",
    ()=>fetchLiveScoreEvents,
    "fetchMatchResult",
    ()=>fetchMatchResult,
    "isMatchMatch",
    ()=>isMatchMatch,
    "normalizeTeamName",
    ()=>normalizeTeamName,
    "searchLiveScoreEvents",
    ()=>searchLiveScoreEvents
]);
const normalizeTeamName = (s)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const isMatchMatch = (apiId, apiLocalNm, apiVisitorNm, myId, myLocalNm, myVisitorNm, apiDate, myDate)=>{
    if (apiId === myId) return true;
    if (!myLocalNm || !myVisitorNm) return false;
    if (apiDate && myDate) {
        const t1 = new Date(apiDate).getTime();
        const t2 = new Date(myDate).getTime();
        // Diferencia mayor a 48 horas significa que no es el mismo partido
        if (Math.abs(t1 - t2) > 48 * 60 * 60 * 1000) return false;
    }
    const aLocal = normalizeTeamName(apiLocalNm);
    const aVisitor = normalizeTeamName(apiVisitorNm);
    const mLocal = normalizeTeamName(myLocalNm);
    const mVisitor = normalizeTeamName(myVisitorNm);
    return (aLocal.includes(mLocal) || mLocal.includes(aLocal)) && (aVisitor.includes(mVisitor) || mVisitor.includes(aVisitor));
};
const generateDatesInRange = (startStr, endStr)=>{
    const dates = [];
    const current = new Date(`${startStr}T00:00:00`);
    const end = new Date(`${endStr}T23:59:59`);
    while(current <= end){
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        dates.push(`${yyyy}${mm}${dd}`);
        current.setDate(current.getDate() + 1);
    }
    // Límite de 15 días de consulta a la vez
    return dates.slice(0, 15);
};
const parseLiveScoreResponse = (data)=>{
    const matches = [];
    if (!data || !data.Stages) return matches;
    const now = new Date();
    data.Stages.forEach((stage)=>{
        const country = stage.Cnm || stage.Snm || 'Internacional';
        const league = stage.Snm || 'Liga';
        const events = stage.Events || [];
        events.forEach((ev)=>{
            if (!ev.Esd || !ev.T1 || !ev.T2) return;
            const dateStr = ev.Esd.toString();
            // LiveScore Date Format: YYYYMMDDHHmmss
            const y = dateStr.slice(0, 4);
            const m = dateStr.slice(4, 6);
            const d = dateStr.slice(6, 8);
            const H = dateStr.slice(8, 10);
            const M = dateStr.slice(10, 12);
            const s = dateStr.slice(12, 14);
            // Asume horario local del navegador al parsear sin Z
            const isoString = `${y}-${m}-${d}T${H}:${M}:${s}`;
            const matchDate = new Date(isoString);
            matches.push({
                id: ev.Eid,
                name: `${ev.T1[0].Nm} vs ${ev.T2[0].Nm}`,
                startDate: matchDate.toISOString(),
                team1: {
                    id: ev.T1[0].ID || ev.T1[0].Nm,
                    name: ev.T1[0].Nm
                },
                team2: {
                    id: ev.T2[0].ID || ev.T2[0].Nm,
                    name: ev.T2[0].Nm
                },
                competitionName: league,
                countryName: country,
                logo1: ev.T1[0].Img ? `https://lsm-static-prod.livescore.com/medium/${ev.T1[0].Img}` : undefined,
                logo2: ev.T2[0].Img ? `https://lsm-static-prod.livescore.com/medium/${ev.T2[0].Img}` : undefined,
                status: ev.Eps,
                score1: ev.Tr1 ? parseInt(ev.Tr1) : 0,
                score2: ev.Tr2 ? parseInt(ev.Tr2) : 0
            });
        });
    });
    return matches;
};
const fetchLiveScoreEvents = async (startDateStr, endDateStr)=>{
    try {
        if (!startDateStr || !endDateStr) {
            const d = new Date();
            startDateStr = d.toISOString().split('T')[0];
            endDateStr = startDateStr;
        }
        const dates = generateDatesInRange(startDateStr, endDateStr);
        const allMatches = [];
        const promises = dates.map(async (dateStr)=>{
            const url = `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/-4`;
            const proxiedUrl = `https://api.codetabs.com/v1/proxy?quest=${url}`;
            try {
                const res = await fetch(proxiedUrl);
                if (!res.ok) return [];
                const data = await res.json();
                return parseLiveScoreResponse(data);
            } catch (err) {
                return [];
            }
        });
        const results = await Promise.all(promises);
        results.forEach((r)=>allMatches.push(...r));
        return allMatches;
    } catch (e) {
        console.error("Error fetching LiveScore:", e);
        return [];
    }
};
const searchLiveScoreEvents = async (query, startDateStr, endDateStr)=>{
    const events = await fetchLiveScoreEvents(startDateStr, endDateStr);
    if (!query) return events;
    const q = query.toLowerCase();
    return events.filter((e)=>e.name.toLowerCase().includes(q) || e.countryName.toLowerCase().includes(q) || e.competitionName.toLowerCase().includes(q));
};
const fetchMatchResult = async (matchId, matchDateIso, localTeamName, visitorTeamName)=>{
    const d = new Date(matchDateIso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
    const url = `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/-4`;
    const cb = Date.now();
    // Lista de proxies de respaldo por si el principal falla
    const proxies = [
        `https://api.codetabs.com/v1/proxy?quest=${url}&_cb=${cb}`,
        `https://corsproxy.io/?${encodeURIComponent(url + '?_cb=' + cb)}`,
        `https://thingproxy.freeboard.io/fetch/${url}`
    ];
    for (const proxiedUrl of proxies){
        try {
            const res = await fetch(proxiedUrl);
            if (!res.ok) {
                console.warn(`Proxy failed: ${proxiedUrl} with status ${res.status}`);
                continue; // Intentar el siguiente proxy
            }
            const textResponse = await res.text();
            // Validar que realmente sea JSON y no un HTML captcha/error
            if (textResponse.startsWith('<')) {
                console.warn(`Proxy returned HTML instead of JSON: ${proxiedUrl}`);
                continue; // Intentar el siguiente proxy
            }
            const data = JSON.parse(textResponse);
            for (const stage of data.Stages || []){
                for (const ev of stage.Events || []){
                    if (isMatchMatch(ev.Eid, ev.T1[0].Nm, ev.T2[0].Nm, matchId, localTeamName, visitorTeamName)) {
                        return {
                            score1: parseInt(ev.Tr1 || '0'),
                            score2: parseInt(ev.Tr2 || '0'),
                            status: ev.Eps // 'FT'=Terminado, 'HT'=MedioTiempo, 'NS'=NoComenzado
                        };
                    }
                }
            }
            // Si llega aquí, descargó bien el JSON pero no encontró el partido.
            console.warn(`Partido ${matchId} no encontrado en la respuesta del día ${dateStr}.`);
            return null; // El partido no está en este día local.
        } catch (err) {
            console.error(`Error with proxy ${proxiedUrl}:`, err);
        // continua al siguiente proxy
        }
    }
    console.error("Todos los proxies fallaron al obtener el resultado para el partido:", matchId);
    return null;
};
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/utils/logoMatcher.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findLocalLogo",
    ()=>findLocalLogo,
    "loadEscudosIndex",
    ()=>loadEscudosIndex,
    "normalizeTeamName",
    ()=>normalizeTeamName
]);
let escudosCache = null;
let escudosPromise = null;
const loadEscudosIndex = async ()=>{
    if (escudosCache) return escudosCache;
    if (escudosPromise) return escudosPromise;
    escudosPromise = fetch('/escudosIndex.json').then((res)=>{
        if (!res.ok) throw new Error("No se pudo cargar el índice de escudos");
        return res.json();
    }).then((data)=>{
        escudosCache = data;
        return data;
    });
    return escudosPromise;
};
const normalizeTeamName = (name)=>{
    let clean = name.toUpperCase()// Remover acentos
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")// Remover caracteres no alfanuméricos
    .replace(/[^A-Z0-9 ]/g, " ").trim();
    // Prefijos típicos de clubes
    const prefixes = [
        "C ATLETICO Y SOCIAL",
        "C ATLETICO Y S",
        "C ATLETICO Y D",
        "C S C D",
        "C S Y D",
        "C ATLETICO",
        "C S D",
        "C D S C",
        "C D S",
        "C C D",
        "A D",
        "C D",
        "C S",
        "C U",
        "AS ATLETICA",
        "SDAD",
        "ASOC",
        "CLUB",
        "CA",
        "CS",
        "CD"
    ];
    // Sufijos
    const suffixes = [
        "F C",
        "FC",
        "C F",
        "A C",
        "S C",
        "S A",
        "S D",
        "A C",
        "M Y S",
        "S Y D"
    ];
    // Remover prefijos
    for (const p of prefixes){
        if (clean.startsWith(p + " ")) {
            clean = clean.substring(p.length + 1).trim();
            break; // remove first match and stop
        }
    }
    // Remover sufijos
    for (const s of suffixes){
        if (clean.endsWith(" " + s)) {
            clean = clean.substring(0, clean.length - s.length - 1).trim();
            break; // remove first match and stop
        }
    }
    // Quitar la palabra ATLETICO, DEPORTIVO, etc. si queda colgada
    clean = clean.replace(/\b(ATLETICO|ATLETICA|DEPORTIVO|SPORTIVO|SPORTING|ASOCIACION)\b/g, "").trim();
    // Espacios múltiples a simples
    clean = clean.replace(/\s+/g, ' ');
    return clean;
};
const findLocalLogo = async (teamName)=>{
    try {
        const index = await loadEscudosIndex();
        const targetClean = normalizeTeamName(teamName);
        if (!targetClean) return null;
        // 1. Coincidencia exacta Limpia
        let match = index.find((e)=>normalizeTeamName(e.name) === targetClean);
        if (match) return match.path;
        // 2. Coincidencia parcial (e.g., "RACING" vs "RACING C DE TRELEW")
        match = index.find((e)=>{
            const indexClean = normalizeTeamName(e.name);
            if (indexClean.length < 3 || targetClean.length < 3) return false; // evitar short falsos
            // Chequear si uno está contenido dentro del otro
            return indexClean.includes(targetClean) || targetClean.includes(indexClean);
        });
        if (match) return match.path;
        return null;
    } catch (err) {
        console.error("Error buscando logo local:", err);
        return null;
    }
};
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/hooks/useLiveScores.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLiveScores",
    ()=>useLiveScores
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$utils$2f$apiDeportes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/utils/apiDeportes.ts [app-ssr] (ecmascript)");
;
;
// Caché global en memoria para evitar que la interfaz parpadee o borre resultados
let globalLiveEventsCache = [];
let isFetching = false;
let lastFetchTime = 0;
const useLiveScores = ()=>{
    const [liveEvents, setLiveEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(globalLiveEventsCache);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(globalLiveEventsCache.length === 0);
    const fetchEvents = async ()=>{
        // Obtenemos los eventos. Si está en caché y hace menos de 10 segundos, no solicitamos de nuevo la API de inmediato.
        const now = Date.now();
        if (globalLiveEventsCache.length > 0 && now - lastFetchTime < 10000) {
            setLiveEvents(globalLiveEventsCache);
            setLoading(false);
            return;
        }
        if (isFetching) return;
        isFetching = true;
        // Si no hay información pre-cargada establecemos loading true para la 1ra vez
        if (globalLiveEventsCache.length === 0) setLoading(true);
        try {
            const d = new Date();
            const today = d.toISOString().split('T')[0];
            const pastDate = new Date(d);
            pastDate.setDate(pastDate.getDate() - 4); // Consultar hasta 4 días atrás
            const startStr = pastDate.toISOString().split('T')[0];
            const events = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$utils$2f$apiDeportes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLiveScoreEvents"])(startStr, today);
            globalLiveEventsCache = events;
            lastFetchTime = Date.now();
            setLiveEvents(events);
        } catch (e) {
            console.error('Error in useLiveScores', e);
        } finally{
            setLoading(false);
            isFetching = false;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchEvents();
        // Recargar periódicamente en segundo plano
        const interval = setInterval(fetchEvents, 3 * 60 * 1000); // 3 minutes
        return ()=>clearInterval(interval);
    }, []);
    return {
        liveEvents,
        loading,
        refetch: fetchEvents
    };
};
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/constants/countries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNTRIES",
    ()=>COUNTRIES
]);
const COUNTRIES = [
    {
        code: 'AR',
        name: 'Argentina'
    },
    {
        code: 'BO',
        name: 'Bolivia'
    },
    {
        code: 'BR',
        name: 'Brazil'
    },
    {
        code: 'CL',
        name: 'Chile'
    },
    {
        code: 'CO',
        name: 'Colombia'
    },
    {
        code: 'CR',
        name: 'Costa Rica'
    },
    {
        code: 'CU',
        name: 'Cuba'
    },
    {
        code: 'EC',
        name: 'Ecuador'
    },
    {
        code: 'SV',
        name: 'El Salvador'
    },
    {
        code: 'ES',
        name: 'España'
    },
    {
        code: 'US',
        name: 'Estados Unidos'
    },
    {
        code: 'GT',
        name: 'Guatemala'
    },
    {
        code: 'HN',
        name: 'Honduras'
    },
    {
        code: 'MX',
        name: 'México'
    },
    {
        code: 'NI',
        name: 'Nicaragua'
    },
    {
        code: 'PA',
        name: 'Panamá'
    },
    {
        code: 'PY',
        name: 'Paraguay'
    },
    {
        code: 'PE',
        name: 'Perú'
    },
    {
        code: 'PR',
        name: 'Puerto Rico'
    },
    {
        code: 'DO',
        name: 'República Dominicana'
    },
    {
        code: 'UY',
        name: 'Uruguay'
    },
    {
        code: 'VE',
        name: 'Venezuela'
    }
];
}),
"[project]/Downloads/tinkazo-main (1)/tinkazo-main/src/app/admin/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$views$2f$AdminPage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/tinkazo-main (1)/tinkazo-main/views/AdminPage.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function AdminRoute() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$tinkazo$2d$main__$28$1$292f$tinkazo$2d$main$2f$views$2f$AdminPage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        initialConfig: ctx.appConfig,
        onSave: ctx.handleSaveConfig,
        onLogout: ctx.handleLogout,
        onExit: ctx.navigateToHome,
        onProcessWithdrawal: ctx.handleProcessWithdrawal,
        onProcessSellerRecharge: ctx.handleProcessSellerRecharge,
        dataFetchError: ctx.dataFetchError
    }, void 0, false, {
        fileName: "[project]/Downloads/tinkazo-main (1)/tinkazo-main/src/app/admin/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Downloads_tinkazo-main%20%281%29_tinkazo-main_0348f597._.js.map