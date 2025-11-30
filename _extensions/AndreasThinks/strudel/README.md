# Strudel Live Coding (Quarto extension)

A Quarto filter that embeds the full [Strudel](https://strudel.cc/) REPL directly into your pages—with CodeMirror editor, pattern visualisation, and interactive controls. Users can edit patterns live and hear changes in real-time.

## Features

- **Editable code** — Full CodeMirror editor with syntax highlighting
- **Visualisation** — See patterns rendered in real-time
- **Interactive controls** — Play, stop, and all the Strudel REPL features
- **Version pinning** — Locked to a specific Strudel version (1.2.6) so patterns won't break when Strudel updates
- **No iframe** — Loads directly in the page using the `<strudel-editor>` web component

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

   ````markdown
   ```strudel
   note("c3 eb3 g3 bb3")
     .s("sawtooth")
     .cutoff(sine.range(200, 2000).slow(4))
     .room(0.5)
   ```
   ````

3. Render the page. Each `strudel` block will be transformed into an interactive REPL where readers can edit the code and play it.

## How it works

The extension uses [`@strudel/repl`](https://www.npmjs.com/package/@strudel/repl) which provides the `<strudel-editor>` web component. When the page loads:

1. The JavaScript detects any `strudel` code blocks
2. Loads the Strudel REPL from unpkg CDN
3. Transforms each code block into a `<strudel-editor>` element with the pattern code

## Notes

- The filter only loads the Strudel REPL script once per page and skips blocks that are already wrapped.
- Audio initialisation requires a user gesture per browser autoplay policies; clicking play starts the Strudel audio context.
- Styling is provided by `strudel.css`; the REPL component has its own styling but you can adjust the wrapper CSS.

## License

This extension uses Strudel which is licensed under [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). When distributing modified versions, you must keep track of changes and license derivative work under the same license.
