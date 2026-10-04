import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await rm(`${root}dist`, { recursive: true, force: true });
await mkdir(`${root}dist`, { recursive: true });
await cp(`${root}src`, `${root}dist`, { recursive: true });
await writeFile(`${root}dist/.nojekyll`, '');
await cp(`${root}dist/index.html`, `${root}dist/404.html`);
console.log('Built Panelune into dist/. No runtime dependencies or external services.');
