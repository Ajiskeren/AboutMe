document.addEventListener("DOMContentLoaded", () => {
  const tombol = document.getElementById("gantiWarna");
  const picker = document.getElementById("colorPicker");

  // ------------------ Warna Klik Biasa ------------------
  const warnaList = [
    ["Red", "red"],
    ["Gold", "gold"],
    ["Purple", "#cc00ff"],
    ["Green", "#00ff00"],
    ["Blue", "#00ffff"],
    ["Pink", "pink"],
    ["Gray", "#adadad"],
  ];

  let index = 0;

  tombol.addEventListener("click", () => {
    const [nama, warna] = warnaList[index];

    document.documentElement.style.setProperty("--warna-utama", warna);
    tombol.textContent = nama;

    index = (index + 1) % warnaList.length;
  });

  // ------------------ Long Press Color Picker ------------------
  let pressTimer;
  let isLongPress = false;

  tombol.addEventListener("pointerdown", () => {
    isLongPress = false;

    pressTimer = setTimeout(() => {
      isLongPress = true;
      picker.click(); // buka color picker
    }, 600);
  });

  tombol.addEventListener("pointerup", () => {
    clearTimeout(pressTimer);
  });

  tombol.addEventListener("pointerleave", () => {
    clearTimeout(pressTimer);
  });

  // Saat warna dipilih
  picker.addEventListener("input", () => {
    const warna = picker.value;
    document.documentElement.style.setProperty("--warna-utama", warna);
    tombol.textContent = warna; // tampilkan HEX di tombol (opsional)
  });
});
