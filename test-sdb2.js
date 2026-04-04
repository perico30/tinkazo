const url = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Real%20Madrid';

try {
  fetch(url).then(r => r.json()).then(data => {
     if (data.teams && data.teams.length > 0) {
       console.log('Keys:', Object.keys(data.teams[0]).filter(k => k.includes('Badge') || k.includes('Logo')));
       console.log('Badge:', data.teams[0].strBadge);
     } else {
       console.log('No team found');
     }
  });
} catch(e) {
  console.error(e);
}
