// Fig. 1 on the homepage: every post as a point in a slowly turning 3D figure.
// Positions and topics come from post-map.json, which scripts/post_map.py builds before each render.
// Hovering a point marks its post in the feed below; hovering a post finds its point.
(function () {
  const canvas = document.getElementById("post-map");
  if (!canvas) return;
  const plate = canvas.parentElement;
  const tip = plate.querySelector(".nb-tip");
  const key = document.querySelector(".nb-key");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (n) => getComputedStyle(document.body).getPropertyValue(n).trim();
  const norm = (h) => { let s = (h || "").replace(/^https?:\/\/[^/]+\//, "").replace(/^(\.\/|\/)+/, "").replace(/index\.html$/, ""); try { s = decodeURIComponent(s); } catch (e) {} return s; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  let topics = [], posts = [], dust = [];
  let W = 0, H = 0, ay = 0.6, ax = -0.25, drag = null, hover = null, ext = null, mouse = null, filter = -1, t0 = null, colors = {};

  function readColors() {
    colors = { fg: css("--nb-fg"), meta: css("--nb-meta"), topic: [1, 2, 3, 4, 5, 6].map((i) => css("--nb-k" + i)) };
  }
  const topicColor = (i) => colors.topic[i % colors.topic.length];

  function size() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function project(x, y, z) {
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    let X = x * cy - z * sy, Z = x * sy + z * cy;
    const Y = y * cx - Z * sx; Z = y * sx + Z * cx;
    const s = Math.min(W, H) * 0.36, f = 2.6 / (2.6 + Z);
    return { X: W / 2 + X * s * f, Y: H / 2 + Y * s * f, Z, f };
  }

  // faint points around each topic, for texture; seeded so the figure looks the same every visit
  function makeDust() {
    let seed = 11;
    const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const g = () => (r() + r() + r() - 1.5) / 1.5;
    dust = [];
    topics.forEach((t, i) => {
      const c = t.center;
      for (let k = 0; k < 110; k++) dust.push({ x: c[0] + g() * 0.3, y: c[1] + g() * 0.3, z: c[2] + g() * 0.3, topic: i });
    });
  }

  function draw() {
    const e = t0 === null ? 0 : reduce ? 1 : 1 - Math.pow(1 - Math.min(1, (performance.now() - t0) / 700), 3);
    ctx.clearRect(0, 0, W, H);
    const live = ext || hover;
    // axes
    const ends = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]].map((p) => project(...p));
    ctx.strokeStyle = colors.meta; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    ctx.beginPath();
    for (let i = 0; i < 6; i += 2) { ctx.moveTo(ends[i].X, ends[i].Y); ctx.lineTo(ends[i + 1].X, ends[i + 1].Y); }
    ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;

    const pts = dust.map((p) => ({ p, ...project(p.x * e, p.y * e, p.z * e) }))
      .concat(posts.map((p) => ({ p, post: true, ...project(p.xyz[0] * e, p.xyz[1] * e, p.xyz[2] * e) })))
      .sort((a, b) => b.Z - a.Z);

    if (live) { // lines to posts that share a tag
      const from = pts.find((q) => q.p === live);
      pts.forEach((q) => {
        if (!q.post || q.p === live || !q.p.tags.some((t) => live.tags.includes(t))) return;
        ctx.strokeStyle = topicColor(live.topic); ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(from.X, from.Y); ctx.lineTo(q.X, q.Y); ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    let near = null, nearD = 18;
    for (const q of pts) {
      const dim = filter >= 0 && q.p.topic !== filter;
      if (!q.post) { ctx.globalAlpha = (dim ? 0.08 : 0.45) * q.f; ctx.fillStyle = colors.meta; ctx.fillRect(q.X - 0.6, q.Y - 0.6, 1.3, 1.3); continue; }
      const on = q.p === live, r = (on ? 6 : 4) * q.f;
      ctx.globalAlpha = dim ? 0.2 : 1; ctx.strokeStyle = topicColor(q.p.topic); ctx.lineWidth = on ? 2 : 1.4;
      ctx.beginPath(); ctx.arc(q.X, q.Y, r, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(q.X - r / 2, q.Y); ctx.lineTo(q.X + r / 2, q.Y); ctx.moveTo(q.X, q.Y - r / 2); ctx.lineTo(q.X, q.Y + r / 2); ctx.stroke();
      if (mouse) { const d = Math.hypot(q.X - mouse.x, q.Y - mouse.y); if (d < nearD) { nearD = d; near = q; } }
    }
    ctx.globalAlpha = 1;

    if (e > 0.6) { // topic labels
      ctx.font = "italic 15px 'Newsreader', Georgia, serif"; ctx.textAlign = "center";
      topics.forEach((t, i) => {
        const q = project(t.center[0], t.center[1] - 0.34, t.center[2]);
        ctx.fillStyle = topicColor(i); ctx.globalAlpha = (filter >= 0 && filter !== i ? 0.3 : 1) * (e - 0.6) / 0.4;
        ctx.fillText(t.name, q.X, q.Y);
      });
      ctx.globalAlpha = 1;
    }

    if (mouse && !drag) {
      const h = near ? near.p : null;
      if (h !== hover) { hover = h; markFeed(hover); }
      canvas.style.cursor = near ? "pointer" : "grab";
    }
    if (live) {
      const q = pts.find((x) => x.p === live);
      tip.hidden = false;
      tip.style.left = Math.max(4, Math.min(q.X, W - 260)) + "px"; tip.style.top = q.Y + "px";
      tip.innerHTML = `${esc(live.title)}<small>${esc(topics[live.topic].name)}</small>`;
    } else tip.hidden = true;
  }

  function loop() { if (!drag && !reduce) ay += 0.0012; draw(); requestAnimationFrame(loop); }

  // feed <-> figure
  const feedItems = () => [...document.querySelectorAll(".nb-post")];
  function markFeed(p) { feedItems().forEach((a) => a.classList.toggle("is-hovered", !!p && norm(a.getAttribute("href")) === norm(p.href))); }
  function wireFeed() {
    const byHref = new Map(posts.map((p) => [norm(p.href), p]));
    feedItems().forEach((a) => {
      const p = byHref.get(norm(a.getAttribute("href")));
      if (!p) return;
      const dot = a.querySelector(".nb-topic");
      if (dot) dot.style.background = `var(--nb-k${(p.topic % 6) + 1})`;
      a.addEventListener("mouseenter", () => { ext = p; });
      a.addEventListener("mouseleave", () => { ext = null; });
    });
  }

  function buildKey() {
    if (!key) return;
    key.innerHTML = topics.map((t, i) => `<button type="button" aria-pressed="false" data-i="${i}"><i style="background:var(--nb-k${(i % 6) + 1})"></i>${esc(t.name)}</button>`).join("");
    key.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const i = +b.dataset.i; filter = filter === i ? -1 : i;
      key.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.i === filter));
    });
  }

  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, ay, ax, moved: false }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      ay = drag.ay + dx * 0.008; ax = Math.max(-1.2, Math.min(1.2, drag.ax + dy * 0.008));
    }
  });
  canvas.addEventListener("pointerup", () => { const was = drag; drag = null; if (was && !was.moved && hover) location.href = new URL(hover.href, document.baseURI).href; });
  canvas.addEventListener("pointerleave", () => { mouse = null; if (hover) { hover = null; markFeed(null); } });
  addEventListener("resize", size);
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  fetch(new URL("post-map.json", document.baseURI))
    .then((r) => r.json())
    .then((data) => {
      topics = data.topics; posts = data.posts;
      readColors(); size(); makeDust(); buildKey(); wireFeed();
      t0 = performance.now(); requestAnimationFrame(loop);
    })
    .catch(() => { plate.closest(".nb-right")?.classList.add("is-empty"); });
})();
