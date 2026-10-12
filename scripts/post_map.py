"""Build post-map.json for the homepage atlas (cell 01).

Runs as a Quarto pre-render script, so it needs nothing beyond numpy and
PyYAML and no API key. For every published post it:

1. reads the title, subtitle, description, tags and body text;
2. turns the text into TF-IDF vectors and reduces them with a truncated SVD
   (latent semantic analysis);
3. assigns a topic from topics.yml by tag overlap, falling back to the
   nearest topic in text space for posts with no mapped tags;
4. links each post to its two nearest neighbours in text space and to every
   post it shares a tag with. includes/post-atlas.js lays the graph out.

Output: post-map.json at the project root, copied to the site as a resource.
"""

import json
import math
import re
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import yaml

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "posts"
OUT = ROOT / "post-map.json"

STOP = set("""a about above after again against all also am an and any are as at be because been before being below
between both but by can could did do does doing down during each few for from further had has have having he her here
hers herself him himself his how i if in into is it its itself just like lot me more most my myself no nor not now of
off on once only or other our ours ourselves out over own really same she should so some such than that the their
theirs them themselves then there these they this those through to too under until up very was we were what when where
which while who whom why will with would you your yours yourself yourselves one get got make made much many even way
well still going thing things think bit quite pretty actually use used using also lots new can't don't i'm it's i've
that's there's you're we're let's ll ve re don didn doesn isn wasn won wouldn couldn shouldn http https www com org
png jpg html quarto echo true false fig cap code python import def return none self print plt df pd np""".split())


def front_matter(text):
    m = re.match(r"^\s*---\s*\n(.*?)\n---[ \t]*(?:\n|$)", text, re.S)
    if not m:
        return {}, text
    return (yaml.safe_load(m.group(1)) or {}), text[m.end():]


def read_post(path):
    raw = path.read_text(encoding="utf-8")
    if path.suffix == ".ipynb":
        nb = json.loads(raw)
        cells = nb.get("cells", [])
        if not cells:
            return None
        head = "".join(cells[0].get("source", ""))
        meta, rest = front_matter(head)
        body = rest + "\n" + "\n".join("".join(c.get("source", "")) for c in cells[1:] if c.get("cell_type") == "markdown")
    else:
        meta, body = front_matter(raw)
    if not meta or not meta.get("title") or meta.get("draft"):
        return None
    rel = path.relative_to(ROOT).with_suffix(".html").as_posix()
    return {
        "href": rel,
        "title": str(meta["title"]),
        "subtitle": str(meta.get("subtitle") or ""),
        "description": str(meta.get("description") or ""),
        "tags": [str(t) for t in (meta.get("categories") or [])],
        "body": body,
    }


def collect():
    posts = []
    for path in sorted(POSTS.rglob("*")):
        if path.suffix not in (".qmd", ".ipynb") or path.name.startswith("_"):
            continue
        if any(part.startswith(("_", ".")) for part in path.relative_to(POSTS).parts[:-1]):
            continue
        if ".ipynb_checkpoints" in path.parts:
            continue
        post = read_post(path)
        if post:
            posts.append(post)
    return posts


def tokens(text):
    text = re.sub(r"```.*?```", " ", text, flags=re.S)       # fenced code
    text = re.sub(r"\]\([^)]*\)", "]", text)                 # link targets
    text = re.sub(r"<[^>]+>|\{[^}]*\}", " ", text)           # html, attributes
    return [w for w in re.findall(r"[a-z][a-z\-']{2,}", text.lower()) if w not in STOP]


def tfidf(docs):
    vocab = Counter()
    for d in docs:
        vocab.update(set(d))
    terms = sorted(t for t, n in vocab.items() if n >= 2 and n <= 0.6 * len(docs))
    index = {t: i for i, t in enumerate(terms)}
    X = np.zeros((len(docs), len(terms)))
    for r, d in enumerate(docs):
        for t, n in Counter(d).items():
            if t in index:
                X[r, index[t]] = 1 + math.log(n)
    idf = np.log((1 + len(docs)) / (1 + np.array([vocab[t] for t in terms]))) + 1
    X *= idf
    X /= np.linalg.norm(X, axis=1, keepdims=True) + 1e-12
    return X


