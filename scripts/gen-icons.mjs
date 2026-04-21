import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ── Icon SVG ──────────────────────────────────────────────────────────────
// Receipt + indigo gradient background + euro coin + check
// Canvas: 512×512 viewBox
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="receiptGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e0e7ff"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background rounded square -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>

  <!-- Receipt body -->
  <g filter="url(#shadow)">
    <path d="M148 108 L148 404 L168 390 L188 404 L208 390 L228 404 L248 390 L268 404 L288 390 L308 404 L328 390 L348 404 L364 404 L364 108 Z"
          fill="url(#receiptGrad)" rx="8"/>
  </g>

  <!-- Receipt serrated bottom edge (already in path above via zigzag) -->

  <!-- Lines on receipt -->
  <rect x="176" y="148" width="120" height="12" rx="6" fill="#6366f1" opacity="0.8"/>
  <rect x="176" y="174" width="80" height="8" rx="4" fill="#a5b4fc" opacity="0.7"/>

  <!-- Divider -->
  <rect x="168" y="200" width="176" height="2" rx="1" fill="#c7d2fe" opacity="0.6"/>

  <!-- Amount lines -->
  <rect x="176" y="218" width="60" height="8" rx="4" fill="#94a3b8" opacity="0.5"/>
  <rect x="260" y="218" width="64" height="8" rx="4" fill="#6366f1" opacity="0.7"/>

  <rect x="176" y="238" width="50" height="8" rx="4" fill="#94a3b8" opacity="0.5"/>
  <rect x="260" y="238" width="48" height="8" rx="4" fill="#6366f1" opacity="0.7"/>

  <!-- Divider -->
  <rect x="168" y="260" width="176" height="2" rx="1" fill="#c7d2fe" opacity="0.6"/>

  <!-- Total bold line -->
  <rect x="176" y="278" width="56" height="12" rx="6" fill="#4338ca" opacity="0.9"/>
  <rect x="250" y="278" width="80" height="12" rx="6" fill="#4338ca" opacity="0.9"/>

  <!-- Check circle badge (bottom-right) -->
  <circle cx="348" cy="356" r="52" fill="#22c55e"/>
  <circle cx="348" cy="356" r="44" fill="#16a34a"/>
  <!-- Check mark -->
  <polyline points="322,356 340,374 378,334"
            fill="none" stroke="white" stroke-width="14"
            stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ── Adaptive icon foreground SVG (centered on 108dp canvas) ──────────────
// Android adaptive icons have a 108dp safe zone with 72dp safe content
const svgForeground = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="receiptGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e0e7ff"/>
    </linearGradient>
    <filter id="shadow2">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Receipt body -->
  <g filter="url(#shadow2)">
    <path d="M148 108 L148 404 L168 390 L188 404 L208 390 L228 404 L248 390 L268 404 L288 390 L308 404 L328 390 L348 404 L364 404 L364 108 Z"
          fill="url(#receiptGrad2)"/>
  </g>

  <rect x="176" y="148" width="120" height="12" rx="6" fill="#6366f1" opacity="0.9"/>
  <rect x="176" y="174" width="80" height="8" rx="4" fill="#a5b4fc" opacity="0.8"/>
  <rect x="168" y="200" width="176" height="2" rx="1" fill="#c7d2fe"/>
  <rect x="176" y="218" width="60" height="8" rx="4" fill="#94a3b8" opacity="0.6"/>
  <rect x="260" y="218" width="64" height="8" rx="4" fill="#6366f1" opacity="0.8"/>
  <rect x="176" y="238" width="50" height="8" rx="4" fill="#94a3b8" opacity="0.6"/>
  <rect x="260" y="238" width="48" height="8" rx="4" fill="#6366f1" opacity="0.8"/>
  <rect x="168" y="260" width="176" height="2" rx="1" fill="#c7d2fe"/>
  <rect x="176" y="278" width="56" height="12" rx="6" fill="#4338ca"/>
  <rect x="250" y="278" width="80" height="12" rx="6" fill="#4338ca"/>

  <circle cx="348" cy="356" r="52" fill="#22c55e"/>
  <circle cx="348" cy="356" r="44" fill="#16a34a"/>
  <polyline points="322,356 340,374 378,334"
            fill="none" stroke="white" stroke-width="14"
            stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function generate() {
  const tasks = [
    // PWA icons
    { svg: svg(512), path: join(root, 'public/icon-512.png'), size: 512 },
    { svg: svg(192), path: join(root, 'public/icon-192.png'), size: 192 },

    // Android mipmap - ic_launcher (full icon with background)
    { svg: svg(48),  path: join(root, 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png'),    size: 48  },
    { svg: svg(72),  path: join(root, 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png'),    size: 72  },
    { svg: svg(96),  path: join(root, 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png'),   size: 96  },
    { svg: svg(144), path: join(root, 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'),  size: 144 },
    { svg: svg(192), path: join(root, 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'), size: 192 },

    // Android mipmap - ic_launcher_round (same design, round crop done by Android)
    { svg: svg(48),  path: join(root, 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png'),    size: 48  },
    { svg: svg(72),  path: join(root, 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png'),    size: 72  },
    { svg: svg(96),  path: join(root, 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png'),   size: 96  },
    { svg: svg(144), path: join(root, 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png'),  size: 144 },
    { svg: svg(192), path: join(root, 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png'), size: 192 },

    // Android adaptive icon foreground (108dp per density, transparent bg)
    { svg: svgForeground(81),  path: join(root, 'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png'),    size: 81  },
    { svg: svgForeground(108), path: join(root, 'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png'),    size: 108 },
    { svg: svgForeground(162), path: join(root, 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png'),   size: 162 },
    { svg: svgForeground(216), path: join(root, 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png'),  size: 216 },
    { svg: svgForeground(324), path: join(root, 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png'), size: 324 },

    // Also copy to dist assets (already in public)
    { svg: svg(512), path: join(root, 'android/app/src/main/assets/public/icon-512.png'), size: 512 },
    { svg: svg(192), path: join(root, 'android/app/src/main/assets/public/icon-192.png'), size: 192 },
  ];

  for (const { svg: svgStr, path, size } of tasks) {
    await sharp(Buffer.from(svgStr))
      .resize(size, size)
      .png()
      .toFile(path);
    console.log(`✓ ${path.split(/[\\/]/).slice(-3).join('/')}`);
  }

  console.log('\n✅ All icons generated');
}

generate().catch(err => { console.error(err); process.exit(1); });
