# C.R.M. — Central de Registro Mecânico

Sistema de gerenciamento para RPG de mesa — fichas de personagem, campanhas, criaturas, mapas táticos, habilidades e rolagem de dados.

Aplicação modular em React e TypeScript para gerenciamento de mesas de RPG.

---

## Stack

| Camada       | Tecnologia                     |
|-------------|--------------------------------|
| Build        | [Vite](https://vitejs.dev/)    |
| UI           | React 19 + TypeScript          |
| Estado       | Zustand (subscribeWithSelector) |
| Estilo       | Tailwind CSS v4 + CSS custom   |
| Nuvem        | Supabase (Realtime + Auth)     |
| Persistência | localStorage + JSON export     |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── abilities/   # Aba de habilidades e catálogo de magias
│   ├── campaign/    # Aba de campanha, party e notas de sessão
│   ├── creatures/   # Aba de criaturas, bestiário e controle de iniciativa
│   ├── dice/        # Aba de rolagem de dados
│   ├── maps/        # Editor tático de mapas com tiles
│   ├── sheets/      # Ficha de personagem (lista + formulário)
│   └── ui/          # Componentes base: Modal, Toast, TopBar, Sidebar
├── data/
│   ├── abilities.ts # Habilidades por nível e classe (todas as classes)
│   ├── bestiary.ts  # Catálogo do bestiário (80 criaturas)
│   ├── constants.ts # Atributos, classes, perícias, ferramentas de mapa
│   └── magic.ts     # Catálogo de magias (200 entradas, 4 fontes)
├── services/
│   ├── storage.ts   # localStorage, export/import JSON, factories de estado
│   └── supabase.ts  # Cliente Supabase, auth, sync em tempo real
├── store/
│   └── index.ts     # Zustand store central com todas as actions
├── types/
│   └── index.ts     # Interfaces TypeScript para todo o domínio
├── App.tsx          # Roteamento de abas
└── index.css        # Design system com variáveis CSS + Tailwind
```

---

## Funcionalidades

- **Personagens** — Ficha completa: atributos (dados), perícias, ataques, equipamento, história
- **Campanhas** — Arquivo de campanha, party, registro de sessões com notas e etiquetas
- **Criaturas** — Criação de criaturas da campanha, catálogo do bestiário, controle de iniciativa
- **Mapas** — Editor tático de grid com tiles, pintura livre, mapas aleatórios e banco de mapas salvos
- **Habilidades** — Catálogo de 200 magias (4 fontes) e habilidades por nível de todas as 6 classes
- **Dados** — Rolagem livre (d4 a d100), fórmulas customizadas (`3d6+2`), histórico de 100 rolagens
- **Sincronização** — Backup/restauração local em JSON + sync em tempo real via Supabase

---

## Como rodar

### Instalação automática (recomendado)

**Linux / macOS:**
```bash
bash setup/install.sh
```

**Windows (PowerShell):**
```powershell
.\setup\install.ps1
```

Os scripts verificam a versão do Node.js (≥18), instalam as dependências e oferecem subir o servidor automaticamente.

### Instalação manual

```bash
npm install
npm run dev        # servidor de desenvolvimento em http://localhost:5173
```

No PowerShell com política de scripts restrita, use `npm.cmd install` e
`npm.cmd run dev`.

Build de produção:
```bash
npm run build      # gera dist/
npm run lint       # valida TypeScript e regras React
npm run preview    # serve o build localmente
```

---

## Diferenças em relação ao original

| Antes (vanilla JS)              | Depois (refatorado)                           |
|---------------------------------|-----------------------------------------------|
| 11 arquivos JS com globais      | Módulos ES com import/export explícitos       |
| ~5.500 linhas sem tipagem       | TypeScript estrito em toda a base de código   |
| Templates HTML embutidos em JS  | Componentes React com JSX tipado              |
| Variáveis globais mutáveis      | Zustand store com actions bem definidas       |
| CSS monolítico (~620 linhas)    | Design system com variáveis CSS + Tailwind v4 |
| Sem build system                | Vite com HMR, tree-shaking e bundle otimizado |

---

## Configuração Supabase (opcional)

Para sincronização em nuvem, clique em **Online** no topbar e configure:

1. **URL do projeto** — ex: `https://xxx.supabase.co`
2. **Anon Key** — chave pública do projeto
3. **Código de partilha** — identificador único da mesa (ex: `mesa-principal`)

O schema SQL necessário está em [supabase_schema.sql](./supabase_schema.sql).
Depois de aplicar o schema, a tela **Online** permite criar uma conta, criar uma
mesa ao salvar ou entrar em uma mesa existente pelo código de partilha.

## Compatibilidade de dados

A aplicação mantém as chaves de `localStorage` do site anterior e normaliza
automaticamente os formatos históricos. Isso inclui notas no nível raiz, sessão
em texto, tiles de mapa em string, criaturas sem atributos novos e fichas com
campos adicionados ao longo do projeto. A mesma normalização é aplicada a
arquivos JSON importados e estados carregados do Supabase.

O manual publicado pela aplicação está em `public/ebook`.
