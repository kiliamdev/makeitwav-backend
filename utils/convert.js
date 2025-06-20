const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const TEMP_DIR = path.join(__dirname, '..', 'temp');

function convertYouTubeToWav(url) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();

    // Alapértelmezett fájlnév slugify-val → a letöltés után ezt fogjuk keresni
    const ytCommand = `yt-dlp --cookies /app/cookies.txt --print "%(title)s" --no-playlist "${url}"`;

    exec(ytCommand, (titleErr, rawTitle) => {
      if (titleErr || !rawTitle) {
        return reject('Failed to retrieve title');
      }

      const title = slugify(rawTitle.trim(), { strict: true });
      const outputPath = path.join(TEMP_DIR, `${title}.wav`);

      const command = `yt-dlp --cookies /app/cookies.txt -x --audio-format wav -o "${outputPath}" "${url}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr);
        }

        // Ellenőrizzük, hogy a fájl valóban létrejött
        setTimeout(() => {
          if (!fs.existsSync(outputPath)) {
            return reject('No output file found');
          }

          // Törlés időzítése 5 perc múlva
          setTimeout(() => {
            fs.unlink(outputPath, () => {});
          }, 5 * 60 * 1000);

          resolve(path.basename(outputPath));
        }, 2000);
      });
    });
  });
}

module.exports = { convertYouTubeToWav };
