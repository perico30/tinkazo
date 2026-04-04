const url = 'https://www.escudosdefutbolyequipaciones.com/?s=Real+Madrid';
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

try {
  fetch(proxyUrl)
    .then(r => r.json())
    .then(data => {
      const html = data.contents;
      // the teams are usually inside a div with class "post-thumbnail" or "attachment-post-thumbnail"
      const match = html.match(/<img[^>]+src="([^">]+)"[^>]*class="[^"]*wp-post-image/i) 
                 || html.match(/<img[^>]+src="([^">]+)"[^>]*class="[^"]*attachment-medium/i)
                 || html.match(/<img[^>]+src="([^">]+)"[^>]*alt="Real Madrid/i);
      
      console.log('Result:', match ? match[1] : 'Not Found');
    });
} catch(e) {
  console.error(e);
}
