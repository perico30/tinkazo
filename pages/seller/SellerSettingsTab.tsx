import React, { useState, useEffect } from 'react';
import type { RegisteredUser } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import SaveIcon from '../../components/icons/SaveIcon';

interface SellerSettingsTabProps {
  currentUser: RegisteredUser;
  onUpdateUser: (updatedUser: RegisteredUser) => void;
}

const SellerSettingsTab: React.FC<SellerSettingsTabProps> = ({ currentUser, onUpdateUser }) => {
    const [formState, setFormState] = useState({
        password: currentUser.password,
        sellerWhatsappNumber: currentUser.sellerWhatsappNumber || '',
        sellerQrCodeUrl: currentUser.sellerQrCodeUrl || '',
    });

    // Este efecto es CRUCIAL. Sincroniza el estado local del formulario con cualquier
    // cambio en la prop `currentUser` que viene del componente padre.
    // Esto asegura que después de guardar, el formulario refleje los datos actualizados.
    useEffect(() => {
        if (currentUser) {
            setFormState({
                password: currentUser.password,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Construye el objeto de usuario completo para enviar al padre
        const updatedUser: RegisteredUser = {
            ...currentUser, // Base con todos los datos originales (id, username, etc.)
            ...formState,   // Sobrescribe los campos que han cambiado en el formulario
        };
        onUpdateUser(updatedUser);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg space-y-6">
                <h2 className="font-semibold text-xl">Mi Información de Vendedor</h2>
                
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
                    <button type="submit" className="flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors">
                        <SaveIcon className="h-5 w-5"/>
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerSettingsTab;