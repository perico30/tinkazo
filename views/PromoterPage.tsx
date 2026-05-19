import React, { useState, useMemo, useEffect } from 'react';
import type { AppConfig, RegisteredUser, Carton, Prediction, Jornada, Team, PromoterProfile } from '../types';
import JornadaWizard from '../components/admin/JornadaWizard';
import ImageUpload from '../components/admin/ImageUpload';
import CartonModal from '../components/CartonModal';
import Header from '../components/Header';
import HomeIcon from '../components/icons/HomeIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import UsersIcon from '../components/icons/UsersIcon';
import WalletIcon from '../components/icons/WalletIcon';
import TicketIcon from '../components/icons/TicketIcon';
import GearIcon from '../components/icons/GearIcon';
import { supabase } from '../supabaseClient';
import { useLiveScores } from '../hooks/useLiveScores';
import { isMatchMatch } from '../utils/apiDeportes';

interface PromoterPageProps {
  currentUser: RegisteredUser;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => Promise<void>;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
  onTransferBalance: (sellerId: string, clientId: string, amount: number) => void;
  onLogout: () => void;
  onExit: () => void;
  onPlayJornada: (jornada: Jornada) => void;
  onProcessClientRecharge: (requestId: string, action: 'approve' | 'reject', sellerId: string) => Promise<void>;
}

type PromoterTab = 'dashboard' | 'clients' | 'finance' | 'settings';

import ClientRechargesTab from './seller/ClientRechargesTab';

