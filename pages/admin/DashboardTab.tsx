import React from 'react';

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


const DashboardTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <MetricCard title="Cartones Vendidos" value="12,543" change="12.5%" changeType="increase" />
      <MetricCard title="Ingresos Totales" value="$89,400" change="20.1%" changeType="increase" />
      <MetricCard title="Ganancias de la Casa" value="$15,230" change="5.2%" changeType="increase" />
      <MetricCard title="Retiros" value="$5,600" change="2.1%" changeType="decrease" />
      <MetricCard title="Usuarios Registrados" value="2,150" change="30 nuevos" changeType="increase" />
    </div>
  );
};

export default DashboardTab;