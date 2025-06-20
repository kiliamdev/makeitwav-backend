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
app.use('/temp', express.static(path.join(__dirname, 'temp'))); // fallback statikus útvonal

// ✅ ÚJ: letöltő endpoint
app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'temp', fileName);
  const title = decodeURIComponent(fileName);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', `attachment; filename="${title}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});


// ✅ POST /convert
app.post('/convert', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('https://www.youtube.com')) {
    return res.status(400).json({ error: 'Invalid YouTube URL.' });
  }

  try {
    const filename = await convertYouTubeToWav(url);
    const fileUrl = `${req.protocol}://${req.get('host')}/download/${encodeURIComponent(filename)}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
