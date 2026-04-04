const url = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Real%20Madrid';

try {
  fetch(url).then(r => r.json()).then(data => {
     if (data.teams && data.teams.length > 0) {
       console.log('Logo URL:', data.teams[0].strTeamBadge);
     } else {
       console.log('No team found');
     }
  });
} catch(e) {
  console.error(e);
}
