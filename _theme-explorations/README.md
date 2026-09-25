# Theme explorations

Ten alternative styles for the site. Each one is a CSS override that loads **after** `styles.css`. Content, structure and `_quarto.yml` navigation stay as they are. All three have dark and light modes and work with the existing `◐` toggle.

| Theme | Idea | Fonts |
|---|---|---|
| `blueprint.css` | Engineering drawing. Dark mode is a cyanotype sheet; light mode is drafting vellum with blue ink. Drafting grid, corner registration marks, numbered `DWG-01` post sheets, and a footer laid out like a drawing title block. | IBM Plex Sans / Sans Condensed / Mono |
| `datasheet.css` | Swiss component datasheet. Flat and typographic, with heavy hairline rules and one signal colour (international orange). Posts are an indexed table; the headshot is greyscale until hover. | Geist / Geist Mono |
| `terminal.css` | A calm TUI. The navbar is a tmux status line, content sits in titled box-drawn panes, headings get markdown sigils, and posts are listed as `ls -lt` rows with a selection bar. Warm amber palette. | JetBrains Mono |
| `workspace.css` | The site as a code editor. The navbar is a tab strip (`home.qmd`, `about.qmd`…), paragraphs get a soft-wrapped line-number gutter, and prose takes syntax-highlight roles (links = strings, subtitles = `//` comments, tags = types). The category sidebar is the file explorer, the TOC is the outline, and the footer is a status bar. | Inter / JetBrains Mono |
| `commit.css` | Version control. The post list is `git log --graph`: a rail with commit nodes, `HEAD~n` refs, `HEAD → main` on the latest post, and tags shown as `(tag: …)` decorations. The intro is a diff of README.md with green added lines, headings are `@@` hunk headers, and the footer is a `Signed-off-by:` trailer. | Source Sans 3 / Martian Mono |
| `kernel.css` | A Jupyter notebook. Pages sit on a white notebook sheet over a grey desk. Posts are cells with `In [n]:` / `Out[n]:` prompts (title as the input, excerpt as the output), the intro is a selected markdown cell, and the navbar shows a kernel indicator. Code cells in notebook posts get real prompts. | Fira Sans / Fira Code |
| `survey.css` *(wildcard)* | A topographic map, nodding to the geospatial / OSM / crime-in-space posts. Contour lines (`survey-contours.svg`) and a kilometre grid sit behind a map-inset content panel. The intro is a "YOU ARE HERE" marker, posts are numbered waypoints on a dashed footpath ("10 min walk"), and the category sidebar is a map legend with symbols. Headings are trig points, with scale bars in the post header and footer. Dark mode is a night-navigation chart. | Barlow / Barlow Condensed / Space Mono |

### Notebook variations (unbranded takes on `kernel.css`)

| Theme | Idea | Fonts |
|---|---|---|
| `margin.css` | The quietest version. A narrow margin holds cell indices (`00`, `01`…) and `§` section marks. Each post is a soft input block (title, subtitle, `#tags`) followed by a `↳` output. Hovering a cell lights a thin rail, and a small green "ready" dot sits by the name. | IBM Plex Sans / Mono |
| `folio.css` | A notebook typeset for print. Serif prose on warm paper, bracketed old-style cell numbers `[1]` in the margin, and numbered sections. Posts are ruled input boxes with the excerpt set as an "Abstract." caption. The category sidebar is a book index with dotted leaders, and the intro opens in small caps. Oxblood accent. | Newsreader / JetBrains Mono |
| `console.css` | A modern data-workspace feel. Every post is a card with a header strip (`✓ cell 01 · latest`, date and timing), the input on top and the output on a slightly different surface below. Faint dot-grid canvas, violet/lime accents; notebook code cells in posts also become cards. | Inter / Geist Mono |

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
