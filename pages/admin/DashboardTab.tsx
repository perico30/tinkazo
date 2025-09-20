import React, { useMemo } from 'react';
import type { AppConfig } from '../../types';

interface DashboardTabProps {
    config: AppConfig;
}

const MetricCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => {
    const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
                <p className={`text-sm mt-1 ${changeColor}`}>
                    {changeType === 'increase' ? '▲' : '▼'} {change}
                </p>
            )}
        </div>
    );
};


const DashboardTab: React.FC<DashboardTabProps> = ({ config }) => {
  const metrics = useMemo(() => {
        const cartonesVendidos = config.cartones.length;
        
        const ingresosTotales = config.cartones.reduce((total, carton) => {
            const jornada = config.jornadas.find(j => j.id === carton.jornadaId);
            return total + (jornada?.cartonPrice || 0);
        }, 0);

        const retirosCompletados = config.withdrawalRequests
            .filter(req => req.status === 'completed')
            .reduce((total, req) => total + req.amount, 0);

        // House profit is 30% of total revenue from cartons, minus completed withdrawals.
        // Prizes are paid from the other 70% of revenue, so they are not subtracted from the house's profit here.
        const gananciasCasa = (ingresosTotales * 0.30) - retirosCompletados;
        
        const usuariosRegistrados = config.users.length;

        return {
            cartonesVendidos,
            ingresosTotales,
            gananciasCasa,
            retirosCompletados,
            usuariosRegistrados,
            botinAmount: config.botinAmount || 0,
        };
    }, [config]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard title="Cartones Vendidos" value={metrics.cartonesVendidos.toString()} />
      <MetricCard title="Ingresos Totales" value={`Bs ${Math.floor(metrics.ingresosTotales).toLocaleString('es-ES')}`} />
      <MetricCard title="Ganancias de la Casa" value={`Bs ${Math.floor(metrics.gananciasCasa).toLocaleString('es-ES')}`} />
      <MetricCard title="Retiros" value={`Bs ${Math.floor(metrics.retirosCompletados).toLocaleString('es-ES')}`} />
      <MetricCard title="Usuarios Registrados" value={metrics.usuariosRegistrados.toString()} />
      <MetricCard title="Pozo del Botín" value={`Bs ${Math.floor(metrics.botinAmount).toLocaleString('es-ES')}`} />
    </div>
  );
};

export default DashboardTab;