const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = process.cwd();
const promptsPath = path.join(root, "tools", "bestiary_ai_prompts.json");
const dirs = [
  path.join(root, "public", "ebook", "assets", "bestiary"),
  path.join(root, "dist", "ebook", "assets", "bestiary")
];

const W = 512;
const H = 384;

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function hash(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function color(hex, alpha = 255) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), alpha];
}

function mix(a, b, t) {
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
    Math.round((a[3] ?? 255) * (1 - t) + (b[3] ?? 255) * t)
  ];
}

function blend(img, i, c) {
  const a = c[3] / 255;
  img[i] = Math.round(c[0] * a + img[i] * (1 - a));
  img[i + 1] = Math.round(c[1] * a + img[i + 1] * (1 - a));
  img[i + 2] = Math.round(c[2] * a + img[i + 2] * (1 - a));
  img[i + 3] = 255;
}

function canvas(seed) {
  const img = Buffer.alloc(W * H * 4);
  const a = color("#efe4cf");
  const b = color("#d8c8ab");
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = (((x * 13 + y * 17 + seed) % 31) / 31) * 0.08;
      const c = mix(a, b, y / H * 0.35 + n);
      const i = (y * W + x) * 4;
      img[i] = c[0]; img[i + 1] = c[1]; img[i + 2] = c[2]; img[i + 3] = 255;
    }
  }
  return img;
}

function ellipse(img, cx, cy, rx, ry, c) {
  const x0 = Math.max(0, Math.floor(cx - rx));
  const x1 = Math.min(W - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry));
  const y1 = Math.min(H - 1, Math.ceil(cy + ry));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const v = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
      if (v <= 1) blend(img, (y * W + x) * 4, c);
    }
  }
}

function rect(img, x, y, w, h, c) {
  for (let yy = Math.max(0, y | 0); yy < Math.min(H, (y + h) | 0); yy++) {
    for (let xx = Math.max(0, x | 0); xx < Math.min(W, (x + w) | 0); xx++) blend(img, (yy * W + xx) * 4, c);
  }
}

function line(img, x0, y0, x1, y1, c, width = 4) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ellipse(img, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width / 2, width / 2, c);
  }
}

function poly(img, pts, c) {
  const minY = Math.max(0, Math.floor(Math.min(...pts.map(p => p[1]))));
  const maxY = Math.min(H - 1, Math.ceil(Math.max(...pts.map(p => p[1]))));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y)) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k < xs.length; k += 2) {
      for (let x = Math.max(0, Math.floor(xs[k])); x <= Math.min(W - 1, Math.ceil(xs[k + 1] ?? xs[k])); x++) blend(img, (y * W + x) * 4, c);
    }
  }
}

function palette(prompt, seed) {
  const p = prompt.toLowerCase();
  if (/luz|dourad|solar|radiante|anjo|sagrado/.test(p)) return ["#d1a642", "#fff1a8", "#6b4a1f"];
  if (/sombra|noite|escuro|vazio|cinza|luto/.test(p)) return ["#2d2b38", "#6d7188", "#111118"];
  if (/lodo|pântano|pantano|lama|raiz|floresta|verde|musgo/.test(p)) return ["#4f6a3d", "#9aa86a", "#28321e"];
  if (/fogo|chama|raiva|sangue|demônio|demonio/.test(p)) return ["#9a3327", "#e08a3a", "#3b1714"];
  if (/gelo|água|agua|afog|rio|lago|bruma/.test(p)) return ["#4b7f96", "#b7dce2", "#1d3642"];
  if (/cristal|vidro|espelho|runa|arcana|fissura/.test(p)) return ["#5866a8", "#b4c4e8", "#2f315a"];
  if (/metal|cobre|ferro|máquina|maquina|drone|tecn/.test(p)) return ["#806d54", "#c6b28c", "#303238"];
  const hues = ["#6b5944", "#827456", "#495463", "#684a58"];
  return [hues[seed % hues.length], "#c8b58d", "#2f2a24"];
}

function addInk(img, seed) {
  const ink = color("#2a211d", 70);
  for (let i = 0; i < 36; i++) {
    const x = 40 + ((seed * (i + 3)) % 420);
    const y = 45 + ((seed * (i + 7)) % 280);
    line(img, x, y, x + ((seed >> (i % 12)) % 41) - 20, y + ((seed >> (i % 10)) % 31) - 15, ink, 1);
  }
}

function addAura(img, cx, cy, rx, ry, c) {
  for (let i = 5; i >= 1; i--) ellipse(img, cx, cy, rx + i * 10, ry + i * 8, [c[0], c[1], c[2], 16]);
}

