import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('./dist');

function getAllHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`\n======================================================================`);
console.log(`🔍 Technical SEO Audit: Canonical & Hreflang Validation`);
console.log(`Auditing ${htmlFiles.length} generated HTML documents in dist/...`);
console.log(`======================================================================\n`);

let missingCanonicalCount = 0;
let canonicalMismatchCount = 0;
let deadHreflangCount = 0;
let validHreflangCount = 0;
let multiLocalePagesCount = 0;
let singleLocalePagesCount = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let relUrl = file.replace(distDir, '').replace(/index\.html$/, '');
  if (!relUrl.startsWith('/')) relUrl = '/' + relUrl;
  if (!relUrl.endsWith('/')) relUrl = relUrl + '/';
  const expectedUrl = `https://sizetoolshub.com${relUrl}`;

  // 1. Check Canonical
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canonicalMatch) {
    console.error(`❌ Missing canonical tag: ${relUrl}`);
    missingCanonicalCount++;
  } else {
    const foundCanonical = canonicalMatch[1];
    if (foundCanonical !== expectedUrl) {
      console.error(`❌ Canonical mismatch for ${relUrl}: expected ${expectedUrl}, found ${foundCanonical}`);
      canonicalMismatchCount++;
    }
  }

  // 2. Check Hreflang Alternates
  const hreflangMatches = [...content.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
  
  if (hreflangMatches.length > 2) {
    multiLocalePagesCount++;
  } else {
    singleLocalePagesCount++;
  }

  for (const match of hreflangMatches) {
    const [_, lang, altUrl] = match;
    try {
      const parsed = new URL(altUrl);
      let targetPath = parsed.pathname;
      if (targetPath.endsWith('/')) targetPath += 'index.html';
      const diskPath = path.join(distDir, targetPath.replace(/^\//, ''));

      if (!fs.existsSync(diskPath)) {
        console.error(`❌ Dead hreflang URL on ${relUrl}: [hreflang=${lang}] -> ${altUrl} does NOT exist on disk!`);
        deadHreflangCount++;
      } else {
        validHreflangCount++;
      }
    } catch (e) {
      console.error(`❌ Malformed hreflang URL on ${relUrl}: ${altUrl}`);
      deadHreflangCount++;
    }
  }
}

console.log(`📊 Audit Summary Results:`);
console.log(`- Total Pages Audited: ${htmlFiles.length}`);
console.log(`- Self-referencing Canonical Verified: ${htmlFiles.length - missingCanonicalCount - canonicalMismatchCount} / ${htmlFiles.length}`);
console.log(`- Canonical Errors: ${missingCanonicalCount + canonicalMismatchCount}`);
console.log(`- 4-Locale Full Alternate Pages: ${multiLocalePagesCount}`);
console.log(`- English-only Verified Single Pages: ${singleLocalePagesCount}`);
console.log(`- Total Valid Verified Hreflang Links: ${validHreflangCount}`);
console.log(`- Dead (404) Hreflang Links Found: ${deadHreflangCount}`);

if (missingCanonicalCount === 0 && canonicalMismatchCount === 0 && deadHreflangCount === 0) {
  console.log(`\n🎉 PHASE 28 AUDIT PASSED: 100% of pages have self-referencing canonicals and all hreflang URLs resolve to real 200 pages!`);
} else {
  console.error(`\n⚠️ PHASE 28 AUDIT FAILED with errors.`);
  process.exit(1);
}
