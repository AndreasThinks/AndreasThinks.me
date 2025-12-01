(() => {
  const DEFAULT_VERSION = "latest";
  const STRUDEL_REPL_BASE = "https://unpkg.com/@strudel/repl@";
  const currentScript = document.currentScript;

  const normalizeVersion = (value) => {
    if (typeof value !== "string") {
      return { version: DEFAULT_VERSION, reason: value === undefined ? "missing" : "not a string" };
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return { version: DEFAULT_VERSION, reason: "empty" };
    }

    if (!/^[-\w.]+$/.test(trimmed)) {
      return { version: DEFAULT_VERSION, reason: "invalid format" };
    }

    return { version: trimmed };
  };

  const { version: resolvedVersion, reason: versionProblem } = normalizeVersion(
    currentScript?.dataset?.strudelVersion
  );

  if (versionProblem && currentScript?.dataset?.strudelVersion !== undefined) {
    console.warn(
      `Strudel REPL version '${currentScript.dataset.strudelVersion}' is ${versionProblem}; falling back to '${DEFAULT_VERSION}'.`
    );
  }

  const STRUDEL_REPL_SOURCE = `${STRUDEL_REPL_BASE}${resolvedVersion}`;
  const GLOBAL_LOADER_KEY = "__strudelReplLoader";

  const attachLoader = (scriptEl, versionLabel) => {
    const promise = new Promise((resolve, reject) => {
      if (scriptEl.dataset.strudelReplLoaded === "true") {
        resolve();
        return;
      }

      scriptEl.addEventListener(
        "load",
        () => {
          scriptEl.dataset.strudelReplLoaded = "true";
          resolve();
        },
        { once: true }
      );

      scriptEl.addEventListener(
        "error",
        () => reject(new Error(`Unable to load Strudel REPL from CDN (${versionLabel})`)),
        { once: true }
      );
    });

    window[GLOBAL_LOADER_KEY] = { version: versionLabel, promise };
    return promise;
  };

  const loadScript = () => {
    const existingLoader = window[GLOBAL_LOADER_KEY];
    if (existingLoader) {
      if (existingLoader.version !== resolvedVersion) {
        console.warn(
          `Strudel REPL already loading version '${existingLoader.version}', requested '${resolvedVersion}'. Using the existing script.`,
        );
      }
      return existingLoader.promise;
    }

    const existingScript =
      document.querySelector("script[data-strudel-repl-loader]") ||
      document.querySelector(`script[src^="${STRUDEL_REPL_BASE}"]`);

    if (existingScript) {
      const scriptVersion = existingScript.dataset.strudelReplVersion || resolvedVersion;
      if (scriptVersion !== resolvedVersion) {
        console.warn(
          `Strudel REPL already present with version '${scriptVersion}', requested '${resolvedVersion}'. Using the existing script.`,
        );
      }
      return attachLoader(existingScript, scriptVersion);
    }

    const script = document.createElement("script");
    script.src = STRUDEL_REPL_SOURCE;
    script.async = true;
    script.dataset.strudelReplLoader = "true";
    script.dataset.strudelReplVersion = resolvedVersion;

    const promise = attachLoader(script, resolvedVersion);
    document.head.appendChild(script);
    return promise;
  };

  const transformBlock = (codeBlock, index) => {
    const code = codeBlock.textContent.trim();
    const pre = codeBlock.parentElement;
    const parent = pre.parentElement;

    // Create a wrapper div for styling
    const wrapper = document.createElement("div");
    wrapper.className = "strudel-repl-wrapper";

    // Create custom controls
    const controls = document.createElement("div");
    controls.className = "strudel-controls";

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "strudel-button play";
    playBtn.textContent = "▶ Play";
    playBtn.disabled = true;

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "strudel-button stop";
    stopBtn.textContent = "■ Stop";
    stopBtn.disabled = true;

    const status = document.createElement("span");
    status.className = "strudel-status";
    status.textContent = "Loading…";

    controls.append(playBtn, stopBtn, status);

    // Create the strudel-editor element
    const editor = document.createElement("strudel-editor");

    // The code must be wrapped in HTML comments per Strudel docs
    editor.innerHTML = `<!--\n${code}\n-->`;

    wrapper.appendChild(controls);
    wrapper.appendChild(editor);
    parent.replaceChild(wrapper, pre);

    // Set up controls once the editor is ready
    const setupControls = () => {
      // Wait for the editor property to be available
      const checkEditor = setInterval(() => {
        if (editor.editor) {
          clearInterval(checkEditor);

          playBtn.disabled = false;
          stopBtn.disabled = false;
          status.textContent = "Ready to play";
          status.dataset.state = "idle";

          playBtn.addEventListener("click", async () => {
            try {
              // Show visualisation
              wrapper.classList.add("playing");

              status.textContent = "▶ Playing";
              status.dataset.state = "active";
              await editor.editor.evaluate();
            } catch (err) {
              console.error("Strudel play error:", err);
              status.textContent = "Error";
              status.dataset.state = "error";
            }
          });

          stopBtn.addEventListener("click", () => {
            try {
              editor.editor.stop();

              // Hide visualisation
              wrapper.classList.remove("playing");

              status.textContent = "Stopped. Tap Play";
              status.dataset.state = "idle";
            } catch (err) {
              console.error("Strudel stop error:", err);
            }
          });
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkEditor);
        if (!editor.editor) {
          status.textContent = "Failed to load";
          status.dataset.state = "error";
        }
      }, 10000);
    };

    // Start checking for editor after a short delay
    setTimeout(setupControls, 500);
  };

  const enhanceBlocks = async () => {
    const codeBlocks = Array.from(document.querySelectorAll("pre > code.language-strudel"));
    const preBlocks = Array.from(document.querySelectorAll("pre.strudel"))
      .map((pre) => pre.querySelector("code"))
      .filter(Boolean);

    const blocks = [...codeBlocks, ...preBlocks].filter((block, idx, arr) => arr.indexOf(block) === idx);
    if (!blocks.length) return;

    // Load the Strudel REPL script first
    try {
      await loadScript();
    } catch (err) {
      console.error("Failed to load Strudel REPL:", err);
      blocks.forEach((block) => {
        const pre = block.closest("pre");
        if (!pre) return;

        if (pre.nextElementSibling?.classList.contains("strudel-warning")) return;

        const warning = document.createElement("div");
        warning.className = "strudel-warning";
        warning.textContent = "Strudel REPL failed to load. Showing original code.";

        pre.insertAdjacentElement("afterend", warning);
      });
      return;
    }

    // Transform each code block into a strudel-editor
    blocks.forEach((block, idx) => {
      if (block.closest(".strudel-repl-wrapper")) return;
      transformBlock(block, idx);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceBlocks);
  } else {
    enhanceBlocks();
  }
})();
