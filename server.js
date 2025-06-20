const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { convertYouTubeToWav } = require('./utils/convert');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // hogy a req.protocol helyesen https legyen Render-en
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
    const fileUrl = `https://makeitwav-backend.onrender.com/temp/${filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
