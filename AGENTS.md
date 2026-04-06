# andreasthinks-site — Agent Development Guide

Personal website for Andreas Varotsis. Built with Quarto, deployed via GitHub Actions on push to `main`.

**Live site:** https://andreasthinks.me  
**Repo:** https://github.com/AndreasThinks/AndreasThinks.me  
**Stack:** Quarto + Jupyter notebooks, Bootstrap (Darkly theme), custom CSS

---

## Project Structure

```
andreasthinks-site/
├── index.qmd              ← Homepage with blog listing (scans posts/ only)
├── about.qmd
├── recent_work.qmd        ← Talks, papers, articles — link formal work here
├── _quarto.yml            ← Site config, navbar, format defaults
├── styles.css             ← All custom CSS, theme variables, figure switching
├── includes/
│   └── theme-toggle.html  ← Dark/light mode JS (sets data-theme on <html>)
├── posts/                 ← Blog posts — appears in homepage listing
│   ├── _metadata.yml      ← freeze: true, title-block-banner: true
│   └── <slug>/
│       └── index.ipynb    ← Notebook posts (or .qmd for plain markdown)
├── papers/                ← Working papers and formal write-ups
│   ├── _metadata.yml      ← freeze: true, title-block-banner: true
│   └── <slug>/
│       ├── index.ipynb
│       └── figures/
└── slides/                ← Teaching slides
```

---

## Content Types

### Blog posts (`posts/`)
- Appear in the homepage listing (`index.qmd` scans `contents: posts`)
- `draft: true` in frontmatter renders the post but excludes it from listings and sitemaps (`draft-mode: unlinked` in `_quarto.yml`)
- Use `draft: true` while writing; flip to `false` to publish

### Papers (`papers/`)
- Never appear in the homepage listing (listing only scans `posts/`)
- No draft flag needed — safe from accidental publication
- Link from `recent_work.qmd` under the Papers section
- `freeze: true` is set in `papers/_metadata.yml` so GitHub Actions doesn't try to re-execute notebooks that reference local absolute paths

---

## Dark / Light Theme System

The site defaults to the user's system preference and has a manual toggle (`◐` in the navbar). The theme toggle JS sets `data-theme="dark"` or `data-theme="light"` on the `<html>` element, and `styles.css` has CSS variables for both.

**Key CSS variables** (defined in `styles.css` for `:root`, `[data-theme="dark"]`, `[data-theme="light"]`):
- Dark accent: `#7bfcca` / Light accent: `#1f8f70`
- Dark bg: `#05060d` / Light bg: `#f5f7fb`
- Text: `#f4f7ff` (dark) / `#0b1220` (light)

### Figures must work in both modes

**Markdown image references** (papers, static images): generate two PNGs and use CSS classes:

```markdown
:::{.dark-fig}
![Caption](figures/fig_dark.png)
:::
:::{.light-fig}
![Caption](figures/fig_light.png)
:::
```

CSS classes `.dark-fig` and `.light-fig` are already defined in `styles.css`.

**Dark matplotlib style:**
```python
plt.rcParams.update({
    'figure.facecolor': '#1a1a2e', 'axes.facecolor': '#16213e',
    'text.color': '#e0e0e0', 'axes.labelcolor': '#e0e0e0',
    'xtick.color': '#e0e0e0', 'ytick.color': '#e0e0e0',
})
# Accents: '#00d4ff' primary, '#00ff9f' secondary, '#ff6b6b' alert, '#666688' muted
```

**Light matplotlib style:**
```python
plt.rcParams.update({
    'figure.facecolor': 'white', 'axes.facecolor': '#f8f9fa',
    'text.color': '#1a1a2e', 'axes.labelcolor': '#1a1a2e',
    'xtick.color': '#333344', 'ytick.color': '#333344',
})
# Accents: '#1d6fa4' primary, '#2a9d5c' secondary, '#cc3333' alert, '#888899' muted
```

**Code cell output figures** (embedded matplotlib PNGs in notebooks): can't serve two variants. Tag the cell with `# | classes: dark-plot` and the CSS filter handles inversion in light mode. The `.dark-plot` CSS class is already defined in `styles.css`.

```python
# | echo: false
# | classes: dark-plot
# | fig-cap: "Your caption"
import matplotlib.pyplot as plt
# ... dark-style figure code ...
```

---

## Notebook Posts: Build Pattern

Build notebooks via a Python script to avoid JSON escaping nightmares. Never hand-write the JSON.

```python
import json
nb = {"nbformat": 4, "nbformat_minor": 5,
      "metadata": {"kernelspec": {"display_name": "AI Productivity (uv)",
                                   "language": "python", "name": "ai_productivity"},
                   "language_info": {"name": "python", "version": "3.11.0"}},
      "cells": []}

def raw(src): return {"cell_type": "raw",   "metadata": {}, "source": src, "id": "r%02d" % len(nb["cells"])}
def md(src):  return {"cell_type": "markdown","metadata": {}, "source": src, "id": "m%02d" % len(nb["cells"])}
def code(src):return {"cell_type": "code",   "metadata": {}, "source": src, "outputs": [], "execution_count": None, "id": "c%02d" % len(nb["cells"])}
```

**Execute before committing:**
```bash
/home/andreasclaw/.hermes/hermes-agent/venv/bin/jupyter nbconvert \
  --to notebook --execute --inplace \
  --ExecutePreprocessor.kernel_name=ai_productivity \
  --ExecutePreprocessor.timeout=180 \
  /home/andreasclaw/projects/andreasthinks-site/posts/<slug>/index.ipynb
```

Use absolute paths with nbconvert — relative paths silently fail with "matched no files".

---

## Known Pitfalls

**No `\n` inside string literals in code cells.**
The notebook build script writes Python source into JSON strings. A `\n` becomes a literal newline which Python parses as an unterminated string:
```python
# BAD  →  SyntaxError at execution time
ax.set_xticklabels(['Pre\n(2022)', 'Post\n(2024)'])
# GOOD
ax.set_xticklabels(['Pre (2022)', 'Post (2024)'])
```

**Raw cell metadata must be `{}`, not a nested dict.**
`{"format": {"html": {...}}}` fails nbformat validation. The YAML frontmatter goes in `source`, not in `metadata`.

**Save figures to the post directory, not `/tmp/`.**
`/tmp/` is not committed. Put figures in `posts/<slug>/figures/` or `papers/<slug>/figures/`.

**Papers with absolute data paths won't execute on CI.**
Set `freeze: true` in the cell or in `papers/_metadata.yml`. Pre-execute locally and commit the outputs. CI uses frozen outputs rather than re-running.

---

## Deployment

`git push` to `main` triggers GitHub Actions which runs `quarto render` and publishes to GitHub Pages. No manual steps needed.

Draft posts (draft: true) render and deploy — they're just excluded from listings and sitemaps. They're accessible at their URL and useful for sharing before full publication.

---

## Adding a New Paper

1. Create `papers/<slug>/` and copy figures in
2. Write `papers/<slug>/index.ipynb` with proper frontmatter
3. Add `freeze: true` + `title-block-banner: true` in `papers/_metadata.yml` (already there)
4. Execute locally, commit with outputs
5. Add entry to `recent_work.qmd` under Papers:
   ```markdown
   - [Title (Year)](../../papers/<slug>/index.html) — One-line description.
   ```
6. Push

*Last updated: April 2026*
