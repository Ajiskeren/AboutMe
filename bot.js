const chatToggleBtn = document.getElementById("chat-toggle");
const chatCloseBtn = document.getElementById("chat-close");
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");

let isChatOpen = false;

// Fungsi untuk Membuka Chat dengan Efek Glitch
function openChat() {
  if (isChatOpen) return;

  chatContainer.classList.remove("hidden", "glitch-out");
  // Trik untuk me-restart animasi CSS
  void chatContainer.offsetWidth;
  chatContainer.classList.add("glitch-in");

  isChatOpen = true;
  // Fokus ke input setelah animasi kira-kira selesai
  setTimeout(() => userInput.focus(), 700);
}

// Fungsi untuk Menutup Chat dengan Efek Glitch
function closeChat() {
  if (!isChatOpen) return;

  chatContainer.classList.remove("glitch-in");
  chatContainer.classList.add("glitch-out");

  // Tunggu animasi 'glitch-out' selesai (0.6s) baru benar-benar disembunyikan
  setTimeout(() => {
    chatContainer.classList.add("hidden");
    chatContainer.classList.remove("glitch-out");
    isChatOpen = false;
  }, 600); // Sesuaikan dengan durasi animasi CSS
}

// Event Listeners untuk tombol
chatToggleBtn.addEventListener("click", openChat);
chatCloseBtn.addEventListener("click", closeChat);

// Kirim pesan pakai Enter
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Tampilkan pesan user
  chatHistory.innerHTML += `<p class="user-msg">> ${message}</p>`;
  userInput.value = "";
  scrollToBottom();

  // Tampilkan loading retro
  const loadingId = "loading-" + Date.now();
  chatHistory.innerHTML += `<p id="${loadingId}" class="sys-msg" style="color:var(--retro-magenta)"><span id="loading-text">PROCESSING_REQUEST...///</span></p>`;
  scrollToBottom();

  try {
    // Panggil backend Vercel (kode backend sama seperti sebelumnya)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });

    const data = await response.json();

    // Hapus loading
    document.getElementById(loadingId).remove();

    // Tampilkan balasan bot dengan sedikit efek ketik/glitch di teksnya
    chatHistory.innerHTML += `<p class="bot-msg">> ${data.reply}_</p>`;
    scrollToBottom();
  } catch (error) {
    document.getElementById(loadingId).remove();
    chatHistory.innerHTML += `<p class="sys-msg" style="color:red">ERROR: CONNECTION_LOST. SIGNAL CORRUPTED.</p>`;
    scrollToBottom();
  }
}

function scrollToBottom() {
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
