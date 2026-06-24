const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = process.cwd();
const publicHtml = path.join(root, "public", "ebook", "Bestiario_Sistema_Mecanico.html");
const htmlFiles = [
  publicHtml,
  path.join(root, "dist", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Bestiario.html")
];
const dirs = [
  path.join(root, "public", "ebook", "assets", "bestiary"),
  path.join(root, "dist", "ebook", "assets", "bestiary")
];

const W = 320;
const H = 240;

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
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function hex(hex, a = 255) {
  const value = hex.replace("#", "");
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16), a];
}

function blend(dst, i, color) {
  const a = color[3] / 255;
  dst[i] = Math.round(color[0] * a + dst[i] * (1 - a));
  dst[i + 1] = Math.round(color[1] * a + dst[i + 1] * (1 - a));
  dst[i + 2] = Math.round(color[2] * a + dst[i + 2] * (1 - a));
  dst[i + 3] = 255;
}

function canvas(fill = "#ead7ad") {
  const data = Buffer.alloc(W * H * 4);
  const c = hex(fill);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
  }
  return data;
}

function rect(img, x, y, w, h, color) {
  const c = Array.isArray(color) ? color : hex(color);
  for (let yy = Math.max(0, y | 0); yy < Math.min(H, (y + h) | 0); yy++) {
    for (let xx = Math.max(0, x | 0); xx < Math.min(W, (x + w) | 0); xx++) blend(img, (yy * W + xx) * 4, c);
  }
}

function ellipse(img, cx, cy, rx, ry, color) {
  const c = Array.isArray(color) ? color : hex(color);
  const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(W - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(H - 1, Math.ceil(cy + ry));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const v = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
      if (v <= 1) blend(img, (y * W + x) * 4, c);
    }
  }
}

function line(img, x0, y0, x1, y1, color, width = 3) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ellipse(img, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width / 2, width / 2, color);
  }
}

function poly(img, points, color) {
  const c = Array.isArray(color) ? color : hex(color);
  const minY = Math.max(0, Math.floor(Math.min(...points.map(p => p[1]))));
  const maxY = Math.min(H - 1, Math.ceil(Math.max(...points.map(p => p[1]))));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i], [xj, yj] = points[j];
      if ((yi > y) !== (yj > y)) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k < xs.length; k += 2) {
      for (let x = Math.max(0, Math.floor(xs[k])); x <= Math.min(W - 1, Math.ceil(xs[k + 1] || xs[k])); x++) blend(img, (y * W + x) * 4, c);
    }
  }
}

function hash(value) {
  let h = 2166136261;
  for (const ch of value) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function decodeHtml(value) {
  return value.replace(/&[a-z]+;/gi, m => ({ "&aacute;": "á", "&eacute;": "é", "&iacute;": "í", "&oacute;": "ó", "&uacute;": "ú", "&atilde;": "ã", "&otilde;": "õ", "&ccedil;": "ç", "&amp;": "&" }[m] || m));
}

function strip(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, "")).trim();
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseMonsters(html) {
  const monsters = [];
  const re = /<article class="monster-card grade-(\d)" id="([^"]+)">([\s\S]*?)<\/article>/g;
  let m;
  while ((m = re.exec(html))) {
    const body = m[3];
    const tags = [...body.matchAll(/<span>([\s\S]*?)<\/span>/g)].map(x => strip(x[1]));
    const name = strip((body.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || m[2]);
    monsters.push({
      grade: Number(m[1]),
      id: m[2],
      name,
      slug: slugify(m[2]),
      type: (tags[0] || "Tipo: Criatura").replace("Tipo:", "").trim(),
      size: tags[2] || "",
      habitat: tags[3] || "",
      source: tags[4] || ""
    });
  }
  return monsters;
}

const typeColor = {
  Besta: ["#6f4b2a", "#2d2118"],
  Humanoide: ["#6b4434", "#201814"],
  Construto: ["#697579", "#24292b"],
  "Espírito": ["#a9d8e6", "#2b4456"],
  "Aberração": ["#8e3159", "#220b18"],
  Elemental: ["#529ca0", "#203c42"],
  "Morto-vivo": ["#c9c1a0", "#29261f"],
  Entidade: ["#5a204d", "#140912"]
};
const sourceColor = { Primitiva: "#d8462d", Natural: "#4d8d3d", Arcana: "#7357d4", Tecnologia: "#bd7a32", "Fé": "#d7b44a", "Absorção": "#11131c" };
const habitatColor = { Floresta: "#355d30", "Pântano": "#4b5b31", "Ruína": "#77634c", Cidade: "#59606b", Deserto: "#b38343", "Linha De Força": "#5941a9", Montanha: "#727b83", "Subterrâneo": "#2d2237" };

