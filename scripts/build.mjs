import { cp, mkdir, readdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
for (const name of await readdir('public')) await cp('public/' + name, 'dist/' + name, { recursive: true });
console.log('BrewLab web build ready in dist/');