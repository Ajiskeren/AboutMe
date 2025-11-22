/* Robust terminal script — safer DOM checks + forced fallback hide
   Paste entire file to replace existing terminal.js
*/

(function () {
  // small helper
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const safe = (id) => document.getElementById(id);

  // Query elements safely
  const intro = safe("intro");
  const introLinesEl = safe("intro-lines");
  const introCursor = safe("intro-cursor");
  const introInputPlaceholder = safe("intro-input-placeholder");

  const overlay = safe("terminalOverlay");
  const toggleBtn = safe("terminalToggle");
  const closeBtn = safe("termClose");
  const linesOverlay = safe("linesOverlay");
  const termInput = safe("termInputOverlay");
  const promptRowOverlay = safe("promptRowOverlay");
  const termBodyOverlay = safe("termBodyOverlay");

  const main = safe("main");

  const glitchSound = safe("glitchSound");
  const typeSound = safe("typeSound");
  const errBeep = safe("errBeep");

  // If required DOM nodes missing, bail with console hint
  if (!intro || !introLinesEl || !main) {
    console.error(
      "Terminal init failed: missing required DOM elements. Check IDs: intro, intro-lines, main."
    );
    return;
  }

  // Boot lines (example)
  const bootLines = [
    "[ OK ] Starting kernel...",
    "[ OK ] Loading drivers...",
    "[ OK ] Mounting root filesystem...",
    "[ OK ] Initializing udev...",
    "[FAILED] AXIS_NET: interface timeout",
    "[ OK ] AXIS_NET: recovered",
    "[FAILED] AXIS_DB: connection retry 1",
    "[FAILED] AXIS_DB: connection retry 2",
    "[ OK ] AXIS_DB connected (ro)",
    "[ OK ] Loading services...",
    "[FAILED] AXIS_SEC: key mismatch",
    "[ OK ] AXIS_SEC regenerated key",
    "[ WARN ] CPU microcode outdated",
    "[ OK ] Applying microcode patch",
    "[ OK ] AXIS_ModuleLoader ready",
    "[FAILED] AXIS_X: checksum invalid",
    "[ OK ] Ignoring non-critical module",
    "[ OK ] AXIS scheduler online",
    "[ OK ] AXIS watchdog started",
    ">>> AXIS host: axis",
    ">>> System ready",
  ];

  // TIMING
  const TOTAL = 2000; // total intro time target
  const GLITCH = 350;
  const TYPING_TIME = Math.max(100, TOTAL - GLITCH);
  const PER_LINE = TYPING_TIME / Math.max(1, bootLines.length);

  /* ---------- helpers ---------- */
  function appendLineTo(el, text) {
    if (!el) return;
    const node = document.createElement("div");
    const lower = String(text).toLowerCase();
    if (
      text.includes("[FAILED]") ||
      lower.includes("error") ||
      lower.includes("[err]")
    ) {
      node.classList.add("error");
      node.classList.add("blink");
    }
    node.textContent = text;
    el.appendChild(node);
  }
  function scrollToBottom(el) {
    if (!el) return;
    setTimeout(() => (el.scrollTop = el.scrollHeight), 8);
  }
  function playSound(el) {
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play().catch(() => {});
    } catch (e) {}
  }
  function flashOverlayOn(el, duration = 600) {
    if (!el) return;
    const fx = document.createElement("div");
    fx.className = "glitch-flash";
    el.appendChild(fx);
    setTimeout(() => {
      try {
        el.removeChild(fx);
      } catch (e) {}
    }, duration + 40);
  }

  /* ---------- RUN INTRO (safe) ---------- */
  (async function runIntro() {
    try {
      // small initial pause
      await sleep(60);

      // Clear intro area first (in case)
      introLinesEl.innerHTML = "";

      // Fast print each line, spacing to fit PER_LINE
      for (let i = 0; i < bootLines.length; i++) {
        appendLineTo(introLinesEl, bootLines[i]);
        scrollToBottom(introLinesEl);
        await sleep(Math.max(0, Math.floor(PER_LINE)));
      }

      // show prompt and short placeholder
      if (introCursor) introCursor.style.visibility = "visible";
      if (introInputPlaceholder) introInputPlaceholder.textContent = "uname -a";

      // glitch visual + sound
      const termBody = intro.querySelector(".term-body") || intro;
      flashOverlayOn(termBody, GLITCH);
      intro.classList.add("glitch");
      playSound(glitchSound);

      // After glitch, hide intro and show main
      setTimeout(() => {
        try {
          intro.style.display = "none";
        } catch (e) {}
        try {
          main.classList.add("show");
          main.setAttribute("aria-hidden", "false");
        } catch (e) {}
      }, GLITCH);
    } catch (err) {
      // If anything fails, ensure we hide intro eventually so site is accessible
      console.error("runIntro error:", err);
      setTimeout(() => {
        try {
          intro.style.display = "none";
        } catch (e) {}
        try {
          main.classList.add("show");
          main.setAttribute("aria-hidden", "false");
        } catch (e) {}
      }, TOTAL + 200);
    }
  })();

  // Force-hide fallback in case runIntro crashes early (guarantee not stuck)
  setTimeout(() => {
    if (intro && getComputedStyle(intro).display !== "none") {
      console.warn("Forcing hide intro after fallback timeout.");
      try {
        intro.style.display = "none";
      } catch (e) {}
      try {
        main.classList.add("show");
        main.setAttribute("aria-hidden", "false");
      } catch (e) {}
    }
  }, TOTAL + 2000); // extra safety timeout (TOTAL + 2s)

  /* ---------- Interactive overlay logic (safe wiring) ---------- */
  // minimal state
  const state = {
    cwd: "/home/axis",
    history: [],
    historyIndex: -1,
    files: {
      "/": ["home", "var", "etc"],
      "/home": ["axis"],
      "/home/axis": ["readme.txt"],
    },
    promptText: "axis@linux:~$",
  };

  const commands = {
    help() {
      safePrint([
        "Available: help, music-help, clear, about, axis, axis --info, ls, cd, pwd, open, play, hack, echo, run, exit",
      ]);
    },
    clear() {
      if (linesOverlay) linesOverlay.innerHTML = "";
      if (termBodyOverlay) scrollToBottom(termBodyOverlay);
    },
    about() {
      safePrint(["AXIS Web Terminal", "Author: (you)", "Version: 1.0"]);
    },
    axis(args) {
      if (args && args[0] === "--info") {
        commands["axis --info"]();
        return;
      }
      safePrint(["AXIS: commands: --info, status"]);
    },
    "axis --info"() {
      safePrint(["Hostname: axis", "Services: 42", "Uptime: simulated"]);
    },
    // ============================
    // 🎵 MUSIC TERMINAL COMMANDS
    // ============================

    "music-help": function () {
      safePrint([
        "🎵 MUSIC COMMAND LIST",
        "--------------------------------",
        "play <index|title>   → Putar lagu",
        "pause                → Pause lagu",
        "resume               → Lanjutkan lagu",
        "next                 → Lagu berikutnya",
        "prev                 → Lagu sebelumnya",
        "seek <detik>         → Lompat ke waktu",
        "volume <0–1>         → Atur volume",
        "repeat <on|off>      → Mode repeat",
        "random               → Mode acak",
        "now                  → Info lagu sekarang",
        "list                 → Daftar semua lagu",
        "--------------------------------",
        "Gunakan: run <function> untuk fungsi internal",
      ]);
    },

    // ▶️ PLAY (play index / play title)
    play(args) {
      if (!args || args.length === 0) {
        safePrint(["Usage: play <index|title>"]);
        return;
      }

      let query = args.join(" ").toLowerCase();

      // Jika angka → pakai index
      let index = parseInt(query);
      if (!isNaN(index)) {
        if (tracks[index]) {
          loadTrack(index);
          safePrint([`Playing: ${tracks[index].title}`]);
        } else {
          safePrint(["Track index tidak ditemukan"]);
        }
        return;
      }

      // Jika string → cari title
      let found = tracks.findIndex((t) =>
        t.title.toLowerCase().includes(query)
      );

      if (found !== -1) {
        loadTrack(found);
        safePrint([`Playing: ${tracks[found].title}`]);
      } else {
        safePrint(["Lagu tidak ditemukan"]);
      }
    },

    // ⏸ PAUSE
    pause() {
      audio.pause();
      safePrint(["Paused"]);
    },

    // ▶️ RESUME
    resume() {
      audio.play();
      safePrint(["Resumed"]);
    },

    // ⏭ NEXT
    next() {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
      safePrint([`Next: ${tracks[currentTrack].title}`]);
    },

    // ⏮ PREV
    prev() {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrack);
      safePrint([`Previous: ${tracks[currentTrack].title}`]);
    },

    // ⏩ SEEK detik
    seek(args) {
      if (!args || isNaN(parseFloat(args[0]))) {
        safePrint(["Usage: seek <seconds>"]);
        return;
      }

      audio.currentTime = parseFloat(args[0]);
      safePrint([`Seek → ${audio.currentTime.toFixed(1)}s`]);
    },

    // 🔊 VOLUME
    volume(args) {
      if (!args || isNaN(parseFloat(args[0]))) {
        safePrint(["Usage: volume <0–1>"]);
        return;
      }

      let v = parseFloat(args[0]);

      if (v < 0 || v > 1) {
        safePrint(["Volume must be between 0 and 1"]);
        return;
      }

      audio.volume = v;
      safePrint([`Volume: ${(v * 100).toFixed(0)}%`]);
    },

    // 🔁 REPEAT
    repeat(args) {
      if (!args || (args[0] !== "on" && args[0] !== "off")) {
        safePrint(["Usage: repeat <on|off>"]);
        return;
      }

      audio.loop = args[0] === "on";

      safePrint([`Repeat: ${audio.loop ? "ON" : "OFF"}`]);
    },

    // 🔀 RANDOM PLAY
    random() {
      let r = Math.floor(Math.random() * tracks.length);
      loadTrack(r);
      safePrint([`Random: ${tracks[r].title}`]);
    },

    // ℹ️ INFO LAGU SEKARANG
    now() {
      const t = tracks[currentTrack];
      safePrint([
        "🎵 NOW PLAYING",
        "-------------------------",
        `Title : ${t.title}`,
        `Artist: ${t.artist}`,
        `Time  : ${audio.currentTime.toFixed(1)}s / ${
          audio.duration ? audio.duration.toFixed(1) : "?"
        }s`,
      ]);
    },

    // 📜 LIST TRACKS
    list() {
      safePrint(["🎵 Track List:"]);
      tracks.forEach((t, i) => safePrint([`${i}. ${t.title}`]));
    },
    ls(args) {
      const p = args && args[0] ? resolvePath(args[0]) : state.cwd;
      const list = state.files[p] || [];
      safePrint(list.length ? [list.join("  ")] : [""]);
    },
    pwd() {
      safePrint([state.cwd]);
    },
    cd(args) {
      if (!args || !args[0] || args[0] === "~") {
        state.cwd = "/home/axis";
        safePrint([state.cwd]);
        return;
      }
      const t = resolvePath(args[0]);
      if (state.files[t]) {
        state.cwd = t;
        safePrint([state.cwd]);
      } else {
        playSound(errBeep);
        safePrint([`cd: ${args[0]}: No such file or directory`]);
      }
    },
    open(args) {
      const t = (args && args[0]) || "";
      if (!t) {
        safePrint(["Usage: open <url|home>"]);
        return;
      }
      if (t === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        safePrint(["Opened: home"]);
        return;
      }
      if (/^https?:\/\//.test(t)) {
        safePrint([`Opening: ${t}`]);
        setTimeout(() => window.open(t, "_blank"), 150);
        return;
      }
      safePrint([`Open: Unknown target "${t}"`]);
    },
    play(args) {
      const what = (args && args.join(" ")) || "";

      // Efek lama tetap
      if (what === "glitch") {
        playSound(glitchSound);
        safePrint(["Played: glitch"]);
        return;
      }
      if (what === "type") {
        playSound(typeSound);
        safePrint(["Played: type"]);
        return;
      }

      // Cari lagu berdasarkan judul (case-insensitive)
      const index = tracks.findIndex(
        (t) => t.title.toLowerCase() === what.toLowerCase()
      );

      if (index !== -1) {
        safePrint([
          `Loading: ${tracks[index].title} - ${tracks[index].artist}`,
        ]);
        loadTrack(index); // 🔥 pakai player utama
        return;
      }

      // Tidak ditemukan
      safePrint([
        `Lagu "${what}" tidak ditemukan.`,
        `Gunakan: play <judul lagu>`,
      ]);
    },

    run(args) {
      const fn = args && args[0];

      if (!fn) {
        safePrint(["Usage: run <functionName>"]);
        return;
      }

      // Cek apakah fungsi ada di window / global scope
      const fnRef = window[fn];

      if (typeof fnRef === "function") {
        try {
          fnRef(); // jalankan fungsi
          safePrint([`Executed: ${fn}()`]);
        } catch (e) {
          safePrint([`Error while running ${fn}(): ${e.message}`]);
        }
      } else {
        safePrint([`Function "${fn}" not found.`]);
      }
    },
    hack() {
      safePrint(["Initiating hack sequence..."]);
      const seq = [
        "connecting...",
        "bypassing...",
        "[FAILED] attempt",
        "switching...",
        "done (simulated)",
      ];
      let i = 0;
      const iv = setInterval(() => {
        if (i < seq.length) {
          if (linesOverlay) appendLineTo(linesOverlay, seq[i]);
          i++;
          scrollToBottom(termBodyOverlay);
        } else clearInterval(iv);
      }, 90);
    },
    echo(args) {
      safePrint([args.join(" ")]);
    },
    exit() {
      closeOverlay();
    },
  };

  function safePrint(arr) {
    if (!linesOverlay) return;
    arr.forEach((t) => appendLineTo(linesOverlay, t));
    scrollToBottom(termBodyOverlay);
  }

  function resolvePath(p) {
    if (!p) return state.cwd;
    if (p.startsWith("/")) return p;
    if (p === "~") return "/home/axis";
    if (state.files[state.cwd + "/" + p]) return state.cwd + "/" + p;
    if (state.files["/" + p]) return "/" + p;
    return "/";
  }

  function handleTabCompletion(current) {
    if (!current) return current;
    const all = Object.keys(commands);
    const parts = current.trim().split(/\s+/);
    const last = parts.pop() || "";
    const candidates = all.filter(
      (c) => c.startsWith(last) || c.startsWith(parts[0] + " " + last)
    );
    if (candidates.length === 1) {
      parts.push(candidates[0]);
      return parts.join(" ") + " ";
    }
    if (candidates.length > 1) {
      safePrint(["Possible: " + candidates.join("  ")]);
      return current;
    }
    return current;
  }

  function runCommand(raw) {
    if (!raw) return;
    const parts = raw.split(/\s+/);
    const cmd = (parts.shift() || "").toLowerCase();
    const args = parts;
    const multi = cmd + (args[0] ? " " + args[0] : "");
    if (commands[multi]) {
      commands[multi](args.slice(1));
      return;
    }
    if (commands[cmd]) {
      try {
        commands[cmd](args);
      } catch (e) {
        playSound(errBeep);
        if (linesOverlay) appendLineTo(linesOverlay, "Error: " + e.message);
      }
      return;
    }
    playSound(errBeep);
    if (linesOverlay) appendLineTo(linesOverlay, `${cmd}: command not found`);
    scrollToBottom(termBodyOverlay);
  }

  /* ---------- Overlay open/close wiring (guarded) ---------- */
  function openOverlay() {
    if (!overlay) return;
    overlay.classList.remove("overlay-hidden");
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
    if (linesOverlay) linesOverlay.innerHTML = "";
    safePrint(["Interactive terminal. Type 'help' for commands."]);
    if (promptRowOverlay) promptRowOverlay.style.display = "flex";
    if (termInput) {
      termInput.value = "";
      termInput.focus();
    }
  }
  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.add("overlay-hidden");
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
    if (termInput) termInput.blur();
  }

  // attach toggle (if present)
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (!overlay) return;
      if (overlay.classList.contains("overlay-hidden")) openOverlay();
      else closeOverlay();
    });
  } else {
    console.warn("terminalToggle button not found; overlay toggle disabled.");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      overlay &&
      !overlay.classList.contains("overlay-hidden")
    )
      closeOverlay();
    // optional tilde (~) hotkey to toggle if overlay exists and focus not in input
    if (
      e.key === "`" &&
      document.activeElement &&
      document.activeElement.tagName !== "INPUT"
    ) {
      if (!overlay) return;
      if (overlay.classList.contains("overlay-hidden")) openOverlay();
      else closeOverlay();
    }
  });

  // input listeners (guarded)
  if (termInput) {
    termInput.addEventListener("keydown", (e) => {
      const val = termInput.value;
      if (e.key === "Enter") {
        e.preventDefault();
        const raw = val.trim();
        if (linesOverlay)
          appendLineTo(linesOverlay, state.promptText + " " + raw);
        state.history.push(raw);
        state.historyIndex = state.history.length;
        runCommand(raw);
        termInput.value = "";
        scrollToBottom(termBodyOverlay);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (state.history.length === 0) return;
        state.historyIndex = Math.max(
          0,
          (state.historyIndex === -1
            ? state.history.length
            : state.historyIndex) - 1
        );
        termInput.value = state.history[state.historyIndex] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (state.history.length === 0) return;
        state.historyIndex = Math.min(
          state.history.length,
          state.historyIndex + 1
        );
        termInput.value = state.history[state.historyIndex] || "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        termInput.value = handleTabCompletion(val);
      } else {
        // optionally play typing sound (non-blocking)
        playSound(typeSound);
      }
    });
    // click term body to focus input
    if (termBodyOverlay)
      termBodyOverlay.addEventListener("click", () => termInput.focus());
  } else {
    console.warn("termInputOverlay not found; interactive input disabled.");
  }

  // expose for debugging
  window._axisTerminal = {
    openOverlay,
    closeOverlay,
    appendLineTo,
    safePrint: safePrint,
    state,
    commands,
  };
})();
