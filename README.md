# A Ultima Ascenção

Aplicação React + TypeScript para gerenciar mesas de RPG e publicar a biblioteca de ebooks do sistema.

O projeto tem duas partes principais:

- **App de mesa**: fichas, campanhas, criaturas, mapas, habilidades, dados e downloads.
- **Ebooks publicados**: Livro de Regras, Bestiário e Livro do Mestre em `public/ebook` e `dist/ebook`.

---

## Como Rodar

Instale as dependências:

```bash
npm install
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

Abra a URL mostrada pelo Vite, normalmente:

```text
http://localhost:5173/
```

No PowerShell, se houver restrição de execução, use:

```powershell
npm.cmd install
npm.cmd run dev
```

---

## Build E Publicação Local

Gere o build de produção:

```bash
npm run build
```

Depois do build, sincronize os ebooks para dentro de `dist/ebook`:

```bash
node tools\publish_download_site.cjs
node tools\sync_rulebook_class_features.cjs
node tools\enrich_bestiary_special_abilities.cjs
node tools\sync_rulebook_pdf.cjs
```

Para testar o build local:

```bash
node tools\serve_download_site.cjs
```

URL local:

```text
http://127.0.0.1:4173/
```

---

## Fluxo Recomendado Após Editar Conteúdo

Use esta sequência quando mexer em habilidades, características, bestiário ou ebooks:

```bash
node tools\expand_feature_descriptions.cjs
node tools\sync_rulebook_class_features.cjs
node tools\generate_bestiary_png_sprites.cjs
node tools\enrich_bestiary_special_abilities.cjs
npm run build
node tools\publish_download_site.cjs
node tools\sync_rulebook_class_features.cjs
node tools\enrich_bestiary_special_abilities.cjs
node tools\sync_rulebook_pdf.cjs
```

Essa ordem garante que:

- características de Sensiente e Devoto fiquem junto das classes;
- habilidades especiais do bestiário tenham descrição;
- sprites do bestiário continuem em PNG;
- arquivos finais sejam copiados para `dist`.
- o PDF do Livro de Regras seja refeito a partir do HTML atualizado.

---

## Ebooks

Os ebooks ficam em:

```text
public/ebook/
dist/ebook/
```

Arquivos principais publicados:

```text
A_Ultima_Ascencao_Livro_de_Regras.html
A_Ultima_Ascencao_Livro_de_Regras.pdf
A_Ultima_Ascencao_Livro_de_Regras.epub
A_Ultima_Ascencao_Bestiario.html
A_Ultima_Ascencao_Livro_do_Mestre.html
```

Também existem aliases com acento no nome, como:

```text
A_Ultima_Ascenção_Livro_de_Regras.html
A_Ultima_Ascenção_Bestiario.html
```

Os arquivos sem acento são os mais seguros para URL e hospedagem.

---

## Aba Downloads

Dentro do app há uma aba **Downloads**.

Ela lista:

- Livro de Regras em HTML, PDF e EPUB;
- Bestiário em HTML;
- Livro do Mestre em HTML.

Os botões usam os arquivos `A_Ultima_Ascencao_*`, pois eles funcionam melhor em deploys estáticos.

---

## Organização Do Livro De Regras

As características expandidas de **Sensiente** e **Devoto** são geradas a partir de:

```text
src/data/abilities.ts
```

Scripts relacionados:

```bash
node tools\expand_feature_descriptions.cjs
node tools\sync_rulebook_class_features.cjs
```

Resultado esperado:

- Sensiente: 120 características expandidas, com custo PE, descrição e efeito.
- Devoto: 140 características expandidas, com custo PD, descrição e efeito.
- Essas tabelas aparecem junto das seções de classe, antes da Parte XIII de habilidades.

---

## Bestiário

O bestiário usa PNG nas fichas das criaturas.

Scripts relacionados:

```bash
node tools\generate_bestiary_png_sprites.cjs
node tools\enrich_bestiary_special_abilities.cjs
```

Resultado esperado:

- 80 fichas de criaturas;
- 80 referências PNG;
- 0 referências SVG;
- 80 habilidades especiais com descrição mecânica.

---

## Estrutura Principal

```text
src/
  app/
    AppShell.tsx
    AppContent.tsx
    tabs.tsx
    useActiveDiceRoll.ts
    useCloudSync.ts
  components/
    abilities/
    campaign/
    creatures/
    dice/
    downloads/
    maps/
    sheets/
    ui/
  data/
    abilities.ts
    bestiary.ts
    catalog.ts
    constants.ts
    magic.ts
  services/
  store/
  types/
```

Arquivos de publicação:

```text
public/ebook/
dist/ebook/
tools/
netlify.toml
```

---

## Scripts Úteis

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist` |
| `npm run preview` | Preview Vite do build |
| `node tools\serve_download_site.cjs` | Servidor estático simples em `http://127.0.0.1:4173/` |
| `node tools\publish_download_site.cjs` | Sincroniza ebooks nomeados para `public` e `dist` |
| `node tools\sync_rulebook_pdf.cjs` | Gera o PDF atualizado do Livro de Regras a partir do HTML |
| `node tools\sync_rulebook_class_features.cjs` | Move/insere características de Sensiente e Devoto nas seções de classe |
| `node tools\generate_bestiary_png_sprites.cjs` | Gera sprites PNG do bestiário |
| `node tools\enrich_bestiary_special_abilities.cjs` | Adiciona descrição mecânica às habilidades especiais das criaturas |
| `node tools\expand_feature_descriptions.cjs` | Atualiza efeitos/custos das características expandidas |

---

## Deploy

O projeto já tem `netlify.toml`.

Configuração esperada:

```toml
[build]
  publish = "dist"
```

Antes de publicar:

```bash
npm run build
node tools\publish_download_site.cjs
node tools\sync_rulebook_class_features.cjs
node tools\enrich_bestiary_special_abilities.cjs
node tools\sync_rulebook_pdf.cjs
```

Depois disso, publique a pasta `dist`.

---

## Supabase Opcional

O app pode sincronizar dados em nuvem via Supabase.

Use o botão **Online** na barra superior e informe:

- URL do projeto Supabase;
- Anon Key;
- código de partilha da mesa.

O schema está em:

```text
supabase_schema.sql
```

---

## Observações

- `dist` é gerado pelo build, então pode ser recriado.
- Depois de qualquer build, rode os scripts de sincronização dos ebooks novamente.
- Os arquivos SVG antigos do bestiário foram removidos; o bestiário publicado usa PNG.
- Para links públicos, prefira os nomes `A_Ultima_Ascencao_*`, sem acento.
