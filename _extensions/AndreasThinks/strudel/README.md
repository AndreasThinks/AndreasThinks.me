# Strudel Live Coding (Quarto extension)

A lightweight Quarto filter that injects the Strudel browser bundle once per page and wraps `strudel` code blocks with Play/Stop controls for live coding demos.

## Installation

You can install the extension straight from this repository:

```bash
quarto add AndreasThinks/AndreasThinks.me
```

Quarto will place the extension in `_extensions/AndreasThinks/strudel`. If you prefer to vendor just the extension, copy the folder into your project at the same path.

## Usage

1. Enable the filter on a page or in `_quarto.yml`:

   ```yaml
   format:
     html:
       filters: [strudel]
   ```

   Or add `filters: [strudel]` in a page's YAML front matter.

2. Write Strudel snippets in fenced code blocks:

   ```
   ```strudel
   every(3, rev, note("c4 g4 e4 a4").fast(2))
     .sometimesBy(0.4, jux(rev))
     .slow(1.5)
   ```
   ```

3. Render the page. Each `strudel` block will receive Play/Stop controls, initialize Strudel on first play, and clean up when stopped.

## Notes

- The filter only loads the Strudel CDN script once per page and skips blocks that are already wrapped, so you can mix `pre.strudel` and `code.language-strudel` outputs safely.
- Audio initialization requires a user gesture per browser autoplay policies; the first Play click starts the Strudel audio context.
- Styling is provided by `strudel.css` to match the neon theme used on this site; adjust the CSS if you want different colors.