const PromoterPage: React.FC<PromoterPageProps> = ({ currentUser, config, onSave, onUpdateUser, onTransferBalance, onLogout, onExit, onPlayJornada, onProcessClientRecharge }) => {
  const { liveEvents } = useLiveScores();
  const [activeTab, setActiveTab] = useState<PromoterTab>(() => {
    return (localStorage.getItem('tinkazoPromoterTab') as PromoterTab) || 'dashboard';
  });
  
  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tinkazoPromoterTab', activeTab);
  }, [activeTab]);

  const [viewingCarton, setViewingCarton] = useState<Carton | null>(null);
  const [transferClientId, setTransferClientId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // Get this promoter's profile
  const promoterProfile = useMemo(() => 
    config.promoterProfiles.find(p => p.userId === currentUser.id),
    [config.promoterProfiles, currentUser.id]
  );

  // Get clients referred by this promoter
  const myClients = useMemo(() =>
    config.users.filter(u => u.referredBy === currentUser.id && u.role === 'client'),
    [config.users, currentUser.id]
  );

  // Count cartones sold to promoter's clients
  const myCartonesCount = useMemo(() => {
    const myClientIds = myClients.map(c => c.id);
    return config.cartones.filter(c => myClientIds.includes(c.userId)).length;
  }, [config.cartones, myClients]);

  // Total commissions earned
  const totalCommissionsEarned = useMemo(() => {
    return config.transactions
      .filter(t => t.userId === currentUser.id && t.type === 'commission')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [config.transactions, currentUser.id]);

  // Handle transfer balance to client
  const handleTransfer = () => {
    if (!transferClientId || !transferAmount) {
      alert('Selecciona un cliente e ingresa un monto.');
      return;
    }
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('El monto debe ser mayor a 0.');
      return;
    }
    onTransferBalance(currentUser.id, transferClientId, amount);
    setTransferAmount('');
  };

  // Check if jornada can be deleted (no cartones sold)
  const canDeleteJornada = (jornadaId: string) => {
    return !config.cartones.some(c => c.jornadaId === jornadaId);
  };

  const handleDeleteJornada = async (jornadaId: string) => {
    if (!canDeleteJornada(jornadaId)) {
      alert('No puedes eliminar esta jornada porque ya tiene cartones vendidos.');
      return;
    }
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta jornada?')) return;
    
    const newConfig = {
      ...config,
      jornadas: config.jornadas.filter(j => j.id !== jornadaId)
    };
    await onSave(newConfig);
  };

  const getCartonesForJornada = (jornadaId: string) =>
    config.cartones.filter(c => c.jornadaId === jornadaId);

  // Settings state
  const [settingsQr, setSettingsQr] = useState(promoterProfile?.qrImageUrl || '');
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(promoterProfile?.whatsappNumber || '');
  const [savingSettings, setSavingSettings] = useState(false);

  const handleSaveSettings = async () => {
    if (!promoterProfile) return;
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('promoter_profiles')
        .update({ qr_image_url: settingsQr, whatsapp_number: settingsWhatsapp })
        .eq('user_id', currentUser.id);
      if (error) throw error;
      alert('¡Configuración guardada!');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const tabs: { id: PromoterTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Inicio', icon: HomeIcon },
    { id: 'clients', label: 'Clientes', icon: UsersIcon },
    { id: 'finance', label: 'Financiero', icon: WalletIcon },
    { id: 'settings', label: 'Ajustes', icon: GearIcon },
  ];

  return (
    <>
      {showJornadaWizard && (
        <JornadaWizard
          onCancel={() => setShowJornadaWizard(false)}
          onSave={handleCreateJornada}
        />
      )}
      {viewingCarton && (
        <CartonModal
          carton={viewingCarton}
          jornada={config.jornadas.find(j => j.id === viewingCarton.jornadaId) || null}
          teams={config.teams}
          appName={config.appName}
          logoUrl={config.logoUrl}
          onClose={() => setViewingCarton(null)}
          onSave={() => {}}
          isReadOnly={true}
        />
      )}
      {/* Edit Jornada Modal */}
      {editingJornada && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full">
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
              <h2 className="text-xl font-bold">✏️ Editar Jornada</h2>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Nombre</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-gray-700 p-2 rounded border border-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Premio 1er Lugar</label>
                  <input type="text" value={editFirstPrize} onChange={e => setEditFirstPrize(e.target.value)} className="w-full bg-gray-700 p-2 rounded border border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Premio 2do Lugar</label>
                  <input type="text" value={editSecondPrize} onChange={e => setEditSecondPrize(e.target.value)} className="w-full bg-gray-700 p-2 rounded border border-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Precio del Cartón (Bs)</label>
                <input type="number" value={editCartonPrice} onChange={e => setEditCartonPrice(e.target.value)} className="w-full bg-gray-700 p-2 rounded border border-gray-600" min="0" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Estado</label>
                <div className="flex flex-wrap gap-2">
                  {(['abierta', 'en_juego', 'cerrada'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${editStatus === s ? 'bg-cyan-500 text-gray-900' : 'bg-gray-600 hover:bg-gray-500'}`}
                    >
                      {s === 'abierta' ? '🟢 Abierta' : s === 'en_juego' ? '🟡 En Juego' : '🔴 Cerrada'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Matches List */}
              <div>
                <label className="block text-sm mb-2 text-gray-300 font-bold">Partidos ({editingJornada.matches.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editingJornada.matches.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-3">No hay partidos.</p>
                  ) : (
                    editingJornada.matches.map(match => {
                      const localTeam = config.teams.find(t => t.id === match.localTeamId);
                      const visitorTeam = config.teams.find(t => t.id === match.visitorTeamId);
                      return (
                        <div key={match.id} className="flex items-center justify-between bg-gray-700/80 p-2 rounded-lg">
                          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                            <div className="flex items-center gap-1 truncate">
                              {localTeam?.logo && <img src={localTeam.logo} alt="" className="w-4 h-4 object-contain" />}
                              <span className="truncate">{localTeam?.name || 'N/A'}</span>
                            </div>
                            <span className="text-gray-500 text-xs flex-shrink-0">vs</span>
                            <div className="flex items-center gap-1 truncate">
                              <span className="truncate">{visitorTeam?.name || 'N/A'}</span>
                              {visitorTeam?.logo && <img src={visitorTeam.logo} alt="" className="w-4 h-4 object-contain" />}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar ${localTeam?.name} vs ${visitorTeam?.name}?`)) {
                                setEditingJornada(prev => prev ? {
                                  ...prev,
                                  matches: prev.matches.filter(m => m.id !== match.id),
                                  botinMatchId: prev.botinMatchId === match.id ? null : prev.botinMatchId
                                } : null);
                              }
                            }}
                            className="ml-2 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full flex-shrink-0 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 flex justify-end gap-3 rounded-b-lg">
              <button onClick={() => setEditingJornada(null)} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
              <button onClick={handleSaveEditJornada} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Guardar</button>
            </div>
          </div>
        </div>
      )}
      <div className="relative flex flex-col h-full bg-gray-900 text-white overflow-hidden">
        <Header
          appName={config.appName}
          logoUrl={config.logoUrl}
          userRole="promoter"
          currentUser={currentUser}
          primaryColor={config.theme.primaryColor}
          userCartonCount={0}
          onHomeClick={onExit}
          onLoginClick={() => {}}
          onRegisterClick={() => {}}
          onAdminClick={() => {}}
          onLogoutClick={onLogout}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          <div className="bg-gray-800/80 p-2 text-center border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
              🎪 Promotor: {promoterProfile?.displayName || currentUser.username}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 col-span-2 p-4 rounded-xl">
                <h3 className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Gran Pozo Global</h3>
                <p className="text-3xl font-black text-white stat-value mt-1">Bs {Math.floor(config.globalJackpot || 0).toLocaleString('es-ES')}</p>
              </div>
              <div className="stat-card stat-card-green">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Mi Saldo</h3>
                <p className="text-2xl font-black text-green-400 stat-value mt-1">Bs {Math.floor(currentUser.balance || 0).toLocaleString('es-ES')}</p>
              </div>
              <div className="stat-card stat-card-cyan">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Comisión Directa</h3>
                <p className={`text-2xl font-black stat-value mt-1 text-cyan-400`}>
                  20%
                </p>
              </div>
              <div className="stat-card stat-card-purple">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Cartones Vendidos</h3>
                <p className="text-2xl font-black text-white stat-value mt-1">{myCartonesCount}</p>
              </div>
              <div className="stat-card stat-card-amber">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Comisiones Ganadas</h3>
                <p className="text-2xl font-black text-yellow-400 stat-value mt-1">Bs {Math.floor(totalCommissionsEarned).toLocaleString('es-ES')}</p>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                {/* Referral Code Card */}
                {promoterProfile?.referralCode && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-300 mb-1">Tu código universal (registro + acceso jornadas privadas)</p>
                    <p className="text-2xl font-mono font-black text-purple-300 tracking-widest">{promoterProfile.referralCode}</p>
                  </div>
                )}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-2">📊 Resumen</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Clientes referidos</span><span className="font-bold">{myClients.length}</span></div>
                    <div className="flex justify-between border-t border-gray-700 pt-2"><span className="text-gray-400">Tus comisiones ganadas</span><span className="font-bold text-green-400">+Bs {Math.floor(totalCommissionsEarned).toLocaleString('es-ES')}</span></div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'clients' && (
              <div className="space-y-4">
                {/* Transfer Balance */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-cyan-400">💸 Transferir Saldo a Cliente</h3>
                    <span className="text-xs font-bold text-green-400 bg-green-900/30 border border-green-500/30 px-2 py-1 rounded-lg">
                      Mi Saldo: ∞
                    </span>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={transferClientId}
                      onChange={e => setTransferClientId(e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
                    >
                      <option value="">Seleccionar cliente...</option>
                      {myClients.filter(c => c.status === 'active').map(c => (
                        <option key={c.id} value={c.id}>{c.username} (Bs {Math.floor(c.balance || 0)})</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={e => setTransferAmount(e.target.value)}
                        placeholder="Monto (Bs)"
                        className="flex-1 bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
                        min="1"
                      />
                      <button
                        onClick={handleTransfer}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-sm transition"
                      >
                        Transferir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client List */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-3">👥 Mis Clientes ({myClients.length})</h3>
                  {promoterProfile?.referralCode && (
                    <div className="bg-purple-900/30 border border-purple-500/30 p-3 rounded-lg mb-3">
                      <p className="text-xs text-gray-300">Tu código de referido:</p>
                      <p className="text-lg font-mono font-bold text-purple-300">{promoterProfile.referralCode}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Comparte este código para que tus clientes se registren vinculados a ti.</p>
                    </div>
                  )}
                  {myClients.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No tienes clientes referidos aún.</p>
                  ) : (
                    <div className="space-y-2">
                      {myClients.map(c => {
                          const clientCartones = config.cartones.filter(cart => cart.userId === c.id);
                          const isExpanded = expandedClient === c.id;

                          return (
                            <div key={c.id} className="bg-gray-900/50 rounded-lg overflow-hidden">
                                <div className="flex justify-between items-center p-3">
                                  <div>
                                    <span className="font-semibold text-sm">{c.username}</span>
                                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                      {c.status === 'active' ? 'Activo' : 'Pendiente'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <span className="text-sm font-bold text-cyan-300">Bs {Math.floor(c.balance || 0)}</span>
                                      <button 
                                        onClick={() => setExpandedClient(isExpanded ? null : c.id)}
                                        className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded hover:bg-purple-500/30 transition flex items-center gap-1"
                                      >
                                          <TicketIcon className="w-3 h-3" />
                                          Cartones ({clientCartones.length})
                                      </button>
                                  </div>
                                </div>
                                {isExpanded && (
                                    <div className="p-3 bg-gray-800/50 border-t border-gray-700/50">
                                        {clientCartones.length === 0 ? (
                                            <p className="text-xs text-gray-500 text-center py-2">Este cliente no ha comprado cartones.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {clientCartones.map(cart => {
                                                    const jornada = config.jornadas.find(j => j.id === cart.jornadaId);
                                                    
                                                    const totalMatches = jornada?.matches.length || 0;
                                                    let liveHits = 0;
                                                    let misses = 0;
                                                    let matchesWithResult = 0;

                                                    if (jornada) {
                                                        jornada.matches.forEach(match => {
                                                            let finalResult = match.result;

                                                            if (!jornada.resultsProcessed && !finalResult) {
                                                                const localTeam = config.teams.find(t => t.id === match.localTeamId);
                                                                const visitorTeam = config.teams.find(t => t.id === match.visitorTeamId);
                                                                const liveMatch = liveEvents.find(e => isMatchMatch(e.id, e.team1.name, e.team2.name, match.id, localTeam?.name, visitorTeam?.name, e.startDate, match.dateTime));
                                                                if (liveMatch && (liveMatch.status === 'FT' || liveMatch.status === 'AET' || liveMatch.status === 'AP')) {
                                                                    if (liveMatch.score1! > liveMatch.score2!) finalResult = '1';
                                                                    else if (liveMatch.score1! < liveMatch.score2!) finalResult = '2';
                                                                    else finalResult = 'X';
                                                                }
                                                            }

                                                            if (finalResult) {
                                                                matchesWithResult++;
                                                                if (cart.predictions[match.id] === finalResult) {
                                                                    liveHits++;
                                                                } else {
                                                                    misses++;
                                                                }
                                                            }
                                                        });
                                                    }

                                                    let displayHits = liveHits;
                                                    let displayMisses = misses;
                                                    let displayFinished = matchesWithResult;

                                                    if (jornada?.resultsProcessed && typeof cart.hits === 'number') {
                                                        displayHits = cart.hits;
                                                        displayMisses = Math.max(0, totalMatches - cart.hits);
                                                        displayFinished = totalMatches;
                                                    } else if (jornada) {
                                                        let allFinished = true;
                                                        const now = new Date().getTime();
                                                        jornada.matches.forEach(m => {
                                                            if (new Date(m.dateTime).getTime() + 2 * 60 * 60 * 1000 > now) allFinished = false;
                                                        });
                                                        if (allFinished) displayFinished = totalMatches;
                                                    }

                                                    return (
                                                        <div key={cart.id} onClick={() => setViewingCarton(cart)} className="flex flex-col gap-2 text-xs bg-gray-800 p-2 rounded border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
                                                            <div className="flex justify-between items-center">
                                                                <div className="truncate pr-2">
                                                                    <span className="font-bold text-cyan-400">{jornada?.name || 'Jornada Desconocida'}</span>
                                                                    <span className="text-gray-500 ml-2">{new Date(cart.purchaseDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="text-gray-300 whitespace-nowrap">
                                                                    Ver detalles &gt;
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center mt-1">
                                                                <div className="flex items-center bg-gray-900/50 rounded-full border border-gray-700/50 shadow-inner overflow-hidden">
                                                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold border-r border-gray-700/50">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                                        {displayHits} Aciertos
                                                                    </div>
                                                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-bold border-r border-gray-700/50">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                        {displayMisses} Fallos
                                                                    </div>
                                                                    <div className="px-2 py-0.5 flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                                        {displayFinished} / {totalMatches} finalizados
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                          );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-4">
                {/* Guarantee Info */}
                <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30 p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-3">💰 Estado de Garantía</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-300">Depósito total</span><span className="font-bold text-green-400">Bs {Math.floor(guaranteeBalance).toLocaleString('es-ES')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Comisión consumida ({commissionRate}%)</span><span className="font-bold text-yellow-400">-Bs {Math.floor(commissionConsumed).toLocaleString('es-ES')}</span></div>
                    <div className="flex justify-between border-t border-gray-600 pt-2"><span className="text-white font-bold">Garantía restante</span><span className={`font-bold text-lg ${guaranteeRemaining > 0 ? 'text-cyan-400' : 'text-red-400'}`}>Bs {Math.floor(guaranteeRemaining).toLocaleString('es-ES')}</span></div>
                  </div>
                  {guaranteeRemaining <= 0 && (
                    <div className="mt-3 bg-red-900/30 border border-red-500/50 p-2 rounded text-xs text-red-300">
                      ⚠️ Tu garantía se ha agotado. Contacta al administrador para depositar más y seguir operando.
                    </div>
                  )}
                </div>

                {/* Solicitudes de Recarga de Clientes */}
                <ClientRechargesTab currentUser={currentUser} config={config} onProcessClientRecharge={onProcessClientRecharge} />

                {/* Revenue Breakdown */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-3">📊 Desglose de Ingresos por Jornada</h3>
                  {myJornadas.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No hay jornadas para mostrar.</p>
                  ) : (
                    <div className="space-y-2">
                      {myJornadas.map(j => {
                        const cartones = getCartonesForJornada(j.id);
                        const revenue = cartones.length * j.cartonPrice;
                        const commission = revenue * (commissionRate / 100);
                        return (
                          <div key={j.id} className="bg-gray-900/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm">{j.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                j.status === 'abierta' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                              }`}>{j.status}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[11px] mt-1">
                              <div><span className="text-gray-400">Ventas: </span><span className="text-white font-bold">{cartones.length}</span></div>
                              <div><span className="text-gray-400">Ingreso: </span><span className="text-green-400 font-bold">Bs {Math.floor(revenue)}</span></div>
                              <div><span className="text-gray-400">Comisión: </span><span className="text-yellow-400 font-bold">Bs {Math.floor(commission)}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Transaction History */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-3">📝 Historial de Transacciones</h3>
                  {config.transactions.filter(t => t.userId === currentUser.id).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No hay transacciones aún.</p>
                  ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {config.transactions.filter(t => t.userId === currentUser.id).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center text-xs py-2 border-b border-gray-700/50 last:border-0">
                          <div>
                            <span className="font-medium text-white">{tx.description || tx.type}</span>
                            <p className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleDateString('es-ES')}</p>
                          </div>
                          <span className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount >= 0 ? '+' : ''}Bs {Math.floor(tx.amount).toLocaleString('es-ES')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-purple-400">⚙️ Configuración de Pago</h2>
                <p className="text-sm text-gray-400">Configura tu QR de pago y WhatsApp. Tus clientes verán esta información al recargar saldo.</p>
                
                <div className="bg-gray-800 p-6 rounded-lg space-y-5">
                  <ImageUpload
                    label="Tu Código QR de Pago"
                    imageUrl={settingsQr}
                    onImageSelect={setSettingsQr}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Número de WhatsApp</label>
                    <input
                      type="tel"
                      value={settingsWhatsapp}
                      onChange={e => setSettingsWhatsapp(e.target.value)}
                      className="w-full bg-gray-700 p-2.5 rounded-lg border border-gray-600"
                      placeholder="+58 412 1234567"
                    />
                    <p className="text-xs text-gray-500 mt-1">Incluye código de país. Ej: +58412...</p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold transition disabled:opacity-50"
                  >
                    {savingSettings ? 'Guardando...' : '💾 Guardar Configuración'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Nav */}
        <nav className="absolute bottom-3 left-4 right-4 z-40 bg-[#020617]/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden">
          <div className="flex justify-around items-center h-16 w-full px-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 active:scale-95 transition-transform ${activeTab === tab.id ? 'text-purple-400' : 'text-slate-500'}`}
              >
                <tab.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-[9px] font-medium leading-tight text-center px-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default PromoterPage;
