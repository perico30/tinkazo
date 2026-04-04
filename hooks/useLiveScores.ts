import { useState, useEffect } from 'react';
import { fetchLiveScoreEvents, ExternalMatch } from '../utils/apiDeportes';

export const useLiveScores = () => {
    const [liveEvents, setLiveEvents] = useState<ExternalMatch[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const d = new Date();
            const today = d.toISOString().split('T')[0];
            const yesterdayDate = new Date(d);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toISOString().split('T')[0];
            
            const events = await fetchLiveScoreEvents(yesterday, today);
            setLiveEvents(events);
        } catch (e) {
            console.error('Error in useLiveScores', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // Option to refresh periodically
        const interval = setInterval(fetchEvents, 3 * 60 * 1000); // 3 minutes
        return () => clearInterval(interval);
    }, []);

    return { liveEvents, loading, refetch: fetchEvents };
};
