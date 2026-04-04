const fetchLiveScore = async (dateStr) => {
    // dateStr format: YYYYMMDD
    const url = `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dateStr}/-4`;
    // -4 is timezone offset roughly for Venezuela/USA East
    console.log("Fetching:", url);
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const stages = data.Stages || [];
        let totalMatches = 0;
        stages.forEach(stage => {
            totalMatches += (stage.Events || []).length;
        });
        console.log(`LiveScore ${dateStr}: Found ${totalMatches} events across ${stages.length} leagues/stages.`);
        if (totalMatches > 0 && stages[0].Events.length > 0) {
            const ev = stages[0].Events[0];
            console.log(`Sample Event: ${ev.T1[0].Nm} vs ${ev.T2[0].Nm} at ${ev.Esd}`);
        }
    } catch(e) {
        console.error("LiveScore Error:", e.message);
    }
}

(async () => {
    // Tomorrow
    await fetchLiveScore("20260321");
    // Next week
    await fetchLiveScore("20260328");
    // 2 weeks
    await fetchLiveScore("20260404");
})();
