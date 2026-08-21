/**
 * OGP画像ジェネレータ — public/images/ogp.png (1200×630) を生成する。
 *
 *   node scripts/gen-ogp.mjs
 *
 * SVGを組み立てて sharp でPNGに書き出す。デザインは以下:
 *   - 背景  : tokens.css の --grad と同値の青グラデーション
 *   - 左上  : 白ロゴ(public/images/cara_logo_white.svg のパスを流用)
 *   - 中央  : ヒーローコピー(TOPのh1と同じ文言)を白・太字で2行
 *   - 下部  : ドメイン表記
 *
 * ■ フォントについて
 * sharp(librsvg)はSVG内のテキストをシステムのインストール済みフォントで描画する。
 * 日本語が豆腐(□)になるのを避けるため、実行前に FONT_STACK のいずれかが
 * 必要。Windows標準の Yu Gothic / Meiryo があれば動作する。
 * 生成後は必ず目視で文字化けがないか確認すること。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const W = 1200;
const H = 630;

/** tokens.css の --grad と同値 */
const GRAD = { from: '#1F4FA8', mid: '#2E6BD6', to: '#3F9BE8', angleDeg: 118 };

const FONT_STACK = "'Noto Sans JP','Yu Gothic','Yu Gothic UI',Meiryo,'MS PGothic',sans-serif";

/** TOPのh1と同じ文言。改行位置は視覚バランスで決める */
const HEADLINE = ['AIで作った文書を、', 'そのまま監査に出せる。'];
const DOMAIN = 'generis-japan.com';

/**
 * CSSの linear-gradient(Ndeg, …) を SVG linearGradient の座標に変換する。
 * CSSの角度は「上方向が0度・時計回り」。グラデーション線の長さは
 * L = |W·sin θ| + |H·cos θ| で、線は矩形の中心を通る。
 */
function cssAngleToLine(angleDeg, w, h) {
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const len = Math.abs(w * sin) + Math.abs(h * cos);
  // CSSの角度方向の単位ベクトル(y軸は下向きなので cos を反転)
  const dx = sin;
  const dy = -cos;
  const cx = w / 2;
  const cy = h / 2;
  return {
    x1: +(cx - (dx * len) / 2).toFixed(2),
    y1: +(cy - (dy * len) / 2).toFixed(2),
    x2: +(cx + (dx * len) / 2).toFixed(2),
    y2: +(cy + (dy * len) / 2).toFixed(2),
  };
}

/**
 * 白ロゴSVGから <path> 要素だけを抜き出して再利用する。
 * ロゴのパスを本ファイルに複製すると原本と二重管理になるため、実ファイルから読む。
 */
function extractLogo() {
  const src = readFileSync(resolve(ROOT, 'public/images/cara_logo_white.svg'), 'utf8');
  const viewBox = src.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error('ロゴSVGから viewBox を取得できませんでした');
  // <path> と、スウッシュを包む <g>(商標記号)をすべて拾う
  const parts = src.match(/<(path|g)\b[\s\S]*?<\/\1>|<path\b[^>]*\/>/g) ?? [];
  if (parts.length === 0) throw new Error('ロゴSVGから path を抽出できませんでした');
  return { viewBox, body: parts.join('\n      ') };
}

function buildSvg() {
  const g = cssAngleToLine(GRAD.angleDeg, W, H);
  const logo = extractLogo();

  // ロゴ配置(左上)。原本の縦横比を保ったまま幅で合わせる
  const [, , vbW, vbH] = logo.viewBox.split(/[\s,]+/).map(Number);
  const logoW = 232;
  const logoH = +((vbH / vbW) * logoW).toFixed(2);
  const logoX = 76;
  const logoY = 70;

  const lineGap = 96;
  const headBaseY = 330;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" gradientUnits="userSpaceOnUse"
      x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}">
      <stop offset="0%" stop-color="${GRAD.from}"/>
      <stop offset="48%" stop-color="${GRAD.mid}"/>
      <stop offset="100%" stop-color="${GRAD.to}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 背景の装飾円(サイトのヒーローと同じ、白の薄い円) -->
  <circle cx="${W - 90}" cy="-60" r="300" fill="#FFFFFF" opacity="0.07"/>
  <circle cx="70" cy="${H + 40}" r="240" fill="#FFFFFF" opacity="0.05"/>

  <!-- 左上ロゴ(cara_logo_white.svg のパスを流用) -->
  <svg x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}"
       viewBox="${logo.viewBox}" overflow="visible">
      ${logo.body}
  </svg>

  <!-- ヒーローコピー -->
  <g font-family="${FONT_STACK}" font-weight="700" fill="#FFFFFF"
     font-size="74" letter-spacing="1">
${HEADLINE.map((line, i) => `    <text x="${logoX}" y="${headBaseY + i * lineGap}">${line}</text>`).join('\n')}
  </g>

  <!-- 下部ドメイン -->
  <text x="${logoX}" y="${H - 74}" font-family="${FONT_STACK}" font-weight="500"
        font-size="27" letter-spacing="2.5" fill="#FFFFFF" opacity="0.88">${DOMAIN}</text>
</svg>
`;
}

const svg = buildSvg();

// デバッグ用にSVGも残す(PNGの文字化け調査時に使う)
mkdirSync(resolve(ROOT, 'scripts'), { recursive: true });
writeFileSync(resolve(ROOT, 'scripts/ogp.svg'), svg, 'utf8');

const out = resolve(ROOT, 'public/images/ogp.png');
await sharp(Buffer.from(svg), { density: 144 })
  .resize(W, H)
  .png({ compressionLevel: 9 })
  .toFile(out);

const { size } = await import('node:fs').then((fs) => fs.promises.stat(out));
console.log(`✓ ${out} (${W}x${H}, ${(size / 1024).toFixed(1)} KB)`);
