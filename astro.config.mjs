// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dynamically discover all routes across categories and content collection
function getNonDefaultLocaleUrls() {
  const converterDir = path.resolve('./src/content/converters');
  const categories = ['shoe-size', 'clothing-size', 'ring-size', 'cooking', 'data', 'paper-size', 'fuel'];
  const basePaths = ['/'];

  for (const cat of categories) {
    basePaths.push(`/${cat}/`);
    const catDir = path.join(converterDir, cat);
    if (fs.existsSync(catDir)) {
      const files = fs.readdirSync(catDir);
      for (const f of files) {
        if (f.endsWith('.json') || f.endsWith('.md')) {
          const slug = f.replace(/\.(json|md)$/, '');
          basePaths.push(`/${cat}/${slug}/`);
        }
      }
    }
  }

  const customPages = [];
  const nonDefaultLocales = ['pt-br', 'es', 'fr'];
  for (const loc of nonDefaultLocales) {
    for (const p of basePaths) {
      if ((loc === 'pt-br' || loc === 'es' || loc === 'fr') && (p.startsWith('/shoe-size') || p.startsWith('/clothing-size') || p === '/')) {
        continue; // Handled by actual localized pages in src/pages/{locale}/
      }
      customPages.push(`https://sizetoolshub.com/${loc}${p === '/' ? '/' : p}`);
    }
  }

  return customPages;
}

/**
 * Post-processes sitemaps to ensure exact filenames requested:
 * sitemap-en.xml, sitemap-pt-br.xml, sitemap-es.xml, sitemap-fr.xml, and sitemap-index.xml
 */
function sitemapLocaleNormalizer() {
  return {
    name: 'sitemap-locale-normalizer',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const destDir = fileURLToPath(dir);
        const locales = ['en', 'pt-br', 'es', 'fr'];

        // 1. Copy chunk files to exact locale filenames
        for (const loc of locales) {
          const chunkFile = path.join(destDir, `sitemap-${loc}-0.xml`);
          const targetFile = path.join(destDir, `sitemap-${loc}.xml`);
          if (fs.existsSync(chunkFile)) {
            fs.copyFileSync(chunkFile, targetFile);
          }
        }

        // 2. Generate clean sitemap-index.xml referencing sitemap-{locale}.xml
        const now = new Date().toISOString();
        const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://sizetoolshub.com/sitemap-en.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sizetoolshub.com/sitemap-pt-br.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sizetoolshub.com/sitemap-es.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://sizetoolshub.com/sitemap-fr.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>
`;

        fs.writeFileSync(path.join(destDir, 'sitemap-index.xml'), indexXml, 'utf8');
        fs.writeFileSync(path.join(destDir, 'sitemap.xml'), indexXml, 'utf8');

        // 3. Mirror to public/ directory so dev server serves them at root
        const publicDir = path.resolve('./public');
        for (const loc of locales) {
          const srcFile = path.join(destDir, `sitemap-${loc}.xml`);
          if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, path.join(publicDir, `sitemap-${loc}.xml`));
          }
        }
        fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf8');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://sizetoolshub.com',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          'pt-br': 'pt-BR',
          es: 'es',
          fr: 'fr',
        },
      },
      customPages: getNonDefaultLocaleUrls(),
      chunks: {
        'en': (item) => {
          if (!/\/pt-br\/|\/es\/|\/fr\//.test(item.url)) {
            return item;
          }
        },
        'pt-br': (item) => {
          if (/\/pt-br\//.test(item.url)) {
            return item;
          }
        },
        'es': (item) => {
          if (/\/es\//.test(item.url)) {
            return item;
          }
        },
        'fr': (item) => {
          if (/\/fr\//.test(item.url)) {
            return item;
          }
        },
      },
    }),
    sitemapLocaleNormalizer(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br', 'es', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
