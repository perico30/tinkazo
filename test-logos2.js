const checkLogo = async (teamId) => {
  const urls = [
    `https://ls.sir.sportradar.com/sportradar/en/team/logo/${teamId}`,
    `https://sb2img.altenar2.com/teams/${teamId}.png`,
    `https://content.doradobet.com/images/teams/${teamId}.png`,
    `https://s3.eu-west-1.amazonaws.com/cdn.livesport.com/team_logos/${teamId}.png`,
    `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetTeamImage?teamId=${teamId}`
  ];

  for(const url of urls) {
     try {
       const res = await fetch(url);
       console.log(url);
       console.log(' -> OK?', res.ok, 'Status:', res.status, 'Final URL:', res.url);
     } catch(e) {
       console.log(url, 'Error');
     }
  }
}
checkLogo('1112508');
