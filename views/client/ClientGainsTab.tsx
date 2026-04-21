import React from 'react';
import type { Carton, Jornada } from '../../types';
import TrophyIcon from '../../components/icons/TrophyIcon';

interface ClientGainsTabProps {
    winningCartones: Carton[];
    jornadas: Jornada[];
}

const ClientGainsTab: React.FC<ClientGainsTabProps> = ({ winningCartones, jornadas }) => {
  if (winningCartones.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <TrophyIcon className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Mis Ganancias</h2>
        <p className="text-gray-400">
          Aún no has ganado ningún premio. ¡Sigue participando y la suerte estará de tu lado!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Mi Historial de Ganancias</h2>
      {/* ═══ MOBILE CARDS (< md) ═══ */}
      <div className="md:hidden space-y-3">
        {winningCartones
          .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
          .map(carton => {
            const jornada = jornadas.find(j => j.id === carton.jornadaId);
            const lastMatchDate = jornada?.matches.reduce((latest, match) => {
                const matchDate = new Date(match.dateTime);
                return matchDate > latest ? matchDate : latest;
            }, new Date(0));
            const details = carton.prizeDetails;
            const winnersCount = details?.jornada?.winnersCount ?? details?.botin?.winnersCount ?? details?.gordito?.winnersCount;

            return (
              <div key={carton.id} className="bg-slate-800/50 border border-green-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-white text-sm">{jornada?.name || 'Desconocida'}</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Ganador</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/40 rounded-lg p-2.5">
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider text-[10px]">Aciertos</span>
                    <p className="font-bold text-lg text-cyan-300">{carton.hits}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider text-[10px]">Premio</span>
                    <p className="font-bold text-lg text-green-400">Bs {Math.floor(carton.prizeWon || 0).toLocaleString('es-ES')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider text-[10px]">Fecha</span>
                    <p className="font-semibold text-white">{lastMatchDate && lastMatchDate.getFullYear() > 1970 ? lastMatchDate.toLocaleDateString('es-ES') : 'N/A'}</p>
                  </div>
                </div>
                {winnersCount && winnersCount > 1 && (
                  <p className="text-[10px] text-gray-400 text-center mt-2">Compartido entre {winnersCount} ganadores</p>
                )}
              </div>
            );
        })}
      </div>

      {/* ═══ DESKTOP TABLE (≥ md) ═══ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-[11px] text-gray-300 uppercase tracking-wider bg-slate-800/80">
            <tr>
              <th scope="col" className="px-6 py-3">Jornada</th>
              <th scope="col" className="px-6 py-3">Fecha de Cierre</th>
              <th scope="col" className="px-6 py-3 text-center">Aciertos</th>
              <th scope="col" className="px-6 py-3 text-right">Premio Ganado</th>
            </tr>
          </thead>
          <tbody>
            {winningCartones
              .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
              .map(carton => {
                const jornada = jornadas.find(j => j.id === carton.jornadaId);
                const lastMatchDate = jornada?.matches.reduce((latest, match) => {
                    const matchDate = new Date(match.dateTime);
                    return matchDate > latest ? matchDate : latest;
                }, new Date(0));
                const details = carton.prizeDetails;
                const winnersCount = details?.jornada?.winnersCount ?? details?.botin?.winnersCount ?? details?.gordito?.winnersCount;

                return (
                  <tr key={carton.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{jornada?.name || 'Desconocida'}</td>
                    <td className="px-6 py-4">{lastMatchDate && lastMatchDate.getFullYear() > 1970 ? lastMatchDate.toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-cyan-300">{carton.hits}</td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-lg text-green-400">Bs {Math.floor(carton.prizeWon || 0).toLocaleString('es-ES')}</p>
                      {winnersCount && winnersCount > 1 && (
                        <p className="text-xs text-gray-400">(Compartido entre {winnersCount})</p>
                      )}
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientGainsTab;