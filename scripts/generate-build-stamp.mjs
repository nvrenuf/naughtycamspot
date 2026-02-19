import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'src', 'generated');
const jsonPath = path.join(generatedDir, 'build-stamp.json');
const publicBuildTxtPath = path.join(repoRoot, 'public', 'build.txt');

const envSha =
  process.env.NCS_BUILD_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.CI_COMMIT_SHA ||
  process.env.SOURCE_VERSION ||
  '';

const resolveShortSha = () => {
  if (typeof envSha === 'string' && envSha.trim().length > 0) {
    return envSha.trim().slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8'
    }).trim();
  } catch {
    return 'dev';
  }
};

const isoUtc = new Date().toISOString();
const shortSha = resolveShortSha() || 'dev';
const stamp = `${isoUtc}|${shortSha}`;
const displayUtc = `${isoUtc.slice(0, 10)} ${isoUtc.slice(11, 16)} UTC`;

await mkdir(generatedDir, { recursive: true });
await writeFile(
  jsonPath,
  `${JSON.stringify({ stamp, isoUtc, shortSha, displayUtc }, null, 2)}\n`,
  'utf8'
);
await writeFile(publicBuildTxtPath, `${stamp}\n`, 'utf8');
