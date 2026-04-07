import React, { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';
import type { AppConfig, RegisteredUser } from '../../types';
import { COUNTRIES } from '../../constants/countries';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import WalletIcon from '../../components/icons/WalletIcon';

interface UsersTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onActivateUser?: (userId: string) => void;
  onRechargeUser?: (userId: string, amount: number) => void;
  onViewClientTickets?: (client: RegisteredUser) => void;
}

const EditUserModal: React.FC<{
    user: RegisteredUser;
    role: 'client' | 'seller';
    sellers: RegisteredUser[];
    onClose: () => void;
    onSave: (user: RegisteredUser) => void;
}> = ({ user, role, sellers, onClose, onSave }) => {
    
    const [formData, setFormData] = useState({
        username: user.username || '',
        phone: user.phone || '',
        country: user.country || COUNTRIES[0].code,
        assignedSellerId: user.assignedSellerId || '',
        role: user.role || 'client'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.username) {
            alert('Por favor, complete el usuario.');
            return;
        }
        onSave({
            ...user,
            ...formData,
        });
        onClose();
    };
    
    const modalTitle = `Editar ${role === 'client' ? 'Cliente' : 'Vendedor'}`;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Usuario</label>
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Nombre de usuario" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Correo Electrónico (No modificable)</label>
                            <input type="email" value={user.email} disabled className="w-full bg-gray-600/50 text-gray-400 p-2 rounded cursor-not-allowed" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm text-gray-400">Teléfono</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Teléfono" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-400">País</label>
                                <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar País...</option>{COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Rol del Usuario</label>
                            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded">
                                <option value="client">Cliente</option>
                                <option value="seller">Vendedor</option>
                            </select>
                        </div>
                        {formData.role === 'client' && (
                            <div>
                                <label className="block mb-1 text-sm text-gray-400">Asignar Vendedor</label>
                                <select name="assignedSellerId" value={formData.assignedSellerId || ''} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded">
                                    <option value="">Sin Asignar</option>
                                    {sellers.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Guardar</button>
                </div>
            </div>
        </div>
    );
}

const RechargeModal: React.FC<{
    user: RegisteredUser | null;
    onClose: () => void;
    onRecharge: (userId: string, amount: number) => void;
}> = ({ user, onClose, onRecharge }) => {
    const [amount, setAmount] = useState('');

    if (!user) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const rechargeAmount = parseFloat(amount);
        if (rechargeAmount !== 0 && !isNaN(rechargeAmount)) {
            onRecharge(user.id, rechargeAmount);
            onClose();
        } else {
            alert('Por favor, ingrese un monto válido (diferente de cero).');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">Recargar Saldo</h2>
                    <p className="text-sm text-gray-400 mb-4">Usuario: <span className="font-semibold text-white">{user.username}</span></p>
                    <div>
                        <label className="block mb-1 text-sm">Monto a Recargar</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-gray-700 p-2 rounded"
                            placeholder="Ej. 100 o -50"
                            step="1"
                            autoFocus
                            required
                        />
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Confirmar</button>
                </div>
            </form>
        </div>
    );
};


const AddSellerModal: React.FC<{ onClose: () => void; onSave: (data: any) => void; }> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '', country: COUNTRIES[0].code });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSave = () => {
        if (!formData.username || !formData.email || !formData.password || formData.password.length < 6) {
            alert('Por favor, complete todos los campos (Mínimo 6 caracteres para contraseña).');
            return;
        }
        onSave(formData);
    };
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Registrar Nuevo Vendedor</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Nombre o Alias</label>
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Nombre completo o Alias" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Correo Electrónico</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="ejemplo@correo.com" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-400">Contraseña Provisional</label>
                            <input type="text" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Mínimo 6 caracteres" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm text-gray-400">Teléfono / WhatsApp</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="+51..." />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-gray-400">País</label>
                                <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar País...</option>{COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Registrar Vendedor</button>
                </div>
            </div>
        </div>
    );
};


