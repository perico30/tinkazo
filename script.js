const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // En AdminCartonesTab la condicion vieja (con (() => { ... })() : null)
  content = content.replace(/\{\(typeof carton\.hits === 'number' \|\| jornada\?\.status === 'en_juego' \|\| liveHits > 0 \|\| misses > 0\) \? \(\(\) => \{[\s\S]*?\}\)\(\) : (null|\(\s*<span className="text-gray-500 text-xs">-<\/span>\s*\))\}/g,
    `<span className="text-[11px] font-medium text-gray-300">\n   {typeof carton.hits === 'number' ? carton.hits : liveHits} Aciertos - {typeof carton.hits === 'number' ? (jornada?.matches.length || 0) - carton.hits : misses} Fallos - {jornada?.matches.length || 0} finalizados\n</span>`
  );

  // En ClientTicketsTab y SellerTicketsTab la condicion nueva (con && ( ... ))
  content = content.replace(/\{\(typeof carton\.hits === 'number' \|\| jornada\?\.status === 'en_juego' \|\| liveHits > 0 \|\| finalMisses > 0\) && \([\s\S]*?\}\)/g,
    `<span className="text-[11px] font-medium text-gray-300">\n   {typeof carton.hits === 'number' ? carton.hits : liveHits} Aciertos - {typeof carton.hits === 'number' ? (jornada?.matches.length || 0) - carton.hits : finalMisses} Fallos - {jornada?.matches.length || 0} finalizados\n</span>`
  );

  fs.writeFileSync(file, content, 'utf8');
}

updateFile('views/admin/AdminCartonesTab.tsx');
updateFile('views/client/ClientTicketsTab.tsx');
updateFile('views/seller/SellerTicketsTab.tsx');

console.log('Done');
