# Theme explorations

Three alternative styles for the site. Each one is a CSS override that loads **after** `styles.css`. Content, structure and `_quarto.yml` navigation stay as they are. All three have dark and light modes and work with the existing `◐` toggle.

| Theme | Idea | Fonts |
|---|---|---|
| `blueprint.css` | Engineering drawing. Dark mode is a cyanotype sheet; light mode is drafting vellum with blue ink. Drafting grid, corner registration marks, numbered `DWG-01` post sheets, and a footer laid out like a drawing title block. | IBM Plex Sans / Sans Condensed / Mono |
| `datasheet.css` | Swiss component datasheet. Flat and typographic, with heavy hairline rules and one signal colour (international orange). Posts are an indexed table; the headshot is greyscale until hover. | Geist / Geist Mono |
| `terminal.css` | A calm TUI. The navbar is a tmux status line, content sits in titled box-drawn panes, headings get markdown sigils, and posts are listed as `ls -lt` rows with a selection bar. Warm amber palette. | JetBrains Mono |

Previews (desktop + mobile, dark + light) are in `previews/`.

## Try one

Add it after `styles.css` in `_quarto.yml`:

```yaml
format:
  html:
    css:
      - styles.css
      - themes/datasheet.css
```

Once one is chosen, it can be folded into `styles.css` properly.
