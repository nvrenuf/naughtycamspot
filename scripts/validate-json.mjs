import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = dirname(__dirname);

const ajv = new Ajv({ allErrors: true, strict: false });

const loadJson = (...segments) => {
  const path = join(...segments);
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
};

const formatErrors = (errors = []) =>
  errors
    .map((error) => {
      const instancePath = error.instancePath || '/';
      const message = error.message ?? 'Validation error';
      return `  - ${instancePath}: ${message}`;
    })
    .join('\n');

const failures = [];

const programsSchema = loadJson(repoRoot, 'schemas', 'programs.schema.json');
const programsData = loadJson(repoRoot, 'src', 'data', 'programs.json');
const validatePrograms = ajv.compile(programsSchema);

if (!validatePrograms(programsData)) {
  const details = formatErrors(validatePrograms.errors);
  failures.push(`src/data/programs.json failed validation.\n${details}`);
}

const kitSchemaPath = join(repoRoot, 'schemas', 'kit.schema.json');
const kitSchema = loadJson(kitSchemaPath);
const kitDir = join(repoRoot, 'src', 'data', 'kit');

if (existsSync(kitDir)) {
  const entries = readdirSync(kitDir).filter((entry) => entry.endsWith('.json'));
  const validateKit = ajv.compile(kitSchema);

  for (const entry of entries) {
    const fullPath = join(kitDir, entry);
    if (!statSync(fullPath).isFile()) {
      continue;
    }

    const data = loadJson(fullPath);
    if (!validateKit(data)) {
      const details = formatErrors(validateKit.errors);
      failures.push(`src/data/kit/${entry} failed validation.\n${details}`);
    }
  }
}

if (failures.length > 0) {
  console.error('JSON schema validation failed:\n');
  for (const failure of failures) {
    console.error(`${failure}\n`);
  }
  process.exitCode = 1;
} else {
  console.log('JSON schema validation passed.');
}
