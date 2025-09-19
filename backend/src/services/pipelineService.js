const { v4: uuidv4 } = require('uuid');

/**
 * pipelineService - starts a simulated multi-agent pipeline and updates in-memory stores.
 *
 * @param {Object} params
 * @param {Object} params.pipelines  - in-memory pipelines map (by ref)
 * @param {Object} params.testcases  - in-memory testcases map (by ref)
 */
module.exports = function createPipelineService({ pipelines, testcases }) {
  // pipeline steps with simulated durations (ms)
  const STEPS = [
    { id: 'parsing', label: 'Requirement Analyzer', duration: 800 },
    { id: 'generate', label: 'Test Case Generator', duration: 1600 },
    { id: 'mapping', label: 'Compliance Mapper', duration: 1000 },
    { id: 'integration', label: 'Integration Preparation', duration: 600 }
  ];

  function startPipeline({ files = [], regs = [], integrationTarget = 'none' }) {
    const pipelineId = uuidv4();
    const pipeline = {
      id: pipelineId,
      files,
      regs,
      integrationTarget,
      history: [],
      finished: false,
      startedAt: Date.now()
    };
    pipelines[pipelineId] = pipeline;

    // run simulated steps sequentially and update the pipeline history
    (async () => {
      for (const step of STEPS) {
        // add step to history with 0 progress
        const entry = { step: step.id, label: step.label, progress: 0, startedAt: Date.now() };
        pipeline.history.push(entry);

        // simulate progress increments
        const tickMs = 100;
        const ticks = Math.ceil(step.duration / tickMs);
        for (let t = 1; t <= ticks; t++) {
          await new Promise(r => setTimeout(r, tickMs));
          entry.progress = Math.min(100, Math.round((t / ticks) * 100));
          // pipeline.history updated by reference
        }

        // small pause between steps
        await new Promise(r => setTimeout(r, 200));
      }

      // Finished: generate demo testcases
      pipeline.finished = true;
      pipeline.finishedAt = Date.now();

      // Create demo test cases derived from files + regs
      const genCases = [];

      // basic seeded conversions
      const baseCases = [
        {
          reqId: `REQ-${Math.floor(Math.random() * 900) + 100}`,
          description: 'System shall validate medication dosage does not exceed safe threshold.',
          testCase: 'Enter dosage greater than allowed limit; verify system rejects and logs event.',
          expected: 'Error: Dosage exceeds limit; entry rejected; audit log created.',
          reg: regs[0] || 'IEC 62304',
          status: 'Draft'
        },
        {
          reqId: `REQ-${Math.floor(Math.random() * 900) + 100}`,
          description: 'Audit logs must be tamper-evident.',
          testCase: 'Create event, attempt modification, verify original preserved and tampering flagged.',
          expected: 'Tamper flag present; original retained.',
          reg: regs[1] || 'FDA 21 CFR',
          status: 'Draft'
        }
      ];

      // add one case per uploaded file (sample)
      files.forEach((f, idx) => {
        genCases.push({
          reqId: `REQ-F-${idx + 1}-${Math.floor(Math.random() * 900) + 100}`,
          description: `Parse requirement from file ${f.originalname}`,
          testCase: `Validate extracted requirement from ${f.originalname}`,
          expected: 'Requirement parsed & linked to generated test case',
          reg: regs[idx % (regs.length || 1)] || 'ISO 13485',
          status: 'Draft'
        });
      });

      // combine
      testcases[pipelineId] = [...baseCases, ...genCases];

    })();

    return pipelineId;
  }

  return {
    startPipeline
  };
};
