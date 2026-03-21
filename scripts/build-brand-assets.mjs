import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const theme = {
  surface: "#FFF9ED",
  surfaceLow: "#FCF3D8",
  surfaceHighest: "#EBE2C8",
  paper: "#FFFFFF",
  primary: "#4F2800",
  primaryContainer: "#6F3B00",
  secondary: "#406180",
  tertiary: "#263800",
  tint: "#8C4F10",
  text: "#1F1C0B",
  muted: "#42474D",
  ghost: "#C2C7CE",
  sidePanel: "#F7EED2",
  greenWashA: "#E4EAD7",
  greenWashB: "#D6E2CE",
};

function heroSvg() {
  return `\
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="Git Flow Skill hero banner">
  <defs>
    <linearGradient id="paper-wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.surface}" />
      <stop offset="100%" stop-color="${theme.surfaceLow}" />
    </linearGradient>
    <linearGradient id="copper-bleed" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.primary}" />
      <stop offset="100%" stop-color="${theme.primaryContainer}" />
    </linearGradient>
    <linearGradient id="green-wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.greenWashA}" />
      <stop offset="100%" stop-color="${theme.greenWashB}" />
    </linearGradient>
    <pattern id="ledger-line" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M0 43.5 H44" fill="none" stroke="${theme.primary}" stroke-opacity="0.05" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="1600" height="900" fill="url(#paper-wash)" />
  <rect y="0" width="1600" height="108" fill="${theme.surfaceLow}" />
  <rect x="1180" y="0" width="420" height="900" fill="${theme.sidePanel}" />
  <rect x="0" y="0" width="1600" height="900" fill="url(#ledger-line)" opacity="0.35" />

  <text x="86" y="68" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="28" font-style="italic" fill="${theme.primary}">Git-Flow Skill</text>
  <text x="1064" y="68" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="16" letter-spacing="2" fill="${theme.muted}">ARCHIVE</text>
  <text x="1156" y="68" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="16" letter-spacing="2" fill="${theme.secondary}">BRANCHES</text>
  <text x="1276" y="68" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="16" letter-spacing="2" fill="${theme.muted}">STRATEGY</text>
  <rect x="1394" y="34" width="118" height="38" fill="url(#copper-bleed)" />
  <text x="1421" y="58" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="18" font-style="italic" fill="${theme.paper}">Open Ledger</text>

  <g transform="translate(86 160)">
    <text x="0" y="0" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="106" font-style="italic" fill="${theme.secondary}">Git Flow Skill</text>
    <text x="0" y="70" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="30" fill="${theme.muted}">A Codex skill for detection-first Git Flow</text>
    <text x="0" y="112" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="30" fill="${theme.muted}">branching, releases, hotfixes, and</text>
    <text x="0" y="154" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="30" fill="${theme.muted}">documented agent work.</text>

    <g transform="translate(0 202)">
      <rect width="184" height="54" fill="url(#copper-bleed)" />
      <text x="27" y="35" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="26" font-style="italic" fill="${theme.paper}">Initialize</text>
      <rect x="204" width="184" height="54" fill="${theme.surface}" stroke="${theme.ghost}" stroke-opacity="0.18" />
      <text x="250" y="35" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="26" font-style="italic" fill="${theme.secondary}">Read Manual</text>
    </g>
  </g>

  <g transform="translate(970 146)">
    <rect width="442" height="422" fill="${theme.surfaceHighest}" />
    <rect x="34" y="34" width="374" height="354" fill="url(#green-wash)" />
    <rect x="34" y="34" width="374" height="354" fill="${theme.paper}" fill-opacity="0.18" />

    <path d="M150 88 V304" fill="none" stroke="${theme.primary}" stroke-width="1.5" stroke-opacity="0.2" />
    <path d="M150 145 C 210 145, 248 126, 328 118" fill="none" stroke="${theme.secondary}" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter" />
    <path d="M150 208 C 226 208, 252 188, 332 180" fill="none" stroke="${theme.primaryContainer}" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter" />
    <path d="M150 270 C 224 270, 248 252, 336 244" fill="none" stroke="${theme.tertiary}" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter" />

    <rect x="146" y="141" width="8" height="8" fill="${theme.secondary}" />
    <rect x="146" y="204" width="8" height="8" fill="${theme.secondary}" />
    <rect x="146" y="266" width="8" height="8" fill="${theme.secondary}" />
    <rect x="325" y="114" width="8" height="8" fill="${theme.secondary}" />
    <rect x="329" y="176" width="8" height="8" fill="${theme.tint}" />
    <rect x="333" y="240" width="8" height="8" fill="${theme.tertiary}" />

    <rect x="298" y="368" width="164" height="46" fill="${theme.tertiary}" />
    <text x="316" y="397" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="21" font-style="italic" fill="${theme.paper}">Certified Pattern</text>
  </g>

  <g transform="translate(362 535)">
    <rect width="788" height="168" fill="url(#green-wash)" />
    <rect width="788" height="168" fill="${theme.paper}" fill-opacity="0.14" />
    <rect x="36" y="28" width="150" height="16" fill="${theme.secondary}" fill-opacity="0.14" />
    <text x="38" y="73" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="40" font-style="italic" fill="${theme.secondary}">The Detection-First Doctrine</text>
    <text x="38" y="114" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="${theme.muted}">Inspect the real branch model before touching feature, release, or hotfix paths.</text>
    <text x="38" y="145" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="${theme.muted}">Document each move like an archival ledger, not a disposable dashboard.</text>
  </g>

  <text x="264" y="796" font-family="'Newsreader', 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif" font-size="24" font-style="italic" letter-spacing="8" fill="#73777E">TECHNICAL SPECIFICATIONS</text>

  <g transform="translate(92 822)">
    <rect width="312" height="42" fill="${theme.text}" />
    <text x="24" y="28" font-family="'Cascadia Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace" font-size="16" fill="#C8F17A">codex skill install git-flow-skill</text>
  </g>
  <g transform="translate(1104 816)">
    <rect width="332" height="48" fill="${theme.surfaceLow}" />
    <text x="22" y="30" font-family="'Cascadia Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace" font-size="16" fill="${theme.primary}">uv run --with pyyaml validate</text>
    <rect x="266" y="12" width="44" height="24" fill="${theme.paper}" />
    <text x="274" y="29" font-family="'Work Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="700" fill="${theme.tertiary}">PASS</text>
  </g>
</svg>`;
}

