import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html','src','public']) await cp(path, path==='index.html'?'dist/index.html':'dist/'+path,{recursive:true});
console.log('BrewLab web build ready in dist/');