param(
    [switch]$Copiar,
    [switch]$Caminho
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AgentePath = Join-Path $ScriptDir "sistema\agentes\agente_criador_aventura_pronta_sistema_mecanico.md"

if (-not (Test-Path $AgentePath)) {
    Write-Error "Agente nao encontrado em: $AgentePath"
    exit 1
}

if ($Caminho) {
    Write-Output $AgentePath
    exit 0
}

$Conteudo = Get-Content -Path $AgentePath -Raw -Encoding UTF8

if ($Copiar) {
    $Conteudo | Set-Clipboard
    Write-Output "Agente Criador de Aventura Pronta copiado para a area de transferencia."
    exit 0
}

Write-Output $Conteudo
