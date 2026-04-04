import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const escudosDir = path.join(publicDir, 'escudos');
const outputJson = path.join(publicDir, 'escudosIndex.json');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
        filelist = walkSync(dirFile, filelist);
    } else {
        if (file.toLowerCase().endsWith('.png')) {
            const name = path.basename(file, '.png');
            // Obtener path web (/escudos/...)
            let relativePath = dirFile.substring(publicDir.length).replace(/\\/g, '/');
            // Asegurar que comience con slash
            if (!relativePath.startsWith('/')) {
                relativePath = '/' + relativePath;
            }
            filelist.push({
                name,
                path: relativePath
            });
        }
    }
  }
  return filelist;
};

console.log("Generando índice de escudos...");
try {
  const indexList = walkSync(escudosDir);
  fs.writeFileSync(outputJson, JSON.stringify(indexList, null, 2), 'utf-8');
  console.log(`Índice generado exitosamente. Se encontraron ${indexList.length} escudos en total.`);
} catch (error) {
  console.error("Error al generar el índice:", error);
}
