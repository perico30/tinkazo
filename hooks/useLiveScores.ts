import { useState, useEffect } from 'react';
import { fetchLiveScoreEvents, ExternalMatch } from '../utils/apiDeportes';

// Caché global en memoria para evitar que la interfaz parpadee o borre resultados
let globalLiveEventsCache: ExternalMatch[] = [];
let isFetching = false;
let lastFetchTime = 0;

export const useLiveScores = () => {
    const [liveEvents, setLiveEvents] = useState<ExternalMatch[]>(globalLiveEventsCache);
    const [loading, setLoading] = useState(globalLiveEventsCache.length === 0);

    const fetchEvents = async () => {
        // Obtenemos los eventos. Si está en caché y hace menos de 10 segundos, no solicitamos de nuevo la API de inmediato.
        const now = Date.now();
        if (globalLiveEventsCache.length > 0 && (now - lastFetchTime) < 10000) {
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
            
            const events = await fetchLiveScoreEvents(startStr, today);
            globalLiveEventsCache = events;
            lastFetchTime = Date.now();
            setLiveEvents(events);
        } catch (e) {
            console.error('Error in useLiveScores', e);
        } finally {
            setLoading(false);
            isFetching = false;
        }
    };

    useEffect(() => {
        fetchEvents();
        // Recargar periódicamente en segundo plano
        const interval = setInterval(fetchEvents, 3 * 60 * 1000); // 3 minutes
        return () => clearInterval(interval);
    }, []);

    return { liveEvents, loading, refetch: fetchEvents };
};