function drawCreature(item) {
  const seed = hash(item.name + item.prompt);
  const img = canvas(seed);
  const [baseHex, lightHex, darkHex] = palette(item.prompt, seed);
  const base = color(baseHex, 235);
  const light = color(lightHex, 210);
  const dark = color(darkHex, 230);
  const glow = color(lightHex, 95);
  const n = item.number;
  const p = item.prompt.toLowerCase();

  addAura(img, 260, 190, 120, 85, glow);

  if (n <= 10) drawBeast(img, n, p, base, light, dark, seed);
  else if (n <= 20) drawHumanoid(img, p, base, light, dark, seed);
  else if (n <= 30) drawConstruct(img, p, base, light, dark, seed);
  else if (n <= 40) drawSpirit(img, p, base, light, dark, seed);
  else if (n <= 50) drawAberration(img, p, base, light, dark, seed);
  else if (n <= 60) drawElemental(img, p, base, light, dark, seed);
  else if (n <= 70) drawUndead(img, p, base, light, dark, seed);
  else drawEntity(img, p, base, light, dark, seed);

  addInk(img, seed);
  return img;
}

function drawBeast(img, n, p, base, light, dark, seed) {
  if (/corvo|mariposa|vaga-lume/.test(p)) {
    ellipse(img, 250, 185, 40, 60, base);
    poly(img, [[250, 175], [95, 105], [175, 215]], light);
    poly(img, [[260, 175], [420, 105], [335, 215]], light);
    ellipse(img, 250, 120, 28, 24, dark);
    if (/vaga-lume/.test(p)) ellipse(img, 250, 245, 34, 54, light);
  } else if (/serpente/.test(p)) {
    for (let i = 0; i < 15; i++) ellipse(img, 105 + i * 24, 210 + Math.sin(i) * 35, 30, 18, i % 2 ? light : base);
    ellipse(img, 420, 185, 38, 28, dark);
  } else {
    ellipse(img, 250, 205, 105, 48, base);
    ellipse(img, 348, 165, 48, 36, dark);
    for (const x of [185, 235, 290, 330]) line(img, x, 238, x - 15 + (seed % 30), 302, dark, 9);
    poly(img, [[360, 140], [378, 95], [390, 146]], dark);
    poly(img, [[320, 140], [306, 96], [294, 146]], dark);
    line(img, 155, 190, 75, 150, base, 14);
  }
  if (/bruma|cinza|luto/.test(p)) for (let i = 0; i < 8; i++) ellipse(img, 130 + i * 35, 250 - i * 8, 52, 18, [light[0], light[1], light[2], 45]);
}

function drawHumanoid(img, p, base, light, dark) {
  ellipse(img, 255, 115, 32, 38, dark);
  rect(img, 218, 150, 74, 105, base);
  line(img, 222, 165, 145, 222, dark, 13);
  line(img, 290, 165, 370, 218, dark, 13);
  line(img, 235, 250, 205, 330, dark, 14);
  line(img, 275, 250, 305, 330, dark, 14);
  if (/espada|duelista/.test(p)) line(img, 370, 215, 440, 120, light, 6);
  if (/luz|fé|fe/.test(p)) ellipse(img, 255, 135, 76, 95, light);
  if (/sombra|capuz/.test(p)) poly(img, [[255, 75], [205, 150], [305, 150]], dark);
  if (/cristal|linha|caos/.test(p)) for (let i = 0; i < 5; i++) ellipse(img, 205 + i * 28, 170 + i * 12, 10, 18, light);
}

function drawConstruct(img, p, base, light, dark) {
  if (/torreta|colmeia|máquina|maquina/.test(p)) {
    ellipse(img, 255, 190, 96, 96, base);
    rect(img, 210, 260, 90, 50, dark);
    ellipse(img, 255, 175, 26, 26, light);
    for (let i = 0; i < 8; i++) line(img, 255, 190, 255 + Math.cos(i) * 118, 190 + Math.sin(i) * 85, dark, 5);
  } else {
    rect(img, 220, 105, 75, 170, base);
    ellipse(img, 258, 86, 38, 32, dark);
    line(img, 220, 135, 145, 215, dark, 18);
    line(img, 295, 135, 375, 215, dark, 18);
    line(img, 235, 275, 205, 340, dark, 18);
    line(img, 280, 275, 310, 340, dark, 18);
  }
  if (/runa|juramento|sagrado/.test(p)) ellipse(img, 258, 170, 22, 30, light);
  if (/raiz|casca|sal/.test(p)) for (let i = 0; i < 9; i++) line(img, 180 + i * 20, 300, 150 + i * 25, 355, light, 5);
}

