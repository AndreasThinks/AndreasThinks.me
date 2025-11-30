(() => {
  const STRUDEL_VERSION = "1.2.6";
  const STRUDEL_SOURCE = `https://unpkg.com/@strudel/web@${STRUDEL_VERSION}/dist/index.js`;
  let strudelLoading;
  let strudelReady = false;

  const loadScript = () => {
    if (window.initStrudel || strudelLoading) return strudelLoading;
    strudelLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${STRUDEL_SOURCE}"]`);
      if (existing && (existing.dataset.loaded === "true" || typeof window.initStrudel === "function")) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = STRUDEL_SOURCE;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error("Unable to load Strudel from CDN"));
      document.head.appendChild(script);
    });
    return strudelLoading;
  };

  const ensureStrudel = async () => {
    await loadScript();
    if (!strudelReady && typeof window.initStrudel === "function") {
      window.initStrudel();
      strudelReady = true;
    }
    if (!window.evaluate || !window.hush) {
      throw new Error("Strudel failed to initialize");
    }
  };

  const createControls = (codeBlock, index) => {
    const code = codeBlock.textContent.trim();
    const wrapper = document.createElement("div");
    wrapper.className = "strudel-player";
    const pre = codeBlock.parentElement;
    pre.parentElement.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const controls = document.createElement("div");
    controls.className = "strudel-controls";
    controls.setAttribute("aria-label", "Strudel controls");

    const label = document.createElement("div");
    label.className = "strudel-label";
    label.textContent = codeBlock.dataset.title || `Strudel pattern ${index + 1}`;

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "strudel-button play";
    playBtn.textContent = "Play";

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "strudel-button stop";
    stopBtn.textContent = "Stop";

    const status = document.createElement("span");
    status.className = "strudel-status";
    status.textContent = "Idle";

    const setStatus = (text, state) => {
      status.textContent = text;
      status.dataset.state = state;
    };

    playBtn.addEventListener("click", async () => {
      playBtn.disabled = true;
      stopBtn.disabled = true;
      setStatus("Loading…", "loading");
      try {
        await ensureStrudel();
        setStatus("Playing", "active");
        await window.evaluate(code);
      } catch (err) {
        console.error(err);
        setStatus("Error", "error");
      } finally {
        playBtn.disabled = false;
        stopBtn.disabled = false;
      }
    });

    stopBtn.addEventListener("click", async () => {
      if (typeof window.hush === "function") {
        window.hush();
        setStatus("Stopped", "idle");
      }
    });

    controls.append(label, playBtn, stopBtn, status);
    wrapper.appendChild(controls);
  };

  const enhanceBlocks = () => {
    const codeBlocks = Array.from(document.querySelectorAll("pre > code.language-strudel"));
    const preBlocks = Array.from(document.querySelectorAll("pre.strudel"))
      .map((pre) => pre.querySelector("code"))
      .filter(Boolean);

    const blocks = Array.from(new Set([...codeBlocks, ...preBlocks]));
    if (!blocks.length) return;

    blocks.forEach((block, idx) => {
      if (block.closest(".strudel-player")) return;
      createControls(block, idx);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceBlocks);
  } else {
    enhanceBlocks();
  }
})();
