import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

const buildCache = new Map();
const cleanupDirs = new Set();

const resolveOutDirName = (mode) => {
  if (mode === 'pages') {
    return 'dist-test-pages';
  }

  if (mode === 'prod') {
    return 'dist-test-prod';
  }

  throw new Error(`Unknown build mode: ${mode}`);
};

const ensureBuild = async (mode) => {
  if (buildCache.has(mode)) {
    return buildCache.get(mode);
  }

  const outDirName = resolveOutDirName(mode);
  const outDir = path.join(projectRoot, outDirName);
  await rm(outDir, { recursive: true, force: true });

  const command =
    mode === 'pages'
      ? `npx astro build --config astro.config.pages.mjs --outDir ${outDirName}`
      : `npx astro build --outDir ${outDirName}`;

  execSync(command, { cwd: projectRoot, stdio: 'pipe' });

  const result = { outDir, outDirName, mode };
  buildCache.set(mode, result);
  cleanupDirs.add(outDir);
  return result;
};

export const readOutputFile = async (mode, segments) => {
  if (!Array.isArray(segments)) {
    throw new TypeError('segments must be an array of path parts');
  }

  const { outDir } = await ensureBuild(mode);
  const filePath = path.join(outDir, ...segments);
  const html = await readFile(filePath, 'utf8');
  return { html, filePath };
};

export const cleanupBuilds = async () => {
  for (const dir of cleanupDirs) {
    await rm(dir, { recursive: true, force: true });
  }
  cleanupDirs.clear();
  buildCache.clear();
};
