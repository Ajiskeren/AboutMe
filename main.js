var typed = new Typed(".text", {
    strings: ["Axis", "Frontend Developer", "Web Developer"],
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
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playlistEl = document.getElementById("playlist");

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
  { title: "Two Birds", artist: "Regina Spektor", src: "assets/lagu9.mp3", cover: "assets/cover9.jpg" }
];

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
  title.textContent = track.title;
  artist.textContent = track.artist;
  
  handleLyrics(track.src);

  highlightPlaylist();
  audio.play();
  playBtn.textContent = "⏸";
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
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
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
        top: active.offsetTop - lyricsEl.clientHeight / 0.32,
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