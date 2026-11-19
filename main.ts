// News image entry for make.fun, competition news-image-20261119.
// The poster is entry.png beside this file: a 1024x1024 front page
// summing up Thursday 19 November 2026. This program only copies it
// to the grader's output directory, after checking it is a whole PNG
// inside the competition's size limits. Node 22, standard library only.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dest = join(outDir, 'entry.png');

if (!existsSync(src)) {
  throw new Error('entry.png is missing from the repository');
}
const bytes = readFileSync(src);
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
  throw new Error('entry.png is not a PNG file');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
const written = statSync(dest);
if (written.size !== bytes.length) {
  throw new Error(`copy is incomplete: wrote ${written.size} of ${bytes.length} bytes`);
}
const copied = readFileSync(dest);
if (!copied.equals(bytes)) {
  throw new Error('copied entry.png differs from the repository file');
}
console.log(`Wrote ${dest}: ${width}x${height}, ${written.size} bytes`);
