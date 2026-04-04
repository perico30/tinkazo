const startDateStr = "2026-03-20"
const endDateStr = "2026-04-02"
const URL = `https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetHighlights?timezoneOffset=240&langId=4&skinName=doradobet&configId=12&culture=es-ES&countryCode=VE&deviceType=Desktop&numformat=en&integration=doradobet&sportId=66&showAllEvents=false&startDate=${startDateStr}T00:00:00.000Z&endDate=${endDateStr}T23:59:59.000Z`

// Test corsproxy.io
console.log("Testing corsproxy.io...");
fetch(`https://corsproxy.io/?${encodeURIComponent(URL)}`)
  .then(res => res.text())
  .then(text => {
     console.log("CORS Proxy length:", text.length);
     try {
         const obj = JSON.parse(text);
         if(obj.Result) console.log("CORS Proxy SUCCESS");
     } catch(e) { console.log("CORS Proxy failed to parse JSON"); }
  }).catch(e => console.log("CORS Proxy Network error:", e));

// Test allorigins raw
console.log("Testing allorigins raw...");
fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(URL)}`)
  .then(res => res.text())
  .then(text => {
     console.log("AllOrigins Raw length:", text.length);
     try {
         const obj = JSON.parse(text);
         if(obj.Result) console.log("AllOrigins Raw SUCCESS");
     } catch(e) { console.log("AllOrigins Raw failed to parse JSON", text.substring(0, 50)); }
  }).catch(e => console.log("AllOrigins Raw Network error:", e));
