# 🎵 MakeItWav – YouTube to WAV Converter API

MakeItWav is a simple, private-friendly backend service for converting YouTube videos to high-quality `.wav` audio files using `yt-dlp` and `ffmpeg`.

Ideal for music producers, DJs, or casual users who want to extract clean audio without unnecessary compression.

---

## ⚙️ Features

- 🎬 Accepts any valid **YouTube URL**
- 🔊 Converts audio stream to **WAV format**
- 💾 Stores file temporarily for download (auto-deletes after 5 minutes)
- 🧱 Powered by `Node.js`, `Express`, `yt-dlp`, and `ffmpeg`
- 🚀 Deployable to **Render** (Docker-based)

---

## 🌐 Try it live

You can try the frontend at:

👉 [https://makeitwav-vercel.app](https://makeitwav-vercel.app)

Enter a YouTube link and convert it to `.wav` directly in your browser.

---

## 🚀 API Endpoint

### `POST /convert`

**Request body (JSON):**
```json
{
  "url": "https://www.youtube.com/watch?v=EXAMPLE_ID"
}
