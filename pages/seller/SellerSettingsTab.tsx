import React, { useState, useEffect } from 'react';
import type { RegisteredUser } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import SaveIcon from '../../components/icons/SaveIcon';
import { supabase } from '../../supabaseClient';

interface SellerSettingsTabProps {
  currentUser: RegisteredUser;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
}

const SellerSettingsTab: React.FC<SellerSettingsTabProps> = ({ currentUser, onUpdateUser }) => {
    const [formState, setFormState] = useState({
        password: '', // New password field, initially empty
        sellerWhatsappNumber: currentUser.sellerWhatsappNumber || '',
        sellerQrCodeUrl: currentUser.sellerQrCodeUrl || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Este efecto es CRUCIAL. Sincroniza el estado local del formulario con cualquier
    // cambio en la prop `currentUser` que viene del componente padre.
    // Esto asegura que después de guardar, el formulario refleje los datos actualizados.
    useEffect(() => {
        if (currentUser) {
            setFormState({
                password: '', // Keep empty unless typing a new one
                sellerWhatsappNumber: currentUser.sellerWhatsappNumber || '',
                sellerQrCodeUrl: currentUser.sellerQrCodeUrl || '',
            });
        }
    }, [currentUser]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (url: string) => {
        setFormState(prev => ({ ...prev, sellerQrCodeUrl: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        try {
            // Update password if provided
            if (formState.password) {
                const { error } = await supabase.auth.updateUser({ password: formState.password });
                if (error) throw error;
            }

            // Update profile
            const updatedUser: RegisteredUser = {
                ...currentUser,
                sellerWhatsappNumber: formState.sellerWhatsappNumber,
                sellerQrCodeUrl: formState.sellerQrCodeUrl,
            };
            onUpdateUser(updatedUser);
            
            setMessage('¡Configuración guardada! ' + (formState.password ? 'Contraseña actualizada.' : ''));
            setFormState(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (error: any) {
            setMessage('Error: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg space-y-6">
                <h2 className="font-semibold text-xl border-b border-gray-600 pb-2">Mi Configuración</h2>
                
                {message && (
                    <div className={`p-3 rounded ${message.startsWith('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {message}
                    </div>
                )}
                
                <div>
                    <label className="block mb-1 text-sm text-gray-300">Cambiar Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formState.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-600 p-2 rounded border border-gray-500"
                        placeholder="Nueva contraseña"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm text-gray-300">Número de WhatsApp</label>
                    <input
                        type="tel"
                        name="sellerWhatsappNumber"
                        value={formState.sellerWhatsappNumber}
                        onChange={handleInputChange}
                        className="w-full bg-gray-600 p-2 rounded border border-gray-500"
                        placeholder="Ej. +521234567890"
                    />
                     <p className="text-xs text-gray-500 mt-1">Tus clientes usarán este número para enviarte comprobantes.</p>
                </div>
                
                <ImageUpload 
                    label="Código QR para Pagos"
                    imageUrl={formState.sellerQrCodeUrl}
                    onImageSelect={handleImageSelect}
                />
                <p className="text-xs text-gray-500 -mt-4">Sube la imagen de tu QR para que tus clientes puedan recargar.</p>


                <div className="pt-4 text-right">
                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-lg btn-gradient ml-auto disabled:opacity-50">
                        <SaveIcon className="h-5 w-5"/>
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerSettingsTab;