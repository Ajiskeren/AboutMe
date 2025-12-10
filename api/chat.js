export default async function handler(req, res) {
  // 1. Cek Metode Request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, Sayang." });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Cek API Key
  if (!apiKey) {
    console.error("❌ ERROR: API Key hilang dari .env!");
    return res.status(500).json({ error: "API Key belum dipasang." });
  }

  try {
    // 👇 INI DIA UPDATE NYA: 'gemini-2.0-flash' 👇
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                // System Prompt: Biar AI-nya tau dia siapa
                {
                  text: "Kamu adalah 'Sarah', AI Assistant di terminal portofolio M. Aziz Jaya (Ajis). Ajis adalah programmer muda 15 tahun dari Lampung. Jawablah dengan gaya hacker yang ramah, singkat, dan teknis. Gunakan Bahasa Indonesia.",
                },
                { text: message },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 3. Debugging (Cek Terminal Laptop kalau ada error)
    if (!response.ok) {
      console.error("❌ Google Error Status:", response.status);
      console.error("❌ Pesan Error:", data.error?.message);

      // Tips buat Ajis kalau masih error 404
      if (response.status === 404) {
        return res.status(404).json({
          error:
            "Model tidak ditemukan. Coba ganti jadi gemini-2.0-flash-exp di kodenya.",
        });
      }
      return res
        .status(500)
        .json({ error: `Google Marah: ${data.error?.message}` });
    }

    // 4. Ambil Jawaban
    if (!data.candidates || data.candidates.length === 0) {
      return res
        .status(500)
        .json({ error: "AI diam seribu bahasa (No response)." });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
