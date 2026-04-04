const url = 'https://www.escudosdefutbolyequipaciones.com/?s=Real+Madrid';

try {
  fetch(url).then(r => r.text()).then(html => {
     console.log('HTML Length:', html.length);
     // Look for image regex
     const imgMatches = html.match(/<img[^>]+src="([^">]+)"/g);
     if (imgMatches) {
       console.log('Images found:', imgMatches.slice(0, 5));
     }
  });
} catch(e) {
  console.error(e);
}