function background(img, monster) {
  rect(img, 6, 6, 308, 228, hex(habitatColor[monster.habitat] || "#6d5439", 70));
  const a = sourceColor[monster.source] || "#8b5a32";
  if (monster.habitat.includes("Linha")) { line(img, 20, 180, 152, 72, hex(a, 130), 7); line(img, 152, 72, 298, 100, hex(a, 110), 5); ellipse(img, 152, 72, 10, 10, hex(a, 180)); }
  if (monster.habitat === "Floresta") for (const x of [44, 84, 242, 280]) { line(img, x, 190, x + 16, 112, "#263b20", 7); line(img, x, 190, x - 16, 128, "#263b20", 7); }
  if (monster.habitat === "Ruína") for (const x of [38, 88, 238, 276]) rect(img, x, 118 - (x % 3) * 18, 18, 72 + (x % 3) * 18, hex("#3b2f25", 80));
  if (monster.habitat === "Cidade") for (const x of [32, 68, 230, 266]) rect(img, x, 96 - (x % 5) * 9, 20, 96 + (x % 5) * 9, hex("#252a30", 70));
  if (monster.habitat === "Deserto") { line(img, 0, 182, 130, 156, hex("#8f6231", 100), 12); line(img, 130, 156, 320, 180, hex("#8f6231", 90), 10); ellipse(img, 262, 44, 14, 14, hex("#d69d48", 130)); }
  if (monster.habitat === "Montanha") { poly(img, [[20, 190], [80, 72], [138, 190]], hex("#3f4852", 90)); poly(img, [[178, 190], [242, 76], [310, 190]], hex("#3f4852", 90)); }
  if (monster.habitat === "Pântano") { line(img, 8, 180, 92, 166, hex("#273923", 100), 10); line(img, 92, 166, 202, 184, hex("#273923", 100), 10); line(img, 202, 184, 312, 166, hex("#273923", 100), 10); }
  if (monster.habitat === "Subterrâneo") rect(img, 0, 0, 320, 44, hex("#17111a", 120));
}

