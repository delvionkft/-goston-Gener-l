/**
 * Kilistázza a src/config/site.ts fájlban maradt kitöltetlen helyőrzőket.
 * Éles indítás előtt futtasd: `npm run check:content`
 * Ha maradt helyőrző, a szkript 1-es kilépési kóddal áll le — így a CI
 * megfogja, mielőtt kitöltetlen oldal kerülne élesbe.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src/config/site.ts');
const source = readFileSync(file, 'utf8');

const found = new Map();
const lines = source.split('\n');

lines.forEach((line, index) => {
  // Kommentekben lévő példákat nem számítjuk hibának.
  const trimmed = line.trim();
  if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

  for (const match of line.matchAll(/'(\[[^']*?\])'|'([^']*\[[A-ZÁÉÍÓÖŐÚÜŰ0-9][^']*\][^']*)'/g)) {
    const value = match[1] ?? match[2];
    if (!value) continue;
    const list = found.get(value) ?? [];
    list.push(index + 1);
    found.set(value, list);
  }
});

if (found.size === 0) {
  console.log('✓ Nincs kitöltetlen helyőrző a src/config/site.ts fájlban.');
  process.exit(0);
}

let total = 0;
console.log('\nKitöltetlen helyőrzők a src/config/site.ts fájlban:\n');
for (const [value, atLines] of found) {
  total += atLines.length;
  console.log(`  ${value}`);
  console.log(`      sor: ${atLines.join(', ')}`);
}
console.log(`\nÖsszesen ${total} kitöltetlen érték ${found.size} különböző helyőrzőben.`);
console.log('Töltsd ki őket valós adattal, mielőtt élesíted az oldalt.\n');
process.exit(1);
