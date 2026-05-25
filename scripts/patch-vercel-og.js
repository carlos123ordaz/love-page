/**
 * Patch for @vercel/og Windows path bug in Next.js 14.1.0
 * Bug: uses path.join(import.meta.url, ...) which corrupts file:// URLs on Windows
 * Fix: replace with new URL(..., import.meta.url) which handles file:// correctly
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

const buggy = [
    'var fontData = fs.readFileSync(fileURLToPath(join(import.meta.url, "../noto-sans-v27-latin-regular.ttf")));',
    'var yoga_wasm = fs.readFileSync(fileURLToPath(join(import.meta.url, "../yoga.wasm")));',
    'var resvg_wasm = fs.readFileSync(fileURLToPath(join(import.meta.url, "../resvg.wasm")));',
].join('\n');

const fixed = [
    'var fontData = fs.readFileSync(fileURLToPath(new URL("../noto-sans-v27-latin-regular.ttf", import.meta.url)));',
    'var yoga_wasm = fs.readFileSync(fileURLToPath(new URL("../yoga.wasm", import.meta.url)));',
    'var resvg_wasm = fs.readFileSync(fileURLToPath(new URL("../resvg.wasm", import.meta.url)));',
].join('\n');

if (content.includes(fixed)) {
    console.log('[patch-vercel-og] Already patched, nothing to do.');
    process.exit(0);
}

if (!content.includes(buggy)) {
    console.log('[patch-vercel-og] Pattern not found — may already be fixed in this version, skipping.');
    process.exit(0);
}

content = content.replace(buggy, fixed);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[patch-vercel-og] Patched successfully.');
