// The homepage atlas (cell 01): every post on a map, grouped into topic "territories",
// drawn like a terminal screen. Data comes from post-map.json, which scripts/post_map.py
// writes before each render.
// Territories are fields of dots, posts are ◆ glyphs, and moving the cursor opens a lens
// that spreads nearby posts apart and shows their titles. The crosshair snaps to the post a
// click would open. A status line along the bottom names it, and the arrow keys (or h/l)
// step through posts once the map has focus, with Enter to open.
// Hovering a point lights its post in the feed beside it, and hovering a post lights its point.
// Hovering a project in the rail lights its post in both.
(function () {
  const canvas = document.getElementById("post-atlas");
  if (!canvas || !window.d3) return;
  const plot = canvas.parentElement;
  const ring = plot.querySelector(".atlas-ring");
  const status = plot.querySelector(".atlas-status");
  const keys = document.querySelector(".atlas-keys");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const norm = (h) => { let s = (h || "").replace(/^https?:\/\/[^/]+\//, "").replace(/^(\.\/|\/)+/, "").replace(/index\.html$/, ""); try { s = decodeURIComponent(s); } catch (e) {} return s; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  const LENS_R = 120, LENS_M = 2.4;
  const CW = 8, CH = 12; // character cell for the dot grid

  let topics = [], posts = [], links = [], nbr = new Map(), sim = null;
  let W = 0, H = 0, dpr = 1, colors = {}, mouse = null, hover = null, ext = null, filter = -1;
  let grid = null, born = 0, now = 0;

  function readColors() {
    colors = { rail: css("--rail"), panel: css("--bg-panel"), line: css("--border-strong"), text: css("--text-primary"),
      meta: css("--text-meta"), mono: css("--font-mono"), tint: [1, 2, 3, 4, 5].map((i) => css("--atlas-k" + i)) };
  }
  const tint = (t) => colors.tint[t % colors.tint.length];

  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    grid = null;
  }

  // topics sit on an ellipse; each post is pulled towards its topic's anchor
  const anchor = (t) => {
    const a = (t / topics.length) * Math.PI * 2 - Math.PI / 2;
    return { x: W / 2 + Math.cos(a) * W * 0.3, y: H / 2 + Math.sin(a) * H * 0.26 };
  };

  function layout() {
    const F = window.d3;
    sim = F.forceSimulation(posts)
      .force("link", F.forceLink(links).distance((l) => 60 - l.w * 20).strength((l) => 0.05 + l.w * 0.1))
      .force("charge", F.forceManyBody().strength(-90 * Math.min(1, Math.sqrt((W * H) / (700 * 330)))))
      .force("collide", F.forceCollide(W < 400 ? 6 : 9))
      .force("x", F.forceX((d) => anchor(d.topic).x).strength(0.16))
      .force("y", F.forceY((d) => anchor(d.topic).y).strength(0.2))
      .force("bounds", () => { for (const n of posts) { n.x = Math.max(22, Math.min(W - 22, n.x)); n.y = Math.max(40, Math.min(H - 22, n.y)); } })
      .stop();
    // start near the anchors and settle before the first frame, so the map is ready at once
    posts.forEach((n, i) => { const a = anchor(n.topic); n.x = a.x + Math.cos(i * 2.4) * 30; n.y = a.y + Math.sin(i * 2.4) * 30; });
    for (let i = 0; i < 200; i++) sim.tick();
    sim.on("tick", () => { grid = null; draw(); });
  }

  function toScreen(n) {
    let X = n.x, Y = n.y, lens = 0;
    if (mouse) {
      const dx = X - mouse.x, dy = Y - mouse.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < LENS_R) {
        const k = ((LENS_M + 1) * (d / LENS_R)) / (LENS_M * (d / LENS_R) + 1);
        X = mouse.x + (dx / d) * k * LENS_R; Y = mouse.y + (dy / d) * k * LENS_R; lens = 1 - d / LENS_R;
      }
    }
    return { X, Y, lens };
  }

  function hull(pts) {
    pts = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    if (pts.length < 3) return pts;
    const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x), lo = [], up = [];
    for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }

  // territories are painted off-screen with each topic's id as its colour, then sampled once
  // per character cell, so each cell knows which territory (if any) it belongs to
  function buildGrid() {
    const g = document.createElement("canvas"); g.width = W; g.height = H;
    const o = g.getContext("2d", { willReadFrequently: true }); o.lineJoin = "round";
    topics.forEach((name, t) => {
      const h = hull(posts.filter((p) => p.topic === t)); if (!h.length) return;
      o.beginPath(); h.forEach((p, i) => (i ? o.lineTo(p.x, p.y) : o.moveTo(p.x, p.y))); o.closePath();
      o.fillStyle = o.strokeStyle = `rgb(${t + 1},0,0)`; o.lineWidth = 40; o.stroke(); o.fill();
    });
    const px = o.getImageData(0, 0, W, H).data, cells = [];
    for (let y = CH / 2; y < H; y += CH) for (let x = CW / 2; x < W; x += CW) {
      const i = ((y | 0) * W + (x | 0)) * 4, t = px[i + 3] > 200 ? px[i] - 1 : -1;
      cells.push({ x, y, t, r: Math.random() });
    }
    grid = cells;
  }

  function drawGrid() {
    if (!grid) buildGrid();
    const age = reduce ? Infinity : now - born; // the dots appear in a quick dissolve, like a screen being drawn
    ctx.font = `11px ${colors.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const c of grid) {
      if (c.r * 900 > age) continue;
      if (c.t < 0) { if (c.r < 0.04) { ctx.globalAlpha = 0.25; ctx.fillStyle = colors.meta; ctx.fillText(".", c.x, c.y); } continue; }
      const near = mouse && Math.abs(c.x - mouse.x) < CW * 7 && Math.abs(c.y - mouse.y) < CH * 4;
      ctx.globalAlpha = filter >= 0 && filter !== c.t ? 0.12 : near ? 0.75 : 0.32; ctx.fillStyle = tint(c.t);
      ctx.fillText(c.r < 0.08 ? ":" : "·", c.x, c.y);
    }
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 ${W < 500 ? 9.5 : 10.5}px ${colors.mono}`;
    topics.forEach((name, t) => {
      const mem = posts.filter((p) => p.topic === t); if (!mem.length) return;
      const text = "┤ " + name.toLowerCase() + " ├", half = ctx.measureText(text).width / 2 + 6;
      const x = mem.reduce((s, p) => s + p.x, 0) / mem.length, y = Math.min(...mem.map((p) => p.y)) - 24;
      ctx.globalAlpha = filter >= 0 && filter !== t ? 0.3 : 1; ctx.fillStyle = tint(t);
      ctx.fillText(text, Math.max(half, Math.min(W - half, x)), Math.max(14, y));
    });
  }

  function draw() {
    now = performance.now();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const L = ext || hover, near = L ? nbr.get(L) : null;
    drawGrid();
    ctx.lineWidth = 1; ctx.setLineDash([1, 4]);
    for (const l of links) {
      const on = L && (l.source === L || l.target === L);
      ctx.globalAlpha = on ? 0.9 : L ? 0.06 : 0.4;
      if (filter >= 0 && l.source.topic !== filter && l.target.topic !== filter) ctx.globalAlpha *= 0.3;
      ctx.strokeStyle = on ? colors.rail : colors.line;
      const A = toScreen(l.source), B = toScreen(l.target);
      ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.textBaseline = "middle";
    for (const n of posts) {
      const S = toScreen(n), on = n === L, lit = on || (near && near.has(n));
      const dim = (filter >= 0 && n.topic !== filter) || (L && !lit);
      ctx.globalAlpha = dim ? 0.2 : 1; ctx.fillStyle = lit ? colors.rail : tint(n.topic);
      ctx.font = `${on ? 15 : 12 + S.lens * 4}px ${colors.mono}`; ctx.textAlign = "center";
      ctx.fillText(on ? "◉" : "◆", S.X, S.Y);
      // titles appear inside the lens
      const show = on ? 0 : S.lens > 0.15 ? Math.min(1, S.lens * 2.2) : 0;
      if (show) {
        ctx.font = `11px ${colors.mono}`; ctx.textAlign = "left";
        ctx.globalAlpha = show * (dim ? 0.3 : L ? 0.6 : 1); ctx.fillStyle = colors.text;
        ctx.fillText(clip("─ " + n.title, 34), S.X + 10 + S.lens * 3, S.Y);
      }
    }
    ctx.textBaseline = "alphabetic";
    if (L) drawTag(L);
    if (mouse) drawCursor(L && L === hover ? toScreen(L) : null);
    ctx.globalAlpha = 1;
  }

  // the selected post's title sits on a solid tag, above the other lens labels, with a blinking block cursor
  function drawTag(n) {
    const S = toScreen(n), t = ":open " + clip(n.title, 48);
    ctx.font = `500 12px ${colors.mono}`; ctx.textAlign = "left"; ctx.globalAlpha = 1;
    const tw = ctx.measureText(t).width, w = tw + 23, x = Math.max(6, Math.min(W - w - 6, S.X + 16)), y = S.Y - 10;
    ctx.fillStyle = colors.panel; ctx.strokeStyle = colors.rail; ctx.lineWidth = 1;
    ctx.fillRect(x, y, w, 20); ctx.strokeRect(x + 0.5, y + 0.5, w - 1, 19);
    ctx.fillStyle = colors.text; ctx.fillText(t, x + 7, y + 14);
    if (reduce || Math.floor(now / 530) % 2 === 0) ctx.fillRect(x + 9 + tw, y + 4, 7, 12);
  }

  // the cursor: a crosshair at the pointer; bracket corners close on the post a click would open
  function drawCursor(T) {
    const { x, y } = mouse;
    ctx.globalAlpha = 1; ctx.strokeStyle = ctx.fillStyle = colors.rail; ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (T) {
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.moveTo(T.X + sx * 7, T.Y + sy * 3); ctx.lineTo(T.X + sx * 7, T.Y + sy * 7); ctx.lineTo(T.X + sx * 3, T.Y + sy * 7); }
    } else {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.moveTo(x + dx * 4, y + dy * 4); ctx.lineTo(x + dx * 10, y + dy * 10); }
    }
    ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, 7); ctx.fill();
    if (T) {
      const d = Math.hypot(T.X - x, T.Y - y);
      if (d > 12) {
        ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x + ((T.X - x) / d) * 6, y + ((T.Y - y) / d) * 6); ctx.lineTo(T.X, T.Y); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  // the canvas keeps redrawing only while something moves: the opening dissolve, or a blinking tag
  let looping = false;
  function frame() {
    draw();
    if (!reduce && (now - born < 950 || ext || hover)) requestAnimationFrame(frame);
    else looping = false;
  }
  function kick() { if (!looping) { looping = true; requestAnimationFrame(frame); } }

  function pick(mx, my) {
    let best = null, bd = 22;
    for (const n of posts) {
      if (filter >= 0 && n.topic !== filter) continue;
      const S = toScreen(n), d = Math.hypot(S.X - mx, S.Y - my); if (d < bd) { bd = d; best = n; }
    }
    return best;
  }

  // ←/→ step through posts territory by territory, left to right
  const order = () => posts.filter((p) => filter < 0 || p.topic === filter).sort((a, b) => a.topic - b.topic || a.x - b.x);

  function setStatus() {
    if (!status) return;
    const L = ext || hover, list = order(), i = L ? list.indexOf(L) + 1 : 0;
    const where = L ? topics[L.topic] : filter >= 0 ? topics[filter] : "atlas";
    status.innerHTML = `<b>${L ? "VISUAL" : "NORMAL"}</b><span>${esc(where.toLowerCase())}</span>` +
      `<span class="s-title">${L ? `"${esc(clip(L.title, 40))}"` : filter >= 0 ? `${list.length} posts` : `${posts.length} posts · ${topics.length} territories`}</span>` +
      `<span class="s-keys">${L ? "⏎ open " : ""}←→ browse</span><span class="s-pos">${i || "-"}/${list.length}</span>`;
  }

  // feed <-> atlas
  const feed = () => [...document.querySelectorAll("#listing-blog-listings .quarto-post")];
  const feedHref = (el) => norm(el.querySelector(".listing-title a")?.getAttribute("href"));
  function markFeed() { const L = ext || hover; feed().forEach((el) => el.classList.toggle("atlas-lit", !!L && feedHref(el) === L.key)); }
  function filterFeed() { feed().forEach((el) => { el.hidden = filter >= 0 && +el.dataset.topic !== filter; }); }
  const open = (n) => { location.href = new URL(n.href, document.baseURI).href; };

  function wire() {
    const byKey = new Map(posts.map((p) => [p.key, p]));
    feed().forEach((el) => {
      const p = byKey.get(feedHref(el)); if (!p) return;
      el.dataset.topic = p.topic;
      el.addEventListener("mouseenter", () => { ext = p; setStatus(); kick(); });
      el.addEventListener("mouseleave", () => { ext = null; setStatus(); draw(); });
    });
    document.querySelectorAll(".proj-list [data-post]").forEach((el) => {
      const p = byKey.get(norm(el.dataset.post)); if (!p) return;
      el.addEventListener("mouseenter", () => { ext = p; markFeed(); setStatus(); kick(); });
      el.addEventListener("mouseleave", () => { ext = null; markFeed(); setStatus(); draw(); });
    });
    canvas.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      if (ring) { ring.style.left = mx + "px"; ring.style.top = my + "px"; }
      mouse = { x: mx, y: my };
      ext = null;
      const h = pick(mx, my);
      if (h !== hover) { hover = h; markFeed(); setStatus(); }
      canvas.style.cursor = "none";
      draw(); if (hover) kick();
    });
    canvas.addEventListener("pointerleave", () => { mouse = null; hover = null; markFeed(); setStatus(); draw(); });
    // mouse: click opens the post under the crosshair; touch: first tap names a post, second tap opens it
    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect(), n = pick(e.clientX - r.left, e.clientY - r.top);
      if (!n) { hover = null; markFeed(); setStatus(); draw(); return; }
      if (mouse || n === hover) open(n);
      else { hover = n; markFeed(); setStatus(); kick(); }
    });
    canvas.addEventListener("keydown", (e) => {
      const list = order(); if (!list.length) return;
      const i = list.indexOf(ext || hover);
      if (["ArrowRight", "ArrowDown", "l", "j"].includes(e.key)) ext = list[(i + 1) % list.length];
      else if (["ArrowLeft", "ArrowUp", "h", "k"].includes(e.key)) ext = list[(i - 1 + list.length) % list.length];
      else if (e.key === "Enter" && (ext || hover)) return open(ext || hover);
      else if (e.key === "Escape") ext = null;
      else return;
      e.preventDefault(); hover = null; markFeed(); setStatus(); draw(); kick();
    });
    canvas.addEventListener("blur", () => { if (ext && !mouse) { ext = null; markFeed(); setStatus(); draw(); } });
    keys?.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const t = +b.dataset.t; filter = filter === t ? -1 : t;
      keys.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.t === filter));
      if ((ext || hover) && filter >= 0 && (ext || hover).topic !== filter) { ext = hover = null; markFeed(); }
      filterFeed(); setStatus(); draw();
    });
    // the dots dissolve in the first time the map scrolls into view
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { born = performance.now(); kick(); io.disconnect(); } }).observe(plot);
  }

  function buildKeys() {
    if (!keys) return;
    keys.innerHTML = topics.map((name, t) => `<button type="button" aria-pressed="false" data-t="${t}"><i style="background:var(--atlas-k${(t % 5) + 1})"></i>${esc(name.toLowerCase())}<span>${posts.filter((p) => p.topic === t).length}</span></button>`).join("");
  }

  // the caption types itself out as a shell command
  function caption() {
    const cap = document.querySelector(".atlas-count"); if (!cap) return;
    const cmd = `$ atlas --tty  ${posts.length} posts · ${topics.length} territories`;
    const done = () => { cap.innerHTML = `<span class="t-cmd">${esc(cmd)}</span><span class="t-cur" aria-hidden="true"></span>`; };
    if (reduce) return done();
    let i = 0;
    const step = () => { i += 2; cap.textContent = cmd.slice(0, i); if (i < cmd.length) setTimeout(step, 28); else done(); };
    step();
  }

  fetch(new URL("post-map.json", document.baseURI))
    .then((r) => r.json())
    .then((data) => {
      topics = data.topics;
      posts = data.posts.map((p) => ({ ...p, key: norm(p.href) }));
      links = data.edges.map(([a, b, w]) => ({ source: posts[a], target: posts[b], w }));
      posts.forEach((p) => nbr.set(p, new Set()));
      links.forEach((l) => { nbr.get(l.source).add(l.target); nbr.get(l.target).add(l.source); });
      born = performance.now();
      caption(); readColors(); size(); layout(); buildKeys(); wire(); setStatus(); draw();
      document.fonts?.ready.then(draw);
      new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); draw(); });
      let rt = 0;
      addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); sim.alpha(0.5).restart(); if (reduce) { for (let i = 0; i < 120; i++) sim.tick(); sim.stop(); grid = null; draw(); } }, 120); });
    })
    .catch(() => { plot.closest(".atlas-cell")?.setAttribute("hidden", ""); });
})();
