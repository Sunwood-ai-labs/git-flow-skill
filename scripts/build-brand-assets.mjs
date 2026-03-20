import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const theme = {
  background: "#F5F1E8",
  surface: "#FFFDF8",
  paper: "#FFFDF8",
  primary: "#294B69",
  secondary: "#5B725F",
  accent: "#A6531A",
  text: "#1A232B",
  muted: "#5B6670",
  border: "#D8CCBE",
};

function heroSvg() {
  return `\
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="Git Flow Skill hero banner">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.background}" />
      <stop offset="100%" stop-color="#ECE3D3" />
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.surface}" />
      <stop offset="100%" stop-color="${theme.surface}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#5C4C3B" flood-opacity="0.16" />
    </filter>
  </defs>

  <rect width="1600" height="900" rx="48" fill="url(#bg)" />
  <circle cx="1380" cy="140" r="120" fill="#EFE3D1" opacity="0.82" />
  <circle cx="210" cy="760" r="150" fill="#E5D7C2" opacity="0.48" />

  <rect x="90" y="84" width="1420" height="732" rx="40" fill="url(#panel)" stroke="${theme.border}" stroke-width="2" filter="url(#shadow)" />

  <g opacity="0.95">
    <path d="M180 680 C 390 680, 470 556, 630 556 S 880 680, 1080 680 1310 566, 1430 566" fill="none" stroke="${theme.primary}" stroke-width="18" stroke-linecap="round"/>
    <path d="M180 748 C 420 748, 480 640, 640 640 S 890 788, 1100 788 1320 688, 1420 688" fill="none" stroke="${theme.secondary}" stroke-width="18" stroke-linecap="round"/>
    <path d="M180 624 C 330 624, 430 498, 620 498 S 870 620, 1070 620 1310 514, 1430 514" fill="none" stroke="${theme.accent}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="630" cy="556" r="18" fill="${theme.paper}" />
    <circle cx="1080" cy="680" r="18" fill="${theme.paper}" />
    <circle cx="640" cy="640" r="18" fill="${theme.paper}" />
    <circle cx="620" cy="498" r="16" fill="${theme.paper}" />
    <circle cx="1070" cy="620" r="16" fill="${theme.paper}" />
  </g>

  <rect x="154" y="154" width="196" height="44" rx="22" fill="#EFE3D1" opacity="0.98" />
  <text x="186" y="183" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="24" font-weight="700" fill="${theme.text}">Codex Skill</text>

  <text x="154" y="312" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="96" font-weight="800" fill="${theme.text}">Git Flow Skill</text>
  <text x="154" y="386" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="34" font-weight="500" fill="${theme.muted}">Detection-first Git Flow operations for releases, hotfixes,</text>
  <text x="154" y="432" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="34" font-weight="500" fill="${theme.muted}">repair paths, and agent-owned feature branches.</text>

  <g transform="translate(154 486)">
    <rect width="270" height="116" rx="26" fill="#FAF6EF" stroke="${theme.border}" />
    <text x="28" y="40" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="22" font-weight="700" fill="${theme.muted}">Initialize</text>
    <text x="28" y="82" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="34" font-weight="800" fill="${theme.text}">develop safely</text>
  </g>
  <g transform="translate(452 486)">
    <rect width="270" height="116" rx="26" fill="#FAF6EF" stroke="${theme.border}" />
    <text x="28" y="40" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="22" font-weight="700" fill="${theme.muted}">Finish</text>
    <text x="28" y="82" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="34" font-weight="800" fill="${theme.text}">release and hotfix</text>
  </g>
  <g transform="translate(750 486)">
    <rect width="270" height="116" rx="26" fill="#FAF6EF" stroke="${theme.border}" />
    <text x="28" y="40" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="22" font-weight="700" fill="${theme.muted}">Track</text>
    <text x="28" y="82" font-family="'Segoe UI','Yu Gothic UI','Meiryo',sans-serif" font-size="34" font-weight="800" fill="${theme.text}">codex/feature/*</text>
  </g>

</svg>`;
}

function iconSvg(size) {
  return `\
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" role="img" aria-label="Git Flow Skill icon">
  <rect width="512" height="512" rx="120" fill="${theme.primary}" />
  <rect x="42" y="42" width="428" height="428" rx="102" fill="#365574" stroke="#9FB2C4" stroke-width="6" />
  <path d="M94 314 C 162 314, 176 194, 252 194 S 340 302, 416 302" fill="none" stroke="#FFF7EA" stroke-width="28" stroke-linecap="round"/>
  <path d="M94 372 C 176 372, 188 256, 258 256 S 344 392, 418 392" fill="none" stroke="${theme.secondary}" stroke-width="24" stroke-linecap="round"/>
  <path d="M94 248 C 146 248, 180 132, 246 132 S 336 222, 418 222" fill="none" stroke="${theme.accent}" stroke-width="18" stroke-linecap="round"/>
  <circle cx="252" cy="194" r="22" fill="${theme.paper}" />
  <circle cx="258" cy="256" r="18" fill="${theme.paper}" />
  <circle cx="246" cy="132" r="16" fill="${theme.paper}" />
</svg>`;
}

async function main() {
  const repoRoot = process.cwd();
  const assetsDir = path.join(repoRoot, "assets");
  await mkdir(assetsDir, { recursive: true });

  await writeFile(path.join(assetsDir, "hero.svg"), heroSvg(), "utf8");
  await writeFile(path.join(assetsDir, "icon.svg"), iconSvg(512), "utf8");
  await writeFile(path.join(assetsDir, "icon-large.svg"), iconSvg(1024), "utf8");

  console.log(
    JSON.stringify(
      {
        assetsDir,
        generated: ["hero.svg", "icon.svg", "icon-large.svg"],
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
