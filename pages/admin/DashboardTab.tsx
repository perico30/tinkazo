import React, { useMemo } from 'react';
import type { AppConfig } from '../../types';

import UsersGroupIcon from '../../components/icons/UsersGroupIcon';
import BanknotesIcon from '../../components/icons/BanknotesIcon';
import TicketIcon from '../../components/icons/TicketIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';

interface DashboardTabProps {
    config: AppConfig;
}

const SmallMetricCard: React.FC<{ title: string; primaryValue: string; secondaryValue?: string; icon: React.ReactNode; colorClass: string }> = ({ title, primaryValue, secondaryValue, icon, colorClass }) => {
    return (
        <div className="bg-gray-800/80 p-4 rounded-xl shadow-md border border-gray-700/50 flex flex-col justify-between hover:bg-gray-700/80 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-semibold text-gray-400 mx-1">{title}</h3>
                <div className={`p-1.5 rounded-lg ${colorClass}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-2xl font-black text-white">{primaryValue}</p>
                {secondaryValue && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-semibold">{secondaryValue}</p>
                )}
            </div>
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
            
        const retirosPendientes = config.withdrawalRequests.filter(req => req.status === 'pending').length;
        const recargasPendientes = config.rechargeRequests.filter(req => req.status === 'pending').length;

        const clientes = config.users.filter(u => u.role === 'client').length;
        const vendedores = config.users.filter(u => u.role === 'seller').length;
        const usuariosPendientes = config.users.filter(u => u.status === 'pending').length;

        return {
            cartonesVendidos,
            ingresosTotales,
            retirosCompletados,
            retirosPendientes,
            recargasPendientes,
            clientes,
            vendedores,
            usuariosPendientes,
            usuariosTotales: config.users.length,
        };
    }, [config]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <SmallMetricCard 
            title="Cartones Vendidos" 
            primaryValue={metrics.cartonesVendidos.toLocaleString('es-ES')} 
            icon={<TicketIcon className="h-5 w-5" />} 
            colorClass="bg-cyan-500/20 text-cyan-400"
          />
          <SmallMetricCard 
            title="Ingresos Totales" 
            primaryValue={`Bs ${Math.floor(metrics.ingresosTotales).toLocaleString('es-ES')}`} 
            icon={<BanknotesIcon className="h-5 w-5" />} 
            colorClass="bg-green-500/20 text-green-400"
          />
          <SmallMetricCard 
            title="Usuarios Registrados" 
            primaryValue={metrics.usuariosTotales.toString()} 
            secondaryValue={`${metrics.clientes} Cli | ${metrics.vendedores} Ven`}
            icon={<UsersGroupIcon className="h-5 w-5" />} 
            colorClass="bg-purple-500/20 text-purple-400"
          />
          <SmallMetricCard 
            title="Retiros" 
            primaryValue={`Bs ${Math.floor(metrics.retirosCompletados).toLocaleString('es-ES')}`} 
            secondaryValue={`${metrics.retirosPendientes} pendiente(s)`}
            icon={<CreditCardIcon className="h-5 w-5" />} 
            colorClass="bg-orange-500/20 text-orange-400"
          />
        </div>

        {/* Notificaciones y Alertas */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-yellow-500/20 text-yellow-400 p-1.5 rounded-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </span>
                Notificaciones Pendientes
            </h3>
            
            <div className="space-y-3">
                {metrics.recargasPendientes > 0 && (
                    <div className="flex items-start gap-3 bg-blue-900/40 border border-blue-800 p-3 rounded-lg">
                        <div className="text-blue-400 mt-0.5"><CreditCardIcon className="h-5 w-5" /></div>
                        <div>
                            <p className="text-blue-100 font-medium">Solicitudes de Recarga</p>
                            <p className="text-sm text-blue-300">Tienes {metrics.recargasPendientes} solicitud(es) de recarga pendiente(s) de revisión en la pestaña "Financiero".</p>
                        </div>
                    </div>
                )}
                
                {metrics.usuariosPendientes > 0 && (
                    <div className="flex items-start gap-3 bg-purple-900/40 border border-purple-800 p-3 rounded-lg">
                        <div className="text-purple-400 mt-0.5"><UsersGroupIcon className="h-5 w-5" /></div>
                        <div>
                            <p className="text-purple-100 font-medium">Nuevos Usuarios</p>
                            <p className="text-sm text-purple-300">Hay {metrics.usuariosPendientes} usuario(s) recién registrado(s) esperando que actives su cuenta en la pestaña "Usuarios".</p>
                        </div>
                    </div>
                )}

                {metrics.recargasPendientes === 0 && metrics.usuariosPendientes === 0 && (
                    <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 p-4 rounded-lg text-green-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium">Todo está al día. No tienes acciones pendientes por revisar.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DashboardTab;