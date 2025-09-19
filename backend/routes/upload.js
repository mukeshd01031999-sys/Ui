const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPipeline } = require('../services/pipelineManager');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // prefix with timestamp to avoid collisions
    const fname = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, fname);
  }
});
const upload = multer({ storage });

// POST /api/upload
// fields:
//  - files[]  -> uploaded files
//  - regs     -> JSON-stringified array of selected regulations
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const rawFiles = req.files || [];
    const files = rawFiles.map(f => ({
      originalname: f.originalname,
      storedname: f.filename,
      path: `/uploads/${f.filename}`,
      size: f.size
    }));

    let regs = [];
    if (req.body.regs) {
      try { regs = JSON.parse(req.body.regs); } catch (e) { regs = [req.body.regs]; }
    }

    const pipeline = createPipeline({ files, regs });
    return res.json({ pipelineId: pipeline.id, message: 'Pipeline started' });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
