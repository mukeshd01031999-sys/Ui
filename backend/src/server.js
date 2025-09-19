require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

// ensure upload dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

// expose uploaded file static for debugging/testing (optional)
app.use('/uploads', express.static(UPLOAD_DIR));

// API routes (includes upload and pipeline endpoints)
app.use('/api', apiRoutes({ uploadDir: UPLOAD_DIR }));

app.get('/', (req, res) => {
  res.send({ ok: true, msg: 'Raja backend up. Use /api endpoints.' });
});

app.listen(PORT, () => {
  console.log(`Raja backend listening on http://localhost:${PORT}`);
});
