$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Modules = Get-Content (Join-Path $Root "modules.json") -Raw | ConvertFrom-Json
$Output = Join-Path $Root "Sistema_Mecanico_RPG.html"

$Parts = New-Object System.Collections.Generic.List[string]
$Parts.Add("<!DOCTYPE html>")
$Parts.Add('<html xmlns="http://www.w3.org/1999/xhtml">')
$Parts.Add("<head>")
$Parts.Add((Get-Content (Join-Path $Root "src/layout/head.html") -Raw -Encoding UTF8).TrimEnd())
$Parts.Add("</head>")
$Parts.Add("<body>")
$Parts.Add((Get-Content (Join-Path $Root "src/layout/header.html") -Raw -Encoding UTF8).TrimEnd())
$Parts.Add((Get-Content (Join-Path $Root "src/layout/toc.html") -Raw -Encoding UTF8).TrimEnd())
foreach ($Module in $Modules) {
  $Parts.Add((Get-Content (Join-Path $Root $Module.file) -Raw -Encoding UTF8).TrimEnd())
}
$Parts.Add("</body>")
$Parts.Add("</html>")

[System.IO.File]::WriteAllText($Output, ($Parts -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
Write-Host "HTML montado em $Output"
