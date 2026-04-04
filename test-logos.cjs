const https = require('https');

const teamId = '1112508'; // From test-api.js (Real Madrid example)
const url1 = `https://ls.sir.sportradar.com/sportradar/en/team/logo/${teamId}`;
const url2 = `https://media.api-sports.io/football/teams/${teamId.substring(0, 4)}.png`;

https.get(url1, (res) => {
  console.log('SportRadar Status:', res.statusCode);
});

https.get(url2, (res) => {
  console.log('API-Sports Status:', res.statusCode);
});
