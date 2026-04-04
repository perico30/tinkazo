const params = `timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet`;

(async () => {
    // 1. Fetch Sports to get Categories for Soccer (66)
    const sportsUrl = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetSports?${params}`;
    console.log("Fetching Sports:", sportsUrl.split('?')[0]);
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(sportsUrl)}`);
        const data = await res.json();
        
        const soccer = data.Result?.Items?.find(s => s.Id === 66);
        if (!soccer) {
            console.log("Soccer not found in GetSports");
            return;
        }

        const catIds = soccer.Categories.map(c => c.Id).slice(0, 10).join(','); // just take first 10 categories to test
        console.log("Soccer Categories sample:", catIds);

        const eventsUrl = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetEvents?catIds=${catIds}&${params}&startDate=2026-03-20T00:00:00.000Z&endDate=2026-04-05T23:59:59.000Z`;
        console.log("Fetching Events:", eventsUrl.split('?')[0]);
        
        const res2 = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(eventsUrl)}`);
        const data2 = await res2.json();
        console.log("GetEvents returned items:", data2.Result?.Items?.length);
        if (data2.Result?.Items) {
            const events = data2.Result.Items.flatMap(i => i.Events || []);
            console.log("Total events:", events.length);
            if(events.length > 0) {
               console.log("Sample event date:", events[0].StartDate);
               console.log("Last event date:", events[events.length-1].StartDate);
            }
        }
    } catch(e) {
        console.error(e);
    }
})();