function iconSvg(size) {
  return `\
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" role="img" aria-label="Git Flow Skill icon" shape-rendering="geometricPrecision">
  <path d="M6 3.5 V20.5" fill="none" stroke="${theme.primary}" stroke-width="1" stroke-opacity="0.4" stroke-linecap="square" />
  <path d="M6 7.5 C 8.3 7.5, 9.9 7.1, 15.8 6" fill="none" stroke="${theme.secondary}" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
  <path d="M6 12 C 8.5 12, 10.1 11.7, 17 10.5" fill="none" stroke="${theme.primaryContainer}" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
  <path d="M6 16.5 C 8.5 16.5, 10.3 16.1, 18.2 14.9" fill="none" stroke="${theme.tertiary}" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />

  <rect x="5.25" y="6.75" width="1.5" height="1.5" fill="none" stroke="${theme.secondary}" stroke-width="1" />
  <rect x="5.25" y="11.25" width="1.5" height="1.5" fill="none" stroke="${theme.secondary}" stroke-width="1" />
  <rect x="5.25" y="15.75" width="1.5" height="1.5" fill="none" stroke="${theme.secondary}" stroke-width="1" />
  <rect x="15.05" y="5.25" width="1.5" height="1.5" fill="none" stroke="${theme.secondary}" stroke-width="1" />
  <rect x="16.25" y="9.75" width="1.5" height="1.5" fill="none" stroke="${theme.tint}" stroke-width="1" />
  <rect x="17.45" y="14.15" width="1.5" height="1.5" fill="none" stroke="${theme.tertiary}" stroke-width="1" />
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
