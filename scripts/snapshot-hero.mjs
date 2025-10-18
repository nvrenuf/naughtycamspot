import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = dirname(__dirname);
const distDir = join(repoRoot, 'dist');
const indexPath = join(distDir, 'index.html');

rmSync(distDir, { recursive: true, force: true });

execFileSync('npm', ['run', 'build:pages'], {
  cwd: repoRoot,
  stdio: 'inherit'
});

const html = readFileSync(indexPath, 'utf8');
const checks = [
  { token: 'StartRight', message: 'Homepage should reference StartRight in the hero.' },
  { token: '/startright', message: 'Homepage hero should link to /startright.' }
];

const missing = checks.filter(({ token }) => !html.includes(token));

if (missing.length > 0) {
  console.error('Snapshot check failed. Missing content:');
  for (const { message } of missing) {
    console.error(`- ${message}`);
  }
  process.exitCode = 1;
} else {
  console.log('Snapshot hero check passed.');
}
