const { v4: uuidv4 } = require('uuid');

// In-memory pipelines store (for prototype/demo)
const pipelines = new Map();

// createPipeline -> returns pipeline object and starts simulated progress
function createPipeline({ files = [], regs = [] }) {
  const id = uuidv4();
  const history = [
    { step: 'parsing', label: 'Parsing Requirements', progress: 0 },
    { step: 'generate', label: 'Generating Test Cases', progress: 0 },
    { step: 'mapping', label: 'Mapping Compliance', progress: 0 },
    { step: 'integration', label: 'Preparing Integration', progress: 0 }
  ];
  const pipeline = {
    id,
    files,
    regs,
    createdAt: new Date().toISOString(),
    history,
    finished: false,
    testCases: []
  };

  pipelines.set(id, pipeline);

  // start simulation (non-blocking)
  simulatePipeline(pipeline);

  return pipeline;
}

function getPipeline(id) {
  return pipelines.get(id) || null;
}

function getTestCases(id) {
  const p = pipelines.get(id);
  if (!p) return null;
  if (!p.finished) return null;
  return p.testCases;
}

// Very simple simulation of steps with incremental progress.
// At the end, we generate sample test cases.
function simulatePipeline(pipeline) {
  const steps = pipeline.history;
  let idx = 0;

  const runStep = () => {
    if (idx >= steps.length) {
      // finished
      pipeline.finished = true;
      pipeline.testCases = generateTestCasesFromPipeline(pipeline);
      return;
    }

    const step = steps[idx];
    let progress = 0;
    // increase using interval
    const timer = setInterval(() => {
      progress += Math.floor(10 + Math.random() * 25); // jumpy progress for demo
      step.progress = Math.min(100, progress);
      if (step.progress >= 100) {
        clearInterval(timer);
        idx += 1;
        // small pause between steps
        setTimeout(runStep, 250);
      }
    }, 350);
  };

  // start first step shortly after creation
  setTimeout(runStep, 200);
}

// Produces few sample test-cases referencing the pipeline's files/regs.
// Replace with real generator that calls Vertex AI / Agent Builder in Step 2.
function generateTestCasesFromPipeline(pipeline) {
  // For demo produce one test case per file + 1 generic test case
  const tcs = [];

  pipeline.files.forEach((f, i) => {
    tcs.push({
      id: `TC-${i + 1}`,
      reqId: `REQ-${Math.floor(Math.random() * 900 + 100)}`,
      description: `Auto-generated test for file ${f.originalname}`,
      testSteps: [
        'Open application',
        `Upload ${f.originalname} into requirements import`,
        'Validate parsed sections',
        'Run generated test case'
      ],
      expected: 'System validates requirement and creates pass/fail result',
      regs: pipeline.regs,
      status: 'Draft'
    });
  });

  // generic one
  tcs.push({
    id: `TC-${pipeline.files.length + 1}`,
    reqId: `REQ-${Math.floor(Math.random() * 900 + 100)}`,
    description: 'Data privacy check - ensure uploaded PHI is redacted in UI preview',
    testSteps: [
      'Upload requirements containing patient data placeholder',
      'Open preview',
      'Assert PHI is masked'
    ],
    expected: 'PHI not displayed in plain text',
    regs: pipeline.regs,
    status: 'Draft'
  });

  return tcs;
}

module.exports = {
  createPipeline,
  getPipeline,
  getTestCases
};
