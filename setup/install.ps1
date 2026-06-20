# install.ps1 — Instala dependências e sobe o C.R.M. em modo desenvolvimento (Windows)
# Execute no PowerShell: .\setup\install.ps1

$ErrorActionPreference = "Stop"

$Root = Resolve-Path "$PSScriptRoot\.."

Write-Host "==> Verificando Node.js..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERRO: Node.js não encontrado." -ForegroundColor Red
    Write-Host "Instale via: https://nodejs.org  ou  winget install OpenJS.NodeJS.LTS"
    exit 1
}

$NodeVersion = [int](node -e "process.stdout.write(String(process.version.match(/\d+/)[0]))")
if ($NodeVersion -lt 18) {
    $v = node -v
    Write-Host "ERRO: Node.js 18+ é necessário (encontrado: $v)." -ForegroundColor Red
    exit 1
}

$v = node -v
Write-Host "Node.js $v ✓" -ForegroundColor Green
Write-Host ""

Write-Host "==> Instalando dependências..." -ForegroundColor Cyan
Set-Location $Root
npm install

Write-Host ""
Write-Host "==> Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Para subir o servidor de desenvolvimento:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Para build de produção:"
Write-Host "  npm run build"
Write-Host "  npm run preview"
Write-Host ""

$resp = Read-Host "Deseja iniciar o servidor agora? [s/N]"
if ($resp -match '^[sS]$') {
    npm run dev
}
