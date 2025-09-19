import React, { useState, useMemo } from 'react';
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
}

const UserModal: React.FC<{
    user: Partial<RegisteredUser> | null;
    role: 'client' | 'seller';
    sellers: RegisteredUser[];
    onClose: () => void;
    onSave: (user: RegisteredUser) => void;
}> = ({ user, role, sellers, onClose, onSave }) => {
    
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: user?.password || '',
        phone: user?.phone || '',
        country: user?.country || COUNTRIES[0].code,
        assignedSellerId: user?.assignedSellerId || ''
    });

    if (!user) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.username || !formData.email || !formData.password) {
            alert('Por favor, complete al menos el usuario, correo y contraseña.');
            return;
        }
        onSave({
            id: user.id || new Date().toISOString(),
            ...formData,
            role,
            status: user.status || 'active',
            balance: user.balance || 0,
        });
        onClose();
    };
    
    const modalTitle = user.id 
        ? `Editar ${role === 'client' ? 'Cliente' : 'Vendedor'}`
        : `Añadir ${role === 'client' ? 'Cliente' : 'Vendedor'}`;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
                    <div className="space-y-4">
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Nombre de usuario" />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Correo electrónico" />
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Contraseña" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded" placeholder="Teléfono" />
                            <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded"><option value="">Seleccionar País...</option>{COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
                        </div>
                        {role === 'client' && (
                            <div>
                                <label className="block mb-1 text-sm">Asignar Vendedor</label>
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
        if (rechargeAmount > 0) {
            onRecharge(user.id, rechargeAmount);
            onClose();
        } else {
            alert('Por favor, ingrese un monto válido.');
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
                            placeholder="Ej. 100.00"
                            min="0.01"
                            step="0.01"
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


const UsersTab: React.FC<UsersTabProps> = ({ config, setConfig, onActivateUser, onRechargeUser }) => {
    const [activeSubTab, setActiveSubTab] = useState<'client' | 'seller'>('client');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalUser, setModalUser] = useState<Partial<RegisteredUser> | null>(null);
    const [rechargeModalUser, setRechargeModalUser] = useState<RegisteredUser | null>(null);

    const sellers = useMemo(() => config.users.filter(u => u.role === 'seller'), [config.users]);

    const handleSaveUser = (user: RegisteredUser) => {
        setConfig(prev => {
            const userExists = prev.users.some(u => u.id === user.id);
            const updatedUsers = userExists 
                ? prev.users.map(u => u.id === user.id ? user : u)
                : [...prev.users, user];
            return { ...prev, users: updatedUsers };
        });
    };

    const handleDeleteUser = (userId: string) => {
        const userToDelete = config.users.find(u => u.id === userId);
        if (!userToDelete) return;

        let confirmationMessage = `¿Estás seguro de que quieres eliminar a ${userToDelete.username}?`;
        if (userToDelete.role === 'seller') {
            confirmationMessage += '\n\nLos clientes asignados a este vendedor quedarán como "Sin Asignar".';
        }

        if (window.confirm(confirmationMessage)) {
            setConfig(prev => {
                let updatedUsers = prev.users.filter(u => u.id !== userId);
                if (userToDelete.role === 'seller') {
                    updatedUsers = updatedUsers.map(u => {
                        if (u.role === 'client' && u.assignedSellerId === userId) {
                            return { ...u, assignedSellerId: null };
                        }
                        return u;
                    });
                }
                return { ...prev, users: updatedUsers };
            });
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
            {modalUser && <UserModal user={modalUser} role={activeSubTab} sellers={sellers} onClose={() => setModalUser(null)} onSave={handleSaveUser} />}
            {rechargeModalUser && onRechargeUser && <RechargeModal user={rechargeModalUser} onClose={() => setRechargeModalUser(null)} onRecharge={onRechargeUser} />}
            
            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                     <div className="flex border-b border-gray-700">
                        <button onClick={() => { setActiveSubTab('client'); setSearchQuery(''); }} className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'client' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-400 hover:text-white'}`}>Clientes</button>
                        <button onClick={() => { setActiveSubTab('seller'); setSearchQuery(''); }} className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'seller' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-400 hover:text-white'}`}>Vendedores</button>
                    </div>
                    <button onClick={() => setModalUser({ role: activeSubTab })} className="flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-3 py-2 rounded-lg hover:bg-cyan-400">
                        <PlusIcon className="h-5 w-5" />
                        Añadir {activeSubTab === 'client' ? 'Cliente' : 'Vendedor'}
                    </button>
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
                                    <td className="px-6 py-4 font-semibold">${(user.balance || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {user.status === 'active' ? 'Activo' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
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