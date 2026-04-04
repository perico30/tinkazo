const params = `timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet&sportId=66`;

const checkDate = async (dateStr) => {
    // startDate and endDate same day
    const url = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetHighlights?${params}&showAllEvents=false&startDate=${dateStr}T00:00:00.000Z&endDate=${dateStr}T23:59:59.000Z`;
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        let events = 0;
        if (data.Result?.Items?.length) {
            events = data.Result.Items[0]?.Events?.length || 0;
        }
        console.log(`Date: ${dateStr} - Found ${events} events`);
    } catch(e) {
        console.log(`Date: ${dateStr} - Error`);
    }
}

(async () => {
    await checkDate("2026-03-20");
    await checkDate("2026-03-21");
    await checkDate("2026-03-22");
    await checkDate("2026-03-23");
    await checkDate("2026-03-24");
    await checkDate("2026-03-25");
})();
