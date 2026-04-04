const fetchItSearch = async (query, startDateStr, endDateStr) => {
    const params = `timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet`;
    const url = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/SearchEvents?${params}&str=${encodeURIComponent(query)}&startDate=${startDateStr}T00:00:00.000Z&endDate=${endDateStr}T23:59:59.000Z`;

    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        const events = data?.Result?.EventItems || [];
        console.log(`Search: "${query}", Found ${events.length} events.`);
        if(events.length > 0) {
           console.log(`First event date: ${events[0].EventDate || events[0].StartDate}`);
           console.log(`Last event date: ${events[events.length-1].EventDate || events[events.length-1].StartDate}`);
        }
    } catch(e) {
        console.log(`Error: ${e.message}`);
    }
}

(async () => {
    // Buscar sin restricción de dos días
    await fetchItSearch("Liga", "2026-03-25", "2026-04-05");
    await fetchItSearch("FC", "2026-03-25", "2026-04-05");
    await fetchItSearch("a", "2026-03-25", "2026-04-05");
})();
