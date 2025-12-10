var typed = new Typed(".text", {
  strings: ["Axis", "Beginnner", "Rey Ace"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

// Ambil tombol scroll-up dan section home
const scrollBtn = document.getElementById("scrollUpBtn");
const homeSection = document.getElementById("home");

// Observer untuk cek apakah section home terlihat
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Kalau home terlihat, sembunyikan tombol
        scrollBtn.classList.add("hidden");
      } else {
        // Kalau bukan home, tampilkan tombol
        scrollBtn.classList.remove("hidden");
      }
    });
  },
  { threshold: 0.6 }
); // 60% home terlihat baru dianggap aktif

observer.observe(homeSection);

function readMore() {
  const dots = document.getElementById("dots");
  const more = document.getElementById("more");
  const btn = document.getElementById("btn");

  // Cek apakah sedang tersembunyi (punya class collapsed)
  if (more.classList.contains("collapsed")) {
    // AKSI: MUNCULKAN TEKS
    dots.style.display = "none"; // Sembunyikan titik-titik
    more.classList.remove("collapsed"); // Hapus class hidden
    btn.textContent = "Read Less"; // Ubah teks tombol
  } else {
    // AKSI: SEMBUNYIKAN TEKS
    dots.style.display = "inline"; // Munculkan titik-titik
    more.classList.add("collapsed"); // Tambah class hidden
    btn.textContent = "Read More"; // Balikin teks tombol
  }
}

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

let x = 100; // posisi awal X
let y = 100; // posisi awal Y
let dx = 2; // kecepatan arah X
let dy = 2; // kecepatan arah Y
const speed = 1;

function moveButton() {
  const btnWidth = toggleBtn.offsetWidth;
  const btnHeight = toggleBtn.offsetHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Update posisi
  x += dx * speed;
  y += dy * speed;

  // Pantulan horizontal
  if (x + btnWidth >= screenWidth || x <= 0) {
    dx = -dx;
  }

  // Pantulan vertikal
  if (y + btnHeight >= screenHeight || y <= 0) {
    dy = -dy;
  }

  // Terapkan posisi
  toggleBtn.style.left = x + "px";
  toggleBtn.style.top = y + "px";

  requestAnimationFrame(moveButton);
}

// Mulai animasi
moveButton();

// Fungsi buka/tutup
function openSidebar() {
  sidebar.classList.add("open");
  document.body.classList.add("noscroll");
  document.documentElement.classList.add("noscroll");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  document.body.classList.remove("noscroll");
  document.documentElement.classList.remove("noscroll");
}

// Klik tombol ☰
toggleBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  let diffX = endX - startX;

  // Swipe kanan → buka
  if (startX < 50 && diffX > 80) {
    sidebar.classList.add("open");
  }

  // Swipe kiri → tutup
  if (diffX < -80 && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});

const swipeArea = document.getElementById("swipe-area");

swipeArea.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

swipeArea.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  let diffX = endX - startX;

  if (diffX > 80) sidebar.classList.add("open");
  if (diffX > 80) sidebar.classList.add("open");
  if (diffX > 80) sidebar.classList.add("open");
});

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seek = document.getElementById("seek");
const cover = document.getElementById("cover");
const coverImg = document.getElementById("coverImg");
const coverMain = document.getElementById("coverMain");
const videoCover = document.getElementById("videoCover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const canvas = document.getElementById("spectrum");
const ctx = canvas.getContext("2d");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
let fadeDuration = 5; // 5 detik fade
let isFading = false;
const circleCanvas = document.getElementById("circleCanvas");
const ctx2 = circleCanvas.getContext("2d");

let currentTrack = 0; // hanya 1 deklarasi di file
let showVideo = false; // akan di-set pada loadTrack

function renderPopupPlaylist() {
  popupPlaylist.innerHTML = ""; // bersihin dulu

  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.textContent = `${track.title} - ${track.artist}`;

    // klik untuk ganti lagu
    li.addEventListener("click", () => {
      loadTrack(i);
      highlightPopupPlaylist();
    });

    popupPlaylist.appendChild(li);
  });
}

// Highlight playlist
function highlightPopupPlaylist() {
  [...popupPlaylist.children].forEach((el, i) => {
    el.classList.toggle("active", i === currentTrack);
  });
}

const modal = document.getElementById("playlistModal");
const closeBtnP = document.getElementById("closePlaylist");
const popupPlaylist = document.getElementById("popupPlaylist");

