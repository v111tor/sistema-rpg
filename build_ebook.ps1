$ErrorActionPreference = "Stop"

$pandoc = Get-Command pandoc -ErrorAction SilentlyContinue
if (-not $pandoc) {
  $pandoc = Get-ChildItem -Recurse -Filter pandoc.exe -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $pandoc) {
  Write-Host "Pandoc nao encontrado. Instale em: https://pandoc.org/installing.html"
  exit 1
}
$pandocExe = $pandoc.Source
if (-not $pandocExe) { $pandocExe = $pandoc.FullName }
$xelatex = Get-Command xelatex -ErrorAction SilentlyContinue
if (-not $xelatex) {
  $xelatex = Get-ChildItem -Recurse -Filter xelatex.exe -Path "$env:LOCALAPPDATA\Programs\MiKTeX","C:\Program Files\MiKTeX","C:\Program Files (x86)\MiKTeX" -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $xelatex) {
  Write-Host "MiKTeX/xelatex nao encontrado. O script vai gerar EPUB e HTML, mas nao PDF."
}
$xelatexExe = $null
if ($xelatex) {
  $xelatexExe = $xelatex.Source
  if (-not $xelatexExe) { $xelatexExe = $xelatex.FullName }
}

$sources = @(
  "sistema/mecanicas/sistema_mecanico_formatado.md",
  "sistema/mecanicas/bestiario_sistema.md"
)

New-Item -ItemType Directory -Force -Path "sistema/ebook" | Out-Null

foreach ($source in $sources) {
  if (-not (Test-Path $source)) {
    Write-Host "Arquivo nao encontrado: $source"
    exit 1
  }
}

& $pandocExe $sources `
  --metadata-file metadata_ebook.yaml `
  --toc `
  --toc-depth=3 `
  --css ebook.css `
  -o sistema/ebook/Sistema_Mecanico_RPG.epub

& $pandocExe $sources `
  --metadata-file metadata_ebook.yaml `
  --toc `
  --toc-depth=3 `
  --standalone `
  --css ebook.css `
  -o sistema/ebook/Sistema_Mecanico_RPG.html

if ($xelatexExe) {
  & $pandocExe $sources `
    --metadata-file metadata_ebook.yaml `
    --toc `
    --toc-depth=3 `
    --pdf-engine="$xelatexExe" `
    -o sistema/ebook/Sistema_Mecanico_RPG.pdf
}

Write-Host "Arquivos gerados em sistema/ebook"
