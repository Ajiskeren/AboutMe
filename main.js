var typed = new Typed(".text", {
    strings: ["Axis", "Beginnner", "Rey Ace"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});


// Ambil tombol scroll-up dan section home
const scrollBtn = document.getElementById("scrollUpBtn");
const homeSection = document.getElementById("home");

// Observer untuk cek apakah section home terlihat
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Kalau home terlihat, sembunyikan tombol
      scrollBtn.classList.add("hidden");
    } else {
      // Kalau bukan home, tampilkan tombol
      scrollBtn.classList.remove("hidden");
    }
  });
}, { threshold: 0.6 }); // 60% home terlihat baru dianggap aktif

observer.observe(homeSection);


function readMore() {
  let dots = document.getElementById("dots");
  let moreText = document.getElementById("more");
  let btn = document.getElementById("btn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btn.innerHTML = "Baca Selengkapnya";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btn.innerHTML = "Sembunyikan";
    moreText.style.display = "inline";
  }
}

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

let x = 100;  // posisi awal X
let y = 100;  // posisi awal Y
let dx = 2;   // kecepatan arah X
let dy = 2;   // kecepatan arah Y
const speed = 2;

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
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playlistEl = document.getElementById("playlist");
const canvas = document.getElementById("spectrum");
const ctx = canvas.getContext("2d");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
let showOmori = false;
const customImage = "Omori-Normal.gif";

let currentTrack = 0;

// Daftar lagu
const tracks = [
  { title: "Fall in Love Alone", artist: "Stacey Ryan", src: "assets/lagu1.mp3", cover: "assets/cover1.jpg", video: "assets/cover1.mp4" },
  { title: "One The Way", artist: "AiNa The End", src: "assets/lagu2.mp3", cover: "assets/cover2.jpg" },
  { title: "Best Friends", artist: "Rex Orange", src: "assets/lagu3.mp3", cover: "assets/cover3.jpg" },
  { title: "Line Without hook", artist: "Rick Montogeomery", src: "assets/lagu4.mp3", cover: "assets/cover4.jpg" },
  { title: "Every summertime", artist: "NIKI", src: "assets/lagu5.mp3", cover: "assets/cover5.jpg" },
  { title: "Blue", artist: "Yung Kai", src: "assets/lagu6.mp3", cover: "assets/cover6.jpg" },
  { title: "Double Take", artist: "Druv", src: "assets/lagu7.mp3", cover: "assets/cover7.jpg" },
  { title: "Dandelions", artist: "Ruth B.", src: "assets/lagu8.mp3", cover: "assets/cover8.jpg" },
  { title: "Two Birds", artist: "Regina Spektor", src: "assets/lagu9.mp3", cover: "assets/cover9.jpg" },
  { title: "Devil Disguise", artist: "Marino", src: "assets/lagu10.mp3", cover: "assets/cover10.jpg" },
  { title: "December", artist: "Neck Deep", src: "assets/lagu11.mp3", cover: "assets/cover11.jpg" }
];

// fungsi ganti cover dengan transisi
function setCover(src) {
  coverMain.style.opacity = 0; // mulai fade out
  setTimeout(() => {
    coverMain.src = src;       // ganti gambar
    coverMain.style.opacity = 1; // fade in
  }, 500);
}

// fungsi toggle Omori <-> cover lagu
function toggleCover() {
  if (showOmori) {
    setCover(tracks[currentTrack].cover);
  } else {
    setCover(customImage);
  }
  showOmori = !showOmori;
}

// otomatis ganti tiap 5 detik
setInterval(toggleCover, 5000);

// bisa juga ganti manual kalau diklik
coverMain.addEventListener("click", toggleCover);

// Render playlist
tracks.forEach((track, i) => {
  const li = document.createElement("li");
  li.textContent = track.title + " - " + track.artist;
  li.addEventListener("click", () => loadTrack(i));
  playlistEl.appendChild(li);
});

// Load track
function loadTrack(index) {
  currentTrack = index;
  const track = tracks[currentTrack];
  audio.src = track.src;
  cover.src = track.cover;
  coverImg.src = track.cover;
  coverMain.src = track.cover;
  title.textContent = track.title;
  artist.textContent = track.artist;
  
  handleLyrics(track.src);

  highlightPlaylist();
  audio.play();
  playBtn.textContent = "ツ";
}

// Highlight playlist
function highlightPlaylist() {
  [...playlistEl.children].forEach((el, i) => {
    el.classList.toggle("active", i === currentTrack);
  });
}

