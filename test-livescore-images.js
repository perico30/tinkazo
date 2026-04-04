const url = `https://prod-public-api.livescore.com/v1/api/app/date/soccer/20260320/-4`;
fetch(url)
  .then(res => res.json())
  .then(data => {
      const ev = data.Stages[0].Events[0];
      console.log("Team 1:", JSON.stringify(ev.T1, null, 2));
      console.log("Team 2:", JSON.stringify(ev.T2, null, 2));
  });
