import React, { useState } from "react";

// Single-file React + Tailwind mockup for "AI Test Case Copilot for Healthcare".
// - Tailwind CSS assumed present in host project.
// - This is a presentational mockup with interactive states and sample data.

export default function App() {
  const [route, setRoute] = useState("dashboard");
  const [files, setFiles] = useState([]);
  const [selectedRegs, setSelectedRegs] = useState(["FDA 21 CFR Part 11", "IEC 62304"]);
  const [integrationTarget, setIntegrationTarget] = useState("Jira");
  const [processing, setProcessing] = useState(false);
  const [agentStatus, setAgentStatus] = useState({
    parser: "idle",
    generator: "idle",
    mapper: "idle",
    integrator: "idle",
  });

  const [requirements] = useState(sampleRequirements);
  const [testCases, setTestCases] = useState(sampleTestCases);
  const [selectedReq, setSelectedReq] = useState(requirements[0].id);

  function handleFileUpload(e) {
    const incoming = Array.from(e.target.files).map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name }));
    setFiles((s) => [...s, ...incoming]);
  }

  function toggleReg(r) {
    setSelectedRegs((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  }

  function startGeneration() {
    setProcessing(true);
    setAgentStatus({ parser: "running", generator: "queued", mapper: "queued", integrator: "queued" });

    // Simulated orchestration with timeouts
    setTimeout(() => setAgentStatus((s) => ({ ...s, parser: "done", generator: "running" })), 1000);
    setTimeout(() => setAgentStatus((s) => ({ ...s, generator: "done", mapper: "running" })), 2600);
    setTimeout(() => setAgentStatus((s) => ({ ...s, mapper: "done", integrator: "running" })), 3800);
    setTimeout(() => {
      setAgentStatus({ parser: "done", generator: "done", mapper: "done", integrator: "done" });
      setProcessing(false);
    }, 5200);
  }

  function updateTestStep(tcId, newSteps) {
    setTestCases((prev) => prev.map((t) => (t.id === tcId ? { ...t, steps: newSteps } : t)));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-72 border-r bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">AI</div>
            <div>
              <h1 className="text-lg font-semibold">AI Test Case Copilot</h1>
              <p className="text-xs text-gray-500">Healthcare QA · Compliance-first</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem label="Dashboard" active={route === "dashboard"} onClick={() => setRoute("dashboard")} />
            <NavItem label="Upload Requirements" active={route === "upload"} onClick={() => setRoute("upload")} />
            <NavItem label="Generated Test Cases" active={route === "review"} onClick={() => setRoute("review")} />
            <NavItem label="Compliance Dashboard" active={route === "compliance"} onClick={() => setRoute("compliance")} />
            <NavItem label="Integrations" active={route === "integrations"} onClick={() => setRoute("integrations")} />
            <NavItem label="Settings" active={route === "settings"} onClick={() => setRoute("settings")} />
          </nav>

          <div className="mt-6 text-xs text-gray-500">
            <p className="font-medium">Agents Ready</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center gap-2"><Dot /> Requirement Analyzer</li>
              <li className="flex items-center gap-2"><Dot /> Test Generator</li>
              <li className="flex items-center gap-2"><Dot /> Compliance Mapper</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {route === "dashboard" && (
            <Dashboard
              files={files}
              setRoute={setRoute}
              agentStatus={agentStatus}
              processing={processing}
              setFiles={setFiles}
            />
          )}

          {route === "upload" && (
            <UploadPage
              files={files}
              onUpload={handleFileUpload}
              selectedRegs={selectedRegs}
              toggleReg={toggleReg}
              integrationTarget={integrationTarget}
              setIntegrationTarget={setIntegrationTarget}
              startGeneration={startGeneration}
              processing={processing}
              agentStatus={agentStatus}
            />
          )}

          {route === "review" && (
            <ReviewPage
              requirements={requirements}
              testCases={testCases}
              selectedReq={selectedReq}
              setSelectedReq={setSelectedReq}
              updateTestStep={updateTestStep}
            />
          )}

          {route === "compliance" && (
            <CompliancePage requirements={requirements} testCases={testCases} />
          )}

          {route === "integrations" && <IntegrationsPage integrationTarget={integrationTarget} setIntegrationTarget={setIntegrationTarget} />}

          {route === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 ${
        active ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
      }`}>
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

function Dot() {
  return <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />;
}

function Dashboard({ files, setRoute, agentStatus, processing }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome back — Healthcare QA</h2>
          <p className="text-sm text-gray-600 mt-1">Create compliant test cases from requirements faster with AI.</p>
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={() => setRoute("upload")} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">Upload Requirements</button>
          <button onClick={() => setRoute("review")} className="px-4 py-2 border rounded-md">Review Test Cases</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <InfoCard title="Requirements Parsed" value={files.length} />
        <InfoCard title="Test Cases Generated" value={processing ? "Processing…" : "340"} />
        <InfoCard title="Compliance Coverage" value="98%" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Agents Orchestration</h3>
        <div className="mt-3 grid grid-cols-4 gap-3">
          <AgentCard name="Parser" status={agentStatus.parser} />
          <AgentCard name="Generator" status={agentStatus.generator} />
          <AgentCard name="Mapper" status={agentStatus.mapper} />
          <AgentCard name="Integrator" status={agentStatus.integrator} />
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h4 className="font-medium">Quick Actions</h4>
        <div className="mt-4 flex gap-3">
          <button onClick={() => setRoute("upload")} className="px-4 py-2 bg-sky-500 text-white rounded-md">Upload Files</button>
          <button onClick={() => setRoute("compliance")} className="px-4 py-2 border rounded-md">View Traceability</button>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ name, status }) {
  const statusMap = {
    idle: { label: "Idle", color: "bg-gray-200 text-gray-700" },
    running: { label: "Running", color: "bg-amber-100 text-amber-700" },
    queued: { label: "Queued", color: "bg-blue-50 text-blue-700" },
    done: { label: "Done", color: "bg-green-100 text-green-700" },
  };
  const s = statusMap[status] || statusMap.idle;
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-gray-500">{status === "running" ? "Processing…" : "Ready"}</div>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function UploadPage({ files, onUpload, selectedRegs, toggleReg, integrationTarget, setIntegrationTarget, startGeneration, processing, agentStatus }) {
  const regsList = ["FDA 21 CFR Part 11", "IEC 62304", "ISO 13485", "ISO 9001", "GDPR (Data) "];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upload Requirements</h2>
        <div className="text-sm text-gray-500">Accepted: PDF, DOCX, XML, MD</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block border-2 border-dashed border-gray-200 rounded p-6 text-center cursor-pointer">
          <input type="file" multiple onChange={onUpload} className="hidden" />
          <div className="text-sm text-gray-700">Drag & drop files here or click to browse</div>
        </label>

        <div className="mt-4">
          <div className="text-sm text-gray-600">Uploaded Files</div>
          <div className="mt-2 space-y-2">
            {files.length === 0 && <div className="text-xs text-gray-400">No files uploaded yet.</div>}
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 text-xs">DOC</div>
                  <div className="text-sm">{f.name}</div>
                </div>
                <div className="text-xs text-gray-500">Parsed</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium">Select Regulations</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {regsList.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleReg(r)}
                  className={`text-sm border px-3 py-2 rounded ${selectedRegs.includes(r) ? "bg-indigo-50 border-indigo-200" : "bg-white"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Integration Target</div>
            <select value={integrationTarget} onChange={(e) => setIntegrationTarget(e.target.value)} className="mt-3 w-full border rounded px-3 py-2">
              <option>Jira</option>
              <option>Azure DevOps</option>
              <option>Polarion</option>
              <option>CSV / Excel</option>
            </select>

            <div className="mt-4 text-xs text-gray-500">Configure your integration credentials in the Integrations page.</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={startGeneration} disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">Generate Test Cases</button>
          <button onClick={() => {}} className="px-4 py-2 border rounded-md">Save as Draft</button>

          <div className="ml-auto text-xs text-gray-500">Orchestrator Status:</div>
          <div className="ml-2 flex items-center gap-2">
            <MiniAgentBadge name="Parser" status={agentStatus.parser} />
            <MiniAgentBadge name="Generator" status={agentStatus.generator} />
            <MiniAgentBadge name="Mapper" status={agentStatus.mapper} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniAgentBadge({ name, status }) {
  const map = { idle: "gray", running: "amber", queued: "blue", done: "green" };
  const color = map[status] || "gray";
  return (
    <div className={`px-2 py-1 rounded text-xs bg-${color}-50 text-${color}-700`}>{name}</div>
  );
}

function ReviewPage({ requirements, testCases, selectedReq, setSelectedReq, updateTestStep }) {
  const filtered = testCases.filter((t) => t.reqId === selectedReq);
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 bg-white rounded-lg shadow p-4">
        <h3 className="font-medium">Requirements</h3>
        <div className="mt-3 space-y-2">
          {requirements.map((r) => (
            <button key={r.id} onClick={() => setSelectedReq(r.id)} className={`w-full text-left px-3 py-2 rounded ${selectedReq === r.id ? "bg-indigo-50" : "hover:bg-gray-100"}`}>
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-xs text-gray-500 mt-1">{r.short}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-3 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Generated Test Cases</h3>
            <p className="text-xs text-gray-500">Editable — autosaves locally</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded text-sm">Approve Selected</button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Push to ALM</button>
          </div>
        </div>

        <div className="mt-4">
          <table className="w-full table-fixed text-sm">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="w-1/6 py-2">TC ID</th>
                <th className="w-2/6 py-2">Title</th>
                <th className="w-2/6 py-2">Steps</th>
                <th className="w-1/6 py-2">Expected</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((tc) => (
                <tr key={tc.id} className="border-t">
                  <td className="py-3 font-medium">{tc.id}</td>
                  <td className="py-3">{tc.title}</td>
                  <td className="py-3">
                    <EditableSteps steps={tc.steps} onSave={(s) => updateTestStep(tc.id, s)} />
                  </td>
                  <td className="py-3">{tc.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-500">Ambiguous cases are flagged by the Reviewer Agent and highlighted in yellow.</div>
      </div>
    </div>
  );
}

function EditableSteps({ steps, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(steps.join("\n"));

  function save() {
    const arr = value.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave(arr);
    setEditing(false);
  }

  return (
    <div>
      {!editing && (
        <div className="text-sm">
          <ol className="list-decimal ml-5">
            {steps.map((s, i) => (
              <li key={i} className="py-0.5">{s}</li>
            ))}
          </ol>
          <div className="mt-2">
            <button onClick={() => setEditing(true)} className="px-2 py-1 text-xs border rounded">Edit</button>
          </div>
        </div>
      )}

      {editing && (
        <div>
          <textarea value={value} onChange={(e) => setValue(e.target.value)} className="w-full border rounded p-2 text-sm" rows={6} />
          <div className="mt-2 flex gap-2">
            <button onClick={save} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CompliancePage({ requirements, testCases }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compliance & Traceability</h2>
        <div className="text-sm text-gray-500">Download audit-ready report (PDF / Excel)</div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Coverage</h4>
          <div className="mt-3 text-2xl font-semibold">98%</div>
          <div className="text-xs text-gray-500 mt-1">Requirements covered by >=1 test case</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Gaps</h4>
          <div className="mt-3 text-2xl font-semibold text-red-600">2</div>
          <div className="text-xs text-gray-500 mt-1">Unmapped regulatory hooks</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Last Run</h4>
          <div className="mt-3 text-2xl font-semibold">Sep 12, 2025</div>
          <div className="text-xs text-gray-500 mt-1">Recent automated generation</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h4 className="font-medium mb-3">Traceability Matrix</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="w-1/6 py-2">Requirement</th>
                <th className="w-1/6 py-2">Test Case</th>
                <th className="w-1/6 py-2">Regulation</th>
                <th className="w-1/6 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{t.reqId}</td>
                  <td className="py-2">{t.id}</td>
                  <td className="py-2">{t.regs.join(", ")}</td>
                  <td className="py-2">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IntegrationsPage({ integrationTarget, setIntegrationTarget }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Integrations</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">ALM Targets</h4>
          <div className="mt-3 space-y-3">
            <IntegrationCard name="Jira" status="synced" />
            <IntegrationCard name="Azure DevOps" status="partial" />
            <IntegrationCard name="Polarion" status="error" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Export</h4>
          <div className="mt-3 space-y-3">
            <button className="w-full px-3 py-2 border rounded">Export to CSV / Excel</button>
            <button className="w-full px-3 py-2 border rounded">Download Audit PDF</button>
            <button className="w-full px-3 py-2 border rounded">Open Sync Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ name, status }) {
  const map = { synced: "bg-green-50 text-green-700", partial: "bg-amber-50 text-amber-700", error: "bg-red-50 text-red-700" };
  return (
    <div className="flex items-center justify-between border rounded p-3">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-500">Last sync: Sep 15, 2025</div>
      </div>
      <div className={`px-3 py-1 rounded text-sm ${map[status]}`}>{status}</div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Security & Access</h4>
          <div className="mt-3 text-sm text-gray-500">Configure SSO, roles, and permissions.</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">Agent Configuration</h4>
          <div className="mt-3 text-sm text-gray-500">Tune model temperature, select domain models (Gemini / Vertex AI).</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Sample data ----------

const sampleRequirements = [
  { id: "REQ-001", title: "Medication dosage validation", short: "Ensure dosage limits are enforced" },
  { id: "REQ-002", title: "User authentication", short: "SSO and role-based access" },
  { id: "REQ-003", title: "Audit logging", short: "Track user operations for compliance" },
];

const sampleTestCases = [
  {
    id: "TC-001",
    reqId: "REQ-001",
    title: "Reject dosage above safe threshold",
    steps: ["Open prescription form", "Enter dosage 1000mg", "Submit"],
    expected: "System shows error and prevents submission",
    regs: ["IEC 62304"],
    status: "Draft",
  },
  {
    id: "TC-002",
    reqId: "REQ-001",
    title: "Allow dosage within safe range",
    steps: ["Open prescription form", "Enter dosage 50mg", "Submit"],
    expected: "System accepts and saves prescription",
    regs: ["FDA 21 CFR Part 11"],
    status: "Approved",
  },
  {
    id: "TC-003",
    reqId: "REQ-002",
    title: "SSO login",
    steps: ["Navigate to login", "Click SSO button", "Authenticate via provider"],
    expected: "User is logged in with correct role",
    regs: ["ISO 27001"],
    status: "Draft",
  },
];

