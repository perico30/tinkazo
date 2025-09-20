import React, { useMemo } from 'react';
import type { AppConfig, RegisteredUser, Carton } from '../../types';
import { COUNTRIES } from '../../constants/countries';

interface SellerClientsTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onViewClientTickets: (client: RegisteredUser) => void;
}

const SellerClientsTab: React.FC<SellerClientsTabProps> = ({ currentUser, config, onViewClientTickets }) => {

    const myClients = useMemo(() => {
        return config.users.filter(u => u.role === 'client' && u.assignedSellerId === currentUser.id);
    }, [config.users, currentUser.id]);

    const getCountryName = (countryCode: string) => {
        return COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Mis Clientes Asignados ({myClients.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Usuario</th>
                            <th scope="col" className="px-6 py-3">Correo</th>
                            <th scope="col" className="px-6 py-3">País</th>
                            <th scope="col" className="px-6 py-3">Saldo</th>
                            <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myClients.map(user => {
                            const cartonCount = config.cartones.filter(c => c.userId === user.id).length;
                            return (
                                <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{getCountryName(user.country)}</td>
                                    <td className="px-6 py-4 font-semibold">Bs {(user.balance || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onViewClientTickets(user)}
                                            className="font-medium text-cyan-400 hover:underline"
                                            title={`Ver los ${cartonCount} cartones de ${user.username}`}
                                        >
                                            Ver Cartones
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {myClients.length === 0 && <p className="text-center text-gray-500 py-8">No tienes clientes asignados.</p>}
            </div>
        </div>
    );
};

export default SellerClientsTab;