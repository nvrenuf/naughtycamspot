import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { banners } from '../src/data/banners';

const distDir = path.resolve('dist');

const readHtml = (relativePath: string) => fs.readFileSync(path.join(distDir, relativePath), 'utf8');

const collectHtmlFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectHtmlFiles(resolved);
    }
    return entry.name.endsWith('.html') ? [resolved] : [];
  });
};

beforeAll(() => {
  execSync('npm run build:pages', { stdio: 'inherit' });
});

describe('banner registry', () => {
  it('loads without throwing and contains valid entries', () => {
    expect(banners.length).toBeGreaterThan(0);

    for (const banner of banners) {
      expect(banner.id).toBeTypeOf('string');
      expect(banner.width).toBeGreaterThan(0);
      expect(banner.height).toBeGreaterThan(0);
      expect(banner.img).toMatch(/\.svg$/);
      expect(banner.href).toBeTruthy();
    }
  });
});

describe('pages build safety', () => {
  it('does not emit /go/ links in Pages builds', () => {
    const htmlFiles = collectHtmlFiles(distDir);
    const contents = htmlFiles.map((filePath) => fs.readFileSync(filePath, 'utf8'));

    for (const content of contents) {
      expect(content).not.toContain('/go/');
    }
  });

  it('renders placeholder banners on target pages', () => {
    const homeHtml = readHtml('index.html');
    const compareHtml = readHtml(path.join('compare', 'index.html'));

    expect(homeHtml).toContain('/placeholders/banner-728x90.svg');
    expect(compareHtml).toContain('/placeholders/banner-728x90.svg');

    const blogDir = path.join(distDir, 'blog');
    const blogEntries = fs
      .readdirSync(blogDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(blogEntries.length).toBeGreaterThan(0);

    const firstBlog = blogEntries[0];
    const blogHtml = readHtml(path.join('blog', firstBlog, 'index.html'));

    expect(blogHtml).toContain('/placeholders/banner-300x250.svg');
  });
});