function drawSpirit(img, p, base, light, dark) {
  ellipse(img, 255, 145, 45, 55, [base[0], base[1], base[2], 150]);
  ellipse(img, 255, 230, 80, 112, [base[0], base[1], base[2], 120]);
  for (let i = 0; i < 10; i++) line(img, 210 + i * 10, 255, 160 + i * 22, 335, [light[0], light[1], light[2], 90], 7);
  if (/máscara|mascara/.test(p)) ellipse(img, 255, 135, 30, 40, light);
  if (/vento|cantor|eco/.test(p)) for (let i = 0; i < 5; i++) ellipse(img, 255, 190, 90 + i * 25, 35 + i * 12, [dark[0], dark[1], dark[2], 35]);
  if (/balança|ordem|julgamento/.test(p)) { line(img, 255, 95, 255, 250, dark, 4); line(img, 205, 155, 305, 155, dark, 4); }
}

function drawAberration(img, p, base, light, dark, seed) {
  ellipse(img, 255, 200, 105, 88, base);
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    line(img, 255, 205, 255 + Math.cos(a) * (95 + seed % 50), 205 + Math.sin(a) * (80 + seed % 30), dark, 8);
  }
  if (/olhos|olho/.test(p)) for (let i = 0; i < 18; i++) ellipse(img, 180 + (i * 37) % 150, 150 + (i * 23) % 100, 10, 7, light);
  if (/boca|dentes/.test(p)) ellipse(img, 255, 215, 58, 28, dark);
  if (/espelh|vidro|núcleo|nucleo/.test(p)) for (let i = 0; i < 9; i++) poly(img, [[180 + i * 18, 100 + i * 6], [205 + i * 18, 118], [190 + i * 18, 150]], light);
}

function drawElemental(img, p, base, light, dark) {
  if (/vento|pó|po|areia|nuvem/.test(p)) {
    for (let i = 0; i < 12; i++) ellipse(img, 150 + i * 22, 150 + Math.sin(i) * 65, 58, 22, [base[0], base[1], base[2], 110]);
  } else if (/chama|fogo/.test(p)) {
    for (let i = 0; i < 5; i++) poly(img, [[255, 70 + i * 18], [190 - i * 8, 300], [320 + i * 8, 300]], i % 2 ? light : base);
  } else {
    ellipse(img, 255, 200, 78, 130, base);
    ellipse(img, 255, 105, 40, 44, light);
  }
  if (/raiz|pedra|gelo/.test(p)) for (let i = 0; i < 7; i++) line(img, 195 + i * 20, 100, 150 + i * 35, 310, dark, 5);
}

function drawUndead(img, p, base, light, dark) {
  ellipse(img, 255, 105, 34, 42, dark);
  rect(img, 225, 145, 60, 120, base);
  line(img, 225, 165, 160, 245, dark, 10);
  line(img, 285, 165, 350, 245, dark, 10);
  line(img, 235, 260, 215, 330, dark, 12);
  line(img, 275, 260, 300, 330, dark, 12);
  if (/coroa|rei/.test(p)) poly(img, [[220, 82], [240, 45], [255, 80], [276, 45], [292, 82]], light);
  if (/sino/.test(p)) ellipse(img, 255, 190, 55, 70, light);
  if (/enxame|dentes/.test(p)) for (let i = 0; i < 40; i++) ellipse(img, 130 + (i * 37) % 250, 130 + (i * 19) % 160, 9, 5, light);
}

function drawEntity(img, p, base, light, dark) {
  addAura(img, 255, 185, 145, 120, light);
  if (/fissura|vazio|linha/.test(p)) {
    poly(img, [[250, 40], [300, 145], [260, 190], [310, 340], [215, 220], [245, 170], [210, 80]], dark);
    line(img, 250, 45, 310, 340, light, 7);
  } else if (/máquina|maquina/.test(p)) {
    for (let r = 120; r > 35; r -= 28) ellipse(img, 255, 190, r, r, r % 2 ? base : light);
    ellipse(img, 255, 190, 28, 28, dark);
  } else {
    ellipse(img, 255, 175, 90, 115, base);
    ellipse(img, 255, 85, 45, 48, dark);
    for (let i = 0; i < 6; i++) line(img, 255, 185, 105 + i * 60, 95 + (i % 3) * 90, dark, 10);
  }
  if (/asas|anjo/.test(p)) { poly(img, [[210, 150], [65, 70], [130, 245]], light); poly(img, [[300, 150], [445, 70], [380, 245]], light); }
}

if (!fs.existsSync(promptsPath)) {
  console.error("Rode primeiro: node tools\\import_bestiary_ai_prompts.cjs");
  process.exit(1);
}

const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));
let generated = 0;
for (const dir of dirs) fs.mkdirSync(dir, { recursive: true });

for (const item of prompts) {
  const publicFile = path.join(dirs[0], item.target);
  if (!fs.existsSync(publicFile)) {
    fs.writeFileSync(publicFile, encodePng(W, H, drawCreature(item)));
    generated++;
  }
  for (const dir of dirs.slice(1)) {
    const target = path.join(dir, item.target);
    if (!fs.existsSync(target)) fs.copyFileSync(publicFile, target);
  }
}

console.log(JSON.stringify({ prompts: prompts.length, generated }, null, 2));
