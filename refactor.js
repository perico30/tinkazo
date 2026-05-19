const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes("toLocaleString('es-ES')")) {
                // Not replacing date locale strings if any
                content = content.replace(/toLocaleString\('es-ES'\)/g, "toLocaleString('de-DE')");
                // Restore dates if they got modified accidentally (dates usually have options object too, but we can fix exact matches)
                content = content.replace(/toLocaleString\('de-DE', \{ weekday/g, "toLocaleString('es-ES', { weekday");
                content = content.replace(/toLocaleString\('de-DE', \{ day/g, "toLocaleString('es-ES', { day");
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    });
}

replaceInDir(path.join(__dirname, 'views'));
replaceInDir(path.join(__dirname, 'components'));
replaceInDir(path.join(__dirname, 'hooks'));
