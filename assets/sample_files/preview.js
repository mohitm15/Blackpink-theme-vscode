const fs = require('fs');
const path = require('path');

// ── Point to your theme's tokenColors.json ──
const themeDir = path.join(__dirname, 'your-theme-name'); // ← change this
const tokenColors = JSON.parse(fs.readFileSync(path.join(themeDir, 'tokenColors.json'), 'utf-8'));

// ── Pretty-print every scope → color ──
console.log('═'.repeat(60));
console.log('TOKEN COLORS');
console.log('═'.repeat(60));

tokenColors.forEach((entry, i) => {
  const scopes = Array.isArray(entry.scope) ? entry.scope : [entry.scope];
  const s = entry.settings || {};
  const fg  = s.foreground || '—';
  const bg  = s.background || '';
  const fs_ = s.fontStyle  || '';

  console.log(`\n[${i}] ${scopes.join(', ')}`);
  console.log(`     fg: ${fg}  ${bg ? `bg: ${bg}` : ''}  ${fs_ ? `style: ${fs_}` : ''}`);
});

// ── Also dump editor colors (colors.json) if present ──
const colorsPath = path.join(themeDir, 'colors.json');
if (fs.existsSync(colorsPath)) {
  const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf-8'));
  console.log('\n' + '═'.repeat(60));
  console.log('EDITOR COLORS');
  console.log('═'.repeat(60));
  Object.entries(colors).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}   