import React, { useRef, useState } from 'react';
import UploadIcon from '../icons/UploadIcon';

interface ImageUploadProps {
    label: string;
    imageUrl: string;
    onImageSelect: (dataUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, imageUrl, onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (e.g., limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Por favor, elige una imagen de menos de 5MB.');
            return;
        }

        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) {
                setIsProcessing(false);
                alert("No se pudo leer el archivo.");
                return;
            }
            const img = new Image();
            img.onload = () => {
                const MAX_WIDTH = 512;
                const MAX_HEIGHT = 512;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsProcessing(false);
                    alert("Error al procesar la imagen. El contexto del canvas no está disponible.");
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Use WebP for better compression, with a quality of 0.9 (adjust as needed)
                const dataUrl = canvas.toDataURL('image/webp', 0.9);
                onImageSelect(dataUrl);
                setIsProcessing(false);
            };
            img.onerror = () => {
                setIsProcessing(false);
                alert("El archivo seleccionado no pudo ser cargado como imagen. Por favor, intente con otro archivo.");
            };
            img.src = event.target.result as string;
        };
        reader.onerror = () => {
            setIsProcessing(false);
            alert("Error al leer el archivo.");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center overflow-hidden border border-gray-600">
                    {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 text-center px-2">Sin imagen</span>}
                </div>
                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center justify-center gap-2 bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-500 text-white disabled:opacity-70 disabled:cursor-wait w-36"
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <UploadIcon className="h-5 w-5"/>
                            <span>Subir...</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
