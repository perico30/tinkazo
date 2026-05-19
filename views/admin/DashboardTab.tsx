import React, { useMemo } from 'react';
import type { AppConfig, Jornada, Carton, RegisteredUser } from '../../types';

import UsersGroupIcon from '../../components/icons/UsersGroupIcon';
import BanknotesIcon from '../../components/icons/BanknotesIcon';
import TicketIcon from '../../components/icons/TicketIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';

interface DashboardTabProps {
    config: AppConfig;
    setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const SmallMetricCard: React.FC<{ title: string; primaryValue: string; secondaryValue?: string; icon: React.ReactNode; iconBgClass: string; accentClass: string }> = ({ title, primaryValue, secondaryValue, icon, iconBgClass, accentClass }) => {
    return (
        <div className={`stat-card ${accentClass} flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{title}</h3>
                <div className={`p-2 rounded-xl ${iconBgClass}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-3xl font-black text-white stat-value">{primaryValue}</p>
                {secondaryValue && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-semibold">{secondaryValue}</p>
                )}
            </div>
        </div>
    );
};

const DashboardTab: React.FC<DashboardTabProps> = ({ config, setConfig }) => {
  const metrics = useMemo(() => {
        const cartonesVendidos = config.cartones.length;
        
        const ingresosTotales = config.cartones.reduce((total, carton) => {
            const jornada = config.jornadas.find(j => j.id === carton.jornadaId);
            return total + (jornada?.cartonPrice || 0);
        }, 0);

        const gananciasCasa = ingresosTotales * 0.30;

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
            gananciasCasa,
            retirosCompletados,
            retirosPendientes,
            recargasPendientes,
            clientes,
            vendedores,
            usuariosPendientes,
            usuariosTotales: config.users.length,
        };
    }, [config]);

  const handleDistributeJackpot = () => {
    if (!window.confirm("¿Estás seguro de que deseas CERRAR EL CICLO y repartir el Pozo Acumulado? Esta acción es irreversible.")) return;

    const newConfig = JSON.parse(JSON.stringify(config)) as AppConfig;
    
    // Encontrar jornadas cerradas que no hayan sido pagadas globalmente
    const jornadasToProcess = newConfig.jornadas.filter((j: Jornada) => j.status === 'cerrada' && j.resultsProcessed && !j.globalPrizeProcessed);
    
    if (jornadasToProcess.length === 0) {
        alert("No hay jornadas cerradas con resultados pendientes de reparto global.");
        return;
    }

    const jornadaIds = jornadasToProcess.map((j: Jornada) => j.id);
    const cartonesToEvaluate = newConfig.cartones.filter((c: Carton) => jornadaIds.includes(c.jornadaId));
    
    const winners15 = cartonesToEvaluate.filter((c: Carton) => c.hits === 15);
    const winners14 = cartonesToEvaluate.filter((c: Carton) => c.hits === 14);

    if (winners15.length === 0 && winners14.length === 0) {
        // Rollover
        newConfig.jornadas.forEach((j: Jornada) => {
            if (jornadaIds.includes(j.id)) j.globalPrizeProcessed = true;
        });
        setConfig(newConfig);
        alert("No hubo ganadores de 15 ni 14 aciertos. El pozo se acumula para la próxima semana (Rollover). Recuerda Guardar Cambios.");
        return;
    }

    let currentJackpot = newConfig.globalJackpot || 0;
    const amountFor15 = currentJackpot * 0.70;
    const amountFor14 = currentJackpot * 0.30;

    let distributed = 0;

    if (winners15.length > 0) {
        const prizePerWinner15 = amountFor15 / winners15.length;
        winners15.forEach((carton: Carton) => {
            carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner15;
            carton.prizeDetails = carton.prizeDetails || {};
            carton.prizeDetails.global15 = { tier: 1, winnersCount: winners15.length, amount: prizePerWinner15 };
            
            const user = newConfig.users.find((u: RegisteredUser) => u.id === carton.userId);
            if (user) user.balance = (user.balance || 0) + prizePerWinner15;
        });
        distributed += amountFor15;
    }

    if (winners14.length > 0) {
        const prizePerWinner14 = amountFor14 / winners14.length;
        winners14.forEach((carton: Carton) => {
            carton.prizeWon = (carton.prizeWon || 0) + prizePerWinner14;
            carton.prizeDetails = carton.prizeDetails || {};
            carton.prizeDetails.global14 = { tier: 2, winnersCount: winners14.length, amount: prizePerWinner14 };
            
            const user = newConfig.users.find((u: RegisteredUser) => u.id === carton.userId);
            if (user) user.balance = (user.balance || 0) + prizePerWinner14;
        });
        distributed += amountFor14;
    }

    // Actualizar jornadas
    newConfig.jornadas.forEach((j: Jornada) => {
        if (jornadaIds.includes(j.id)) j.globalPrizeProcessed = true;
    });

    // Actualizar cartones evaluados
    newConfig.cartones = newConfig.cartones.map((c: Carton) => {
        const w15 = winners15.find((w: Carton) => w.id === c.id);
        if (w15) return w15;
        const w14 = winners14.find((w: Carton) => w.id === c.id);
        if (w14) return w14;
        return c;
    });

    newConfig.globalJackpot = currentJackpot - distributed;
    setConfig(newConfig);
    
    alert(`Se repartieron Bs ${Math.floor(distributed).toLocaleString('es-ES')} entre los ganadores. El pozo restante es Bs ${Math.floor(newConfig.globalJackpot).toLocaleString('es-ES')}. Recuerda presionar Guardar Cambios.`);
  };

