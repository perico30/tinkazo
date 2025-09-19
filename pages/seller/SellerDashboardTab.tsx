import React from 'react';
import type { AppConfig, RegisteredUser } from '../../types';

interface SellerDashboardTabProps {
  currentUser: RegisteredUser;
  config: AppConfig;
}


const SellerDashboardTab: React.FC<SellerDashboardTabProps> = ({ currentUser, config }) => {
    const openJornadas = config.jornadas.filter(j => j.status === 'abierta');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-lg mb-2">Resumen</h3>
                 <p className="text-gray-400">Bienvenido a tu panel, {currentUser.username}. Desde aquí puedes gestionar a tus clientes y ver las jornadas activas.</p>
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-4">Jornadas Disponibles</h3>
                {openJornadas.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {openJornadas.map(jornada => (
                            <div key={jornada.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{jornada.name}</p>
                                    <p className="text-xs text-gray-400">1er Premio: {jornada.firstPrize}</p>
                                </div>
                                <span className="text-sm font-bold text-green-400">ABIERTA</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">No hay jornadas abiertas en este momento.</p>
                )}
            </div>
        </div>
    );
};

export default SellerDashboardTab;