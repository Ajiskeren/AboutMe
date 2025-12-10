/* AXIS TERMINAL V3.0 — GEMINI API INTEGRATED (FIXED)
   Code by: M. Aziz Jaya & Sarah (Assistant)
   Paste this into your terminal.js file
*/

(function () {
  // --- UTILITIES ---
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const safe = (id) => document.getElementById(id);

  // --- DOM ELEMENTS ---
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

  // --- AUDIO ---
  const glitchSound = safe("glitchSound");
  const typeSound = safe("typeSound");
  const errBeep = safe("errBeep");

  // --- BOOT SEQUENCE ---
  const bootLines = [
    "[ OK ] Starting kernel...",
    "[ OK ] Loading drivers...",
    "[ OK ] Mounting root filesystem...",
    "[ OK ] Initializing udev...",
    "[FAILED] AXIS_NET: interface timeout",
    "[ OK ] AXIS_NET: recovered",
    "[ OK ] Loading services...",
    "[ OK ] AXIS_AI_CORE: Neural Network connected",
    "[ OK ] AXIS scheduler online",
    ">>> AXIS host: axis",
    ">>> System ready",
  ];

  // --- CONFIG ---
  const TOTAL = 2000;
  const GLITCH = 350;
  const PER_LINE = (TOTAL - GLITCH) / bootLines.length;

  /* ---------- HELPERS ---------- */
  function appendLineTo(el, text, isAi = false) {
    if (!el) return;
    const node = document.createElement("div");

    // Formatting sederhana
    let formatted = text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<span style="color:#fff; font-weight:bold">$1</span>'
      ) // Bold
      .replace(/`([^`]+)`/g, '<span style="color:var(--accent)">$1</span>'); // Code

    // Style khusus Error
    if (text.includes("[FAILED]") || text.toLowerCase().includes("error")) {
      node.classList.add("error", "blink");
    }

    // Style khusus AI
    if (isAi) {
      node.style.color = "#a6e22e";
      node.style.textShadow = "0 0 5px rgba(166, 226, 46, 0.5)";
      formatted = "🤖 AI: " + formatted;
    }

    node.innerHTML = formatted;
    el.appendChild(node);
  }

  function scrollToBottom(el) {
    if (!el) return;
    setTimeout(() => (el.scrollTop = el.scrollHeight), 10);
  }

  function playSound(el) {
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  }

  // Helper untuk efek ngetik satu-satu (Typewriter Effect)
  async function typeWriterEffect(prefix, text) {
    const node = document.createElement("div");
    node.style.color = "#00ffcc"; // Warna Cyan
    node.style.marginBottom = "8px";
    node.style.whiteSpace = "pre-wrap";
    linesOverlay.appendChild(node);

    // Bersihkan format markdown bold (**) jadi HTML bold
    let cleanText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Loop ngetik (pakai innerHTML hati-hati, kita simplifikasi biar aman)
    // Kita append char by char, tapi kalau ada tag HTML kita langsung render
    // Untuk simplifikasi biar gak bug di tag HTML, kita ketik teks biasa aja dulu
    // atau langsung render full kalau teksnya kompleks.

    // Versi Simple & Aman:
    node.innerHTML = `<strong>${prefix}</strong>`; // Prefix dulu

    const contentSpan = document.createElement("span");
    node.appendChild(contentSpan);

    // Hapus tag HTML buat efek ketik biar gak rusak (atau render langsung)
    // Di sini kita render langsung chunk demi chunk biar cepet
    let i = 0;
    const speed = 10; // Kecepatan ngetik ms

    // Kita pakai trick: render text full tapi hide, terus reveal?
    // Atau ketik manual plain text. Gemini suka ngasih markdown.
    // Kita pakai plain text typing aja biar kerasa hacker-nya.

    const plainText = text.replace(/\*\*/g, ""); // Hapus bintang markdown

    while (i < plainText.length) {
      contentSpan.textContent += plainText.charAt(i);
      i++;
      scrollToBottom(termBodyOverlay);
      if (i % 2 === 0) await sleep(speed); // Delay tiap 2 huruf
    }
  }

  /* ---------- AI LOGIC (GEMINI INTEGRATION) ---------- */
  async function processAiResponse(query) {
    if (!query) return;

    // 1. Tampilkan status loading
    const loadingId = "load_" + Date.now();
    appendLineTo(
      linesOverlay,
      `<span id="${loadingId}" style="color:yellow">[ CONNECTING TO NEURAL NET... ]</span>`
    );
    scrollToBottom(termBodyOverlay);

    // Matikan input biar user gak spam
    if (termInput) termInput.disabled = true;

    try {
      // 2. Kirim pesan ke backend Vercel (/api/chat)
      const req = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const res = await req.json();

      // Hapus tulisan loading
      const loadEl = document.getElementById(loadingId);
      if (loadEl) loadEl.remove();

      if (res.error) {
        appendLineTo(linesOverlay, `[ERROR] ${res.error}`);
        appendLineTo(
          linesOverlay,
          `(Info: Pastikan server backend berjalan / Vercel CLI aktif)`
        );
      } else {
        // 3. Efek mengetik untuk jawaban Gemini
        await typeWriterEffect("🤖 GEMINI: ", res.reply);
      }
    } catch (err) {
      const loadEl = document.getElementById(loadingId);
      if (loadEl) loadEl.remove();
      console.error(err);
      appendLineTo(linesOverlay, `[FATAL ERROR] Gagal menghubungi Server AI.`);
      appendLineTo(
        linesOverlay,
        `Tip: Fitur ini butuh Backend (Vercel). Cek console.`
      );
    } finally {
      // Nyalakan input lagi
      if (termInput) {
        termInput.disabled = false;
        termInput.focus();
      }
      scrollToBottom(termBodyOverlay);
    }
  }

  /* ---------- MAIN INTRO ---------- */
  (async function runIntro() {
    try {
      await sleep(100);
      introLinesEl.innerHTML = "";
      for (let line of bootLines) {
        appendLineTo(introLinesEl, line);
        scrollToBottom(introLinesEl);
        await sleep(PER_LINE);
      }
      if (introCursor) introCursor.style.visibility = "visible";
      if (introInputPlaceholder)
        introInputPlaceholder.textContent = "init_portfolio.sh";

      const termBody = intro.querySelector(".term-body") || intro;
      intro.classList.add("glitch");
      playSound(glitchSound);

      setTimeout(() => {
        intro.style.display = "none";
        main.classList.remove("main-hidden");
        main.classList.add("show");
      }, GLITCH);
    } catch (e) {
      console.log("Intro skipped");
    }
  })();

  /* ---------- INTERACTIVE TERMINAL ---------- */
  const state = {
    history: [],
    historyIndex: -1,
    cwd: "~/projects/portfolio",
    promptText: "axis@dev:~$",
  };

  const commands = {
    help() {
      appendLineTo(
        linesOverlay,
        `
      <div style="color:#ddd">
        AVAILABLE COMMANDS:
        -------------------
        <span style="color:yellow">ai [teks]</span>    → Chat dengan Gemini AI
        <span style="color:yellow">play [judul]</span> → Putar lagu
        <span style="color:yellow">clear</span>        → Bersihkan layar
        <span style="color:yellow">about</span>        → Info developer
        <span style="color:yellow">contact</span>      → Info kontak
        <span style="color:yellow">exit</span>         → Tutup terminal
      </div>
      `
      );
    },

    // COMMAND AI
    ai(args) {
      if (!args.length) {
        appendLineTo(linesOverlay, "Usage: ai <pertanyaan>");
        return;
      }
      processAiResponse(args.join(" "));
    },

    // Alias
    chat(args) {
      this.ai(args);
    },
    tanya(args) {
      this.ai(args);
    },

    // Command Lain
    clear() {
      linesOverlay.innerHTML = "";
    },
    about() {
      appendLineTo(linesOverlay, "M. Aziz Jaya | 15 y.o | Fullstack Wannabe");
    },
    contact() {
      appendLineTo(linesOverlay, "WA: 089508883568 | IG: @axis_pp_ra");
    },

    // Music Player
    play(args) {
      if (typeof tracks === "undefined") {
        appendLineTo(linesOverlay, "[ERR] Audio driver not loaded.");
        return;
      }
      let query = args.join(" ").toLowerCase();

      if (!query) {
        if (typeof audio !== "undefined") audio.play();
        appendLineTo(linesOverlay, "Resuming audio stream...");
        return;
      }

      let foundIndex = tracks.findIndex((t) =>
        t.title.toLowerCase().includes(query)
      );
      if (foundIndex !== -1 && typeof loadTrack === "function") {
        loadTrack(foundIndex);
        audio.play();
        appendLineTo(linesOverlay, `Now Playing: ${tracks[foundIndex].title}`);
      } else {
        appendLineTo(linesOverlay, `[ERR] Song "${query}" not found.`);
      }
    },
    stop() {
      if (typeof audio !== "undefined") audio.pause();
      appendLineTo(linesOverlay, "Audio paused.");
    },

    exit() {
      closeOverlay();
    },
  };

  function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts.shift().toLowerCase();

    if (commands[cmd]) {
      commands[cmd](parts);
    } else {
      playSound(errBeep);
      appendLineTo(linesOverlay, `bash: ${cmd}: command not found`);
    }
  }

  /* ---------- EVENT LISTENERS ---------- */
  function openOverlay() {
    overlay.classList.remove("overlay-hidden");
    overlay.style.display = "flex";
    termInput.focus();
  }

  function closeOverlay() {
    overlay.classList.add("overlay-hidden");
    overlay.style.display = "none";
  }

  if (toggleBtn)
    toggleBtn.onclick = () => {
      if (
        overlay.style.display === "none" ||
        overlay.classList.contains("overlay-hidden")
      )
        openOverlay();
      else closeOverlay();
    };
  if (closeBtn) closeBtn.onclick = closeOverlay;

  window.addEventListener("keydown", (e) => {
    if (e.key === "`") {
      if (overlay.classList.contains("overlay-hidden")) openOverlay();
      else closeOverlay();
    }
  });

  if (termInput) {
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = termInput.value;
        if (!val) return;

        appendLineTo(linesOverlay, `${state.promptText} ${val}`);
        state.history.push(val);
        state.historyIndex = state.history.length;

        runCommand(val);
        termInput.value = "";
        scrollToBottom(termBodyOverlay);
      } else if (e.key === "ArrowUp") {
        // Fitur history up
        if (state.historyIndex > 0) {
          state.historyIndex--;
          termInput.value = state.history[state.historyIndex];
        }
      }
    });
    termBodyOverlay.addEventListener("click", () => termInput.focus());
  }

  /* --- VIRTUAL KEYBOARD LOGIC (Tambahkan di dalam IIFE terminal.js) --- */
  const keyboard = document.getElementById("retroKeyboard");

  if (keyboard && termInput) {
    // Bunyi ketikan khusus keyboard layar
    const clickSound = new Audio("assets/audio/type-click.mp3"); // Pastikan path audionya bener ya

    keyboard.addEventListener("click", (e) => {
      // Cek apakah yang diklik itu tombol
      if (e.target.classList.contains("key")) {
        const key = e.target.getAttribute("data-key");

        // Mainkan suara (Opsional, biar keren)
        // clickSound.currentTime = 0;
        // clickSound.play().catch(()=>{});

        // Efek visual getar
        termInput.focus();

        if (key === "enter") {
          // Simulasi tekan Enter beneran
          const event = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            bubbles: true,
          });
          termInput.dispatchEvent(event);
        } else if (key === "backspace") {
          // Hapus 1 huruf belakang
          termInput.value = termInput.value.slice(0, -1);
        } else if (key === "clear") {
          // Hapus semua
          termInput.value = "";
        } else {
          // Ngetik huruf biasa
          termInput.value += key;
        }
      }
    });

    // Sembunyikan keyboard kalau di Desktop (Opsional, kalau mau cuma di HP)
    // if (window.innerWidth > 768) keyboard.style.display = 'none';
  }
})();
