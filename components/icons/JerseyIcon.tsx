import React from 'react';

interface JerseyProps {
  primaryColor: string;
  secondaryColor: string;
  initials: string;
  className?: string;
}

const JerseyIcon: React.FC<JerseyProps> = ({ primaryColor, secondaryColor, initials, className = '' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }}
    >
      {/* Sombras base para profundidad */}
      <defs>
        <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Manga Izquierda */}
      <path d="M25 25 L5 40 L12 50 L25 40 Z" fill={primaryColor} />
      {/* Borde manga izq */}
      <path d="M5 40 L12 50 L14 48 L7 38 Z" fill={secondaryColor} />

      {/* Manga Derecha */}
      <path d="M75 25 L95 40 L88 50 L75 40 Z" fill={primaryColor} />
      {/* Borde manga der */}
      <path d="M95 40 L88 50 L86 48 L93 38 Z" fill={secondaryColor} />

      {/* Cuerpo principal */}
      <path d="M25 25 L75 25 L80 90 L20 90 Z" fill={primaryColor} />
      
      {/* Gradiente de volumen sobre el cuerpo */}
      <path d="M25 25 L75 25 L80 90 L20 90 Z" fill="url(#jerseyGradient)" />

      {/* Cuello redondo / V */}
      <path d="M35 25 C 35 38, 65 38, 65 25 Z" fill={secondaryColor} />
      
      {/* Borde inferior del cuerpo */}
      <path d="M20 90 L80 90 L79 85 L21 85 Z" fill={secondaryColor} />

      {/* Escudito / Iniciales en el pecho */}
      <text 
        x="50" 
        y="58" 
        fontFamily="Impact, sans-serif" 
        fontSize="24" 
        fontWeight="bold" 
        fill={secondaryColor} 
        textAnchor="middle" 
        alignmentBaseline="middle"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {initials}
      </text>
    </svg>
  );
};

export default JerseyIcon;
