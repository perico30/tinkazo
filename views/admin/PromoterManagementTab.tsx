import React, { useState, useMemo } from 'react';
import type { AppConfig, RegisteredUser, PromoterProfile } from '../../types';
import { supabase } from '../../supabaseClient';

interface PromoterManagementTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onRechargeClick?: (user: RegisteredUser) => void;
}

const PromoterManagementTab: React.FC<PromoterManagementTabProps> = ({ config, setConfig, onRechargeClick }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newCommission, setNewCommission] = useState('20');
  const [newReferralCode, setNewReferralCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingGuarantee, setEditingGuarantee] = useState<string | null>(null);
  const [guaranteeAmount, setGuaranteeAmount] = useState('');
  const [expandedPromoter, setExpandedPromoter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const promoterUsers = config.users.filter(u => u.role === 'promoter');

  const getPromoterProfile = (userId: string) =>
    config.promoterProfiles.find(p => p.userId === userId);

  const getCartonesForPromoter = (userId: string) => {
    // Count cartones bought by clients referred by this promoter
    const clientIds = config.users.filter(u => u.referredBy === userId).map(u => u.id);
    return config.cartones.filter(c => clientIds.includes(c.userId));
  };

  const getRevenueForPromoter = (userId: string) => {
    const clientIds = config.users.filter(u => u.referredBy === userId).map(u => u.id);
    return config.cartones
      .filter(c => clientIds.includes(c.userId))
      .reduce((sum, c) => {
        const jornada = config.jornadas.find(j => j.id === c.jornadaId);
        return sum + (jornada?.cartonPrice || 0);
      }, 0);
  };

  const handleCreatePromoter = async () => {
    if (!newUsername || !newEmail || !newPassword || !newDisplayName || !newReferralCode) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Check if referral code is unique
    const codeExists = config.promoterProfiles.some(p => p.referralCode.toUpperCase() === newReferralCode.toUpperCase());
    if (codeExists) {
      alert('El código de referido ya existe. Elige otro.');
      return;
    }

    setIsCreating(true);
    try {
      // Step 1: Create auth user (this triggers auto-insert into public.users)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: { username: newUsername, role: 'promoter', phone: newPhone || '0000000', country: 'VE' }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const userId = authData.user.id;

      // Step 2: Wait a moment for the trigger to create the public.users row
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Update the auto-created row (trigger already inserted it)
      const { error: updateError } = await supabase.from('users').upsert({
        id: userId,
        username: newUsername,
        email: newEmail,
        phone: newPhone || '0000000',
        country: 'VE',
        role: 'promoter',
        status: 'active',
        balance: 0,
        referral_code: newReferralCode.toUpperCase()
      }, { onConflict: 'id' });
      if (updateError) {
        console.error("Error updating public.users:", updateError);
      }

      // Step 4: Insert into promoter_profiles
      const { error: profileError } = await supabase.from('promoter_profiles').insert({
        user_id: userId,
        display_name: newDisplayName,
        admin_commission_pct: parseFloat(newCommission),
        referral_code: newReferralCode.toUpperCase(),
        guarantee_balance: 0,
        status: 'active'
      });
      if (profileError) throw profileError;

      alert(`¡Promotor "${newDisplayName}" creado exitosamente! Código: ${newReferralCode.toUpperCase()}`);
      setShowCreateForm(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewDisplayName('');
      setNewCommission('20');
      setNewReferralCode('');
      setNewPhone('');
    } catch (error: any) {
      alert('Error: ' + (error.message || 'No se pudo crear el promotor'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateGuarantee = async (userId: string) => {
    const amount = parseFloat(guaranteeAmount);
    if (isNaN(amount) || amount === 0) {
      alert('Ingresa un monto válido.');
      return;
    }
    try {
      const profile = getPromoterProfile(userId);
      if (!profile) throw new Error('Perfil no encontrado');

      const newBalance = profile.guaranteeBalance + amount;

      const { data, error } = await supabase
        .from('promoter_profiles')
        .update({ guarantee_balance: newBalance })
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('La base de datos no se actualizó (0 filas afectadas). Esto suele ocurrir porque faltan las políticas de seguridad (RLS) para permitir a los administradores actualizar la tabla promoter_profiles.');
      }

      // Create a transaction record
      await supabase.from('transactions').insert({
        user_id: userId,
        amount: amount,
        type: 'guarantee_deposit',
        description: amount > 0 
          ? `Depósito de saldo: +Bs ${amount}` 
          : `Ajuste de saldo: Bs ${amount}`
      });

      // Update local state immediately
      setConfig(prev => ({
        ...prev,
        promoterProfiles: prev.promoterProfiles.map(p =>
          p.userId === userId ? { ...p, guaranteeBalance: newBalance } : p
        )
      }));

      alert(`Saldo actualizado: ${amount > 0 ? '+' : ''}Bs ${amount}`);
      setEditingGuarantee(null);
      setGuaranteeAmount('');
    } catch (error: any) {
      alert('Error: ' + (error.message || 'No se pudo actualizar'));
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? 'suspender' : 'activar';
    if (!window.confirm(`¿Estás seguro de ${action} a este promotor?`)) return;
    try {
      const { error } = await supabase
        .from('promoter_profiles')
        .update({ status: newStatus })
        .eq('user_id', userId);
      if (error) throw error;
      setConfig(prev => ({
        ...prev,
        promoterProfiles: prev.promoterProfiles.map(p =>
          p.userId === userId ? { ...p, status: newStatus as 'active' | 'suspended' } : p
        )
      }));
      alert(`Promotor ${newStatus === 'active' ? 'activado' : 'suspendido'} exitosamente.`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleDeletePromoter = async (userId: string, username: string) => {
    if (!window.confirm(`¿Eliminar al promotor "${username}"?\n\nSus clientes quedarán asignados al administrador. Esta acción no se puede deshacer.`)) return;
    try {
      // Unassign clients that were referred by this promoter
      await supabase
        .from('users')
        .update({ referred_by: null, assigned_seller_id: null })
        .eq('referred_by', userId);

      // Delete promoter profile first
      const { error: profileError } = await supabase
        .from('promoter_profiles')
        .delete()
        .eq('user_id', userId);
      if (profileError) throw profileError;

      // Delete user record
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (userError) throw userError;

      setConfig(prev => ({
        ...prev,
        promoterProfiles: prev.promoterProfiles.filter(p => p.userId !== userId),
        users: prev.users.map(u => 
          u.referredBy === userId ? { ...u, referredBy: null, assignedSellerId: null } : u
        ).filter(u => u.id !== userId)
      }));
      alert('Promotor eliminado. Sus clientes ahora están con el administrador.');
    } catch (e: any) {
      alert('Error al eliminar: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-purple-400">🎪 Gestión de Promotores</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition"
        >
          {showCreateForm ? 'Cancelar' : '+ Crear Promotor'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg space-y-3">
          <h3 className="font-bold text-purple-300">Crear Nuevo Promotor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nombre del promotor</label>
              <input
                type="text"
                value={newDisplayName}
                onChange={e => setNewDisplayName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Usuario</label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Ej: juanperez"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Correo</label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Contraseña segura"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Código de referido</label>
              <input
                type="text"
                value={newReferralCode}
                onChange={e => setNewReferralCode(e.target.value.toUpperCase())}
                placeholder="Ej: TIGRE24"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Teléfono</label>
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="71234567"
                className="w-full bg-gray-700 p-2 rounded-lg border border-gray-600 text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleCreatePromoter}
            disabled={isCreating}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition disabled:opacity-50"
          >
            {isCreating ? 'Creando...' : 'Crear Promotor'}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-green-400 mb-3">💰 Resumen General</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{promoterUsers.length}</div>
            <div className="text-xs text-gray-400">Promotores</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {promoterUsers.reduce((total, u) => total + getCartonesForPromoter(u.id).length, 0)}
            </div>
            <div className="text-xs text-gray-400">Cartones Vendidos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              Bs {Math.floor(
                promoterUsers.reduce((total, u) => total + getRevenueForPromoter(u.id), 0)
              ).toLocaleString('es-ES')}
            </div>
            <div className="text-xs text-gray-400">Ingresos Generados</div>
          </div>
        </div>
      </div>

      {/* Promoter List */}
      {promoterUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No hay promotores creados aún.</div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Buscar promotor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700/80 border border-slate-600 p-2.5 rounded-lg mb-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 focus:outline-none transition-colors text-sm"
          />
          <div className="space-y-1">
            {promoterUsers
              .filter(u => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                const profile = getPromoterProfile(u.id);
                return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (profile?.displayName || '').toLowerCase().includes(q) || (profile?.referralCode || '').toLowerCase().includes(q);
              })
              .map(user => {
              const profile = getPromoterProfile(user.id);
              const cartones = getCartonesForPromoter(user.id);
              const revenue = getRevenueForPromoter(user.id);
              const commission = revenue * ((profile?.adminCommissionPct || 10) / 100);
              const jornadas = config.jornadas.filter(j => j.promoterId === user.id);
              const clients = config.users.filter(u => u.referredBy === user.id);
              const isExpanded = expandedPromoter === user.id;

              return (
                <div key={user.id} className="rounded-lg overflow-hidden">
                  {/* Compact Row */}
                  <button
                    onClick={() => setExpandedPromoter(prev => prev === user.id ? null : user.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 text-left transition-colors ${isExpanded ? 'bg-purple-900/30' : 'bg-slate-800/50 hover:bg-slate-700/40'}`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
                      {(profile?.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">{profile?.displayName || user.username}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${profile?.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {profile?.status === 'active' ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-purple-300 font-mono">{profile?.referralCode || 'N/A'}</span>
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-green-400 font-bold shrink-0">Bs {Math.floor(profile?.guaranteeBalance || 0).toLocaleString('es-ES')}</span>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-slate-700/30 border-t border-purple-500/20 p-3 space-y-3">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-gray-900/50 p-2 rounded">
                          <div className="text-gray-400">Saldo</div>
                          <div className="font-bold text-green-400">Bs {Math.floor(profile?.guaranteeBalance || 0).toLocaleString('es-ES')}</div>
                        </div>
                        <div className="bg-gray-900/50 p-2 rounded">
                          <div className="text-gray-400">Cartones Vendidos</div>
                          <div className="font-bold text-white">{cartones.length}</div>
                        </div>
                        <div className="bg-gray-900/50 p-2 rounded">
                          <div className="text-gray-400">Ingresos Generados</div>
                          <div className="font-bold text-cyan-400">Bs {Math.floor(revenue).toLocaleString('es-ES')}</div>
                        </div>
                        <div className="bg-gray-900/50 p-2 rounded">
                          <div className="text-gray-400">Clientes</div>
                          <div className="font-bold text-white">{clients.length}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">{profile?.adminCommissionPct || 20}% comisión</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-600/30 text-gray-400">@{user.username}</span>
                      </div>

                      {/* Guarantee Management */}
                      {editingGuarantee === user.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={guaranteeAmount}
                            onChange={e => setGuaranteeAmount(e.target.value)}
                            placeholder="Monto (+ o -)"
                            className="flex-1 bg-gray-700 p-2 rounded border border-gray-600 text-sm"
                          />
                          <button
                            onClick={() => handleUpdateGuarantee(user.id)}
                            className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold transition"
                          >
                            Aplicar
                          </button>
                          <button
                            onClick={() => { setEditingGuarantee(null); setGuaranteeAmount(''); }}
                            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingGuarantee(user.id)}
                          className="w-full py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 rounded-lg text-sm text-green-300 font-bold transition"
                        >
                          💰 Ajustar Saldo
                        </button>
                      )}

                      {/* Jornadas Summary */}
                      {jornadas.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400">Jornadas ({jornadas.length}):</p>
                          {jornadas.map(j => {
                            const jCartones = config.cartones.filter(c => c.jornadaId === j.id);
                            return (
                              <div key={j.id} className="flex justify-between text-xs bg-gray-900/30 p-2 rounded">
                                <span>{j.name}</span>
                                <div className="flex gap-3">
                                  <span className="text-gray-400">{jCartones.length} cartones</span>
                                  <span className={`${j.status === 'abierta' ? 'text-green-400' : 'text-gray-500'}`}>{j.status}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-700">
                        <button
                          onClick={() => handleToggleStatus(user.id, profile?.status || 'active')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                            profile?.status === 'active'
                              ? 'bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 text-yellow-300'
                              : 'bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 text-green-300'
                          }`}
                        >
                          {profile?.status === 'active' ? '⏸️ Suspender' : '▶️ Activar'}
                        </button>
                        <button
                          onClick={() => handleDeletePromoter(user.id, user.username)}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 transition"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoterManagementTab;