// Play/Pause
playBtn.addEventListener("click", () => {
  if(audio.paused) {
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
});
seek.addEventListener("input", () => {
  audio.currentTime = seek.value;
});

// Saat pertama kali masuk, pilih lagu random & auto play
window.addEventListener("load", () => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  loadTrack(randomIndex);
});

// ========================
// LIRIK SYNC FUNCTION
// ========================
let lrcData = [];           // simpan lirik sinkron
let lastActiveIndex = -1;   // track baris aktif terakhir
const lyricsEl = document.getElementById("lyrics");

// Fungsi utama: load lirik dari file .lrc
function handleLyrics(trackSrc) {
  const lrcFile = trackSrc.replace(".mp3", ".lrc");
  fetch(lrcFile)
    .then(res => {
      if (!res.ok) throw new Error("File LRC tidak ditemukan: " + lrcFile);
      return res.text();
    })
    .then(text => {
      lrcData = parseLRC(text);
      renderLyrics(lrcData);
    })
    .catch(err => {
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
        behavior: "smooth"
      });
    }
    lastActiveIndex = idx;
  }
}

// Hubungkan dengan audio player
audio.addEventListener("timeupdate", () => {
  updateLyrics(audio.currentTime);
});

canvas.width = window.innerWidth;
  canvas.height = 200;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = 2048; // resolusi detail
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const barCount = 40; // bar besar
  const smoothed = new Float32Array(barCount);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const percent = i / barCount;

      // log scale index
      const index = Math.floor(Math.pow(percent, 2.0) * bufferLength); 
      let value = dataArray[index] || 0;

      // boost high frequency (kanan)
      const boost = 1 + percent * 2; // makin ke kanan makin naik
      value *= boost;

      // smoothing
      smoothed[i] = smoothed[i] * 0.85 + value * 0.15;

      // scaling
      let barHeight = smoothed[i] * 0.5;

      // biar gak hilang total
      if (barHeight < 10) barHeight = 10;

      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(
        i * barWidth,
        canvas.height - barHeight,
        barWidth - 4,
        barHeight
      );
    }
  }

  audio.onplay = () => {
    audioCtx.resume().then(draw);
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
openBtn.addEventListener("click", () => {
  sidebarS.classList.add("active");
  openBtn.style.display = "none"; // sembunyikan tombol luar
});

// Tutup sidebar
closeBtn.addEventListener("click", () => {
  sidebarS.classList.remove("active");
  openBtn.style.display = "block"; // munculkan lagi tombol luar
});

function updateTime() {
  const now = new Date();
  document.getElementById('hours').textContent = String(now.getHours()).padStart(2, '0');
  document.getElementById('minutes').textContent = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('seconds').textContent = String(now.getSeconds()).padStart(2, '0');
}
setInterval(updateTime, 1000);
updateTime();

async function getWeather(city) {
  const url = `https://wttr.in/${city}?format=%C+%t`;

  // Lebih banyak emoji
  const weatherIcons = {
    "sunny": "☀️🌞🔥",
    "clear": "🌞✨🌙",
    "cloud": "☁️🌥️🌤️",
    "partly": "⛅🌤️🌥️",
    "overcast": "🌥️☁️🌫️",
    "rain": "🌧️🌦️💧",
    "shower": "🌦️🌧️☔",
    "thunder": "⛈️⚡🌩️",
    "storm": "🌪️🌩️⛈️",
    "drizzle": "💧🌦️☁️",
    "mist": "🌫️🌁💨",
    "fog": "🌫️🌁👓",
    "snow": "❄️☃️⛄",
    "ice": "🧊❄️🥶",
    "wind": "💨🍃🌬️",
    "hot": "🔥🥵🌞",
    "cold": "🥶❄️🧊"
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

(function(){
  emailjs.init("vusiDp2YuSkT0-mcC"); // Public Key dari EmailJS
})();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();

    emailjs.sendForm("service_2fde5xv", "template_jj81348", this)
      .then(function(){
        alert("✅ Pesan berhasil dikirim!");
      }, function(error){
        alert("❌ Gagal: " + JSON.stringify(error));
      });
  });
});

function tampilkanTanggal() {
  const sekarang = new Date();

  const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const bulan = ["Januari","Februari","Maret","April","Mei","Juni",
                 "Juli","Agustus","September","Oktober","November","Desember"];

  const namaHari = hari[sekarang.getDay()];
  const tanggal = sekarang.getDate();
  const namaBulan = bulan[sekarang.getMonth()];
  const tahun = sekarang.getFullYear();

  document.getElementById("tanggal").textContent = 
    `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}

// Jalankan saat halaman dimuat
tampilkanTanggal();