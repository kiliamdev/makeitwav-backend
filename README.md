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

## 🛠️ Requirements

- `yt-dlp` (automatically installed in Docker)
- `ffmpeg` (automatically installed in Docker)
- Node.js v18+ (for local use)

---

## 🚀 API Endpoint

### `POST /convert`

**Request body (JSON):**

```json
{
  "url": "https://www.youtube.com/watch?v=EXAMPLE_ID"
}
