/**
 * Patch for @vercel/og path bug in Next.js 14.1.0
 * Bug: uses "../" relative paths which look in the parent @vercel/ directory,
 *      but all assets (font, wasm) live in the same @vercel/og/ directory.
 * Fix: replace "../" with "./" so paths resolve correctly.
 *
 * Re-run automatically via "postinstall" in package.json
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'index.node.js');

if (!fs.existsSync(filePath)) {
    console.log('[patch-vercel-og] File not found, skipping.');
    process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');

const fixed = [
    'var fontData = fs.readFileSync(fileURLToPath(new URL("./noto-sans-v27-latin-regular.ttf", import.meta.url)));',
    'var yoga_wasm = fs.readFileSync(fileURLToPath(new URL("./yoga.wasm", import.meta.url)));',
    'var resvg_wasm = fs.readFileSync(fileURLToPath(new URL("./resvg.wasm", import.meta.url)));',
].join('\n');

if (content.includes(fixed)) {
    console.log('[patch-vercel-og] Already patched, nothing to do.');
    process.exit(0);
}

// Match any variant (../  or ./) and replace with the correct ./
const buggyPattern = /var fontData = fs\.readFileSync\(fileURLToPath\(new URL\("\.\.?\/noto-sans[^"]+", import\.meta\.url\)\)\);[\s\S]*?var yoga_wasm = fs\.readFileSync\(fileURLToPath\(new URL\("\.\.?\/yoga\.wasm", import\.meta\.url\)\)\);[\s\S]*?var resvg_wasm = fs\.readFileSync\(fileURLToPath\(new URL\("\.\.?\/resvg\.wasm", import\.meta\.url\)\)\);/;

if (!buggyPattern.test(content)) {
    console.log('[patch-vercel-og] Pattern not found — may already be fixed in this version, skipping.');
    process.exit(0);
}

content = content.replace(buggyPattern, fixed);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[patch-vercel-og] Patched successfully.');