// Buka popup
coverMain.addEventListener("click", () => {
  modal.style.display = "flex";

  // Animasi slide-up
  setTimeout(() => {
    modal.classList.add("show");
    document.querySelector(".playlist-content").classList.add("show");
  }, 10);

  // Render playlist ke popup
  renderPopupPlaylist();
  highlightPopupPlaylist();
});

// Tutup popup (tombol X)
closeBtnP.addEventListener("click", closePopup);

// Tutup popup jika klik area luar
window.addEventListener("click", (e) => {
  if (e.target === modal) closePopup();
});

function closePopup() {
  modal.classList.remove("show");
  document.querySelector(".playlist-content").classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 450); // sesuai dengan durasi animasi CSS
}

function waitForEventOnce(target, eventName, timeoutMs = 2500) {
  return new Promise((resolve, reject) => {
    let done = false;
    function cleanup() {
      done = true;
      target.removeEventListener(eventName, onEvent);
      clearTimeout(timer);
    }
    function onEvent(e) {
      if (done) return;
      cleanup();
      resolve(e);
    }
    target.addEventListener(eventName, onEvent);
    const timer = setTimeout(() => {
      if (done) return;
      cleanup();
      reject(new Error("timeout " + eventName));
    }, timeoutMs);
  });
}

// ======= tampilkan video dengan transisi aman
async function showVideoCover() {
  if (!videoCover) return;
  // load / ensure ready
  try {
    videoCover.load();
    await waitForEventOnce(videoCover, "canplay", 2500).catch(() => null);
    await videoCover.play().catch((e) => console.warn("play rejected:", e));
  } catch (e) {
    console.warn("showVideoCover err", e);
  }
  videoCover.classList.add("visible");
  cover.classList.add("hidden");
}

// ======= tampilkan image
function showImageCover() {
  if (!videoCover) return;
  videoCover.classList.remove("visible");
  cover.classList.remove("hidden");
  try {
    videoCover.pause();
  } catch (e) {}
}

// ======= toggle click pada container .cover
document.querySelector(".cover").addEventListener("click", () => {
  const t = tracks[currentTrack];
  if (!t || !t.videoCover) return;
  showVideo = !showVideo;
  if (showVideo) showVideoCover();
  else showImageCover();
});

function fadeOut(audio, duration = fadeDuration) {
  isFading = true;
  let step = audio.volume / (duration * 20); // 20 kali per detik

  const fade = setInterval(() => {
    if (audio.volume - step > 0) {
      audio.volume -= step;
    } else {
      audio.volume = 0;
      clearInterval(fade);
    }
  }, 50);
}

function fadeIn(audio, duration = fadeDuration) {
  audio.volume = 0;
  let step = 1 / (duration * 20);

  const fade = setInterval(() => {
    if (audio.volume + step < 1) {
      audio.volume += step;
    } else {
      audio.volume = 1;
      clearInterval(fade);
    }
  }, 50);
}

// Fungsi Helper: Ubah Jempol Slider jadi Emoji
function setSliderEmoji(emoji) {
  // Kalau di data tracks tidak ada emoji, default ke not balok 🎵
  const icon = emoji || "🎵";

  // Bikin gambar SVG dari emoji
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
      <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='24'>${icon}</text>
    </svg>
  `.trim();

  const encodedSvg = encodeURIComponent(svg);
  const dataUrl = `url("data:image/svg+xml;utf8,${encodedSvg}")`;

  // Kirim ke CSS Variable
  document.documentElement.style.setProperty("--thumb-emoji", dataUrl);
}

function updateSliderGradient() {
  if (!seek.max) return;
  const val = (seek.value / seek.max) * 100;
  // Warna kiri: activeColor, Warna kanan: abu-abu
  seek.style.background = `linear-gradient(90deg, ${activeColor} ${val}%, #d0d0d0 ${val}%)`;
}

// ======= loadTrack (Final Version)
function loadTrack(index) {
  currentTrack = index;
  const track = tracks[currentTrack];
  if (!track) return;

  isFading = false; // reset

  // === 🔥 UPDATE EMOJI & WARNA SLIDER ===
  // 1. Set Emoji
  setSliderEmoji(track.emoji);

  // 2. Set Warna (Ambil dari tracks, kalau gak ada pake default)
  activeColor = track.color || "#00ffcc";

  // 3. Update CSS Variable (Untuk Border Visualizer & Shadow)
  document.documentElement.style.setProperty("--warna-utama", activeColor);

  // 4. Update Slider Gradient Sekarang Juga
  updateSliderGradient();

  // === SET AUDIO & TEXT ===
  audio.src = track.src;
  title.textContent = track.title || "";
  artist.textContent = track.artist || "";

  // === SET IMAGE ===
  const coverUrl = track.cover || "";
  cover.src = coverUrl;
  coverImg.src = coverUrl;
  coverMain.src = coverUrl;

  // === SET VIDEO COVER ===
  if (track.videoCover) {
    if (videoCover.getAttribute("src") !== track.videoCover) {
      videoCover.setAttribute("src", track.videoCover);
      try {
        videoCover.load();
      } catch (e) {}
    }
    showVideo = true;
    showVideoCover();
  } else {
    showVideo = false;
    showImageCover();
  }

  // === EXTRAS ===
  handleLyrics(track.src);
  highlightPopupPlaylist();

  // Play
  audio.play().catch((e) => console.warn("audio play:", e));
  playBtn.textContent = "ツ"; // Icon custom kamu

  fadeIn(audio);
}

// Play/Pause
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "ツ";
  } else {
    audio.pause();
    playBtn.textContent = "˙◠˙";
  }
});

