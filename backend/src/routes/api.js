const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const createPipelineService = require('../services/pipelineService');

module.exports = ({ uploadDir }) => {
  const router = express.Router();

  // multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const id = uuidv4();
      const safe = file.originalname.replace(/[^a-z0-9_.-]/gi, '_');
      cb(null, `${id}_${safe}`);
    }
  });

  const upload = multer({ storage });

  // in-memory store for demo
  const pipelines = {};   // pipelineId -> { id, history: [{step,label,progress}], finished }
  const testcases = {};   // pipelineId -> [ test-case objects ]
  const pipelineService = createPipelineService({ pipelines, testcases });

  /**
   * POST /api/upload
   * fields:
   * - files (multipart)
   * - regs (JSON string or comma-separated list)
   * - integrationTarget (string)
   */
  router.post('/upload', upload.array('files', 8), (req, res) => {
    try {
      const files = (req.files || []).map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        path: f.path,
        size: f.size
      }));

      // regs can be string or JSON
      let regs = req.body.regs || '';
      try {
        regs = JSON.parse(regs);
      } catch (e) {
        // if not JSON, split by comma
        if (typeof regs === 'string') {
          regs = regs.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      const integrationTarget = req.body.integrationTarget || 'none';

      const pipelineId = pipelineService.startPipeline({ files, regs, integrationTarget });

      res.json({ ok: true, pipelineId, message: 'Pipeline started' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: 'Upload failed' });
    }
  });

  // GET pipeline status
  router.get('/pipeline/:id', (req, res) => {
    const id = req.params.id;
    const p = pipelines[id];
    if (!p) return res.status(404).json({ ok: false, error: 'pipeline not found' });
    res.json({ ok: true, pipeline: p });
  });

  // GET generated testcases for pipeline
  router.get('/testcases/:id', (req, res) => {
    const id = req.params.id;
    const tc = testcases[id];
    if (!tc) return res.status(404).json({ ok: false, error: 'testcases not found or pipeline not finished' });
    res.json({ ok: true, testcases: tc });
  });

  // Integration sync (demo)
  router.post('/integrations/:name/sync', (req, res) => {
    const name = req.params.name;
    // demo: just accept pipelineId and return success after short delay
    const { pipelineId } = req.body;
    setTimeout(() => {
      return res.json({ ok: true, message: `Synced pipeline ${pipelineId} to ${name} (demo)` });
    }, 600);
  });

  return router;
};
