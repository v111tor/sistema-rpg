$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path "assets/downloads" | Out-Null

Write-Host "Baixe pacotes livres/CC0 nestas fontes e coloque em assets/downloads:"
Write-Host "- Kenney: https://kenney.nl/assets"
Write-Host "- OpenGameArt: https://opengameart.org/"
Write-Host "- Itch.io free assets: https://itch.io/game-assets/free"
Write-Host ""
Write-Host "Depois, extraia e organize em assets/icons, assets/maps, assets/tokens e assets/textures."
Write-Host "Evitei download automatico porque os links diretos mudam e cada pacote pode ter uma licenca diferente."
