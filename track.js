const tracks = [
  {
    title: "Fall in Love Alone",
    // Arti: Berjudi dengan perasaan (Risiko vs Penyesalan)
    emoji: "🎰",
    color: "#ff6b81", // Pink Cemas
    artist: "Stacey Ryan",
    src: "assets/lagu1.mp3",
    cover: "assets/cover1.jpg",
    videoCover: "assets/video1.mp4",
  },
  {
    title: "One The Way",
    // Arti: Ketahanan berjalan meski tanpa arah pasti
    emoji: "🧭",
    color: "#e17055", // Jingga Jalanan
    artist: "AiNa The End",
    src: "assets/lagu2.mp3",
    cover: "assets/cover2.jpg",
    videoCover: "assets/video2.mp4",
  },
  {
    title: "Best Friends",
    // Arti: Ikatan platonik yang terlalu dalam hingga takut rusak
    emoji: "🤝",
    color: "#f39c12", // Kuning Hangat
    artist: "Rex Orange",
    src: "assets/lagu3.mp3",
    cover: "assets/cover3.jpg",
  },
  {
    title: "Line Without a Hook",
    // Arti: Merasa hancur dan butuh pasangan sebagai 'jangkar'
    emoji: "⚓",
    color: "#00cec9", // Teal Lautan
    artist: "Rick Montogeomery",
    src: "assets/lagu4.mp3",
    cover: "assets/cover4.jpg",
    videoCover: "assets/video4.mp4",
  },
  {
    title: "Every Summertime",
    // Arti: Kenangan yang diputar ulang seperti film
    emoji: "🎞️",
    color: "#fab1a0", // Peach Senja
    artist: "NIKI",
    src: "assets/lagu5.mp3",
    cover: "assets/cover5.jpg",
    videoCover: "assets/video5.mp4",
  },
  {
    title: "Blue",
    // Arti: Tenggelam dalam kedalaman cinta (Damai)
    emoji: "🌊",
    color: "#0984e3", // Biru Laut Dalam
    artist: "Yung Kai",
    src: "assets/lagu6.mp3",
    cover: "assets/cover6.jpg",
    videoCover: "assets/video6.mp4",
  },
  {
    title: "Double Take",
    // Arti: Terhipnotis perubahan perasaan dari teman ke cinta
    emoji: "😵‍💫",
    color: "#a29bfe", // Lavender Mimpi
    artist: "Druv",
    src: "assets/lagu7.mp3",
    cover: "assets/cover7.jpg",
    videoCover: "assets/video7.mp4",
  },
  {
    title: "Dandelions",
    // Arti: Meniup harapan ke semesta (Faith)
    emoji: "🌬️",
    color: "#fdcb6e", // Kuning Harapan
    artist: "Ruth B.",
    src: "assets/lagu8.mp3",
    cover: "assets/cover8.jpg",
    videoCover: "assets/video8.mp4",
  },
  {
    title: "Two Birds",
    // Arti: Pilihan hidup yang berbeda (Satu terbang, satu diam)
    emoji: "⚖️",
    color: "#b2bec3", // Abu-abu Langit
    artist: "Regina Spektor",
    src: "assets/lagu9.mp3",
    cover: "assets/cover9.jpg",
  },
  {
    title: "Devil Disguise",
    // Arti: Topeng kepalsuan yang indah
    emoji: "🎭",
    color: "#6c5ce7", // Ungu Misterius
    artist: "Marino",
    src: "assets/lagu10.mp3",
    cover: "assets/cover10.jpg",
    videoCover: "assets/video10.mp4",
  },
  {
    title: "Cuma Teman",
    // Arti: Terjebak dalam kebisuan (Friendzone)
    emoji: "😶",   
    color: "#636e72", // Abu Gelap
    artist: "Ryo",
    src: "assets/lagu12.mp3",
    cover: "assets/Ryo.jpeg",
    videoCover: "assets/video11.mp4",
  },
  {
    title: "December",
    // Arti: Dingin, kesepian, dan isolasi diri
    emoji: "❄️",
    color: "#74b9ff", // Biru Es
    artist: "Neck Deep",
    src: "assets/lagu11.mp3",
    cover: "assets/cover11.jpg",
    videoCover: "assets/video12.mp4",
  },
  {
    title: "Masa Lalu",
    // Arti: Waktu yang membeku dalam ingatan
    emoji: "⏳",
    color: "#d35400", // Coklat Sepia
    artist: "Chaeroel",
    src: "assets/lagu13.mp3",
    cover: "assets/cover13.jpeg",
    videoCover: "assets/video13.mp4",
  },
  {
    title: "Always",
    // Arti: Janji kesetiaan abadi (Terkunci)
    emoji: "🔒",
    color: "#2c3e50", // Midnight Blue
    artist: "Daniel Chaesar",
    src: "assets/lagu14.mp3",
    cover: "assets/cover14.jpeg",
    videoCover: "assets/video14.mp4",
  },
  {
    title: "Glue Song",
    // Arti: Terikat erat, rasa aman dan nyaman
    emoji: "🧶",
    color: "#fd79a8", // Pink Manis
    artist: "Beabadoobee",
    src: "assets/lagu15.mp3",
    cover: "assets/cover15.jpeg",
  },
  {
    title: "Lowkey",
    // Arti: Hubungan rahasia di balik layar
    emoji: "🕶️",
    color: "#2d3436", // Hitam Elegan
    artist: "NIKI",
    src: "assets/lagu16.mp3",
    cover: "assets/cover16.jpeg",
  },
  {
    title: "Wildflower",
    // Arti: Tumbuh di atas luka masa lalu (Rapuh tapi indah)
    emoji: "🥀",
    color: "#badc58", // Hijau Pucat
    artist: "Billie Eilish",
    src: "assets/lagu17.mp3",
    cover: "assets/cover17.jpeg",
  },
  {
    title: "Shade",
    // Arti: Berlindung dari dunia luar
    emoji: "☂️",
    color: "#636e72", // Abu Teduh
    artist: "Rex Orange",
    src: "assets/lagu18.mp3",
    cover: "assets/cover18.jpeg",
  },
  {
    title: "About You",
    // Arti: Pikiran yang penuh dengan satu orang (Melamun)
    emoji: "💭",
    color: "#e84393", // Pink Obsesi
    artist: "RYO",
    src: "assets/lagu19.mp3",
    cover: "assets/cover19.jpeg",
    videoCover: "assets/video19.mp4",
  },
];
