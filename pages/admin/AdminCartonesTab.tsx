import React, { useState } from 'react';
import type { AppConfig, Carton } from '../../types';
import TicketIcon from '../../components/icons/TicketIcon';
import SearchIcon from '../../components/icons/SearchIcon';

interface AdminCartonesTabProps {
  config: AppConfig;
  onViewCarton: (carton: Carton) => void;
}

const AdminCartonesTab: React.FC<AdminCartonesTabProps> = ({ config, onViewCarton }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
              <tr>
                <th className="px-4 py-3">ID Cartón</th>
                <th className="px-4 py-3">Usuario (Email)</th>
                <th className="px-4 py-3">Jornada</th>
                <th className="px-4 py-3">Fecha de Compra</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCartones.map((carton) => {
                const user = getUserDetails(carton.userId);
                return (
                  <tr key={carton.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{carton.id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-cyan-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{getJornadaName(carton.jornadaId)}</td>
                    <td className="px-4 py-3">{new Date(carton.purchaseDate).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewCarton(carton)}
                        className="text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                        title="Ver Detalles"
                      >
                        <SearchIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Ver Cartón</span>
                      </button>
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
