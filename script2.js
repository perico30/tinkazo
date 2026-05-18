const fs = require('fs');

function updateClientSeller(file, isSeller = false) {
    let content = fs.readFileSync(file, 'utf8');
    
    // The previous code had a specific map callback for cartones.
    // We will extract everything inside the map, or replace the specific block.
    // Let's replace the whole map body
    let target = isSeller ? 'SellerTicketsTab' : 'ClientTicketsTab';
    let propName = isSeller ? 'cartones' : 'cartones'; // both have cartones

    const newMapBody = `
                const jornada = jornadas.find(j => j.id === carton.jornadaId);
                const resultsProcessed = jornada?.resultsProcessed;
                const isWinner = carton.prizeWon && carton.prizeWon > 0;
                
                let statusElement: any = null;
                let liveHits = 0;
                let misses = 0;
                let matchesWithResult = 0;
                let earlyLost = false;
                
                if (jornada) {
                    jornada.matches.forEach(match => {
                        let finalResult = match.result;

                        if (!resultsProcessed && !finalResult) {
                            const localTeam = teams.find(t => t.id === match.localTeamId);
                            const visitorTeam = teams.find(t => t.id === match.visitorTeamId);
                            const liveMatch = liveEvents.find(e => isMatchMatch(e.id, e.team1.name, e.team2.name, match.id, localTeam?.name, visitorTeam?.name, e.startDate, match.dateTime));
                            if (liveMatch && (liveMatch.status === 'FT' || liveMatch.status === 'AET' || liveMatch.status === 'AP')) {
                                if (liveMatch.score1! > liveMatch.score2!) finalResult = '1';
                                else if (liveMatch.score1! < liveMatch.score2!) finalResult = '2';
                                else finalResult = 'X';
                            }
                        }

                        if (finalResult) {
                            matchesWithResult++;
                            if (carton.predictions[match.id] === finalResult) {
                                liveHits++;
                            } else {
                                misses++;
                            }
                        }
                    });

                    const maxAllowedMisses = parseFloat(jornada.secondPrize || '0') > 0 ? 1 : 0;
                    if (misses > maxAllowedMisses) {
                        earlyLost = true;
                    }
                }

                const totalMatches = jornada?.matches.length || 0;
                let displayHits = liveHits;
                let displayMisses = misses;
                let displayFinished = matchesWithResult;

                if (resultsProcessed && typeof carton.hits === 'number') {
                    displayHits = carton.hits;
                    displayMisses = Math.max(0, totalMatches - carton.hits);
                    displayFinished = totalMatches;
                } else if (jornada) {
                    let allFinished = true;
                    const now = new Date().getTime();
                    jornada.matches.forEach(m => {
                        if (new Date(m.dateTime).getTime() + 2 * 60 * 60 * 1000 > now) allFinished = false;
                    });
                    if (allFinished) displayFinished = totalMatches;
                }

                if (resultsProcessed || earlyLost) {
                    if (isWinner && !earlyLost) {
                        const details = carton.prizeDetails;
                        const prizeTexts: string[] = [];

                        if (details?.gordito) {
                            prizeTexts.push('EL GORDITO');
                        } else if (details?.jornada) {
                            prizeTexts.push(details.jornada.tier === 1 ? '1ER PREMIO' : '2DO PREMIO');
                        }

                        if (details?.botin) {
                            prizeTexts.push('EL BOTÍN');
                        }

                        let prizeText = prizeTexts.join(' + ');

                        if (prizeText !== '') {
                            prizeText = \`GANASTE \${prizeText}\`;
                        } else if (details?.botin) {
                            prizeText = 'GANASTE EL BOTÍN';
                        } else {
                            prizeText = 'GANADOR';
                        }

                        statusElement = (
                            <span className="text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                {prizeText}
                            </span>
                        );
                    } else {
                        statusElement = (
                            <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                                PERDIDO
                            </span>
                        );
                    }
                } else if (jornada?.status === 'en_juego' || (!resultsProcessed && !earlyLost)) {
                    statusElement = (
                        <span className="text-xs font-bold bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full animate-pulse border border-yellow-500/30">
                            EN JUEGO
                        </span>
                    );
                }

                const isDeletable = earlyLost || (resultsProcessed && !isWinner);
                
                return (
                    <div key={carton.id} className={\`bg-gray-\${isSeller ? '700' : '800'} p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4\`}>
                        <div className="flex-grow w-full">
                            <p className="font-bold text-lg">{jornada ? jornada.name : 'Jornada Desconocida'}</p>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-400">
                                    Comprado: {new Date(carton.purchaseDate).toLocaleString()}
                                </p>
                                {statusElement}
                            </div>
                            <div className="mt-3 flex items-center">
                                <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-700/50 shadow-inner overflow-hidden">
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs font-bold border-r border-gray-700/50">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        {displayHits} Aciertos
                                    </div>
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs font-bold border-r border-gray-700/50">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        {displayMisses} Fallos
                                    </div>
                                    <div className="px-3 py-1 flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {displayFinished} finalizados
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${isSeller ? \`
                        <button 
                            onClick={() => onViewCarton(carton)}
                            className="w-full sm:w-auto flex-shrink-0 bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400"
                        >
                            Ver/Editar Cartón
                        </button>\` : \`
                        <div className="w-full sm:w-auto flex sm:flex-col gap-2 flex-shrink-0">
                            {isDeletable && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteCarton(carton.id); }}
                                    className="flex-1 sm:flex-none bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-2 rounded-lg hover:bg-red-500/40 text-sm"
                                >
                                    Eliminar
                                </button>
                            )}
                            <button 
                                onClick={() => onViewCarton(carton)}
                                className="flex-1 sm:flex-none bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 text-sm w-full"
                            >
                                Ver Cartón
                            </button>
                        </div>\`}
                    </div>
                );
`;

    // Extracting parts
    let headerMatch = content.match(/cartones\.sort\(\(a, b\) => new Date\(b\.purchaseDate\)\.getTime\(\) - new Date\(a\.purchaseDate\)\.getTime\(\)\)\.map\(carton => \{/);
    if(headerMatch) {
        let indexStart = content.indexOf(headerMatch[0]) + headerMatch[0].length;
        // find matching closing brace for map
        let braces = 1;
        let indexEnd = -1;
        for(let i=indexStart; i<content.length; i++) {
            if(content[i] === '{') braces++;
            if(content[i] === '}') braces--;
            if(braces === 0) {
                indexEnd = i;
                break;
            }
        }
        if(indexEnd !== -1) {
            const newContent = content.substring(0, indexStart) + newMapBody + content.substring(indexEnd);
            fs.writeFileSync(file, newContent, 'utf8');
        }
    }
}

updateClientSeller('views/client/ClientTicketsTab.tsx', false);
updateClientSeller('views/seller/SellerTicketsTab.tsx', true);

function updateAdmin(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Para Mobile y Desktop hay un map: `filteredCartones.map((carton) => {`
    // Hay dos de estos en AdminCartonesTab.
    
    let regex = /let liveHits = 0;[\s\S]*?(?=return \()/g;
    
    content = content.replace(regex, \`
            let liveHits = 0;
            let misses = 0;
            let matchesWithResult = 0;
            if (jornada) {
                jornada.matches.forEach(match => {
                    let finalResult = match.result;
                    if (!isProcessed && !finalResult) {
                        const localTeam = config.teams.find(t => t.id === match.localTeamId);
                        const visitorTeam = config.teams.find(t => t.id === match.visitorTeamId);
                        const liveMatch = liveEvents.find(e => isMatchMatch(e.id, e.team1.name, e.team2.name, match.id, localTeam?.name, visitorTeam?.name, e.startDate, match.dateTime));
                        if (liveMatch && (liveMatch.status === 'FT' || liveMatch.status === 'AET' || liveMatch.status === 'AP')) {
                            if (liveMatch.score1! > liveMatch.score2!) finalResult = '1';
                            else if (liveMatch.score1! < liveMatch.score2!) finalResult = '2';
                            else finalResult = 'X';
                        }
                    }
                    if (finalResult) {
                        matchesWithResult++;
                        if (carton.predictions[match.id] === finalResult) liveHits++;
                        else misses++;
                    }
                });
            }

            const totalMatches = jornada?.matches.length || 0;
            let displayHits = liveHits;
            let displayMisses = misses;
            let displayFinished = matchesWithResult;

            if (isProcessed && typeof carton.hits === 'number') {
                displayHits = carton.hits;
                displayMisses = Math.max(0, totalMatches - carton.hits);
                displayFinished = totalMatches;
            } else if (jornada) {
                let allFinished = true;
                const now = new Date().getTime();
                jornada.matches.forEach(m => {
                    if (new Date(m.dateTime).getTime() + 2 * 60 * 60 * 1000 > now) allFinished = false;
                });
                if (allFinished) displayFinished = totalMatches;
            }
            \`);

    // Y arreglar los returns para poner la pill en vez del texto:
    // Mobile text:
    content = content.replace(/<div className="mt-1">[\s\S]*?<span className="text-\[11px\] font-medium text-gray-300">[\s\S]*?<\/span>[\s\S]*?<\/div>/g, \`
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-700/50 shadow-inner overflow-hidden">
                         <div className="px-1.5 py-0.5 flex items-center gap-0.5 bg-green-500/10 text-green-400 text-[9px] font-bold border-r border-gray-700/50">
                             <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                             {displayHits} Aciertos
                         </div>
                         <div className="px-1.5 py-0.5 flex items-center gap-0.5 bg-red-500/10 text-red-400 text-[9px] font-bold border-r border-gray-700/50">
                             <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                             {displayMisses} Fallos
                         </div>
                         <div className="px-1.5 py-0.5 flex items-center gap-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-bold">
                             <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                             {displayFinished} finalizados
                         </div>
                    </div>
                  </div>\`);

    // Desktop text:
    content = content.replace(/<span className="text-\[12px\] font-medium text-gray-300">[\s\S]*?<\/span>/g, \`
                            <div className="flex items-center">
                                <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-700/50 shadow-inner overflow-hidden">
                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold border-r border-gray-700/50">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        {displayHits} Aciertos
                                    </div>
                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-bold border-r border-gray-700/50">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        {displayMisses} Fallos
                                    </div>
                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {displayFinished} finalizados
                                    </div>
                                </div>
                            </div>\`);

    fs.writeFileSync(file, content, 'utf8');
}

updateAdmin('views/admin/AdminCartonesTab.tsx');

console.log('Done');
