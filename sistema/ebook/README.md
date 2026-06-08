# Ebook modularizado

Este diretorio agora tem uma versao modular do ebook.

## Onde editar

- `src/chapters/`: conteudo do livro dividido por partes e secoes principais.
- `src/layout/head.html`: metadados e links de CSS do HTML.
- `src/layout/header.html`: titulo e autor do ebook.
- `src/layout/toc.html`: sumario gerado.
- `css/pandoc.css`: estilos padrao extraidos do Pandoc.
- `css/ebook.css`: estilos editaveis do ebook.
- `modules.json`: ordem dos modulos usados na montagem.

## Como remontar

Depois de editar qualquer modulo, rode:

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

Isso recria `Sistema_Mecanico_RPG.html` a partir dos modulos.

## Backup

O HTML original monolitico foi preservado em:

```text
Sistema_Mecanico_RPG.monolitico.html
```
