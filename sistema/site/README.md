# Site modularizado

Este diretorio agora tem o site separado em arquivos menores para facilitar edicao.

## Onde editar

- `src/layout/head.html`: metadados, titulo, favicon e CSS carregado.
- `src/layout/body-start.html`: inicio da pagina, menu lateral e barra superior.
- `src/tabs/`: telas principais do app, uma aba por arquivo.
- `src/layout/body-end.html`: fechamento do app e modal global.
- `css/styles.css`: aparencia do site.
- `js/`: comportamento do app separado por area.
- `modules.txt`: ordem das abas no HTML final.
- `scripts.txt`: ordem dos scripts JS no HTML final.

## Como remontar

Depois de editar qualquer modulo, rode:

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

Isso recria `rpg_melhorado.html` a partir dos modulos.

## Backup

O arquivo original foi preservado em:

```text
rpg_melhorado.monolitico.html
```