const UsersTab: React.FC<UsersTabProps> = ({ config, setConfig, onActivateUser, onRechargeUser, onViewClientTickets }) => {
    const [activeSubTab, setActiveSubTab] = useState<'client' | 'seller'>('client');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalUser, setModalUser] = useState<RegisteredUser | null>(null);
    const [rechargeModalUser, setRechargeModalUser] = useState<RegisteredUser | null>(null);
    const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);

    const sellers = useMemo(() => config.users.filter(u => u.role === 'seller'), [config.users]);

    const handleAddSeller = async (sellerData: any) => {
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseAnonKey) throw new Error("Faltan variables de entorno");

            const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false, autoRefreshToken: false }
            });

            const { data, error } = await tempClient.auth.signUp({
                email: sellerData.email,
                password: sellerData.password,
                options: {
                    data: {
                        username: sellerData.username,
                        role: 'seller',
                        phone: sellerData.phone,
                        country: sellerData.country,
                    }
                }
            });

            if (error) throw error;
            
            // Si Supabase no tiene un Trigger configurado, insertamos manualmente el perfil:
            if (data?.user) {
                 const { error: insertError } = await tempClient.from('users').insert({
                    id: data.user.id,
                    username: sellerData.username,
                    email: sellerData.email,
                    role: 'seller',
                    phone: sellerData.phone,
                    country: sellerData.country,
                    status: 'active',
                    balance: 0
                 });
                 if (insertError && insertError.code !== '23505') { // 23505 = conflict/already exists
                     console.error("No se pudo auto-insertar en public.users:", insertError);
                 }
            }

            alert('¡Vendedor registrado exitosamente! Aparecerá en la lista en los próximos segundos.');
            setIsAddSellerModalOpen(false);
        } catch (e: any) {
            alert(e.message || "Error al registrar vendedor");
        }
    };

    const handleSaveUser = async (user: RegisteredUser) => {
        try {
            const { error } = await supabase.from('users').update({
                username: user.username,
                phone: user.phone,
                country: user.country,
                role: user.role,
                assigned_seller_id: user.assignedSellerId || null,
            }).eq('id', user.id);

            if (error) throw error;
            
            // Reflejar cambio localmente por rapidez, aunque Realtime lo reescriba
            setConfig(prev => {
                const updatedUsers = prev.users.map(u => u.id === user.id ? user : u);
                return { ...prev, users: updatedUsers };
            });
        } catch (e: any) {
            console.error('Error saving user:', e);
            alert('Error al guardar el usuario en la base de datos: ' + e.message);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const userToDelete = config.users.find(u => u.id === userId);
        if (!userToDelete) return;

        let confirmationMessage = `¿Estás seguro de que quieres eliminar a ${userToDelete.username}?`;
        if (userToDelete.role === 'seller') {
            confirmationMessage += '\n\nLos clientes asignados a este vendedor quedarán como "Sin Asignar".';
        }

        if (window.confirm(confirmationMessage)) {
            try {
                // Si eliminamos a un vendedor, primero liberamos sus clientes:
                if (userToDelete.role === 'seller') {
                    await supabase.from('users').update({ assigned_seller_id: null }).eq('assigned_seller_id', userId);
                }
                
                const { error } = await supabase.from('users').delete().eq('id', userId);
                if (error) throw error;
                
                setConfig(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId) }));
            } catch (e: any) {
                console.error('Error deleting user:', e);
                alert('No se pudo eliminar el usuario de la base de datos: ' + e.message);
            }
        }
    };
    
    const usersToDisplay = useMemo(() => {
        return config.users
            .filter(user => user.role === activeSubTab)
            .filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [config.users, activeSubTab, searchQuery]);

    const getSellerName = (sellerId?: string | null) => {
        if (!sellerId) return <span className="text-gray-500 italic">Sin Asignar</span>;
        const seller = sellers.find(s => s.id === sellerId);
        return seller ? seller.username : <span className="text-red-400 italic">Vendedor no encontrado</span>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            {modalUser && <EditUserModal user={modalUser} role={activeSubTab} sellers={sellers} onClose={() => setModalUser(null)} onSave={handleSaveUser} />}
            {rechargeModalUser && onRechargeUser && <RechargeModal user={rechargeModalUser} onClose={() => setRechargeModalUser(null)} onRecharge={onRechargeUser} />}
            {isAddSellerModalOpen && <AddSellerModal onClose={() => setIsAddSellerModalOpen(false)} onSave={handleAddSeller} />}
            
            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                     <div className="flex border-b border-gray-700">
                        <button onClick={() => { setActiveSubTab('client'); setSearchQuery(''); }} className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'client' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-400 hover:text-white'}`}>Clientes</button>
                        <button onClick={() => { setActiveSubTab('seller'); setSearchQuery(''); }} className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'seller' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-400 hover:text-white'}`}>Vendedores</button>
                    </div>
                    {activeSubTab === 'seller' && (
                        <button 
                            onClick={() => setIsAddSellerModalOpen(true)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Nuevo Vendedor</span>
                        </button>
                    )}
                </div>

                <div className="mb-4 bg-blue-900/30 border border-blue-500/50 rounded p-3 text-sm text-blue-200">
                    <p className="font-bold mb-1">ℹ️ Registro de Usuarios Seguros</p>
                    <p>Como ahora usamos autenticación segura de Supabase, <strong>los usuarios y vendedores deben registrarse ellos mismos</strong> desde la página pública principal. Una vez registrados, aparecerán aquí con estado "Pendiente" listos para ser verificados.</p>
                </div>

                <input
                    type="text"
                    placeholder={`Buscar ${activeSubTab === 'client' ? 'cliente' : 'vendedor'}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded mb-4"
                />

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Correo</th>
                                {activeSubTab === 'client' && <th scope="col" className="px-6 py-3">Vendedor Asignado</th>}
                                <th scope="col" className="px-6 py-3">Saldo</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersToDisplay.map(user => (
                                <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    {activeSubTab === 'client' && <td className="px-6 py-4">{getSellerName(user.assignedSellerId)}</td>}
                                    <td className="px-6 py-4 font-semibold">Bs {Math.floor(user.balance || 0).toLocaleString('es-ES')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {user.status === 'active' ? 'Activo' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        {onViewClientTickets && (
                                            <button onClick={() => onViewClientTickets(user)} className="font-medium text-cyan-400 hover:underline mr-4">
                                                Ver Cartones
                                            </button>
                                        )}
                                        {onRechargeUser && (
                                            <button onClick={() => setRechargeModalUser(user)} className="p-2 text-cyan-400 hover:text-cyan-300" title="Recargar Saldo">
                                                <WalletIcon className="h-5 w-5"/>
                                            </button>
                                        )}
                                        {user.status === 'pending' && onActivateUser && (
                                            <button onClick={() => onActivateUser(user.id)} className="p-2 text-green-400 hover:text-green-300" title="Activar Usuario">
                                                <CheckCircleIcon className="h-5 w-5"/>
                                            </button>
                                        )}
                                        <button onClick={() => setModalUser(user)} className="p-2 text-gray-400 hover:text-white" title="Editar"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-500 hover:text-red-400" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {usersToDisplay.length === 0 && <p className="text-center text-gray-500 py-8">No se encontraron resultados.</p>}
                </div>
            </div>
        </div>
    );
};

export default UsersTab;