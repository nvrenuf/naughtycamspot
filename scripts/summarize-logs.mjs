import fs from 'node:fs/promises';
import path from 'node:path';

const readJsonLines = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
};

const resolveLogPath = async (relativePath) => {
  const cwdPath = path.resolve(process.cwd(), relativePath);
  try {
    await fs.access(cwdPath);
    return cwdPath;
  } catch {
    return '';
  }
};

const formatCounts = (label, counts) => {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(label);
  if (entries.length === 0) {
    console.log('  (none)');
    return;
  }
  entries.forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
};

const sumBy = (items, key) =>
  items.reduce((acc, item) => {
    const value = item?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

const main = async () => {
  const leadPath =
    (await resolveLogPath('public/logs/leads.jsonl')) ||
    (await resolveLogPath('dist/logs/leads.jsonl'));
  const outboundPath =
    (await resolveLogPath('public/logs/outbound.jsonl')) ||
    (await resolveLogPath('dist/logs/outbound.jsonl'));

  const leads = leadPath ? await readJsonLines(leadPath) : [];
  const outbound = outboundPath ? await readJsonLines(outboundPath) : [];

  console.log('Log sources:');
  console.log(`  leads: ${leadPath || '(missing)'}`);
  console.log(`  outbound: ${outboundPath || '(missing)'}`);
  console.log('');

  formatCounts('Leads by platform:', sumBy(leads, 'platform'));
  console.log('');
  formatCounts('Outbound by platform:', sumBy(outbound, 'platform'));
  console.log('');

  const outboundByCid = outbound.reduce((acc, entry) => {
    const cid = entry?.cid;
    if (!cid) return acc;
    acc[cid] = entry;
    return acc;
  }, {});

  const joined = leads.filter((lead) => lead?.click_id && outboundByCid[lead.click_id]);
  console.log(`Joined leads (by click_id): ${joined.length}`);
  if (joined.length > 0) {
    const joinedByPlatform = joined.reduce((acc, lead) => {
      const platform = lead?.platform || outboundByCid[lead.click_id]?.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});
    formatCounts('Joined leads by platform:', joinedByPlatform);
  }
};

await main();
