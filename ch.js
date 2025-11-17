const tombol = document.getElementById("gantiWarna");
let gelap = false;

tombol.addEventListener("click", () => {
  if (!gelap) {
    document.documentElement.style.setProperty("--warna-utama", "#ce4dd5");
    tombol.textContent = "Purple";
    gelap = true;
  } else {
    document.documentElement.style.setProperty("--warna-utama", "gold");
    tombol.textContent = "Gold";
    gelap = false;
  }
});
