// utils/apiDeportes.ts
export interface ExternalMatch {
  id: string;
  name: string;
  startDate: string;
  team1: { id: string; name: string };
  team2: { id: string; name: string };
  competitionName: string;
  countryName: string;
  logo1?: string;
  logo2?: string;
  status?: string;
  score1?: number;
  score2?: number;
}

export const normalizeTeamName = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export const isMatchMatch = (
    apiId: string, apiLocalNm: string, apiVisitorNm: string, 
    myId: string, myLocalNm?: string, myVisitorNm?: string
) => {
    if (apiId === myId) return true;
    if (!myLocalNm || !myVisitorNm) return false;
    const aLocal = normalizeTeamName(apiLocalNm);
    const aVisitor = normalizeTeamName(apiVisitorNm);
    const mLocal = normalizeTeamName(myLocalNm);
    const mVisitor = normalizeTeamName(myVisitorNm);
    return (aLocal.includes(mLocal) || mLocal.includes(aLocal)) &&
           (aVisitor.includes(mVisitor) || mVisitor.includes(aVisitor));
};

const generateDatesInRange = (startStr: string, endStr: string): string[] => {
    const dates: string[] = [];
    const current = new Date(`${startStr}T00:00:00`);
    const end = new Date(`${endStr}T23:59:59`);
    
    while (current <= end) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        dates.push(`${yyyy}${mm}${dd}`);
        current.setDate(current.getDate() + 1);
    }
    // Límite de 15 días de consulta a la vez
    return dates.slice(0, 15);
};

const parseLiveScoreResponse = (data: any): ExternalMatch[] => {
    const matches: ExternalMatch[] = [];
    if (!data || !data.Stages) return matches;

    const now = new Date();

    data.Stages.forEach((stage: any) => {
        const country = stage.Cnm || stage.Snm || 'Internacional';
        const league = stage.Snm || 'Liga';
        
        const events = stage.Events || [];
        events.forEach((ev: any) => {
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
                team1: { id: ev.T1[0].ID || ev.T1[0].Nm, name: ev.T1[0].Nm },
                team2: { id: ev.T2[0].ID || ev.T2[0].Nm, name: ev.T2[0].Nm },
                competitionName: league,
                countryName: country,
                logo1: ev.T1[0].Img ? `https://lsm-static-prod.livescore.com/medium/${ev.T1[0].Img}` : undefined,
                logo2: ev.T2[0].Img ? `https://lsm-static-prod.livescore.com/medium/${ev.T2[0].Img}` : undefined,
                status: ev.Eps, // 'FT', 'AET', etc.
                score1: ev.Tr1 ? parseInt(ev.Tr1) : 0,
                score2: ev.Tr2 ? parseInt(ev.Tr2) : 0,
            });
        });
    });
    return matches;
};

export const fetchLiveScoreEvents = async (startDateStr?: string, endDateStr?: string): Promise<ExternalMatch[]> => {
    try {
        if (!startDateStr || !endDateStr) {
            const d = new Date();
            startDateStr = d.toISOString().split('T')[0];
            endDateStr = startDateStr;
        }

        const dates = generateDatesInRange(startDateStr, endDateStr);
        const allMatches: ExternalMatch[] = [];

        const promises = dates.map(async (dateStr) => {
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
        results.forEach(r => allMatches.push(...r));

        return allMatches;
    } catch (e) {
        console.error("Error fetching LiveScore:", e);
        return [];
    }
};

export const searchLiveScoreEvents = async (query: string, startDateStr?: string, endDateStr?: string): Promise<ExternalMatch[]> => {
    const events = await fetchLiveScoreEvents(startDateStr, endDateStr);
    if (!query) return events;
    const q = query.toLowerCase();
    return events.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.countryName.toLowerCase().includes(q) ||
        e.competitionName.toLowerCase().includes(q)
    );
};

export const fetchMatchResult = async (matchId: string, matchDateIso: string, localTeamName?: string, visitorTeamName?: string): Promise<{score1: number, score2: number, status: string} | null> => {
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

    for (const proxiedUrl of proxies) {
        try {
            const res = await fetch(proxiedUrl);
            if(!res.ok) {
                 console.warn(`Proxy failed: ${proxiedUrl} with status ${res.status}`);
                 continue; // Intentar el siguiente proxy
            }
            const textResponse = await res.text();
            
            // Validar que realmente sea JSON y no un HTML captcha/error
            if(textResponse.startsWith('<')) {
                 console.warn(`Proxy returned HTML instead of JSON: ${proxiedUrl}`);
                 continue; // Intentar el siguiente proxy
            }

            const data = JSON.parse(textResponse);
            
            for (const stage of (data.Stages || [])) {
                for (const ev of (stage.Events || [])) {
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
