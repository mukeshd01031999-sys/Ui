require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const uploadRouter = require('./routes/upload');
const pipelineRouter = require('./routes/pipeline');

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');

// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// serve uploaded files statically (optional)
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api/upload', uploadRouter);
app.use('/api/pipeline', pipelineRouter);

app.get('/', (req, res) => res.send('AI Test Case Copilot Backend - Step 1'));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
