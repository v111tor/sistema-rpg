# Assets do site

O site referencia `assets/crm-symbol.svg` como icone local.

Os icones de mapa ficam em `assets/map-icons/` e foram baixados do
Game-icons.net, com atribuicao registrada em `assets/map-icons/LICENSE.txt`.

Os tiles de terreno do mapa ficam em `assets/map-tiles/`, com licenca e
fontes registradas em `assets/map-tiles/LICENSE.txt`.

Para baixar novos assets externos, use somente pacotes livres ou com licenca
compativel. Boas fontes:

- Kenney Assets: https://kenney.nl/assets
- OpenGameArt: https://opengameart.org/
- Wikimedia Commons: https://commons.wikimedia.org/
- Itch.io free game assets: https://itch.io/game-assets/free

Sugestao de organizacao:

```text
assets/
  icons/
  maps/
  tokens/
  textures/
```

Depois de baixar, prefira nomes simples e sem espacos:

```text
assets/tokens/guerreiro.png
assets/textures/stone-floor.png
assets/maps/dungeon-01.webp
```

Para usar no HTML:

```html
<img src="assets/tokens/guerreiro.png" alt="Token de guerreiro">
```

Para usar como fundo em CSS:

```css
.map-stage {
  background-image: url("assets/textures/stone-floor.png");
}
```

Sempre guarde um arquivo `LICENSE.txt` junto do pacote baixado.
