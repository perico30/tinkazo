import React, { useRef, useState } from 'react';
import type { AppConfig, SocialLink, LegalLink, CarouselImage, JackpotConfig, VideoTutorial } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import DragHandleIcon from '../../components/icons/DragHandleIcon';

interface ConfigurationTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}


const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ config, setConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for drag & drop
  const carouselDragItem = useRef<number | null>(null);
  const carouselDragOverItem = useRef<number | null>(null);
  const sectionDragItem = useRef<number | null>(null);
  const sectionDragOverItem = useRef<number | null>(null);
  const [draggingSection, setDraggingSection] = useState<number | null>(null);

  const handleValueChange = <T extends keyof AppConfig>(key: T, value: AppConfig[T]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNestedChange = <T extends keyof AppConfig, N extends keyof AppConfig[T]>(key: T, nestedKey: N, value: AppConfig[T][N]) => {
    setConfig(prev => ({ ...prev, [key]: { ...(prev[key] as object), [nestedKey]: value } }));
  };

    const handleGorditoJackpotChange = (key: keyof JackpotConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            gorditoJackpot: { ...prev.gorditoJackpot, [key]: value }
        }));
    };
    
    const handleGorditoJackpotColorChange = (colorKey: 'primary' | 'backgroundColor', value: string) => {
        setConfig(prev => ({
            ...prev,
            gorditoJackpot: {
                ...prev.gorditoJackpot,
                colors: { ...prev.gorditoJackpot.colors, [colorKey]: value }
            }
        }));
    };

    const handleBotinJackpotChange = (key: keyof JackpotConfig, value: any) => {
        setConfig(prev => ({
            ...prev,
            botinJackpot: { ...prev.botinJackpot, [key]: value }
        }));
    };

    const handleBotinJackpotColorChange = (colorKey: 'primary' | 'backgroundColor', value: string) => {
        setConfig(prev => ({
            ...prev,
            botinJackpot: {
                ...prev.botinJackpot,
                colors: { ...prev.botinJackpot.colors, [colorKey]: value }
            }
        }));
    };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          callback(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddCarouselImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, (url) => {
        const newImage: CarouselImage = { id: new Date().toISOString(), url };
        setConfig(prev => ({ ...prev, carouselImages: [...prev.carouselImages, newImage]}));
    });
  };

  const handleRemoveCarouselImage = (id: string) => {
    setConfig(prev => ({ ...prev, carouselImages: prev.carouselImages.filter(img => img.id !== id) }));
  }

  // Drag and drop for carousel
  const handleCarouselDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => { carouselDragItem.current = position; e.dataTransfer.effectAllowed = 'move'; };
  const handleCarouselDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => { carouselDragOverItem.current = position; };
  const handleCarouselDrop = () => {
    if (carouselDragItem.current === null || carouselDragOverItem.current === null) return;
    const newImages = [...config.carouselImages];
    const dragItemContent = newImages[carouselDragItem.current];
    newImages.splice(carouselDragItem.current, 1);
    newImages.splice(carouselDragOverItem.current, 0, dragItemContent);
    carouselDragItem.current = null;
    carouselDragOverItem.current = null;
    setConfig(prev => ({ ...prev, carouselImages: newImages }));
  };
  
  // Drag and drop for sections
  const handleSectionDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => { 
    sectionDragItem.current = position; 
    e.dataTransfer.effectAllowed = 'move';
    setDraggingSection(position);
  };
  const handleSectionDragEnter = (position: number) => { sectionDragOverItem.current = position; };
  const handleSectionDrop = () => {
    if (sectionDragItem.current === null || sectionDragOverItem.current === null) return;
    const newSections = [...config.sectionsOrder];
    const dragItemContent = newSections[sectionDragItem.current];
    newSections.splice(sectionDragItem.current, 1);
    newSections.splice(sectionDragOverItem.current, 0, dragItemContent);
    sectionDragItem.current = null;
    sectionDragOverItem.current = null;
    setConfig(prev => ({ ...prev, sectionsOrder: newSections }));
    setDraggingSection(null);
  };
  const handleSectionDragEnd = () => {
    setDraggingSection(null);
  }
  
  // Footer handlers
  const handleSocialChange = (index: number, key: keyof SocialLink, value: string) => {
    const newLinks = [...config.footer.socialLinks];
    newLinks[index] = { ...newLinks[index], [key]: value };
    handleNestedChange('footer', 'socialLinks', newLinks);
  };
  const addSocialLink = () => handleNestedChange('footer', 'socialLinks', [...config.footer.socialLinks, { platform: '', url: '', logoUrl: '' }]);
  const removeSocialLink = (index: number) => handleNestedChange('footer', 'socialLinks', config.footer.socialLinks.filter((_, i) => i !== index));
  const handleLegalChange = (index: 0 | 1, key: keyof LegalLink, value: string) => {
    const newLinks = [...config.footer.legalLinks] as [LegalLink, LegalLink];
    newLinks[index] = { ...newLinks[index], [key]: value };
    handleNestedChange('footer', 'legalLinks', newLinks);
  };

    const handleVideoChange = (index: number, key: keyof VideoTutorial, value: string) => {
    const newVideos = [...config.videoTutorials];
    newVideos[index] = { ...newVideos[index], [key]: value };
    handleValueChange('videoTutorials', newVideos);
  };
  const addVideoTutorial = () => handleValueChange('videoTutorials', [...config.videoTutorials, { id: new Date().toISOString(), title: '', videoUrl: '' }]);
  const removeVideoTutorial = (id: string) => handleValueChange('videoTutorials', config.videoTutorials.filter(v => v.id !== id));

  const sectionNames: { [key in AppConfig['sectionsOrder'][0]]: string } = {
    jackpots: 'Pozos Acumulados',
    carousel: 'Carrusel de Imágenes',
    jornadas: 'Jornadas Deportivas',
    tutorials: 'Videos Tutoriales',
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Apariencia */}
      <details open className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Apariencia</summary>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div><label className="block mb-1">Nombre App</label><input type="text" value={config.appName} onChange={e => handleValueChange('appName', e.target.value)} className="w-full bg-gray-700 p-2 rounded" /></div>
          <ImageUpload label="Logo de la App" imageUrl={config.logoUrl} onImageSelect={url => handleValueChange('logoUrl', url)} />
          <div>
            <label className="block mb-1">Estilo de Fondo</label>
            <select
                value={config.theme.backgroundStyle}
                onChange={e => handleNestedChange('theme', 'backgroundStyle', e.target.value as 'space' | 'business')}
                className="w-full bg-gray-700 p-2 rounded"
            >
                <option value="space">Espacial</option>
                <option value="business">Corporativo</option>
            </select>
          </div>
          <div className="flex items-center justify-between"><label>Color de Texto</label><input type="color" value={config.theme.textColor} onChange={e => handleNestedChange('theme', 'textColor', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-700" /></div>
          <div className="flex items-center justify-between md:col-span-2"><label>Color Primario (Acentos)</label><input type="color" value={config.theme.primaryColor} onChange={e => handleNestedChange('theme', 'primaryColor', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-700" /></div>
        </div>
      </details>

      {/* Orden de Secciones */}
      <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Orden de Secciones</summary>
        <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400 mb-2">Arrastra y suelta para reordenar las secciones de la página de inicio.</p>
            {config.sectionsOrder.map((sectionKey, index) => (
                <div 
                    key={sectionKey}
                    draggable
                    onDragStart={e => handleSectionDragStart(e, index)}
                    onDragEnter={() => handleSectionDragEnter(index)}
                    onDragEnd={handleSectionDragEnd}
                    onDrop={handleSectionDrop}
                    onDragOver={e => e.preventDefault()}
                    className={`flex items-center gap-4 bg-gray-700 p-3 rounded-lg cursor-grab transition-opacity ${draggingSection === index ? 'opacity-50' : ''}`}
                    aria-roledescription={`Sección arrastrable: ${sectionNames[sectionKey]}`}
                >
                    <DragHandleIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{sectionNames[sectionKey]}</span>
                </div>
            ))}
        </div>
      </details>

      {/* Inicio */}
      <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Página de Inicio</summary>
        <div className="mt-4 space-y-4">
          <h3 className="font-bold">Mensaje de Bienvenida</h3>
          <div><label className="block mb-1">Título</label><input type="text" value={config.welcomeMessage.title} onChange={e => handleNestedChange('welcomeMessage', 'title', e.target.value)} className="w-full bg-gray-700 p-2 rounded" /></div>
          <div><label className="block mb-1">Descripción</label><textarea value={config.welcomeMessage.description} onChange={e => handleNestedChange('welcomeMessage', 'description', e.target.value)} className="w-full bg-gray-700 p-2 rounded h-24"></textarea></div>
          <hr className="border-gray-600 my-4" />
          <h3 className="font-bold">Pop-up de Bienvenida</h3>
          <div className="flex items-center gap-4"><label>Activar Pop-up</label><input type="checkbox" checked={config.welcomePopup.enabled} onChange={e => handleNestedChange('welcomePopup', 'enabled', e.target.checked)} className="h-6 w-6" /></div>
          {config.welcomePopup.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-700">
                <div><label className="block mb-1">Título del Pop-up</label><input type="text" value={config.welcomePopup.title} onChange={e => handleNestedChange('welcomePopup', 'title', e.target.value)} className="w-full bg-gray-700 p-2 rounded" /></div>
                <div><label className="block mb-1">Texto del Pop-up</label><textarea value={config.welcomePopup.text} onChange={e => handleNestedChange('welcomePopup', 'text', e.target.value)} className="w-full bg-gray-700 p-2 rounded"></textarea></div>
                <ImageUpload label="Imagen del Pop-up" imageUrl={config.welcomePopup.imageUrl} onImageSelect={url => handleNestedChange('welcomePopup', 'imageUrl', url)} />
                {config.welcomePopup.imageUrl && (
                    <button 
                        type="button" 
                        onClick={() => handleNestedChange('welcomePopup', 'imageUrl', '')}
                        className="text-sm text-red-400 hover:underline -mt-2"
                    >
                        Eliminar imagen
                    </button>
                )}
            </div>
          )}
        </div>
      </details>

      {/* Gestión de Pozos */}
        <details className="bg-gray-800 p-4 rounded-lg">
            <summary className="font-semibold text-lg cursor-pointer">Gestión de Pozos</summary>
            <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-xl text-cyan-400 mb-2">Pozo "Gordito"</h3>
                    <div><label className="block mb-1 text-sm">Título</label><input type="text" value={config.gorditoJackpot.detail} onChange={e => handleGorditoJackpotChange('detail', e.target.value)} className="w-full bg-gray-600 p-2 rounded"/></div>
                    <div><label className="block mb-1 text-sm">Monto (Texto)</label><input type="text" value={config.gorditoJackpot.amount} onChange={e => handleGorditoJackpotChange('amount', e.target.value)} className="w-full bg-gray-600 p-2 rounded"/></div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Tipo de Fondo</label>
                        <select 
                            value={config.gorditoJackpot.backgroundType || 'color'} 
                            onChange={e => handleGorditoJackpotChange('backgroundType', e.target.value as 'color' | 'image')}
                            className="w-full bg-gray-600 p-2 rounded"
                        >
                            <option value="color">Color Sólido</option>
                            <option value="image">Imagen</option>
                        </select>
                    </div>
                    {config.gorditoJackpot.backgroundType === 'image' ? (
                        <ImageUpload label="Imagen de Fondo" imageUrl={config.gorditoJackpot.backgroundImage} onImageSelect={url => handleGorditoJackpotChange('backgroundImage', url)} />
                    ) : (
                        <div className="flex items-center justify-between"><label className="text-sm">Color de Fondo</label><input type="color" value={config.gorditoJackpot.colors.backgroundColor} onChange={e => handleGorditoJackpotColorChange('backgroundColor', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-600"/></div>
                    )}
                    <div className="flex items-center justify-between"><label className="text-sm">Color de Texto</label><input type="color" value={config.gorditoJackpot.colors.primary} onChange={e => handleGorditoJackpotColorChange('primary', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-600"/></div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-xl text-purple-400 mb-2">Pozo "Botín"</h3>
                     <div><label className="block mb-1 text-sm">Título</label><input type="text" value={config.botinJackpot.detail} onChange={e => handleBotinJackpotChange('detail', e.target.value)} className="w-full bg-gray-600 p-2 rounded"/></div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Monto Actual del Botín</label>
                        <input type="number" value={config.botinAmount || 0} onChange={e => handleValueChange('botinAmount', Number(e.target.value))} className="w-full bg-gray-600 p-2 rounded" step="100"/>
                         <p className="text-xs text-gray-500 mt-1">Este monto es dinámico, pero puede ajustarse manualmente.</p>
                    </div>
                     <div>
                        <label className="block mb-1 text-sm font-medium">Tipo de Fondo</label>
                        <select 
                            value={config.botinJackpot.backgroundType || 'color'} 
                            onChange={e => handleBotinJackpotChange('backgroundType', e.target.value as 'color' | 'image')}
                            className="w-full bg-gray-600 p-2 rounded"
                        >
                            <option value="color">Color Sólido</option>
                            <option value="image">Imagen</option>
                        </select>
                    </div>
                    {config.botinJackpot.backgroundType === 'image' ? (
                        <ImageUpload label="Imagen de Fondo" imageUrl={config.botinJackpot.backgroundImage} onImageSelect={url => handleBotinJackpotChange('backgroundImage', url)} />
                    ) : (
                        <div className="flex items-center justify-between"><label className="text-sm">Color de Fondo</label><input type="color" value={config.botinJackpot.colors.backgroundColor} onChange={e => handleBotinJackpotColorChange('backgroundColor', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-600"/></div>
                    )}
                    <div className="flex items-center justify-between"><label className="text-sm">Color de Texto</label><input type="color" value={config.botinJackpot.colors.primary} onChange={e => handleBotinJackpotColorChange('primary', e.target.value)} className="w-12 h-10 rounded border-none bg-gray-600"/></div>
                </div>
            </div>
        </details>

      {/* Carrusel */}
      <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Carrusel de Imágenes</summary>
        <div className="mt-4">
            <input type="file" accept="image/png, image/jpeg" className="hidden" ref={fileInputRef} onChange={handleAddCarouselImage} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {config.carouselImages.map((image, index) => (
                    <div key={image.id} className="relative group cursor-move" draggable onDragStart={e => handleCarouselDragStart(e, index)} onDragEnter={e => handleCarouselDragEnter(e, index)} onDragEnd={handleCarouselDrop} onDragOver={e => e.preventDefault()}>
                        <img src={image.url} className="w-full h-24 object-cover rounded" alt="" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => handleRemoveCarouselImage(image.id)} className="text-red-400 p-2"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
                 <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-600 rounded flex flex-col items-center justify-center h-24 hover:bg-gray-700">
                    <PlusIcon />
                    <span className="text-xs">Añadir</span>
                </button>
            </div>
        </div>
      </details>
      
      {/* Recargas */}
      <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Recargas y Bonos</summary>
        <div className="mt-4 grid md:grid-cols-1 gap-6 items-start">
            <ImageUpload label="Imagen QR para Recargas (Admin)" imageUrl={config.recharge.qrCodeUrl} onImageSelect={url => handleNestedChange('recharge', 'qrCodeUrl', url)} />
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Número de WhatsApp del Administrador</label>
                <input 
                    type="text" 
                    value={config.adminWhatsappNumber || ''} 
                    onChange={e => handleValueChange('adminWhatsappNumber', e.target.value)} 
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Ej. +51987654321"
                />
                <p className="text-xs text-gray-400 mt-1">Este número se usará como contacto de respaldo cuando un cliente no tenga un vendedor asignado.</p>
            </div>
             <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Comisión de Vendedor (%)</label>
                <input 
                    type="number" 
                    value={config.sellerCommissionPercentage || 0} 
                    onChange={e => handleValueChange('sellerCommissionPercentage', Number(e.target.value))} 
                    className="w-full bg-gray-700 p-2 rounded"
                    min="0"
                    max="100"
                />
                <p className="text-xs text-gray-400 mt-1">Porcentaje de comisión que gana un vendedor al recargar su propio saldo.</p>
            </div>
        </div>
      </details>

        {/* Videos Tutoriales */}
        <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Videos Tutoriales</summary>
        <div className="mt-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Título de la Sección</label>
              <input
                type="text"
                value={config.tutorialsSectionTitle}
                onChange={e => handleValueChange('tutorialsSectionTitle', e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
                placeholder="Ej. Aprende a Jugar"
              />
            </div>
            <p className="text-sm text-gray-400">Añade URLs de videos (ej. YouTube) para mostrar tutoriales en la página de inicio.</p>
            {config.videoTutorials.map((video, index) => (
            <div key={video.id} className="bg-gray-700/50 p-4 rounded-lg flex items-start gap-4">
                <div className="flex-grow space-y-2">
                <input
                    type="text"
                    placeholder="Título del Video"
                    value={video.title}
                    onChange={e => handleVideoChange(index, 'title', e.target.value)}
                    className="w-full bg-gray-600 p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="URL del Video (ej. https://www.youtube.com/watch?v=...)"
                    value={video.videoUrl}
                    onChange={e => handleVideoChange(index, 'videoUrl', e.target.value)}
                    className="w-full bg-gray-600 p-2 rounded"
                />
                </div>
                <button onClick={() => removeVideoTutorial(video.id)} className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-500/20 mt-2">
                <TrashIcon className="h-5 w-5"/>
                </button>
            </div>
            ))}
            <button onClick={addVideoTutorial} className="text-cyan-400 mt-2 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Añadir Video Tutorial
            </button>
        </div>
        </details>

      {/* Pie de Página */}
      <details className="bg-gray-800 p-4 rounded-lg">
        <summary className="font-semibold text-lg cursor-pointer">Pie de Página</summary>
        <div className="mt-4 space-y-6">
            <div><label className="block mb-1">Copyright</label><input type="text" value={config.footer.copyright} onChange={e => handleNestedChange('footer', 'copyright', e.target.value)} className="w-full bg-gray-700 p-2 rounded"/></div>
            <div>
                <h4 className="font-semibold mb-2">Redes Sociales</h4>
                {config.footer.socialLinks.map((link, i) => (
                    <div key={i} className="bg-gray-700/50 p-4 rounded-lg mb-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Plataforma (ej. WhatsApp)" value={link.platform} onChange={e => handleSocialChange(i, 'platform', e.target.value)} className="flex-1 bg-gray-600 p-2 rounded" />
                            <input type="text" placeholder="https://ejemplo.com" value={link.url} onChange={e => handleSocialChange(i, 'url', e.target.value)} className="flex-1 bg-gray-600 p-2 rounded" />
                            <button onClick={() => removeSocialLink(i)} className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-500/20"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                        <ImageUpload
                            label="Logo de Red Social (Opcional)"
                            imageUrl={link.logoUrl || ''}
                            onImageSelect={url => handleSocialChange(i, 'logoUrl', url)}
                        />
                    </div>
                ))}
                <button onClick={addSocialLink} className="text-cyan-400 mt-2">Añadir Red Social</button>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Textos Legales</h4>
                {config.footer.legalLinks.map((link, i) => (
                    <div key={i} className="space-y-2 mb-4">
                        <label className="block font-medium">{link.title}</label>
                        <textarea value={link.content} onChange={e => handleLegalChange(i as 0 | 1, 'content', e.target.value)} className="w-full bg-gray-700 p-2 rounded h-32" />
                    </div>
                ))}
            </div>
        </div>
      </details>
    </div>
  );
};

export default ConfigurationTab;