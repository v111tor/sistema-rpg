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
node tools\organize_rulebook_subclasses.cjs
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
node tools\import_bestiary_ai_prompts.cjs
node tools\generate_bestiary_prompt_pngs.cjs
node tools\apply_bestiary_ai_images.cjs
node tools\enrich_bestiary_special_abilities.cjs
npm run build
node tools\publish_download_site.cjs
node tools\organize_rulebook_subclasses.cjs
node tools\apply_bestiary_ai_images.cjs
node tools\sync_rulebook_class_features.cjs
node tools\enrich_bestiary_special_abilities.cjs
node tools\sync_rulebook_pdf.cjs
```

Essa ordem garante que:

- características de Sensiente e Devoto fiquem junto das classes;
- subclasses fiquem no final da própria classe, com início e fim marcados;
- habilidades especiais do bestiário tenham descrição;
- sprites do bestiário continuem em PNG e possam ser substituídos por imagens `*-ai.png`;
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
node tools\import_bestiary_ai_prompts.cjs
node tools\generate_bestiary_prompt_pngs.cjs
node tools\apply_bestiary_ai_images.cjs
node tools\enrich_bestiary_special_abilities.cjs
```

Para usar os prompts de IA do arquivo `C:\Users\presi\Downloads\Bestiario_Prompts_IA.md`, rode:

```bash
node tools\import_bestiary_ai_prompts.cjs
node tools\generate_bestiary_prompt_pngs.cjs
node tools\apply_bestiary_ai_images.cjs
```

O importador gera `tools/bestiary_ai_prompts.json`. Se o arquivo de prompts tiver 79 entradas, o script completa a entrada ausente de **Casca Andante** para manter as 80 fichas do bestiário.

Resultado esperado:

- 80 fichas de criaturas;
- 80 referências PNG, preferencialmente em arquivos `*-ai.png`;
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
| `node tools\organize_rulebook_subclasses.cjs` | Move subclasses para o final de cada classe e marca início/fim de cada uma |
| `node tools\merge_rulebook_feature_pools.cjs` | Une as características 31-40 aos pools principais das classes e remove a expansão duplicada |
| `node tools\apply_seven_forces_codex.cjs` | Atualiza símbolos do Devoto e publica o Codex das Sete Forças nos ebooks |
| `node tools\rewrite_unique_feature_effects.cjs` | Reescreve características expandidas de Sensiente e Devoto com efeitos únicos |
| `node tools\apply_proficiency_dc_formulas.cjs` | Atualiza CDs antigas para incluir Bônus de Proficiência e ajusta fórmulas do Livro do Mestre |
| `node tools\audit_feature_duplicates.cjs` | Gera relatório de duplicatas em características, habilidades e tabelas principais |
| `node tools\apply_attribute_playtest_recommendations.cjs` | Aplica a escala revisada de CDs baseada no stress test dos atributos |
| `node tools\apply_core_rebalance_5_advances.cjs` | Define 5 avanços iniciais e troca perícias para Bônus de Proficiência por nível |
| `node tools\apply_quimera_corrections.cjs` | Aplica a Quimera corrigida com partes ativadas por Energia da Floresta |
| `node tools\sync_rulebook_pdf.cjs` | Gera o PDF atualizado do Livro de Regras a partir do HTML |
| `node tools\sync_rulebook_class_features.cjs` | Move/insere características de Sensiente e Devoto nas seções de classe |
| `node tools\stress_test_attributes.cjs` | Gera relatório matemático de stress test dos atributos d4 a d20 |
| `node tools\stress_test_creation_advances.cjs` | Gera relatório sobre a quantidade ideal de avanços de atributo na criação |
| `node tools\generate_bestiary_png_sprites.cjs` | Gera sprites PNG do bestiário |
| `node tools\import_bestiary_ai_prompts.cjs` | Importa prompts do bestiário para `tools/bestiary_ai_prompts.json` |
| `node tools\generate_bestiary_prompt_pngs.cjs` | Gera PNGs `*-ai.png` do bestiário a partir dos prompts importados |
| `node tools\apply_bestiary_ai_images.cjs` | Troca as fichas do bestiário para usar os PNGs `*-ai.png` disponíveis |
| `node tools\enrich_bestiary_special_abilities.cjs` | Adiciona descrição mecânica às habilidades especiais das criaturas |
| `node tools\rebalance_bestiary_for_5_advances.cjs` | Rebalanceia o bestiário para personagens com 5 avanços iniciais |
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
node tools\organize_rulebook_subclasses.cjs
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
