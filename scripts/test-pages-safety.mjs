import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = dirname(__dirname);
const distDir = join(repoRoot, 'dist');

rmSync(distDir, { recursive: true, force: true });

execFileSync('npm', ['run', 'build:pages'], {
  cwd: repoRoot,
  stdio: 'inherit'
});

const forbidden = ['/go/', '/recommend'];
const violations = [];

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.html')) {
      continue;
    }

    const contents = readFileSync(fullPath, 'utf8');
    for (const token of forbidden) {
      if (contents.includes(token)) {
        const relativePath = fullPath.startsWith(repoRoot)
          ? fullPath.slice(repoRoot.length + 1)
          : fullPath;
        violations.push(`${relativePath} contains forbidden token "${token}"`);
        break;
      }
    }
  }
};

walk(distDir);

if (violations.length > 0) {
  console.error('Forbidden strings detected in Pages build:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log('Pages safety check passed.');
}
