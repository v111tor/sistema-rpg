const fs = require("fs");
const path = require("path");

const root = process.cwd();
const publicEbook = path.join(root, "public", "ebook");
const distEbook = path.join(root, "dist", "ebook");

const files = [
  {
    source: "Sistema_Mecanico_RPG.html",
    target: "A_Ultima_Ascencao_Livro_de_Regras.html",
    alias: "A_Ultima_Ascenção_Livro_de_Regras.html",
    title: "A Ultima Ascenção — Livro de Regras",
    description: "Sistema mecânico completo, classes, habilidades, características, combate, magia e criação de personagem.",
    type: "HTML"
  },
  {
    source: "Sistema_Mecanico_RPG.pdf",
    target: "A_Ultima_Ascencao_Livro_de_Regras.pdf",
    alias: "A_Ultima_Ascenção_Livro_de_Regras.pdf",
    title: "A Ultima Ascenção — Livro de Regras",
    description: "Versão PDF do livro de regras para leitura e impressão.",
    type: "PDF"
  },
  {
    source: "Sistema_Mecanico_RPG.epub",
    target: "A_Ultima_Ascencao_Livro_de_Regras.epub",
    alias: "A_Ultima_Ascenção_Livro_de_Regras.epub",
    title: "A Ultima Ascenção — Livro de Regras",
    description: "Versão EPUB do livro de regras para leitores digitais.",
    type: "EPUB"
  },
  {
    source: "Bestiario_Sistema_Mecanico.html",
    target: "A_Ultima_Ascencao_Bestiario.html",
    alias: "A_Ultima_Ascenção_Bestiario.html",
    title: "A Ultima Ascenção — Bestiário",
    description: "Catálogo de criaturas com fichas compactas, índices por tipo, grau e habitat, sprites e artes lendárias.",
    type: "HTML"
  },
  {
    source: "Livro_do_Mestre_Sistema_Mecanico.html",
    target: "A_Ultima_Ascencao_Livro_do_Mestre.html",
    alias: "A_Ultima_Ascenção_Livro_do_Mestre.html",
    title: "A Ultima Ascenção — Livro do Mestre",
    description: "Ferramentas de mestre, classe Abismal, magia de Dreno, subclasses abissais, mapa-múndi e regras opcionais.",
    type: "HTML"
  },
  {
    source: "Codex_das_Sete_Forcas.html",
    target: "A_Ultima_Ascencao_Codex_das_Sete_Forcas.html",
    alias: "A_Ultima_Ascenção_Codex_das_Sete_Forças.html",
    title: "A Ultima Ascenção — Codex das Sete Forças",
    description: "Site complementar com lore, símbolos, cultos e referências das sete divindades.",
    type: "HTML"
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rewriteTitle(html, title, kind) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${title} para download e consulta online." />`)
    .replace(/<h1 class="title">[\s\S]*?<\/h1>/, `<h1 class="title">${title}</h1>`)
    .replace(/<p class="author">[\s\S]*?<\/p>/, `<p class="author">${kind}</p>`);
}

function copyNamedEbooks(fromDir, toDir) {
  ensureDir(toDir);
  for (const file of files) {
    const source = path.join(fromDir, file.source);
    const target = path.join(toDir, file.target);
    if (!fs.existsSync(source)) continue;
    if (file.type === "HTML") {
      const kind = file.target.includes("Bestiario") ? "Bestiário" : file.target.includes("Mestre") ? "Livro do Mestre" : "Livro de Regras";
      const rendered = rewriteTitle(fs.readFileSync(source, "utf8"), file.title, kind);
      fs.writeFileSync(target, rendered, "utf8");
      if (file.alias) fs.writeFileSync(path.join(toDir, file.alias), rendered, "utf8");
    } else {
      fs.copyFileSync(source, target);
      if (file.alias) fs.copyFileSync(source, path.join(toDir, file.alias));
    }
  }
}

function card(file) {
  const href = `ebook/${file.target}`;
  const open = file.type === "HTML" ? `<a class="button secondary" href="${href}">Ler online</a>` : "";
  return `<article class="download-card">
  <div>
    <p class="type">${file.type}</p>
    <h2>${file.title}</h2>
    <p>${file.description}</p>
  </div>
  <div class="actions">
    ${open}
    <a class="button" href="${href}" download>Baixar ${file.type}</a>
  </div>
</article>`;
}

const index = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2f1a12" />
    <meta name="description" content="Downloads oficiais dos ebooks de A Ultima Ascenção." />
    <title>A Ultima Ascenção — Downloads</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #2f1a12;
        --wine: #6e291f;
        --gold: #b88938;
        --line: rgba(99, 48, 27, 0.42);
      }
      * { box-sizing: border-box; }
      html {
        min-height: 100%;
        background-color: #d4aa68;
        background-image: url("ebook/assets/fundo-pergaminho.png");
        background-position: center;
        background-size: cover;
        background-attachment: fixed;
      }
      body {
        min-height: 100vh;
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        text-shadow: 0 1px rgba(255, 244, 208, 0.28);
      }
      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: clamp(32px, 6vw, 72px) 0;
      }
      header {
        max-width: 820px;
        margin-bottom: 28px;
        padding-bottom: 22px;
        border-bottom: 2px solid var(--line);
      }
      .eyebrow {
        margin: 0 0 10px;
        color: var(--wine);
        font-family: "Segoe UI", Arial, sans-serif;
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        color: #502118;
        font-size: clamp(2.2rem, 7vw, 5.2rem);
        line-height: .98;
        letter-spacing: 0;
      }
      .lead {
        max-width: 760px;
        margin: 18px 0 0;
        font-size: clamp(1rem, 2vw, 1.2rem);
        line-height: 1.6;
      }
      .downloads {
        display: grid;
        gap: 16px;
        margin-top: 28px;
      }
      .download-card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 18px;
        align-items: center;
        padding: 18px;
        border: 1px solid var(--line);
        border-left: 6px solid var(--wine);
        border-radius: 8px;
        background: rgba(255, 244, 208, 0.28);
        backdrop-filter: blur(1px);
      }
      .download-card h2 {
        margin: 0 0 8px;
        color: #502118;
        font-size: 1.35rem;
        letter-spacing: 0;
      }
      .download-card p {
        margin: 0;
        line-height: 1.5;
      }
      .type {
        margin-bottom: 8px !important;
        color: var(--wine);
        font-family: "Segoe UI", Arial, sans-serif;
        font-size: .78rem;
        font-weight: 800;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 14px;
        border: 1px solid #502118;
        border-radius: 6px;
        color: #fff5d6;
        background: #502118;
        font-family: "Segoe UI", Arial, sans-serif;
        font-weight: 800;
        text-decoration: none;
        white-space: nowrap;
      }
      .button.secondary {
        color: #502118;
        background: rgba(255, 244, 208, 0.24);
      }
      .sync-note {
        margin-top: 26px;
        padding: 14px 16px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 244, 208, 0.18);
        font-size: .96rem;
      }
      @media (max-width: 720px) {
        .download-card { grid-template-columns: 1fr; }
        .actions { justify-content: stretch; }
        .button { width: 100%; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <p class="eyebrow">Biblioteca oficial</p>
        <h1>A Ultima Ascenção</h1>
        <p class="lead">Baixe ou leia online os ebooks do sistema: Livro de Regras, Bestiário e Livro do Mestre. Os arquivos abaixo estão sincronizados com a versão mais recente gerada neste projeto.</p>
      </header>
      <section class="downloads" aria-label="Arquivos para download">
        ${files.map(card).join("\n")}
      </section>
      <p class="sync-note">Arquivos publicados com nomes padronizados para URL. O título público dos ebooks foi atualizado para A Ultima Ascenção.</p>
    </main>
  </body>
</html>
`;

copyNamedEbooks(publicEbook, publicEbook);
copyNamedEbooks(publicEbook, distEbook);
ensureDir(path.join(root, "dist"));

console.log(JSON.stringify({
  files: files.map((file) => `ebook/${file.target}`),
  appEntry: "index.html"
}, null, 2));
