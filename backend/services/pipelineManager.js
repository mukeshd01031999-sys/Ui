import { v4 as uuidv4 } from "uuid";

const pipelines = {};

// --- Agent Cards ---
const agents = {
  requirement: {
    id: "requirementAgent",
    name: "Requirement Understanding Agent",
    run: async (files) => {
      // TODO: replace with AI (Vertex AI / NLP)
      return [
        { reqId: "REQ-001", type: "functional", text: "System shall encrypt patient data" },
        { reqId: "REQ-002", type: "regulatory", text: "System shall log user login attempts" },
      ];
    },
  },

  testcase: {
    id: "testCaseAgent",
    name: "Test Case Generator",
    run: async (requirements) => {
      return requirements.map((r, i) => ({
        id: `TC-${i + 1}`,
        requirementId: r.reqId,
        description: `Verify: ${r.text}`,
        steps: ["Step 1", "Step 2"],
        expected: "Expected result",
        status: "Draft",
      }));
    },
  },

  compliance: {
    id: "complianceAgent",
    name: "Compliance Mapping Agent",
    run: async (testCases, regs) => {
      return testCases.map(tc => ({
        ...tc,
        compliance: regs.map(r => `${tc.id}->${r}`)
      }));
    },
  },

  integration: {
    id: "integrationAgent",
    name: "Integration Agent",
    run: async (testCases) => {
      // mock push to Jira/ADO
      return testCases.map(tc => ({
        ...tc,
        jiraId: "JIRA-" + Math.floor(Math.random() * 1000)
      }));
    },
  },

  reviewer: {
    id: "reviewerAgent",
    name: "Reviewer Agent",
    run: async (testCases) => {
      return testCases.map(tc => ({
        ...tc,
        review: tc.description.length < 20 ? "Too short" : "OK"
      }));
    },
  },
};

// --- Pipeline Orchestration ---
export function startPipeline(files, regs) {
  const id = uuidv4();
  pipelines[id] = { history: [], finished: false, results: {} };

  runPipeline(id, files, regs);
  return id;
}

export function getPipelineStatus(id) {
  return pipelines[id];
}

export function getPipelineTestCases(id) {
  return pipelines[id] ? { testCases: pipelines[id].results.testCases || [] } : null;
}

// --- Run pipeline with orchestration ---
async function runPipeline(id, files, regs) {
  const pipeline = pipelines[id];

  try {
    // Step 1: Requirement Agent
    pipeline.history.push({ step: agents.requirement.name, ts: new Date() });
    const structuredReqs = await agents.requirement.run(files);

    // Step 2 & 3 in parallel (Test Cases + Compliance Mapping)
    pipeline.history.push({ step: agents.testcase.name, ts: new Date() });
    pipeline.history.push({ step: agents.compliance.name, ts: new Date() });

    const [testCases, compliance] = await Promise.all([
      agents.testcase.run(structuredReqs),
      agents.compliance.run(structuredReqs, regs),
    ]);

    // merge compliance mapping into testCases
    const mergedTCs = testCases.map(tc => ({
      ...tc,
      compliance: compliance.find(c => c.id === tc.id)?.compliance || [],
    }));

    // Step 4: Integration
    pipeline.history.push({ step: agents.integration.name, ts: new Date() });
    const integrated = await agents.integration.run(mergedTCs);

    // Step 5 (Optional): Reviewer
    pipeline.history.push({ step: agents.reviewer.name, ts: new Date() });
    const reviewed = await agents.reviewer.run(integrated);

    pipeline.results.testCases = reviewed;
    pipeline.finished = true;
  } catch (err) {
    pipeline.history.push({ step: "Error", error: err.message, ts: new Date() });
    pipeline.finished = true;
  }
}