// Prev/Next
prevBtn.addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
});
nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
});

// Auto next setelah lagu selesai
audio.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
});

// Progress bar
audio.addEventListener("timeupdate", () => {
  seek.value = audio.currentTime;
  seek.max = audio.duration;

  updateSliderColor();
});
seek.addEventListener("input", () => {
  audio.currentTime = seek.value;

  updateSliderColor();
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  if (!isFading && audio.duration - audio.currentTime <= fadeDuration) {
    fadeOut(audio);
  }
});

// === Update warna progress slider ===
// Default warna (biru) jika lagu tidak punya data warna
let activeColor = "#4facfe";

// === UPDATE FUNGSI SLIDER COLOR ===
function updateSliderColor() {
  if (!seek.max || seek.max == 0) return;

  const value = (seek.value / seek.max) * 100;

  // Kita pakai variable 'activeColor' disini
  seek.style.background = `
    linear-gradient(90deg, 
      ${activeColor} ${value}%, 
      #d0d0d0 ${value}%)
  `;
}

// Saat pertama kali masuk, pilih lagu random & auto play
window.addEventListener("load", () => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  loadTrack(randomIndex);
});

// ========================
// LIRIK SYNC ENGINE (ch.js)
// ========================

let lrcData = []; // Simpan data {time, lyric}
let lastActiveIndex = -1; // Track baris terakhir yang aktif
const lyricsEl = document.getElementById("lyrics");

// 1. Fungsi Utama: Load lirik berdasarkan file lagu
function handleLyrics(trackSrc) {
  // Ubah ekstensi .mp3 menjadi .lrc
  const lrcFile = trackSrc.replace(/\.(mp3|wav|ogg)$/i, ".lrc");

  // Reset tampilan sebelum loading
  lyricsEl.innerHTML = '<p class="loading">Loading lyrics...</p>';
  lrcData = [];

  fetch(lrcFile)
    .then((res) => {
      if (!res.ok) throw new Error("404");
      return res.text();
    })
    .then((text) => {
      lrcData = parseLRC(text);
      renderLyrics(lrcData);
    })
    .catch((err) => {
      console.log("Lirik tidak ditemukan:", err);
      lyricsEl.innerHTML = '<p class="no-lyrics">Lyrics not available</p>';
      lrcData = [];
    });
}

// 2. Parser: Ubah teks LRC jadi Array Object
function parseLRC(lrcText) {
  const lines = lrcText.split(/\r?\n/);
  const out = [];

  // Regex untuk menangkap [mm:ss.xx] atau [mm:ss]
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/;

  for (const raw of lines) {
    const match = raw.match(timeRegex);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = match[3] ? parseFloat("0." + match[3]) : 0;

      const time = min * 60 + sec + ms;
      const lyric = raw.replace(timeRegex, "").trim(); // Hapus waktu, sisa teks

      if (lyric) {
        out.push({ time, lyric });
      }
    }
  }
  return out;
}

// 3. Render: Tampilkan baris lirik ke HTML
function renderLyrics(data) {
  lyricsEl.innerHTML = ""; // Bersihkan container

  if (data.length === 0) {
    lyricsEl.innerHTML = '<p class="no-lyrics">Instrumental / No Text</p>';
    return;
  }

  // Buat elemen <p> untuk setiap baris
  const fragment = document.createDocumentFragment(); // Optimasi DOM
  data.forEach((line, i) => {
    const p = document.createElement("p");
    p.textContent = line.lyric;
    p.id = `lyric-${i}`;
    fragment.appendChild(p);
  });

  lyricsEl.appendChild(fragment);
  lastActiveIndex = -1; // Reset highlight
}

