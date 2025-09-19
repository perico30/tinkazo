import React from 'react';
import type { RegisteredUser } from '../../types';

interface ClientDashboardTabProps {
  currentUser: RegisteredUser;
}

const ClientDashboardTab: React.FC<ClientDashboardTabProps> = ({ currentUser }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">¡Hola de nuevo, {currentUser.username}!</h2>
        <p className="text-gray-400">Aquí tienes un resumen de tu actividad y las próximas jornadas.</p>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Próximas Jornadas</h3>
          <p className="text-gray-400 text-center py-8">Aquí se mostrarán las jornadas disponibles para jugar.</p>
      </div>
    </div>
  );
};

export default ClientDashboardTab;