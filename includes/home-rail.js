// The homepage rail (index.qmd): Quarto puts the listing's categories in its own margin
// column, which the rail layout replaces, so move them into the rail's folded Categories.
// Also tag each post in the feed that is one of the recent projects.
(function () {
  const cats = document.querySelector("#quarto-margin-sidebar .quarto-listing-category");
  const fold = document.querySelector(".home-cats");
  if (cats && fold) {
    const n = cats.querySelectorAll(".category").length - 1; // less "All"
    fold.querySelector("summary").insertAdjacentHTML("beforeend", ` <span>(${n})</span>`);
    fold.append(cats);
  }

  const norm = (h) => new URL(h, document.baseURI).pathname.replace(/index\.html$/, "");
  const posts = new Map([...document.querySelectorAll("#listing-blog-listings .quarto-post")]
    .map((el) => [norm(el.querySelector(".listing-title a")?.getAttribute("href") || ""), el]));
  document.querySelectorAll(".proj-list [data-post]").forEach((li) => {
    const el = posts.get(norm(li.dataset.post)); if (!el) return;
    const tag = document.createElement("span");
    tag.className = "proj-feed-tag";
    tag.append(li.querySelector(".proj-status").cloneNode(true), "project");
    el.querySelector(".listing-title").append(tag);
  });
})();
