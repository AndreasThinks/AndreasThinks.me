const styles = `
mastodon-comments {
  display: block;
  margin-top: 3rem;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: var(--mastodon-font-color, var(--text-muted, #9ba9c6));
  --mastodon-font-color: var(--text-muted, #9ba9c6);
  --mastodon-heading-color: var(--text-primary, #f4f7ff);
  --mastodon-background: var(--bg-panel, rgba(10, 15, 30, 0.72));
  --mastodon-border-color: var(--border-soft, rgba(123, 252, 200, 0.18));
  --mastodon-radius: var(--radius-md, 14px);
  --mastodon-radius-sm: var(--radius-sm, 8px);
  --mastodon-link: var(--accent, #7bfcca);
  --mastodon-link-hover: var(--accent-strong, #32ffc7);
  --comment-indent: 48px;
}

mastodon-comments h2 {
  color: var(--mastodon-heading-color);
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  margin-bottom: 0.75rem;
}

mastodon-comments p {
  color: var(--mastodon-font-color);
  max-width: 640px;
  line-height: 1.65;
}

mastodon-comments a {
  color: var(--mastodon-link);
  text-decoration: none;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

mastodon-comments a:hover,
mastodon-comments a:focus {
  color: var(--mastodon-link-hover);
  text-shadow: 0 0 12px rgba(123, 252, 200, 0.4);
}

#mastodon-stats {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

#mastodon-stats > div {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.85rem;
  background: rgba(123, 252, 200, 0.08);
  border: 1px solid rgba(123, 252, 200, 0.2);
  border-radius: var(--mastodon-radius-sm);
  color: var(--mastodon-font-color);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

#mastodon-stats a {
  color: inherit;
}

#mastodon-comments-list {
  margin-top: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.mastodon-comment {
  background: var(--mastodon-background);
  border-radius: var(--mastodon-radius);
  border: 1px solid var(--mastodon-border-color);
  padding: 1.35rem;
  color: var(--mastodon-font-color);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-glow, 0 0 25px rgba(123, 252, 200, 0.15));
}

.mastodon-comment .author {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.mastodon-comment .author a {
  text-decoration: none;
}

.mastodon-comment .author .avatar img {
  width: 60px;
  height: 60px;
  border-radius: var(--mastodon-radius-sm);
  border: 1px solid var(--mastodon-border-color);
  box-shadow: 0 6px 16px rgba(5, 6, 13, 0.55);
}

.mastodon-comment .author .details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.mastodon-comment .author .details .name {
  color: var(--mastodon-heading-color);
  font-weight: 600;
}

.mastodon-comment .author .details .user {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--mastodon-font-color);
  opacity: 0.7;
}

.mastodon-comment .author .date {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--mastodon-font-color);
  opacity: 0.65;
}

.mastodon-comment .content {
  line-height: 1.65;
}

.mastodon-comment .content p {
  margin: 0 0 0.75rem;
}

.mastodon-comment .content p:last-child {
  margin-bottom: 0;
}

.mastodon-comment .attachments {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mastodon-comment .attachments > * {
  margin: 0;
  max-width: 100%;
}

.mastodon-comment .attachments img,
.mastodon-comment .attachments video,
.mastodon-comment .attachments audio {
  border-radius: var(--mastodon-radius-sm);
  border: 1px solid rgba(123, 252, 200, 0.18);
}

.mastodon-comment .status {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
}

.mastodon-comment .status > div {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--mastodon-font-color);
}

.mastodon-comment .status a {
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.mastodon-comment .status svg,
.mastodon-comment .status i {
  width: 16px;
  height: 16px;
}

.mastodon-comment .status .replies.active a,
.mastodon-comment .status .reblogs.active a,
.mastodon-comment .status .favourites.active a,
#mastodon-stats .replies.active a,
#mastodon-stats .reblogs.active a,
#mastodon-stats .favourites.active a {
  color: var(--mastodon-link);
}

@media (max-width: 600px) {
  mastodon-comments {
    --comment-indent: 24px;
  }

  .mastodon-comment {
    padding: 1.1rem;
  }

  .mastodon-comment .author {
    flex-wrap: wrap;
  }

  .mastodon-comment .author .date {
    width: 100%;
    margin-left: 0;
  }
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
          }" rel="nofollow">${toot.created_at.substr(
            0,
            10,
          )} ${toot.created_at.substr(11, 8)}</a>
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