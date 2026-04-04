const url = 'https://sb2frontend-altenar2.biahosted.com/api/SportsBook/SearchEvents?timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet&str=madrid';

try {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Data:', text.substring(0, 200));
} catch (e) {
  console.error(e);
}
