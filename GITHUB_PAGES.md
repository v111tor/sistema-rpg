# Publicar no GitHub Pages

## Como "colocar o Codex" no seu GitHub

Eu não entro como uma pessoa/conta própria no seu GitHub. Para eu conseguir publicar por esta máquina, você precisa deixar uma destas opções pronta:

1. **GitHub CLI autenticado nesta máquina**, recomendado.
2. **Git instalado e repositório remoto já configurado**.
3. Você publica manualmente usando os comandos abaixo.

Com GitHub CLI:

```powershell
gh auth login
```

Escolha:

```text
GitHub.com
HTTPS
Login with a web browser
```

Depois de autenticar, eu consigo rodar os comandos `gh` e `git` por aqui.

## Estrutura pronta

Este projeto já tem:

- `index.html` na raiz, redirecionando para `sistema/site/rpg_melhorado.html`.
- `.nojekyll`, para o GitHub Pages publicar arquivos estáticos sem processamento.
- `sistema/site/rpg_melhorado.html`, o site principal.
- `assets/`, ícones e assets.
- `sistema/ebook/`, arquivos do ebook.
- `sistema/mecanicas/`, Markdown fonte do sistema.

## Publicar manualmente

Crie um repositório vazio no GitHub, por exemplo:

```text
mesa-rpg
```

Depois rode na pasta do projeto:

```powershell
git init
git add .
git commit -m "Publica C.R.M. RPG"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mesa-rpg.git
git push -u origin main
```

No GitHub:

1. Abra o repositório.
2. Vá em **Settings**.
3. Abra **Pages**.
4. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salve.

O site ficará em:

```text
https://SEU_USUARIO.github.io/mesa-rpg/
```

## Publicar com GitHub CLI

Depois de autenticar com `gh auth login`, rode:

```powershell
gh repo create mesa-rpg --public --source . --remote origin --push
```

Depois ative o Pages:

```powershell
gh api repos/SEU_USUARIO/mesa-rpg/pages `
  -X POST `
  -f source.branch=main `
  -f source.path=/
```

Se o Pages já existir:

```powershell
gh api repos/SEU_USUARIO/mesa-rpg/pages `
  -X PUT `
  -f source.branch=main `
  -f source.path=/
```