  return (
    <div className="space-y-6">
        {/* Gestión del Pozo Global */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 sm:p-6 rounded-xl shadow-lg border border-blue-500/30">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    💰 Gran Pozo Acumulado
                </h3>
                <button 
                    onClick={handleDistributeJackpot}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-900/50 flex items-center gap-2 transition"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cerrar Ciclo y Repartir Pozo
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1">
                    <p className="text-4xl font-black text-cyan-400">Bs {Math.floor(config.globalJackpot || 0).toLocaleString('es-ES')}</p>
                    <p className="text-sm text-gray-300 mt-2">El pozo aumenta en un 50% del valor de cada cartón vendido.</p>
                </div>
                <div className="flex-1 bg-gray-900/50 p-4 rounded-lg w-full">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Inyectar Pozo Semilla (Bs)</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            value={config.seedJackpot || 0}
                            onChange={(e) => setConfig({ ...config, seedJackpot: Number(e.target.value) })}
                        />
                        <button 
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold transition shrink-0"
                            onClick={() => {
                                const newGlobal = (config.globalJackpot || 0) + Number(config.seedJackpot || 0);
                                setConfig({ ...config, globalJackpot: newGlobal, seedJackpot: 0 });
                                alert('Pozo Semilla inyectado en el Pozo Global. Recuerda Guardar Cambios.');
                            }}
                        >
                            Inyectar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <SmallMetricCard 
            title="Cartones Vendidos" 
            primaryValue={metrics.cartonesVendidos.toLocaleString('es-ES')} 
            icon={<TicketIcon className="h-5 w-5" />} 
            iconBgClass="bg-purple-500/10 text-purple-400"
            accentClass="stat-card-purple"
          />
          <SmallMetricCard 
            title="Ingresos Totales" 
            primaryValue={`Bs ${Math.floor(metrics.ingresosTotales).toLocaleString('es-ES')}`} 
            icon={<BanknotesIcon className="h-5 w-5" />} 
            iconBgClass="bg-cyan-500/10 text-cyan-400"
            accentClass="stat-card-cyan"
          />
          <SmallMetricCard 
            title="Ganancias (30%)" 
            primaryValue={`Bs ${Math.floor(metrics.gananciasCasa).toLocaleString('es-ES')}`} 
            secondaryValue="Comisión de La Casa"
            icon={<BanknotesIcon className="h-5 w-5" />} 
            iconBgClass="bg-green-500/10 text-green-400"
            accentClass="stat-card-green"
          />
          <SmallMetricCard 
            title="Usuarios Registrados" 
            primaryValue={metrics.usuariosTotales.toString()} 
            secondaryValue={`${metrics.clientes} Cli | ${metrics.vendedores} Ven`}
            icon={<UsersGroupIcon className="h-5 w-5" />} 
            iconBgClass="bg-emerald-500/10 text-emerald-400"
            accentClass="stat-card-green"
          />
          <SmallMetricCard 
            title="Retiros" 
            primaryValue={`Bs ${Math.floor(metrics.retirosCompletados).toLocaleString('es-ES')}`} 
            secondaryValue={`${metrics.retirosPendientes} pendiente(s)`}
            icon={<CreditCardIcon className="h-5 w-5" />} 
            iconBgClass="bg-amber-500/10 text-amber-400"
            accentClass="stat-card-amber"
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