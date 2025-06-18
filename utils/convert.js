// utils/convert.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '..', 'temp');

function convertYouTubeToWav(url) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const outputPath = path.join(TEMP_DIR, `${id}.wav`);

      const command = `yt-dlp --cookies /app/cookies.txt -x --audio-format wav -o "${TEMP_DIR}/%(id)s.%(ext)s" "${url}"`;


    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }

      // Keressük meg a WAV fájlt
      setTimeout(() => {
        const files = fs.readdirSync(TEMP_DIR).filter(f => f.endsWith('.wav'));
        const newest = files.sort((a, b) => {
          return fs.statSync(path.join(TEMP_DIR, b)).mtime - fs.statSync(path.join(TEMP_DIR, a)).mtime;
        })[0];

        if (!newest) return reject('No output file found');

        // Törlés időzítése (5 perc után)
        setTimeout(() => {
          fs.unlink(path.join(TEMP_DIR, newest), () => {});
        }, 5 * 60 * 1000);

        resolve(newest);
      }, 2000); // kis késleltetés, hogy a fájl biztosan elkészüljön
    });
  });
}

module.exports = { convertYouTubeToWav };

// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { convertYouTubeToWav } = require('./utils/convert');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// POST /convert
app.post('/convert', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('https://www.youtube.com')) {
    return res.status(400).json({ error: 'Invalid YouTube URL.' });
  }

  try {
    const filename = await convertYouTubeToWav(url);
    const fileUrl = `${req.protocol}://${req.get('host')}/temp/${filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

