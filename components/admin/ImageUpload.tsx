import React, { useRef } from 'react';
import UploadIcon from '../icons/UploadIcon';

interface ImageUploadProps {
    label: string;
    imageUrl: string;
    onImageSelect: (dataUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, imageUrl, onImageSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    onImageSelect(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center overflow-hidden border border-gray-600">
                    {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 text-center px-2">Sin imagen</span>}
                </div>
                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-500 text-white">
                    <UploadIcon className="h-5 w-5"/>
                    Subir...
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