// 4. Update: Highlight lirik sesuai durasi lagu
function updateLyrics(currentTime) {
  if (!lrcData.length) return;

  // Cari index lirik yang pas dengan waktu sekarang
  let idx = lrcData.findIndex((line, i) => {
    const nextTime = lrcData[i + 1] ? lrcData[i + 1].time : Infinity;
    return currentTime >= line.time && currentTime < nextTime;
  });

  // Jika index ditemukan dan berbeda dari yang terakhir aktif
  if (idx !== -1 && idx !== lastActiveIndex) {
    // Hapus class active dari baris sebelumnya
    if (lastActiveIndex !== -1) {
      const prev = document.getElementById(`lyric-${lastActiveIndex}`);
      if (prev) prev.classList.remove("active");
    }

    // Tambahkan class active ke baris sekarang
    const active = document.getElementById(`lyric-${idx}`);
    if (active) {
      active.classList.add("active");

      // === SCROLL OTOMATIS (CENTER) ===
      // Ini membuat lirik selalu di tengah container
      active.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }

    lastActiveIndex = idx;
  }
}

// 5. Event Listener: Sambungkan ke Audio Player
// Pastikan variabel 'audio' sudah ada di main.js
if (typeof audio !== "undefined") {
  audio.addEventListener("timeupdate", () => {
    updateLyrics(audio.currentTime);
  });

  // Reset lirik saat lagu selesai/ganti manual
  audio.addEventListener("seeked", () => {
    // Opsional: Paksa update saat user geser durasi (seek)
    updateLyrics(audio.currentTime);
  });
}

