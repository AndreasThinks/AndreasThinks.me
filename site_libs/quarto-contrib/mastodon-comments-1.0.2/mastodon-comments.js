const styles = `
/* Styled from the site's theme tokens (styles.css) so the comments follow
   the dark/light toggle; fallbacks keep it readable anywhere else. */
mastodon-comments {
  display: block;
  margin-top: 3.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-soft, rgba(127, 127, 127, 0.25));
  color: var(--text-muted, inherit);
  --c-cell: var(--cell, rgba(127, 127, 127, 0.08));
  --c-rail: var(--rail, currentColor);
  --c-meta: var(--text-meta, rgba(127, 127, 127, 0.9));
  --c-strong: var(--text-primary, inherit);
  --c-border: var(--border-soft, rgba(127, 127, 127, 0.25));
  --c-border-strong: var(--border-strong, rgba(127, 127, 127, 0.45));
  --c-link: var(--accent, inherit);
  --c-mono: var(--font-mono, ui-monospace, monospace);
  --c-radius: var(--radius-md, 6px);
  --comment-indent: 2rem;
}

mastodon-comments > p {
  color: var(--text-muted, inherit);
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}

mastodon-comments a {
  color: var(--c-link);
}

/* totals: a quiet mono line rather than a panel */
#mastodon-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  margin: 0 0 1rem;
  padding: 0;
  background: none;
  border: none;
  font-family: var(--c-mono);
  font-size: 0.75rem;
  color: var(--c-meta);
}

#mastodon-stats > div {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  background: none;
  border: none;
  color: var(--c-meta);
}

#mastodon-stats a { color: inherit; text-decoration: none; }
#mastodon-stats svg { width: 14px; height: 14px; margin: 0 !important; }

#mastodon-comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.95rem;
}

/* each comment is a cell */
.mastodon-comment {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.95rem 1.1rem;
  background: var(--c-cell);
  border: none;
  border-radius: var(--c-radius);
  color: var(--text-muted, inherit);
  transition: box-shadow 0.12s ease;
}

.mastodon-comment:hover {
  box-shadow: inset 2px 0 0 var(--c-rail);
}

/* replies hang off a thread line */
.mastodon-comment:not([style*="* 0)"]) {
  background: transparent;
  border-left: 1px solid var(--c-border-strong);
  border-radius: 0;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.mastodon-comment a { text-decoration: none; }

.mastodon-comment .author {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 0 0.75rem;
  align-items: center;
}

.mastodon-comment .author .avatar { grid-column: 1; grid-row: 1 / span 2; }

.mastodon-comment .author .avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  box-shadow: none;
  display: block;
}

.mastodon-comment .author .details {
  grid-column: 2;
  grid-row: 1 / span 2;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
  min-width: 0;
}

.mastodon-comment .author .details .name {
  color: var(--c-strong);
  font-weight: 600;
  font-size: 0.92rem;
  overflow-wrap: anywhere;
}

.mastodon-comment .author .details .user {
  font-family: var(--c-mono);
  font-size: 0.72rem;
  color: var(--c-meta);
  overflow-wrap: anywhere;
}

.mastodon-comment .platform-indicator {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  font-size: 0.8rem;
  line-height: 1;
}

.mastodon-comment .platform-indicator i { color: var(--c-meta) !important; }

.mastodon-comment .author .date {
  grid-column: 3;
  grid-row: 2;
  justify-self: end;
  margin-left: 0;
  font-family: var(--c-mono);
  font-size: 0.68rem;
  white-space: nowrap;
  color: var(--c-meta);
}

.mastodon-comment .author .date:hover { color: var(--c-strong); }

.mastodon-comment .content {
  margin: 0;
  line-height: 1.65;
  overflow-wrap: break-word;
  word-break: break-word;
}

.mastodon-comment .content a { overflow-wrap: anywhere; }

/* Mastodon link markup: hide the "invisible" scheme/tail spans and close
   truncated URLs with an ellipsis, as Mastodon's own frontend does */
.mastodon-comment .content a .invisible { display: none; }
.mastodon-comment .content a .ellipsis::after { content: "\\2026"; }

.mastodon-comment .content p { margin: 0 0 0.6rem; font-size: inherit; }
.mastodon-comment .content p:last-child { margin-bottom: 0; }

.mastodon-comment .attachments {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.mastodon-comment .attachments:empty { display: none; }

.mastodon-comment .attachments > * { margin: 0; max-width: 100%; }

.mastodon-comment .attachments img,
.mastodon-comment .attachments video,
.mastodon-comment .attachments audio {
  border-radius: var(--radius-sm, 4px);
  border: 1px solid var(--c-border);
}

.mastodon-comment .status {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: var(--c-mono);
  font-size: 0.72rem;
}

.mastodon-comment .status > div {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--c-meta);
}

.mastodon-comment .status a {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: inherit;
}

.mastodon-comment .status svg,
.mastodon-comment .status i { width: 14px; height: 14px; font-size: 0.8rem; }

.mastodon-comment .status .active a { color: var(--c-strong); }

@media (max-width: 600px) {
  mastodon-comments { --comment-indent: 1rem; }
  .mastodon-comment { padding: 0.85rem 0.9rem; }
  .mastodon-comment .author { grid-template-columns: 32px minmax(0, 1fr); }
  .mastodon-comment .author .avatar { align-self: start; }
  .mastodon-comment .author .avatar img { width: 32px; height: 32px; }
  .mastodon-comment .author .details { grid-row: 1; flex-direction: column; gap: 0; }
  .mastodon-comment .author .date { grid-column: 2; grid-row: 2; justify-self: start; }
  .mastodon-comment:not([style*="* 0)"]) { padding-left: 0.8rem; }
}

`;

