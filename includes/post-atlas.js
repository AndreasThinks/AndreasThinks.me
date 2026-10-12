// The homepage atlas (cell 01): every post as a point, grouped into topic "territories".
// Data comes from post-map.json, which scripts/post_map.py writes before each render.
// Moving the cursor over the map opens a lens that spreads nearby posts apart and shows their titles.
// Hovering a point lights its post in the feed below, and hovering a post lights its point.
(function () {
  const canvas = document.getElementById("post-atlas");
  if (!canvas || !window.d3) return;
  const plot = canvas.parentElement;
  const ring = plot.querySelector(".atlas-ring");
  const keys = document.querySelector(".atlas-keys");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const norm = (h) => { let s = (h || "").replace(/^https?:\/\/[^/]+\//, "").replace(/^(\.\/|\/)+/, "").replace(/index\.html$/, ""); try { s = decodeURIComponent(s); } catch (e) {} return s; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const LENS_R = 120, LENS_M = 2.4;

  let topics = [], posts = [], links = [], nbr = new Map(), sim = null;
  let W = 0, H = 0, dpr = 1, colors = {}, mouse = null, hover = null, ext = null, filter = -1;

  function readColors() {
    colors = { rail: css("--rail"), line: css("--border-strong"), text: css("--text-primary"), mono: css("--font-mono"),
      tint: [1, 2, 3, 4, 5].map((i) => css("--atlas-k" + i)) };
  }
  const tint = (t) => colors.tint[t % colors.tint.length];

  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
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
    sim.on("tick", draw);
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

  // territories are painted opaque off-screen, then laid down at low alpha so overlaps don't band
  const off = document.createElement("canvas");
  function drawTerritories() {
    if (off.width !== canvas.width || off.height !== canvas.height) { off.width = canvas.width; off.height = canvas.height; }
    const o = off.getContext("2d");
    o.setTransform(dpr, 0, 0, dpr, 0, 0); o.clearRect(0, 0, W, H); o.lineJoin = "round";
    const labels = [];
    topics.forEach((name, t) => {
      const mem = posts.filter((p) => p.topic === t); if (!mem.length) return;
      const h = hull(mem), dim = filter >= 0 && filter !== t;
      o.beginPath(); h.forEach((p, i) => (i ? o.lineTo(p.x, p.y) : o.moveTo(p.x, p.y))); o.closePath();
      o.globalAlpha = dim ? 0.3 : 1; o.fillStyle = o.strokeStyle = tint(t); o.lineWidth = 44; o.stroke(); o.fill();
      labels.push({ t, dim, x: mem.reduce((s, p) => s + p.x, 0) / mem.length, y: Math.min(...mem.map((p) => p.y)) - 26 });
    });
    ctx.globalAlpha = 0.11; ctx.drawImage(off, 0, 0, W, H);
    ctx.font = `500 ${W < 500 ? 9.5 : 10.5}px ${colors.mono}`; ctx.textAlign = "center";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.12em";
    for (const l of labels) {
      const text = topics[l.t].toUpperCase(), half = ctx.measureText(text).width / 2 + 6;
      ctx.globalAlpha = l.dim ? 0.3 : 1; ctx.fillStyle = tint(l.t);
      ctx.fillText(text, Math.max(half, Math.min(W - half, l.x)), Math.max(14, l.y));
    }
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const L = ext || hover, near = L ? nbr.get(L) : null;
    drawTerritories();
    ctx.lineWidth = 1;
    for (const l of links) {
      const on = L && (l.source === L || l.target === L);
      ctx.globalAlpha = on ? 0.9 : L ? 0.06 : 0.28;
      if (filter >= 0 && l.source.topic !== filter && l.target.topic !== filter) ctx.globalAlpha *= 0.3;
      ctx.strokeStyle = on ? colors.rail : colors.line;
      const A = toScreen(l.source), B = toScreen(l.target);
      ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
    }
    ctx.font = `11px ${colors.mono}`; ctx.textAlign = "left";
    for (const n of posts) {
      const S = toScreen(n), on = n === L, lit = on || (near && near.has(n));
      const dim = (filter >= 0 && n.topic !== filter) || (L && !lit);
      const r = (on ? 6 : 4.2) * (1 + S.lens * 0.6);
      ctx.globalAlpha = dim ? 0.2 : 1; ctx.fillStyle = lit ? colors.rail : tint(n.topic);
      ctx.beginPath(); ctx.arc(S.X, S.Y, r, 0, 7); ctx.fill();
      if (on) { ctx.strokeStyle = colors.rail; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(S.X, S.Y, r + 4, 0, 7); ctx.stroke(); }
      // titles appear inside the lens, or for a post lit from the feed
      const show = on ? 1 : S.lens > 0.15 ? Math.min(1, S.lens * 2.2) : 0;
      if (show) {
        ctx.globalAlpha = show * (dim ? 0.4 : 1); ctx.fillStyle = on ? colors.rail : colors.text;
        ctx.fillText(n.title.length > 34 ? n.title.slice(0, 33) + "…" : n.title, S.X + r + 5, S.Y + 4);
      }
    }
    ctx.globalAlpha = 1;
  }

  function pick(mx, my) {
    let best = null, bd = 12;
    for (const n of posts) { const S = toScreen(n), d = Math.hypot(S.X - mx, S.Y - my); if (d < bd) { bd = d; best = n; } }
    return best;
  }

  // feed <-> atlas
  const feed = () => [...document.querySelectorAll("#listing-blog-listings .quarto-post")];
  const feedHref = (el) => norm(el.querySelector(".listing-title a")?.getAttribute("href"));
  function markFeed() { feed().forEach((el) => el.classList.toggle("atlas-lit", !!hover && feedHref(el) === hover.key)); }
  function filterFeed() { feed().forEach((el) => { el.hidden = filter >= 0 && +el.dataset.topic !== filter; }); }

  function wire() {
    const byKey = new Map(posts.map((p) => [p.key, p]));
    feed().forEach((el) => {
      const p = byKey.get(feedHref(el)); if (!p) return;
      el.dataset.topic = p.topic;
      el.addEventListener("mouseenter", () => { ext = p; draw(); });
      el.addEventListener("mouseleave", () => { ext = null; draw(); });
    });
    canvas.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      if (ring) { ring.style.left = mx + "px"; ring.style.top = my + "px"; }
      mouse = { x: mx, y: my };
      const h = pick(mx, my);
      if (h !== hover) { hover = h; markFeed(); }
      canvas.style.cursor = h ? "pointer" : "none";
      draw();
    });
    canvas.addEventListener("pointerleave", () => { mouse = null; hover = null; markFeed(); draw(); });
    // mouse: click opens the post under the lens; touch: first tap names a post, second tap opens it
    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect(), n = pick(e.clientX - r.left, e.clientY - r.top);
      if (!n) { hover = null; markFeed(); draw(); return; }
      if (mouse || n === hover) location.href = new URL(n.href, document.baseURI).href;
      else { hover = n; markFeed(); draw(); }
    });
    keys?.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const t = +b.dataset.t; filter = filter === t ? -1 : t;
      keys.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.t === filter));
      filterFeed(); draw();
    });
  }

  function buildKeys() {
    if (!keys) return;
    keys.innerHTML = topics.map((name, t) => `<button type="button" aria-pressed="false" data-t="${t}"><i style="background:var(--atlas-k${(t % 5) + 1})"></i>${esc(name.toLowerCase())}<span>${posts.filter((p) => p.topic === t).length}</span></button>`).join("");
  }

  fetch(new URL("post-map.json", document.baseURI))
    .then((r) => r.json())
    .then((data) => {
      topics = data.topics;
      posts = data.posts.map((p) => ({ ...p, key: norm(p.href) }));
      links = data.edges.map(([a, b, w]) => ({ source: posts[a], target: posts[b], w }));
      posts.forEach((p) => nbr.set(p, new Set()));
      links.forEach((l) => { nbr.get(l.source).add(l.target); nbr.get(l.target).add(l.source); });
      const cap = document.querySelector(".atlas-count");
      if (cap) cap.innerHTML = `an atlas of <b>${posts.length}</b> posts in <b>${topics.length}</b> territories`;
      readColors(); size(); layout(); buildKeys(); wire(); draw();
      document.fonts?.ready.then(draw);
      new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); draw(); });
      let rt = 0;
      addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); sim.alpha(0.5).restart(); if (reduce) { for (let i = 0; i < 120; i++) sim.tick(); sim.stop(); draw(); } }, 120); });
    })
    .catch(() => { plot.closest(".atlas-cell")?.setAttribute("hidden", ""); });
})();
