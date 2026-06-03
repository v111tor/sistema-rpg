# Assets do site

O site já referencia `assets/crm-symbol.svg` como ícone local.

Para baixar assets externos, use somente pacotes livres ou com licença compatível. Boas fontes:

- Kenney Assets: https://kenney.nl/assets
- OpenGameArt: https://opengameart.org/
- Wikimedia Commons: https://commons.wikimedia.org/
- Itch.io free game assets: https://itch.io/game-assets/free

Sugestão de organização:

```text
assets/
  icons/
  maps/
  tokens/
  textures/
```

Depois de baixar, prefira nomes simples e sem espaços:

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
