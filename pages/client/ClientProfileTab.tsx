import React, { useState } from 'react';
import type { RegisteredUser } from '../../types';
import { COUNTRIES } from '../../constants/countries';
import SaveIcon from '../../components/icons/SaveIcon';

interface ClientProfileTabProps {
  currentUser: RegisteredUser;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
}

const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ currentUser, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        password: currentUser.password,
        phone: currentUser.phone,
        country: currentUser.country,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({
            ...currentUser,
            ...formData,
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-6">
                <h2 className="font-semibold text-xl">Mi Perfil</h2>
                
                <div>
                    <label className="block mb-1 text-sm text-gray-300">Nombre de Usuario (no editable)</label>
                    <input
                        type="text"
                        value={currentUser.username}
                        className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-gray-400 cursor-not-allowed"
                        disabled
                    />
                </div>
                
                 <div>
                    <label className="block mb-1 text-sm text-gray-300">Correo Electrónico (no editable)</label>
                    <input
                        type="email"
                        value={currentUser.email}
                        className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-gray-400 cursor-not-allowed"
                        disabled
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm text-gray-300">Cambiar Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Nueva contraseña"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-gray-300">Teléfono</label>
                         <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 p-2 rounded"
                            placeholder="Tu teléfono"
                         />
                    </div>
                     <div>
                        <label className="block mb-1 text-sm text-gray-300">País</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 p-2 rounded appearance-none"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 text-right">
                    <button type="submit" className="inline-flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors">
                        <SaveIcon className="h-5 w-5"/>
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientProfileTab;