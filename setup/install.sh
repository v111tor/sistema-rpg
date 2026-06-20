#!/usr/bin/env bash
# install.sh — Instala dependências e sobe o C.R.M. em modo desenvolvimento (Linux/macOS)

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Verificando Node.js..."
if ! command -v node &>/dev/null; then
  echo "ERRO: Node.js não encontrado."
  echo "Instale via: https://nodejs.org  ou  nvm install --lts"
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(String(process.version.match(/\d+/)[0]))")
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERRO: Node.js 18+ é necessário (encontrado: $(node -v))."
  exit 1
fi

echo "Node.js $(node -v) ✓"
echo ""

echo "==> Instalando dependências..."
cd "$ROOT"
npm install

echo ""
echo "==> Dependências instaladas com sucesso!"
echo ""
echo "Para subir o servidor de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para build de produção:"
echo "  npm run build"
echo "  npm run preview"
echo ""

read -rp "Deseja iniciar o servidor agora? [s/N] " resp
if [[ "$resp" =~ ^[sS]$ ]]; then
  npm run dev
fi
