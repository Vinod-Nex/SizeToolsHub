import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('./public');

// Master SVG design with explicit colors for high-contrast crisp rasterization
const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="512" height="512" fill="none">
  <!-- 30% iOS Squircle Base Tile -->
  <rect x="1" y="1" width="30" height="30" rx="9" ry="9" fill="#141414" />

  <!-- Calibration Ruler Ticks -->
  <line x1="7" y1="7.5" x2="7" y2="12" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" />
  <line x1="11.5" y1="7.5" x2="11.5" y2="10.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
  <!-- Electric Blue Center Calibration Gauge (#0066ff) -->
  <line x1="16" y1="7.5" x2="16" y2="13.5" stroke="#0066ff" stroke-width="2" stroke-linecap="round" />
  <line x1="20.5" y1="7.5" x2="20.5" y2="10.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
  <line x1="25" y1="7.5" x2="25" y2="12" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" />

  <!-- Dimensional Measure Baseline & Bidirectional Resize Arrows -->
  <line x1="7" y1="18.5" x2="25" y2="18.5" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" />
  <path d="M10 15.5L7 18.5L10 21.5" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M22 15.5L25 18.5L22 21.5" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Precision Center Point & Caliper -->
  <circle cx="16" cy="18.5" r="1.25" fill="#0066ff" />
  <line x1="16" y1="22" x2="16" y2="24.5" stroke="#0066ff" stroke-width="1.75" stroke-linecap="round" />
</svg>
`;

function createIco(pngBuffers, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(pngBuffers.length, 4); // count

  let offset = 6 + (16 * pngBuffers.length);
  const dirEntries = [];

  for (let i = 0; i < pngBuffers.length; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function generate() {
  console.log('Generating Phase 33 Favicon and App Icon Set...');
  const svgBuffer = Buffer.from(svgMarkup);

  // 1. Generate PNGs
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

  // 2. Generate Multi-size favicon.ico (16, 32, 48)
  const icoBuffer = createIco([png16, png32, png48], [16, 32, 48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // 3. Generate site.webmanifest
  const manifest = {
    name: "SizeToolsHub — Sizing & Dimension Conversion Intelligence",
    short_name: "SizeToolsHub",
    description: "Instant international size conversions, brand fit calculators, and luggage dimension checkers.",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#141414",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    orientation: "portrait"
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('✅ Generated files:');
  console.log('  - public/favicon.ico (16x16, 32x32, 48x48)');
  console.log('  - public/favicon-16x16.png');
  console.log('  - public/favicon-32x32.png');
  console.log('  - public/apple-touch-icon.png (180x180)');
  console.log('  - public/android-chrome-192x192.png');
  console.log('  - public/android-chrome-512x512.png');
  console.log('  - public/site.webmanifest');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
