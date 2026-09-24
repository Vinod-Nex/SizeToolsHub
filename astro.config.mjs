// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Phase 27: Sitemaps per locale + Validation Cross-Check Hook
 * Outputs:
 *   - sitemap-en.xml (all English pages)
 *   - sitemap-pt-br.xml (all Portuguese pages)
 *   - sitemap-es.xml (all Spanish pages)
 *   - sitemap-fr.xml (all French pages)
 *   - sitemap-index.xml (index pointing to the 4 locale sitemaps)
 * Cross-checks every URL in each sitemap against actual pages built in dist/
 */
function sitemapLocaleNormalizer() {
  return {
    name: 'sitemap-locale-normalizer',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const destDir = fileURLToPath(dir);
        const locales = ['en', 'pt-br', 'es', 'fr'];

        // 1. Copy chunk files to exact requested locale filenames
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

        // 3. Mirror to public/ directory so dev/preview servers serve them at root
        const publicDir = path.resolve('./public');
        for (const loc of locales) {
          const srcFile = path.join(destDir, `sitemap-${loc}.xml`);
          if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, path.join(publicDir, `sitemap-${loc}.xml`));
          }
        }
        fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf8');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');

        // 4. Cross-check validation: verify sitemap URLs vs actual dist HTML pages
        console.log('\n[Sitemap Validation Audit]');
        let totalMismatch = 0;

        for (const loc of locales) {
          const sitemapFile = path.join(destDir, `sitemap-${loc}.xml`);
          if (!fs.existsSync(sitemapFile)) {
            console.error(`❌ Mismatch: ${sitemapFile} was not generated!`);
            totalMismatch++;
            continue;
          }

          const content = fs.readFileSync(sitemapFile, 'utf8');
          const locMatches = content.match(/<loc>(.*?)<\/loc>/g) || [];
          const sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

          // Count actual HTML pages in dist for this locale
          let distCount = 0;
          const missingFiles = [];

          for (const sUrl of sitemapUrls) {
            const urlObj = new URL(sUrl);
            let relPath = urlObj.pathname;
            if (relPath.endsWith('/')) relPath += 'index.html';
            const diskPath = path.join(destDir, relPath.replace(/^\//, ''));
            if (fs.existsSync(diskPath)) {
              distCount++;
            } else {
              missingFiles.push({ sUrl, diskPath });
            }
          }

          if (missingFiles.length > 0) {
            console.error(`❌ Mismatch in sitemap-${loc}.xml: ${missingFiles.length} URLs do not exist on disk!`);
            missingFiles.forEach(m => console.error(`   - Missing: ${m.sUrl}`));
            totalMismatch += missingFiles.length;
          } else {
            console.log(`✅ sitemap-${loc}.xml: ${sitemapUrls.length} URLs verified (100% matched to built pages)`);
          }
        }

        if (totalMismatch === 0) {
          console.log('✅ Phase 27 XML Sitemap Audit PASSED: 0 orphaned or missing URLs.\n');
        } else {
          console.error(`⚠️ Phase 27 XML Sitemap Audit found ${totalMismatch} mismatches.\n`);
        }
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
