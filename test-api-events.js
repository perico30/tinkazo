const startDateStr = "2026-03-20"
const endDateStr = "2026-04-02"

const fetchIt = async (url) => {
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        let events = [];
        if (data.Result?.Items) {
            events = data.Result.Items[0]?.Events || [];
        } else if (data.Result?.EventItems) {
            events = data.Result.EventItems;
        }else if (data.Result?.Items?.length) {
            // for GetEvents it might be nested
            events = data.Result.Items.flatMap(i => i.Events || []);
        }

        console.log(`URL: ${url.split('?')[0].split('/').pop()}`);
        console.log(`Found ${events.length} events.`);
        if(events.length > 0) {
           console.log(`First event date: ${events[0].EventDate || events[0].StartDate}`);
           console.log(`Last event date: ${events[events.length-1].EventDate || events[events.length-1].StartDate}`);
        }
    } catch(e) {
        console.log(`Error on ${url.split('?')[0]}: ${e.message}`);
    }
}

const params = `timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet&sportId=66`;

const u1 = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetHighlights?${params}&showAllEvents=true&startDate=${startDateStr}T00:00:00.000Z&endDate=${endDateStr}T23:59:59.000Z&count=1000`;
const u2 = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetEvents?${params}&startDate=${startDateStr}T00:00:00.000Z&endDate=${endDateStr}T23:59:59.000Z&count=1000`;
const u3 = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetHighlights?${params}&showAllEvents=false&startDate=${startDateStr}T00:00:00.000Z&endDate=${endDateStr}T23:59:59.000Z`;

(async () => {
    console.log("Testing u1 (GetHighlights showAllEvents=true + count=1000):");
    await fetchIt(u1);
    console.log("Testing u2 (GetEvents):");
    await fetchIt(u2);
    console.log("Testing u3 (current config):");
    await fetchIt(u3);
})();