function resizeCanvas() {
  const styleWidth = canvas.clientWidth;
  const styleHeight = canvas.clientHeight;
  const dpi = window.devicePixelRatio || 1;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  canvas.width = styleWidth * dpi;
  canvas.height = styleHeight * dpi;
  ctx.scale(dpi, dpi);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

analyser.fftSize = 2048;
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// --- DRAW ---
function draw() {
  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const center = h / 2;

  ctx.clearRect(0, 0, w, h);

  // smoothing buffer (biar gelombang halus)
  if (!window.smoothWave) {
    window.smoothWave = new Float32Array(bufferLength);
  }

  // smoothing 90% old + 10% new
  for (let i = 0; i < bufferLength; i++) {
    const target = (dataArray[i] - 128) / 128; // normal -1 sampai 1
    window.smoothWave[i] = window.smoothWave[i] * 0.9 + target * 0.1;
  }

  // gambar waveform
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 2;

  ctx.beginPath();

  const slice = w / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    const y = center + window.smoothWave[i] * (h * 0.45);
    const x = i * slice;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

// --- 1. SETUP CANVAS & RESIZE ---
function resizeCircleCanvas() {
  const dpi = window.devicePixelRatio || 1;
  const w = circleCanvas.clientWidth;
  const h = circleCanvas.clientHeight;

  circleCanvas.width = w * dpi;
  circleCanvas.height = h * dpi;

  ctx2.setTransform(1, 0, 0, 1, 0, 0);
  ctx2.scale(dpi, dpi);
}
resizeCircleCanvas();
window.addEventListener("resize", resizeCircleCanvas);

// --- 2. SETUP AUDIO ROUTING (CHAINING) ---
// Agar suara tidak double, kita sambung seri:
// Source -> Analyser(Waveform) -> AnalyserCircle(Border) -> Speaker
const analyserCircle = audioCtx.createAnalyser();
analyserCircle.fftSize = 256;
const bufferCircle = analyserCircle.frequencyBinCount;
const dataCircle = new Uint8Array(bufferCircle);

// Putuskan koneksi lama jika ada (opsional, untuk keamanan)
source.disconnect();
analyser.disconnect();

// Sambung ulang secara seri
source.connect(analyser); // Masuk ke Analyser 1 (Waveform)
analyser.connect(analyserCircle); // Teruskan ke Analyser 2 (Circle/Border)
analyserCircle.connect(audioCtx.destination); // Terakhir ke Speaker

// --- 4. LOGIC GAMBAR ---
let animationIdCircle; // Untuk mengontrol stop/start loop

function drawCircleSpectrum() {
  animationIdCircle = requestAnimationFrame(drawCircleSpectrum);

  analyserCircle.getByteTimeDomainData(dataCircle);

  const w = circleCanvas.clientWidth;
  const h = circleCanvas.clientHeight;
  const imgW = 110;
  const imgH = 110;
  const cornerRadius = imgW * 0.2;
  const expand = 40;

  ctx2.clearRect(0, 0, w, h);
  ctx2.save();
  ctx2.translate(w / 2, h / 2);

  ctx2.beginPath();

  const total = dataCircle.length;
  for (let i = 0; i <= total; i++) {
    const index = i % total;
    const v = (dataCircle[index] - 128) / 128;
    const wave = v * expand;
    const t = i / total;
    let x, y;

    // Logic Rounded Rectangle tetap sama
    if (t < 0.25) {
      const pct = t / 0.25;
      x = -imgW / 2 + cornerRadius + pct * (imgW - 2 * cornerRadius);
      y = -imgH / 2 - wave;
    } else if (t < 0.5) {
      const pct = (t - 0.25) / 0.25;
      x = imgW / 2 + wave;
      y = -imgH / 2 + cornerRadius + pct * (imgH - 2 * cornerRadius);
    } else if (t < 0.75) {
      const pct = (t - 0.5) / 0.25;
      x = imgW / 2 - cornerRadius - pct * (imgW - 2 * cornerRadius);
      y = imgH / 2 + wave;
    } else {
      const pct = (t - 0.75) / 0.25;
      x = -imgW / 2 - wave;
      y = imgH / 2 - cornerRadius - pct * (imgH - 2 * cornerRadius);
    }

    if (i === 0) ctx2.moveTo(x, y);
    else ctx2.lineTo(x, y);
  }

  ctx2.closePath();

  // 🔥 PERUBAHAN UTAMA DI SINI 🔥
  // Gunakan variable 'activeColor' yang di-update oleh loadTrack
  ctx2.strokeStyle = activeColor || "#00ffcc"; // Fallback ke hijau jika error

  ctx2.lineWidth = 3;
  ctx2.lineJoin = "round";

  // Shadow juga ikuti activeColor
  ctx2.shadowBlur = 15;
  ctx2.shadowColor = activeColor || "#00ffcc";

  ctx2.stroke();
  ctx2.restore();
}

// --- 5. CONTROL PLAY (Mencegah Loop Menumpuk) ---
audio.onplay = async () => {
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  // Batalkan animasi sebelumnya jika ada (biar gak numpuk)
  cancelAnimationFrame(window.animationIdWave); // Asumsi kamu punya var ini untuk waveform
  cancelAnimationFrame(animationIdCircle);

  draw(); // Jalankan waveform
  drawCircleSpectrum(); // Jalankan border neon
};

// Tambahkan onpause untuk hemat resource (opsional tapi disarankan)
audio.onpause = () => {
  cancelAnimationFrame(animationIdCircle);
  // cancelAnimationFrame(window.animationIdWave);
};

// format detik -> menit:detik
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

// update total durasi setelah metadata siap
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// update current time selama audio play
audio.addEventListener("timeupdate", () => {
  current.textContent = formatTime(audio.currentTime);
});

// Toggle Sidebar
const sidebarS = document.getElementById("sidebarS");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

// Buka sidebar
openBtn?.addEventListener("click", () => {
  sidebarS.classList.add("active");
  openBtn.style.display = "none";
});

// Tutup sidebar
closeBtn?.addEventListener("click", () => {
  sidebarS.classList.remove("active");
  openBtn.style.display = "block";
});

function updateTime() {
  const now = new Date();
  document.getElementById("hours").textContent = String(
    now.getHours()
  ).padStart(2, "0");
  document.getElementById("minutes").textContent = String(
    now.getMinutes()
  ).padStart(2, "0");
  document.getElementById("seconds").textContent = String(
    now.getSeconds()
  ).padStart(2, "0");
}
setInterval(updateTime, 1000);
updateTime();

async function getWeather(city) {
  const url = `https://wttr.in/${city}?format=%C+%t`;

  // Lebih banyak emoji
  const weatherIcons = {
    sunny: "☀️🌞🔥",
    clear: "🌞✨🌙",
    cloud: "☁️🌥️🌤️",
    partly: "⛅🌤️🌥️",
    overcast: "🌥️☁️🌫️",
    rain: "🌧️🌦️💧",
    shower: "🌦️🌧️☔",
    thunder: "⛈️⚡🌩️",
    storm: "🌪️🌩️⛈️",
    drizzle: "💧🌦️☁️",
    mist: "🌫️🌁💨",
    fog: "🌫️🌁👓",
    snow: "❄️☃️⛄",
    ice: "🧊❄️🥶",
    wind: "💨🍃🌬️",
    hot: "🔥🥵🌞",
    cold: "🥶❄️🧊",
  };

  try {
    const res = await fetch(url);
    let data = await res.text(); // contoh: "Partly cloudy +29°C"

    let icon = "🌍";
    const desc = data.toLowerCase();

    for (let key in weatherIcons) {
      if (desc.includes(key)) {
        icon = weatherIcons[key];
        break;
      }
    }

    document.getElementById("weather").textContent = `${icon} Bagelen: ${data}`;
  } catch (err) {
    document.getElementById("weather").textContent = "⚠️ Gagal memuat cuaca";
  }
}

// Jalankan untuk Bagelen, Pesawaran
getWeather("Bagelen+Pesawaran");

// Auto-refresh tiap 10 menit
setInterval(() => getWeather("Bagelen+Pesawaran"), 600000);

(function () {
  emailjs.init("vusiDp2YuSkT0-mcC"); // Public Key dari EmailJS
})();

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      emailjs.sendForm("service_2fde5xv", "template_jj81348", this).then(
        function () {
          alert("✅ Pesan berhasil dikirim!");
        },
        function (error) {
          alert("❌ Gagal: " + JSON.stringify(error));
        }
      );
    });
});

