const express = require('express');
const { getPipeline, getTestCases } = require('../services/pipelineManager');

const router = express.Router();

// GET /api/pipeline/:id  -> pipeline status + history
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const p = getPipeline(id);
  if (!p) return res.status(404).json({ error: 'Pipeline not found' });
  return res.json({
    id: p.id,
    createdAt: p.createdAt,
    history: p.history,
    finished: p.finished
  });
});

// GET /api/pipeline/:id/testcases
router.get('/:id/testcases', (req, res) => {
  const id = req.params.id;
  const t = getTestCases(id);
  if (!t) return res.status(404).json({ error: 'Pipeline not found or not finished' });
  return res.json({ testCases: t });
});

module.exports = router;
