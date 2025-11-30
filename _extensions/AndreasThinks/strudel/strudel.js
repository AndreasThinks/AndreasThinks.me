(() => {
  const STRUDEL_REPL_SOURCE = "https://unpkg.com/@strudel/repl@latest";
  let scriptLoaded = false;

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (scriptLoaded) {
        resolve();
        return;
      }
      const existing = document.querySelector(`script[src="${STRUDEL_REPL_SOURCE}"]`);
      if (existing) {
        scriptLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = STRUDEL_REPL_SOURCE;
      script.async = true;
      script.onload = () => {
        scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Unable to load Strudel REPL from CDN"));
      document.head.appendChild(script);
    });
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

    // Create the editor container with overlay
    const editorContainer = document.createElement("div");
    editorContainer.className = "strudel-editor-container";

    // Create overlay for idle state
    const overlay = document.createElement("div");
    overlay.className = "strudel-overlay";
    overlay.innerHTML = '<span class="strudel-overlay-text">▶ Click Play to start</span>';

    // Create the strudel-editor element
    const editor = document.createElement("strudel-editor");
    
    // The code must be wrapped in HTML comments per Strudel docs
    editor.innerHTML = `<!--\n${code}\n-->`;

    editorContainer.appendChild(overlay);
    editorContainer.appendChild(editor);

    wrapper.appendChild(controls);
    wrapper.appendChild(editorContainer);
    parent.replaceChild(wrapper, pre);

    // Set up controls once the editor is ready
    const setupControls = () => {
      // Wait for the editor property to be available
      const checkEditor = setInterval(() => {
        if (editor.editor) {
          clearInterval(checkEditor);
          
          playBtn.disabled = false;
          stopBtn.disabled = false;
          status.textContent = "Ready";
          status.dataset.state = "idle";

          playBtn.addEventListener("click", async () => {
            try {
              // Show visualisation and hide overlay
              wrapper.classList.add("playing");
              overlay.classList.add("hidden");
              
              status.textContent = "Playing";
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
              
              // Hide visualisation and show overlay
              wrapper.classList.remove("playing");
              overlay.classList.remove("hidden");
              
              status.textContent = "Stopped";
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