function tampilkanTanggal() {
  const sekarang = new Date();

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const namaHari = hari[sekarang.getDay()];
  const tanggal = sekarang.getDate();
  const namaBulan = bulan[sekarang.getMonth()];
  const tahun = sekarang.getFullYear();

  document.getElementById(
    "tanggal"
  ).textContent = `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}

// Jalankan saat halaman dimuat
tampilkanTanggal();

const bars = document.querySelectorAll(".bar");
const radialBars = document.querySelectorAll(".radial-bar");

// --- Untuk animasi bar horizontal ---
function checkVisibleBars() {
  bars.forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      bar.classList.add("active");
    } else {
      bar.classList.remove("active");
    }
  });
}

// --- Untuk animasi radial bar ---
function checkVisibleRadialBars() {
  radialBars.forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      bar.classList.add("active");
    } else {
      bar.classList.remove("active");
    }
  });
}

// Gabungkan event scroll & load untuk keduanya
window.addEventListener("scroll", () => {
  checkVisibleBars();
  checkVisibleRadialBars();
});
window.addEventListener("load", () => {
  checkVisibleBars();
  checkVisibleRadialBars();
});

const text = `Hey! Stoked you’re here checking out my portfolio 😎
Got a cool idea, a question, or just wanna team up on something awesome?
Drop me a message through this form and let’s make it happen.
I promise I’ll hit you back ASAP!`;

const typingEl = document.getElementById("typing");
let index = 0;
let isTyping = false;

// Ubah ini sesuai kata yang ingin dijadikan titik mulai animasi:
const startWord = "Got";
const startIndex = text.indexOf(startWord);

// Bagian sebelum kata "Drop" langsung tampil
const staticText = text.slice(0, startIndex);

function typeEffect() {
  if (index < text.length) {
    typingEl.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 35);
  } else {
    isTyping = false;
  }
}

const typingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isTyping) {
        isTyping = true;

        // tampilkan bagian awal
        typingEl.textContent = staticText;

        // mulai efek mengetik dari kata "Drop"
        index = startIndex;
        typeEffect();
      }
    });
  },
  { threshold: 0.4 }
);

typingObserver.observe(typingEl);

/* --- SCROLL SPY KHUSUS SECTION RAKSASA --- */

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".navbar a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY; // Posisi scroll kita saat ini
    let offset = sec.offsetTop - 150; // Toleransi 150px sebelum masuk section
    let height = sec.offsetHeight; // Tinggi section (bisa 300vh, bebas)
    let id = sec.getAttribute("id");

    // LOGIKA:
    // Jika scroll kita LEBIH BESAR dari Pucuk Section (minus offset)
    // DAN scroll kita LEBIH KECIL dari (Pucuk + Tinggi Section)
    // Artinya: Kita sedang berada "di dalam" section tersebut.
    if (top >= offset && top < offset + height) {
      // Matikan semua active class dulu
      navLinks.forEach((links) => {
        links.classList.remove("active");

        // Nyalakan HANYA yang ID-nya cocok
        if (links.getAttribute("href").includes(id)) {
          links.classList.add("active");
        }
      });
    }
  });
};
