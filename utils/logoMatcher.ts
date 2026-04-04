export interface EscudoIndex {
  name: string;
  path: string;
}

let escudosCache: EscudoIndex[] | null = null;
let escudosPromise: Promise<EscudoIndex[]> | null = null;

export const loadEscudosIndex = async (): Promise<EscudoIndex[]> => {
  if (escudosCache) return escudosCache;
  if (escudosPromise) return escudosPromise;

  escudosPromise = fetch('/escudosIndex.json')
    .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el índice de escudos");
        return res.json();
    })
    .then(data => {
        escudosCache = data;
        return data;
    });

  return escudosPromise;
};

// Normaliza limpiando prefijos/sufijos y normalizando texto
export const normalizeTeamName = (name: string): string => {
  let clean = name.toUpperCase()
    // Remover acentos
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    // Remover caracteres no alfanuméricos
    .replace(/[^A-Z0-9 ]/g, " ")
    .trim();

  // Prefijos típicos de clubes
  const prefixes = [
      "C ATLETICO Y SOCIAL", "C ATLETICO Y S", "C ATLETICO Y D", "C S C D", "C S Y D",
      "C ATLETICO", "C S D", "C D S C", "C D S", "C C D", "A D", "C D", "C S", "C U", 
      "AS ATLETICA", "SDAD", "ASOC", "CLUB", "CA", "CS", "CD"
  ];
  
  // Sufijos
  const suffixes = [
      "F C", "FC", "C F", "A C", "S C", "S A", "S D", "A C", "M Y S", "S Y D"
  ];
  
  // Remover prefijos
  for (const p of prefixes) {
      if (clean.startsWith(p + " ")) {
          clean = clean.substring(p.length + 1).trim();
          break; // remove first match and stop
      }
  }
  
  // Remover sufijos
  for (const s of suffixes) {
      if (clean.endsWith(" " + s)) {
          clean = clean.substring(0, clean.length - s.length - 1).trim();
          break; // remove first match and stop
      }
  }

  // Quitar la palabra ATLETICO, DEPORTIVO, etc. si queda colgada
  clean = clean.replace(/\b(ATLETICO|ATLETICA|DEPORTIVO|SPORTIVO|SPORTING|ASOCIACION)\b/g, "").trim();
  
  // Espacios múltiples a simples
  clean = clean.replace(/\s+/g, ' ');
  return clean;
};

export const findLocalLogo = async (teamName: string): Promise<string | null> => {
    try {
        const index = await loadEscudosIndex();
        
        const targetClean = normalizeTeamName(teamName);
        if (!targetClean) return null;

        // 1. Coincidencia exacta Limpia
        let match = index.find(e => normalizeTeamName(e.name) === targetClean);
        if (match) return match.path;
        
        // 2. Coincidencia parcial (e.g., "RACING" vs "RACING C DE TRELEW")
        match = index.find(e => {
            const indexClean = normalizeTeamName(e.name);
            if (indexClean.length < 3 || targetClean.length < 3) return false; // evitar short falsos
            
            // Chequear si uno está contenido dentro del otro
            return indexClean.includes(targetClean) || targetClean.includes(indexClean);
        });

        if (match) return match.path;
        
        return null;
    } catch (err) {
        console.error("Error buscando logo local:", err);
        return null;
    }
};
