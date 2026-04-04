import { normalizeTeamName } from './utils/logoMatcher';

const tests = [
  "C. ATLÉTICO BOCA JUNIORS",
  "C. ATLÉTICO RIVER PLATE",
  "RACING CLUB",
  "RACING C DE TRELEW",
  "CLUB ATLÉTICO INDEPENDIENTE",
  "Manchester Utd",
  "Boca Jrs.",
  "Real Madrid CF"
];

console.log("=== PRUEBA DE NORMALIZACIÓN ===");
for (const t of tests) {
  console.log(`"${t}" => "${normalizeTeamName(t)}"`);
}
