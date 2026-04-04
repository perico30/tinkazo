import React, { useState, useEffect } from 'react';
import JerseyIcon from '../icons/JerseyIcon';
import { findLocalLogo } from '../../utils/logoMatcher';

// Caché global en memoria para evitar solicitudes repetidas al mismo componente
const logoCache: Record<string, string | null> = {};

interface TeamLogoProps {
  teamName: string;
  fallbackUrl?: string;
  className?: string;
}

const normalizeName = (name: string) => {
    // Eliminar "F.C.", "CD", etc, para mejorar la búsqueda si es necesario, 
    // pero TheSportsDB es bastante bueno con nombres completos.
    return encodeURIComponent(name);
};

const PRESET_COLORS = [
  { primary: '#E53935', secondary: '#FFFFFF' }, // Red
  { primary: '#1E88E5', secondary: '#FFFFFF' }, // Blue
  { primary: '#43A047', secondary: '#FFFFFF' }, // Green
  { primary: '#FDD835', secondary: '#1E88E5' }, // Yellow/Blue
  { primary: '#212121', secondary: '#FFFFFF' }, // Black/White
  { primary: '#8E24AA', secondary: '#FFFFFF' }, // Purple
  { primary: '#F4511E', secondary: '#FFFFFF' }, // Orange
  { primary: '#FFFFFF', secondary: '#E53935' }, // White/Red
  { primary: '#FFFFFF', secondary: '#212121' }, // White/Black
  { primary: '#039BE5', secondary: '#FFFFFF' }, // Light Blue
  { primary: '#1E3A8A', secondary: '#FDD835' }, // Navy/Yellow
  { primary: '#D32F2F', secondary: '#1E293B' }, // Red/Navy
];

const getDeterministicColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PRESET_COLORS.length;
  return PRESET_COLORS[index];
};

export const getCachedLogoUrl = async (teamName: string, configFallbackUrl?: string): Promise<string> => {
    if (logoCache[teamName] !== undefined) {
        return logoCache[teamName] || '';
    }
    
    try {
        if (configFallbackUrl) {
            logoCache[teamName] = configFallbackUrl;
            return configFallbackUrl;
        }

        const localLogo = await findLocalLogo(teamName);
        if (localLogo) {
            logoCache[teamName] = localLogo;
            return localLogo;
        }

        const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${normalizeName(teamName)}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.teams && data.teams.length > 0) {
            const foundLogo = data.teams[0].strBadge;
            logoCache[teamName] = foundLogo;
            return foundLogo;
        }
        logoCache[teamName] = null;
        return '';
    } catch {
        logoCache[teamName] = null;
        return '';
    }
};

const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, fallbackUrl, className = "w-full h-full object-contain" }) => {
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>(logoCache[teamName]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    getCachedLogoUrl(teamName, fallbackUrl).then(url => {
        if (isMounted) {
            setLogoUrl(url || null);
        }
    });

    return () => {
      isMounted = false;
    };
  }, [teamName]);

  if (error || logoUrl === null) {
      const colors = getDeterministicColors(teamName);
      const initials = teamName.substring(0, 2).toUpperCase();
      
      return (
         <div className={className + " flex items-center justify-center relative"} style={{ width: '40px', height: '40px' }}>
            <JerseyIcon 
              primaryColor={colors.primary} 
              secondaryColor={colors.secondary} 
              initials={initials} 
              className="w-full h-full drop-shadow-lg"
            />
         </div>
      );
  }

  if (logoUrl) {
      return (
          <img 
              src={logoUrl} 
              alt={teamName} 
              className={className} 
              onError={() => setError(true)}
          />
      );
  }

  // Cargando
  return <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>;
};

export default TeamLogo;