class MastodonComments extends HTMLElement {
  constructor() {
    super();

    this.host = mastodonHost;
    this.user = mastodonUser;
    this.tootId = mastodonTootId;

    this.commentsLoaded = false;

    const styleElem = document.createElement("style");
    styleElem.innerHTML = styles;
    document.head.appendChild(styleElem);
  }

  connectedCallback() {
    this.innerHTML = `
      <h2>Comments</h2>
      <noscript>
        <div id="error">
          Please enable JavaScript to view the comments powered by the Fediverse.
        </div>
      </noscript>
      <p>You can use your Fediverse (i.e. Mastodon, among many others) account to reply to this <a class="link"
          href="https://${this.host}/@${this.user}/${this.tootId}">post</a>.
      </p>
      <div id="mastodon-stats"></div>
      <div id="mastodon-comments-list"></div>
    `;

    const comments = document.getElementById("mastodon-comments-list");
    const rootStyle = this.getAttribute("style");
    if (rootStyle) {
      comments.setAttribute("style", rootStyle);
    }
    
    // Load comments immediately instead of using lazy loading
    this.loadComments();
  }

  escapeHtml(unsafe) {
    return (unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  toot_active(toot, what) {
    var count = toot[what + "_count"];
    return count > 0 ? "active" : "";
  }

  toot_count(toot, what) {
    var count = toot[what + "_count"];
    return count > 0 ? count : "";
  }

  toot_stats(toot) {
    return `
      <div class="replies ${this.toot_active(toot, "replies")}">
        <a href="${
          toot.url
        }" rel="nofollow"><i class="fa fa-reply fa-fw"></i>${this.toot_count(
          toot,
          "replies",
        )}</a>
      </div>
      <div class="reblogs ${this.toot_active(toot, "reblogs")}">
        <a href="${
          toot.url
        }" rel="nofollow"><i class="fa fa-retweet fa-fw"></i>${this.toot_count(
          toot,
          "reblogs",
        )}</a>
      </div>
      <div class="favourites ${this.toot_active(toot, "favourites")}">
        <a href="${
          toot.url
        }" rel="nofollow"><i class="fa fa-star fa-fw"></i>${this.toot_count(
          toot,
          "favourites",
        )}</a>
      </div>
    `;
  }

  user_account(account) {
    var result = `@${account.acct}`;
    if (account.acct.indexOf("@") === -1) {
      var domain = new URL(account.url);
      result += `@${domain.hostname}`;
    }
    return result;
  }

  render_toots(toots, in_reply_to, depth) {
    var tootsToRender = toots
      .filter((toot) => toot.in_reply_to_id === in_reply_to)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    tootsToRender.forEach((toot) => this.render_toot(toots, toot, depth));
  }

  render_toot(toots, toot, depth) {
    toot.account.display_name = this.escapeHtml(toot.account.display_name);
    toot.account.emojis.forEach((emoji) => {
      toot.account.display_name = toot.account.display_name.replace(
        `:${emoji.shortcode}:`,
        `<img src="${this.escapeHtml(emoji.static_url)}" alt="Emoji ${
          emoji.shortcode
        }" height="20" width="20" />`,
      );
    });

    const mastodonComment = `<div class="mastodon-comment" style="margin-left: calc(var(--comment-indent) * ${depth})">
        <div class="author">
          <div class="avatar">
            <img src="${this.escapeHtml(
              toot.account.avatar_static,
            )}" height=60 width=60 alt="">
          </div>
          <div class="details">
            <a class="name" href="${toot.account.url}" rel="nofollow">${
              toot.account.display_name
            }</a>
            <a class="user" href="${
              toot.account.url
            }" rel="nofollow">${this.user_account(toot.account)}</a>
          </div>
          <a class="date" href="${
            toot.url
          }" rel="nofollow" title="${new Date(toot.created_at).toLocaleString()}">${new Date(
            toot.created_at,
          ).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</a>
        </div>
        <div class="content">${toot.content}</div>
        <div class="attachments">
          ${toot.media_attachments
            .map((attachment) => {
              if (attachment.type === "image") {
                return `<a href="${attachment.url}" rel="nofollow"><img src="${
                  attachment.preview_url
                }" alt="${this.escapeHtml(attachment.description)}" /></a>`;
              } else if (attachment.type === "video") {
                return `<video controls><source src="${attachment.url}" type="${attachment.mime_type}"></video>`;
              } else if (attachment.type === "gifv") {
                return `<video autoplay loop muted playsinline><source src="${attachment.url}" type="${attachment.mime_type}"></video>`;
              } else if (attachment.type === "audio") {
                return `<audio controls><source src="${attachment.url}" type="${attachment.mime_type}"></audio>`;
              } else {
                return `<a href="${attachment.url}" rel="nofollow">${attachment.type}</a>`;
              }
            })
            .join("")}
        </div>
        <div class="status">
          ${this.toot_stats(toot)}
        </div>
      </div>`;

    var div = document.createElement("div");
    div.innerHTML =
      typeof DOMPurify !== "undefined"
        ? DOMPurify.sanitize(mastodonComment.trim())
        : mastodonComment.trim();
    document
      .getElementById("mastodon-comments-list")
      .appendChild(div.firstChild);

    this.render_toots(toots, toot.id, depth + 1);
  }

  loadComments() {
    if (this.commentsLoaded) return;

    document.getElementById("mastodon-comments-list").innerHTML =
      "Loading comments from the Fediverse...";

    let _this = this;

    fetch("https://" + this.host + "/api/v1/statuses/" + this.tootId)
      .then((response) => response.json())
      .then((toot) => {
        document.getElementById("mastodon-stats").innerHTML =
          this.toot_stats(toot);
      });

    fetch(
      "https://" + this.host + "/api/v1/statuses/" + this.tootId + "/context",
    )
      .then((response) => response.json())
      .then((data) => {
        if (
          data["descendants"] &&
          Array.isArray(data["descendants"]) &&
          data["descendants"].length > 0
        ) {
          document.getElementById("mastodon-comments-list").innerHTML = "";
          _this.render_toots(data["descendants"], _this.tootId, 0);
        } else {
          document.getElementById("mastodon-comments-list").innerHTML =
            "<p>No comments found</p>";
        }

        _this.commentsLoaded = true;
      });
  }

  respondToVisibility(element, callback) {
    var options = {
      root: null,
    };

    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          callback();
        }
      });
    }, options);

    observer.observe(element);
  }
}

customElements.define("mastodon-comments", MastodonComments);