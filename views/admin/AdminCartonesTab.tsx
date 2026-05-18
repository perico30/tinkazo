import React, { useState } from 'react';
import type { AppConfig, Carton } from '../../types';
import TicketIcon from '../../components/icons/TicketIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { useLiveScores } from '../../hooks/useLiveScores';
import { isMatchMatch } from '../../utils/apiDeportes';

interface AdminCartonesTabProps {
  config: AppConfig;
  onViewCarton: (carton: Carton) => void;
  onDeleteCarton: (cartonId: string) => void;
}

const AdminCartonesTab: React.FC<AdminCartonesTabProps> = ({ config, onViewCarton, onDeleteCarton }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { liveEvents } = useLiveScores();

  const filteredCartones = config.cartones.filter((carton) => {
    const user = config.users.find(u => u.id === carton.userId);
    const userName = user ? `${user.username} ${user.email}`.toLowerCase() : 'desconocido';
    return userName.includes(searchTerm.toLowerCase()) || carton.id.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  const getJornadaName = (jornadaId: string) => {
    return config.jornadas.find(j => j.id === jornadaId)?.name || 'Jornada Desconocida';
  };

  const getUserDetails = (userId: string) => {
    const user = config.users.find(u => u.id === userId);
    if (!user) return { name: 'Usuario Desconocido', email: '' };
    return { name: user.username, email: user.email };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TicketIcon className="h-6 w-6 text-cyan-400" />
          Cartones Vendidos ({config.cartones.length})
        </h2>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por usuario o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/80 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder-gray-400 transition-colors"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
        {/* ═══ MOBILE CARDS (< md) ═══ */}
        <div className="md:hidden p-2 space-y-1.5">
          {filteredCartones.map((carton) => {
            const user = getUserDetails(carton.userId);
            const jornada = config.jornadas.find(j => j.id === carton.jornadaId);
            const isProcessed = jornada?.resultsProcessed;
            const isLost = isProcessed && (!carton.prizeWon || carton.prizeWon === 0);
            const isWinner = isProcessed && carton.prizeWon && carton.prizeWon > 0;

            let borderColor = 'border-slate-700/30';
            if (isLost) borderColor = 'border-red-500/30';
            else if (isWinner) borderColor = 'border-green-500/30';

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

            return (
              <div key={carton.id} className={`flex items-center gap-2 bg-slate-800/50 border ${borderColor} p-2.5 rounded-lg`}>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white text-xs truncate">{user.name}</span>
                    {isWinner && <span className="text-[9px] text-green-400 font-bold shrink-0">🏆</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-cyan-400 truncate">{getJornadaName(carton.jornadaId)}</span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500">{new Date(carton.purchaseDate).toLocaleDateString('es-ES')}</span>
                  </div>
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
                        {displayFinished} / {totalMatches} finalizados
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onViewCarton(carton)}
                    className="text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-cyan-400/20 transition shrink-0"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onDeleteCarton(carton.id)}
                    className="text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-red-400/20 transition shrink-0"
                    title="Eliminar Cartón"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredCartones.length === 0 && <p className="text-center text-gray-400 py-8">No se encontraron cartones.</p>}
        </div>

        {/* ═══ DESKTOP TABLE (≥ md) ═══ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-[11px] text-gray-300 uppercase tracking-wider bg-slate-800/80">
              <tr>
                <th className="px-4 py-3">ID Cartón</th>
                <th className="px-4 py-3">Usuario (Email)</th>
                <th className="px-4 py-3">Jornada</th>
                <th className="px-4 py-3">Resultados</th>
                <th className="px-4 py-3">Fecha de Compra</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCartones.map((carton) => {
                const user = getUserDetails(carton.userId);
                const jornada = config.jornadas.find(j => j.id === carton.jornadaId);
                const isProcessed = jornada?.resultsProcessed;
                const isLost = isProcessed && (!carton.prizeWon || carton.prizeWon === 0);
                const isWinner = isProcessed && carton.prizeWon && carton.prizeWon > 0;

                let rowStyle = "border-b border-slate-800 hover:bg-slate-800/50 transition-colors";
                let textStyle = "text-white";
                let idStyle = "text-gray-400";

                if (isLost) {
                  rowStyle = "border-b border-red-500/30 bg-red-900/40 hover:bg-red-900/60 transition-colors";
                  textStyle = "text-red-100";
                  idStyle = "text-red-300";
                } else if (isWinner) {
                  rowStyle = "border-b border-green-500/30 bg-green-900/40 hover:bg-green-900/60 transition-colors";
                  textStyle = "text-green-100";
                }

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

                return (
                  <tr key={carton.id} className={rowStyle}>
                    <td className={`px-4 py-3 font-mono text-xs ${idStyle}`}>{carton.id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <div className={`font-semibold ${textStyle}`}>{user.name}</div>
                      <div className="text-xs text-cyan-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{getJornadaName(carton.jornadaId)}</td>
                    <td className="px-4 py-3">
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
                            {displayFinished} / {totalMatches} finalizados
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{new Date(carton.purchaseDate).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewCarton(carton)}
                          className="text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                          title="Ver Detalles"
                        >
                          <SearchIcon className="h-4 w-4" />
                          <span>Ver</span>
                        </button>
                        <button
                          onClick={() => onDeleteCarton(carton.id)}
                          className="text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                          title="Eliminar Cartón"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCartones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No se encontraron cartones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCartonesTab;
