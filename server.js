const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { convertYouTubeToWav } = require('./utils/convert');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://makeitwav-backend.onrender.com'; // fix HTTPS

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
    const fileUrl = `${BASE_URL}/download/${encodeURIComponent(filename)}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed.' });
  }
});

// GET /download/:filename
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'temp', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
