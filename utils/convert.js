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

    const command = `yt-dlp -x --audio-format wav -o "${TEMP_DIR}/%(id)s.%(ext)s" "${url}"`;

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
