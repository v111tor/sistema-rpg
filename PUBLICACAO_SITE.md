# Publicar o site e sincronizar fichas

Este projeto agora funciona de dois modos:

- **Offline:** salva no navegador com `localStorage`.
- **Online:** salva a mesa no Supabase e sincroniza entre dispositivos usando o mesmo ID de mesa.

## 1. Criar o banco no Supabase

1. Entre em https://supabase.com.
2. Crie um projeto.
3. Vá em **SQL Editor**.
4. Cole e rode o conteúdo de `supabase_schema.sql`.
5. Vá em **Project Settings > API**.
6. Copie:
   - `Project URL`
   - `anon public key`

## 2. Configurar o site

O site já vem com a URL pública do projeto Supabase preenchida:

```text
https://bnznywlkhxdyieeozmcd.supabase.co
```

Ele também já contém a publishable/anon key informada para uso no frontend.

1. Abra `rpg_melhorado.html`.
2. Clique em **Online**.
3. Confirme ou altere o `ID da mesa`, por exemplo `campanha-da-fissura`.
4. Informe email e senha.
5. Clique em **Entrar / criar conta**.
6. Clique em **Sincronizar** para forçar o envio dos dados.

Os jogadores entram com suas próprias contas e usam o mesmo ID da mesa.

### Se o login falhar na primeira vez

Seu Supabase está com confirmação de email ativa. Na primeira criação de conta:

1. Clique em **Entrar / criar conta**.
2. Abra o email recebido pelo Supabase.
3. Confirme a conta.
4. Volte ao site.
5. Clique em **Online** novamente.
6. Digite o mesmo email e senha.
7. Clique em **Entrar / criar conta**.

Para desativar essa etapa durante testes:

1. Abra o Supabase.
2. Vá em **Authentication > Providers > Email**.
3. Desative a confirmação obrigatória de email, se quiser login imediato.

## 3. Publicar pelo GitHub Pages

Se o Git estiver instalado:

```powershell
git init
git add .
git commit -m "Publica site RPG"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

Depois, no GitHub:

1. Abra o repositório.
2. Vá em **Settings > Pages**.
3. Em **Build and deployment**, escolha:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. O site ficará em:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/rpg_melhorado.html
```

## 4. Publicar pela Vercel

1. Entre em https://vercel.com.
2. Clique em **Add New > Project**.
3. Importe o repositório do GitHub.
4. Use as configurações padrão.
5. Abra a URL gerada pela Vercel.

Para site estático, não precisa configurar build command.

## 5. Publicar pela Netlify

1. Entre em https://netlify.com.
2. Clique em **Add new site > Import an existing project**.
3. Escolha GitHub.
4. Selecione o repositório.
5. Publique sem build command.

## Observações importantes

- A `anon public key` do Supabase é pública por design.
- Não coloque service role key no site.
- O arquivo `supabase_schema.sql` ativa RLS e usa login do Supabase.
- Se quiser permissões mais rígidas, crie convites por jogador em vez de liberar entrada por ID da mesa.
- O site atual sincroniza o estado completo da mesa. Para escala maior, o próximo passo é separar em tabelas: `characters`, `maps`, `creatures`, `spells` e `campaigns`.