function drawBase(img, monster) {
  const [main, dark] = typeColor[monster.type] || ["#725436", "#241b15"];
  const accent = sourceColor[monster.source] || "#a46a32";
  const n = monster.slug;
  if (monster.type === "Construto") {
    rect(img, 112, 72, 96, 86, hex(main)); rect(img, 132, 42, 56, 34, hex(main)); ellipse(img, 146, 92, 8, 8, accent); ellipse(img, 174, 92, 8, 8, accent);
    line(img, 112, 112, 70, 152, dark, 8); line(img, 208, 112, 250, 152, dark, 8); line(img, 134, 158, 114, 214, dark, 8); line(img, 186, 158, 206, 214, dark, 8);
  } else if (monster.type === "Humanoide") {
    ellipse(img, 160, 58, 24, 24, main); poly(img, [[132, 92], [188, 92], [210, 178], [110, 178]], hex(main));
    line(img, 122, 112, 78, 154, dark, 7); line(img, 198, 112, 242, 154, dark, 7); line(img, 140, 176, 124, 220, dark, 7); line(img, 180, 176, 196, 220, dark, 7);
  } else if (monster.type === "Espírito") {
    poly(img, [[160, 36], [206, 92], [198, 166], [160, 218], [118, 166], [108, 92]], hex(main, 150)); ellipse(img, 146, 104, 8, 15, accent); ellipse(img, 178, 104, 8, 15, accent);
  } else if (monster.type === "Aberração") {
    ellipse(img, 160, 112, 64, 48, main); for (const a of [0, 40, 80, 140, 220, 280]) line(img, 160, 134, 160 + Math.cos(a) * 105, 134 + Math.sin(a) * 78, dark, 8);
    for (let i = 0; i < 7; i++) ellipse(img, 132 + (i % 4) * 18, 92 + Math.floor(i / 4) * 22, 7, 5, "#f4e7c0");
  } else if (monster.type === "Elemental") {
    ellipse(img, 160, 124, 62, 62, hex(main, 135)); line(img, 96, 170, 220, 68, accent, 13); line(img, 114, 78, 228, 158, accent, 9); ellipse(img, 160, 124, 18, 18, accent);
  } else if (monster.type === "Morto-vivo") {
    ellipse(img, 160, 56, 24, 24, main); line(img, 160, 80, 160, 168, main, 13); line(img, 126, 110, 194, 110, main, 9); line(img, 140, 168, 116, 220, main, 8); line(img, 180, 168, 204, 220, main, 8);
  } else if (monster.type === "Entidade") {
    poly(img, [[160, 28], [222, 104], [206, 194], [160, 224], [112, 194], [96, 104]], hex(main)); ellipse(img, 160, 112, 28, 28, hex(accent, 180));
  } else {
    ellipse(img, 160, 120, 72, 54, main);
  }
  if (n.includes("lobo") || n.includes("hiena") || n.includes("urso") || n.includes("crocodilo") || n.includes("serpente")) {
    ellipse(img, 144, 134, 84, 34, main); ellipse(img, 224, 116, 28, 22, main); line(img, 86, 148, 44, 168, dark, 8); ellipse(img, 234, 110, 4, 4, accent);
  }
  if (n.includes("corvo") || n.includes("mariposa") || n.includes("noiva")) {
    poly(img, [[154, 112], [38, 84], [134, 150]], hex(dark, 220)); poly(img, [[166, 112], [282, 84], [186, 150]], hex(dark, 220)); ellipse(img, 160, 118, 16, 52, main);
  }
  if (n.includes("boca") || n.includes("dentes") || n.includes("riso")) {
    ellipse(img, 160, 124, 86, 36, "#210711"); for (let x = 100; x <= 220; x += 16) poly(img, [[x, 100], [x + 7, 126], [x + 14, 100]], "#f5e5c6");
  }
  if (n.includes("vidro") || n.includes("cristal") || n.includes("espelhado")) {
    for (const [x, y] of [[90, 70], [224, 96], [158, 48]]) poly(img, [[x, y - 28], [x + 18, y], [x, y + 30], [x - 18, y]], hex("#d8e5ee", 210));
  }
  if (n.includes("raiz") || n.includes("casca")) {
    line(img, 160, 190, 160, 60, "#4f321e", 11); line(img, 160, 116, 96, 52, "#4f321e", 8); line(img, 160, 116, 232, 52, "#4f321e", 8); ellipse(img, 96, 52, 18, 14, "#5f8c3e"); ellipse(img, 232, 52, 18, 14, "#5f8c3e");
  }
  if (n.includes("fissura") || n.includes("vazio") || n.includes("sifao") || n.includes("linha")) {
    ellipse(img, 160, 118, 50, 50, hex("#12111c", 190)); ellipse(img, 160, 118, 28, 28, hex(accent, 150)); line(img, 160, 70, 184, 28, accent, 4); line(img, 160, 166, 126, 218, accent, 4);
  }
  if (n.includes("sino")) { poly(img, [[120, 76], [200, 76], [218, 164], [102, 164]], hex("#b89b55")); ellipse(img, 160, 176, 12, 12, accent); }
  if (n.includes("livro") || n.includes("arquivo")) { rect(img, 94, 68, 64, 98, "#b88952"); rect(img, 162, 68, 64, 98, "#d0ab68"); ellipse(img, 128, 116, 8, 8, accent); ellipse(img, 194, 116, 8, 8, accent); }
  if (n.includes("luto") || n.includes("tristeza") || n.includes("saudade") || n.includes("chorosa")) {
    ellipse(img, 160, 116, 34, 62, hex("#6f86a6", 180)); ellipse(img, 116, 116, 44, 26, hex("#6f86a6", 130)); ellipse(img, 204, 116, 44, 26, hex("#6f86a6", 130));
  }
  for (let i = 0; i < monster.grade; i++) ellipse(img, 24 + i * 14, 26, 5, 5, accent);
  rect(img, 12, 12, 296, 4, hex("#2f1a12", 120)); rect(img, 12, 224, 296, 4, hex("#2f1a12", 120)); rect(img, 12, 12, 4, 216, hex("#2f1a12", 120)); rect(img, 304, 12, 4, 216, hex("#2f1a12", 120));
}

function render(monster) {
  const img = canvas();
  background(img, monster);
  drawBase(img, monster);
  return encodePng(W, H, img);
}

const monsters = parseMonsters(fs.readFileSync(publicHtml, "utf8"));
for (const dir of dirs) fs.mkdirSync(dir, { recursive: true });
for (const monster of monsters) {
  if (monster.grade === 5) continue;
  const png = render(monster);
  for (const dir of dirs) fs.writeFileSync(path.join(dir, `${monster.slug}-sprite.png`), png);
}
for (const htmlFile of htmlFiles) {
  if (!fs.existsSync(htmlFile)) continue;
  let html = fs.readFileSync(htmlFile, "utf8");
  html = html.replace(/assets\/bestiary\/([^"]+-sprite)\.svg/g, "assets/bestiary/$1.png");
  fs.writeFileSync(htmlFile, html, "utf8");
}
console.log(JSON.stringify({ pngSprites: monsters.filter(m => m.grade !== 5).length }, null, 2));