def lsa(X, k):
    U, S, _ = np.linalg.svd(X, full_matrices=False)
    Z = U[:, :k] * S[:k]
    return Z / (np.linalg.norm(Z, axis=1, keepdims=True) + 1e-12)


def assign_topics(posts, Z, topics, ignore):
    unknown = Counter()
    labels = []
    for p in posts:
        scores = [len(set(p["tags"]) & set(t["tags"])) for t in topics]
        best = max(range(len(topics)), key=lambda i: (scores[i], -i))
        labels.append(best if scores[best] > 0 else None)
        known = {tag for t in topics for tag in t["tags"]} | set(ignore)
        unknown.update(tag for tag in p["tags"] if tag not in known)
    # posts with no mapped tags: nearest topic centroid in text space
    for i, lab in enumerate(labels):
        if lab is None:
            cents = [Z[[j for j, l in enumerate(labels) if l == t]].mean(axis=0) if any(l == t for l in labels) else np.zeros(Z.shape[1]) for t in range(len(topics))]
            labels[i] = int(np.argmax([Z[i] @ c for c in cents]))
            print(f"post_map: '{posts[i]['title']}' has no topic tags; placed in '{topics[labels[i]]['name']}' by its text", file=sys.stderr)
    for tag, n in unknown.items():
        print(f"post_map: tag '{tag}' ({n} posts) is not in topics.yml; add it to a topic or to ignore", file=sys.stderr)
    return labels



def edges(Z, posts, ignore):
    """Links for the homepage graph: each post to its two nearest posts in text space,
    plus every pair of posts that share a tag (tags in `ignore` don't count)."""
    Zn = Z / (np.linalg.norm(Z, axis=1, keepdims=True) + 1e-12)
    C = Zn @ Zn.T
    out, ign = {}, set(ignore)
    for i in range(len(posts)):
        for j in [j for j in np.argsort(-C[i]) if j != i][:2]:
            key = tuple(sorted((i, int(j))))
            out[key] = max(out.get(key, 0.0), float(C[i, j]))
        for j in range(i + 1, len(posts)):
            shared = (set(posts[i]["tags"]) & set(posts[j]["tags"])) - ign
            if shared:
                out[(i, j)] = max(out.get((i, j), 0.0), 0.3 + 0.2 * len(shared))
    return [[a, b, round(w, 3)] for (a, b), w in sorted(out.items())]


def main():
    cfg = yaml.safe_load((ROOT / "topics.yml").read_text(encoding="utf-8"))
    topics, ignore = cfg["topics"], cfg.get("ignore", [])
    posts = collect()
    if len(posts) < 4:
        print("post_map: too few posts to map", file=sys.stderr)
        return
    docs = [tokens(" ".join([p["title"]] * 3 + [p["subtitle"], p["description"]] * 2 + [" ".join(p["tags"])] * 2 + [p["body"]])) for p in posts]
    Z = lsa(tfidf(docs), k=min(12, len(posts) - 1))
    labels = assign_topics(posts, Z, topics, ignore)
    # a topic with no posts yet is left off the figure, so it gets no label, colour or key entry
    used = sorted(set(labels))
    for i, t in enumerate(topics):
        if i not in used:
            print(f"post_map: topic '{t['name']}' has no posts yet; left off the map", file=sys.stderr)
    topics = [topics[i] for i in used]
    labels = [used.index(l) for l in labels]
    out = {
        "topics": [t["name"] for t in topics],
        "posts": [{"href": p["href"], "title": p["title"], "tags": p["tags"], "topic": int(l)} for p, l in zip(posts, labels)],
        "edges": edges(Z, posts, ignore),
    }
    OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"post_map: mapped {len(posts)} posts into {len(topics)} topics", file=sys.stderr)


if __name__ == "__main__":
    main()
