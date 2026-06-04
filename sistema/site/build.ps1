$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Output = Join-Path $Root "rpg_melhorado.html"
$Tabs = Get-Content -Encoding UTF8 (Join-Path $Root "modules.txt") | Where-Object { $_.Trim() -ne "" }
$Scripts = Get-Content -Encoding UTF8 (Join-Path $Root "scripts.txt") | Where-Object { $_.Trim() -ne "" }

$Parts = New-Object System.Collections.Generic.List[string]
$Parts.Add("<!DOCTYPE html>")
$Parts.Add('<html lang="pt-BR">')
$Parts.Add("<head>")
$Parts.Add((Get-Content -Encoding UTF8 (Join-Path $Root "src/layout/head.html") -Raw).TrimEnd())
$Parts.Add("</head>")
$Parts.Add("<body>")
$Parts.Add((Get-Content -Encoding UTF8 (Join-Path $Root "src/layout/body-start.html") -Raw).TrimEnd())
foreach ($Tab in $Tabs) {
  $Parts.Add((Get-Content -Encoding UTF8 (Join-Path $Root $Tab) -Raw).TrimEnd())
}
$Parts.Add((Get-Content -Encoding UTF8 (Join-Path $Root "src/layout/body-end.html") -Raw).TrimEnd())
$Parts.Add('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>')
foreach ($Script in $Scripts) {
  $Parts.Add('<script src="' + $Script + '"></script>')
}
$Parts.Add("</body>")
$Parts.Add("</html>")

[System.IO.File]::WriteAllText($Output, ($Parts -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
Write-Host "Site montado em $Output"
