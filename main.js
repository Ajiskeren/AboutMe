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

  const collapsed = more.classList.contains("collapsed");

  if (collapsed) {
    dots.style.display = "none";
    more.classList.remove("collapsed");
    btn.textContent = "Sembunyikan";
  } else {
    dots.style.display = "inline";
    more.classList.add("collapsed");
    btn.textContent = "Baca Selengkapnya";
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

// ======= loadTrack (panggil ini saat memilih lagu)
function loadTrack(index) {
  currentTrack = index;
  const track = tracks[currentTrack];
  if (!track) return;

  isFading = false; // reset

  // set audio & text
  audio.src = track.src;
  title.textContent = track.title || "";
  artist.textContent = track.artist || "";

  // set image
  cover.src = track.cover || "";
  coverImg.src = track.cover || "";

  cover.src = track.cover || "";
  coverMain.src = track.cover || "";

  // set video jika ada
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

  // load lirik
  handleLyrics(track.src);

  // highlight playlist + autoplay
  highlightPopupPlaylist(); // khusus popup

  audio.play().catch((e) => console.warn("audio play:", e));
  playBtn.textContent = "ツ";

  // 🔥 Fade in saat lagu baru mulai
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
function updateSliderColor() {
  if (!seek.max || seek.max == 0) return;

  const value = (seek.value / seek.max) * 100;

  // Warna progress smooth
  seek.style.background = `
    linear-gradient(90deg, 
      #4facfe ${value}%, 
      #d0d0d0 ${value}%)
  `;
}

// Saat pertama kali masuk, pilih lagu random & auto play
window.addEventListener("load", () => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  loadTrack(randomIndex);
});

// ========================
// LIRIK SYNC FUNCTION
// ========================
let lrcData = []; // simpan lirik sinkron
let lastActiveIndex = -1; // track baris aktif terakhir
const lyricsEl = document.getElementById("lyrics");

// Fungsi utama: load lirik dari file .lrc
function handleLyrics(trackSrc) {
  const lrcFile = trackSrc.replace(".mp3", ".lrc");
  fetch(lrcFile)
    .then((res) => {
      if (!res.ok) throw new Error("File LRC tidak ditemukan: " + lrcFile);
      return res.text();
    })
    .then((text) => {
      lrcData = parseLRC(text);
      renderLyrics(lrcData);
    })
    .catch((err) => {
      console.warn("Tidak ada lirik:", err);
      lrcData = [];
      renderLyrics(lrcData);
    });
}

// Parse isi LRC jadi array {time, lyric}
function parseLRC(lrcText) {
  const lines = lrcText.split(/\r?\n/);
  const out = [];
  for (const raw of lines) {
    const match = raw.match(/\[(\d{2}):(\d{2})(?:\.(\d+))?\](.*)/);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = match[3] ? parseInt(match[3].padEnd(3, "0")) / 1000 : 0;
      const time = min * 60 + sec + ms;
      const lyric = match[4].trim();
      if (lyric) out.push({ time, lyric });
    }
  }
  return out;
}

// Render lirik ke HTML
function renderLyrics(data) {
  lyricsEl.innerHTML = "";
  data.forEach((line, i) => {
    const p = document.createElement("p");
    p.textContent = line.lyric;
    p.id = "lyric-" + i;
    lyricsEl.appendChild(p);
  });
  lastActiveIndex = -1; // reset highlight
}

// Update lirik saat lagu berjalan
function updateLyrics(currentTime) {
  if (!lrcData.length) return;
  let idx = lrcData.findIndex((line, i) => {
    const nextTime = lrcData[i + 1] ? lrcData[i + 1].time : Infinity;
    return currentTime >= line.time && currentTime < nextTime;
  });
  if (idx === -1) return;

  if (idx !== lastActiveIndex) {
    // hapus highlight lama
    if (lastActiveIndex !== -1) {
      const prev = document.getElementById("lyric-" + lastActiveIndex);
      if (prev) prev.classList.remove("active");
    }
    // tambahkan highlight baru
    const active = document.getElementById("lyric-" + idx);
    if (active) {
      active.classList.add("active");
      lyricsEl.scrollTo({
        top: active.offsetTop - lyricsEl.clientHeight / 0.27,
        behavior: "smooth",
      });
    }
    lastActiveIndex = idx;
  }
}

// Hubungkan dengan audio player
audio.addEventListener("timeupdate", () => {
  updateLyrics(audio.currentTime);
});

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

// ------ GUNAKAN AUDIOCTX YANG SAMA SELALU ------
const analyserCircle = audioCtx.createAnalyser();
analyserCircle.fftSize = 256;

const bufferCircle = analyserCircle.frequencyBinCount;
const dataCircle = new Uint8Array(bufferCircle);

// 1x saja: source audio untuk semua analis
source.connect(analyserCircle);
source.connect(analyser); // yang waveform
analyserCircle.connect(audioCtx.destination);

// ------ DRAW CIRCLE ------
function drawCircleSpectrum() {
  requestAnimationFrame(drawCircleSpectrum);

  analyserCircle.getByteTimeDomainData(dataCircle);

  const w = circleCanvas.clientWidth;
  const h = circleCanvas.clientHeight;

  const imgW = 110; // ukuran gambar kamu
  const imgH = 110;
  const cornerRadius = imgW * 0.2; // 20%
  const styles = getComputedStyle(document.documentElement);
  const mainColor = styles.getPropertyValue("--warna-utama").trim();
  const glowColor = styles.getPropertyValue("--warna-utama").trim();

  const expand = 55; // seberapa jauh spektrum menjauh dari gambar

  ctx2.clearRect(0, 0, w, h);
  ctx2.save();

  ctx2.translate(w / 2, h / 2);

  ctx2.beginPath();

  const total = dataCircle.length;

  for (let i = 0; i < total; i++) {
    const v = (dataCircle[i] - 128) / 128;
    const wave = v * expand;

    const t = i / total;

    // PATH keliling rounded-rectangle
    let x, y;

    if (t < 0.25) {
      // top edge
      const pct = t / 0.25;
      x = -imgW / 2 + cornerRadius + pct * (imgW - 2 * cornerRadius);
      y = -imgH / 2 - wave;
    } else if (t < 0.5) {
      // right edge
      const pct = (t - 0.25) / 0.25;
      x = imgW / 2 + wave;
      y = -imgH / 2 + cornerRadius + pct * (imgH - 2 * cornerRadius);
    } else if (t < 0.75) {
      // bottom edge
      const pct = (t - 0.5) / 0.25;
      x = imgW / 2 - cornerRadius - pct * (imgW - 2 * cornerRadius);
      y = imgH / 2 + wave;
    } else {
      // left edge
      const pct = (t - 0.75) / 0.25;
      x = -imgW / 2 - wave;
      y = imgH / 2 - cornerRadius - pct * (imgH - 2 * cornerRadius);
    }

    if (i === 0) ctx2.moveTo(x, y);
    else ctx2.lineTo(x, y);
  }

  ctx2.closePath();

  // neon
  ctx2.strokeStyle = mainColor;
  ctx2.lineWidth = 3;
  ctx2.shadowBlur = 20;
  ctx2.shadowColor = glowColor;

  ctx2.stroke();

  ctx2.restore();
}

audio.onplay = async () => {
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
  draw(); // menjalankan waveform
  drawCircleSpectrum(); // menjalankan spectrum lingkaran
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
