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
      <MetricCard title="Cartones Vendidos" value="0" />
      <MetricCard title="Ingresos Totales" value="Bs 0.00" />
      <MetricCard title="Ganancias de la Casa" value="Bs 0.00" />
      <MetricCard title="Retiros" value="Bs 0.00" />
      <MetricCard title="Usuarios Registrados" value="0" />
    </div>
  );
};

export default DashboardTab;