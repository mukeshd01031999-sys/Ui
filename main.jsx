/*
AI Test Case Copilot - Single-file React + Tailwind mockup

Instructions:
- This is a single-file React component (default export) that renders a multi-page mockup UI.
- Tech / libs assumed installed in the project:
  - React 18+
  - Tailwind CSS configured
  - framer-motion
  - axios
  - recharts
  - lucide-react (icons)
  - shadcn/ui (optional; we use minimal imports for card/Button)

How to run:
1. Create a React app (Vite or CRA) and add Tailwind CSS per official guide.
2. Install: npm i framer-motion axios recharts lucide-react
3. Drop this file as src/App.jsx and import into index.jsx.
4. Start dev server.

Notes:
- Backend integration points are mocked with setTimeout to simulate multi-agent orchestration.
- Replace mock functions (simulatePipeline) with real API calls to Vertex AI / Agent Builder / backend endpoints.

*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, UploadCloud, Settings, CheckCircle, AlertTriangle, Database } from 'lucide-react';

// Minimal Shadcn-like Button (replace with import if available)
const Button = ({ children, className = '', ...props }) => (
  <button className={`px-4 py-2 rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 ${className}`} {...props}>
    {children}
  </button>
);

const Sidebar = ({ active, setActive }) => {
  const items = [
    { key: 'home', label: 'Home', icon: <FileText size={18} /> },
    { key: 'upload', label: 'Upload Requirements', icon: <UploadCloud size={18} /> },
    { key: 'review', label: 'Generated Test Cases', icon: <CheckCircle size={18} /> },
    { key: 'compliance', label: 'Compliance Dashboard', icon: <AlertTriangle size={18} /> },
    { key: 'integration', label: 'Integrations', icon: <Database size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];
  return (
    <div className="w-72 bg-white h-full border-r px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800">AI Test Case Copilot</h2>
        <p className="text-sm text-slate-500">Healthcare QA — compliance-first</p>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <button key={i.key} onClick={() => setActive(i.key)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 ${active === i.key ? 'bg-slate-100 font-medium' : 'text-slate-700'}`}>
            {i.icon}
            <span>{i.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const Header = ({ onConnect }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b bg-white">
      <div>
        <h3 className="text-xl font-semibold">AI Test Case Copilot</h3>
        <p className="text-sm text-slate-500">Generate compliant test cases from requirements — instant traceability.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={onConnect}>Connect ALM</Button>
        <div className="text-sm text-slate-600">Signed in as <strong>Mukesh</strong></div>
      </div>
    </div>
  );
};

// Mock pipeline simulator to show agent orchestration progress
const simulatePipeline = (onUpdate) => {
  // sequence of statuses
  const steps = [
    { id: 'parsing', label: 'Parsing Requirements', duration: 800 },
    { id: 'generate', label: 'Generating Test Cases', duration: 1600 },
    { id: 'mapping', label: 'Mapping Compliance', duration: 1000 },
    { id: 'integration', label: 'Preparing Integration', duration: 600 }
  ];
  let i = 0;
  const runNext = () => {
    if (i >= steps.length) {
      onUpdate({ finished: true });
      return;
    }
    const s = steps[i];
    onUpdate({ step: s.id, label: s.label, progress: 0 });
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / s.duration);
      onUpdate({ step: s.id, label: s.label, progress: Math.round(p * 100) });
      if (p >= 1) {
        clearInterval(timer);
        i += 1;
        setTimeout(runNext, 300);
      }
    }, 120);
  };
  runNext();
};

const Home = ({ setActive }) => (
  <div className="p-6">
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Quick Start</h4>
        <p className="text-sm text-slate-600 mb-4">Drag & drop requirement documents, choose standards, and generate traceable test cases automatically.</p>
        <div className="flex gap-3">
          <Button onClick={() => setActive('upload')}>Upload Requirements</Button>
          <Button onClick={() => setActive('review')}>View Generated Test Cases</Button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">System Status</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Agents Ready</div>
              <div className="text-base font-medium">Requirement Analyzer, Test Generator, Compliance Mapper</div>
            </div>
            <div className="text-green-600 font-semibold">● Online</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Integrations</div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Jira</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Azure DevOps</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Polarion</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-3 gap-6">
      <div className="col-span-3 bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Recent Activity</h4>
        <div className="text-sm text-slate-600">No recent pipelines. Upload a file to start a new pipeline.</div>
      </div>
    </div>
  </div>
);

const UploadPage = ({ onStart }) => {
  const [files, setFiles] = useState([]);
  const [selectedRegs, setSelectedRegs] = useState(['FDA', 'IEC 62304']);
  const regs = ['FDA (21 CFR Part 11)', 'IEC 62304', 'ISO 13485', 'ISO 9001', 'ISO 27001', 'GDPR'];

  const addFiles = (e) => {
    const list = Array.from(e.target.files).map(f => ({ name: f.name, size: f.size }));
    setFiles(prev => [...prev, ...list]);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Upload Requirements</h4>
        <p className="text-sm text-slate-600 mb-4">Supported: PDF, DOCX, XML, Markdown.</p>
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
          <UploadCloud className="mx-auto" size={40} />
          <p className="mt-2">Drag & drop files here, or</p>
          <label className="mt-3 inline-block">
            <input type="file" multiple onChange={addFiles} className="hidden" />
            <Button>Select files</Button>
          </label>
          <div className="mt-4 text-left">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded my-1">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-slate-500">{Math.round(f.size / 1024)} KB</div>
                </div>
                <div className="text-slate-500">Ready</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium">Select Regulations</h5>
            <div className="flex flex-wrap gap-2 mt-2">
              {regs.map(r => (
                <button key={r} onClick={() => setSelectedRegs(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} className={`px-3 py-1 rounded ${selectedRegs.includes(r) ? 'bg-blue-50 border border-blue-200' : 'bg-slate-100'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-medium">Integration Target</h5>
            <select className="mt-2 p-2 border rounded w-full">
              <option>Jira</option>
              <option>Azure DevOps</option>
              <option>Polarion</option>
              <option>Export CSV/Excel</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={() => onStart(files, selectedRegs)}>Generate Test Cases</Button>
          <Button className="bg-slate-100 text-slate-700" onClick={() => alert('Save as draft')}>Save as Draft</Button>
        </div>
      </div>
    </div>
  );
};

const ProcessingPage = ({ pipelineState }) => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Processing Pipeline</h4>
        <p className="text-sm text-slate-600 mb-4">Live orchestration of AI agents.</p>
        <div className="space-y-4">
          {pipelineState.history.map((s, idx) => (
            <div key={idx} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-slate-500">Agent: {s.agent || 'system'}</div>
              </div>
              <div className="w-1/3">
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div style={{ width: `${s.progress}%` }} className={`h-full rounded bg-gradient-to-r from-blue-500 to-teal-400`}></div>
                </div>
                <div className="text-xs text-right mt-1">{s.progress}%</div>
              </div>
            </div>
          ))}
        </div>

        {pipelineState.finished && <div className="mt-4 text-green-600 font-medium">Pipeline finished — test cases ready for review.</div>}
      </div>
    </div>
  );
};

const ReviewPage = ({ cases, onUpdateCase, onApproveAll }) => {
  const [search, setSearch] = useState('');
  const filtered = cases.filter(c => c.reqId.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Generated Test Cases</h4>
        <div className="flex items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requirement or test..." className="px-3 py-2 border rounded" />
          <Button onClick={onApproveAll}>Approve All</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-slate-600 text-sm">
              <th className="p-2">Req ID</th>
              <th className="p-2">Requirement</th>
              <th className="p-2">Test Case</th>
              <th className="p-2">Expected Result</th>
              <th className="p-2">Regulation</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <tr key={idx} className="border-t hover:bg-slate-50">
                <td className="p-2 align-top text-sm font-mono">{c.reqId}</td>
                <td className="p-2 align-top text-sm">{c.description}</td>
                <td className="p-2 align-top text-sm">
                  <textarea className="w-full p-2 border rounded" value={c.testCase} onChange={(e) => onUpdateCase(idx, { ...c, testCase: e.target.value })} />
                </td>
                <td className="p-2 align-top text-sm">
                  <input className="w-full p-2 border rounded" value={c.expected} onChange={(e) => onUpdateCase(idx, { ...c, expected: e.target.value })} />
                </td>
                <td className="p-2 align-top text-sm">{c.reg}</td>
                <td className="p-2 align-top text-sm">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComplianceDashboard = ({ stats }) => {
  const barData = [
    { name: 'IEC 62304', value: 80 },
    { name: 'FDA', value: 95 },
    { name: 'ISO 13485', value: 78 },
    { name: 'GDPR', value: 88 }
  ];
  const pieData = [
    { name: 'Compliant', value: 88 },
    { name: 'Pending', value: 8 },
    { name: 'Gaps', value: 4 }
  ];
  const COLORS = ['#34a853', '#fbbc05', '#d93025'];

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-2">Traceability Overview</h4>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-2">Compliance Summary</h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={60} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <div>Total Requirements: <strong>{stats.totalReq}</strong></div>
            <div>Test Cases: <strong>{stats.totalCases}</strong></div>
            <div>Coverage: <strong>{stats.coverage}%</strong></div>
            <div>Gaps: <strong className="text-red-600">{stats.gaps}</strong></div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h5 className="font-medium mb-2">Traceability Matrix (sample)</h5>
        <table className="w-full text-left table-auto text-sm">
          <thead>
            <tr className="text-slate-600">
              <th className="p-2">Req ID</th>
              <th className="p-2">Test Case</th>
              <th className="p-2">Regulation</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">REQ-45</td>
              <td className="p-2">TC-001</td>
              <td className="p-2">IEC 62304</td>
              <td className="p-2 text-amber-600">Draft</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">REQ-46</td>
              <td className="p-2">TC-002</td>
              <td className="p-2">FDA 21 CFR</td>
              <td className="p-2 text-green-600">Approved</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const IntegrationsPage = ({ integrations, onSync }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {integrations.map((it, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-slate-500">{it.desc}</div>
              </div>
              <div className={`font-semibold ${it.status === 'ok' ? 'text-green-600' : it.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>{it.status === 'ok' ? 'Connected' : it.status}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => onSync(it.name)}>Sync Now</Button>
              <Button className="bg-slate-100 text-slate-700" onClick={() => alert('Open settings')}>Settings</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h5 className="font-medium mb-2">Sync Logs</h5>
        <div className="text-xs text-slate-500">Recent syncs and API responses will appear here.</div>
      </div>
    </div>
  );
};

export default function App() {
  const [active, setActive] = useState('home');

  // pipeline state to show progress
  const [pipeline, setPipeline] = useState({ history: [], finished: false });

  const [testCases, setTestCases] = useState([
    { reqId: 'REQ-45', description: 'System shall validate medication dosage does not exceed safe threshold.', testCase: 'Enter > limit, expect error', expected: 'Error: Dosage exceeds limit', reg: 'IEC 62304', status: 'Draft' },
    { reqId: 'REQ-46', description: 'Audit logs must be tamper-evident.', testCase: 'Create event, try modify, expect audit trail', expected: 'Original audit retained', reg: 'FDA 21 CFR', status: 'Approved' }
  ]);

  const [stats, setStats] = useState({ totalReq: 120, totalCases: 340, coverage: 98, gaps: 2 });

  const integrations = [
    { name: 'Jira', desc: 'Atlassian Jira Cloud', status: 'ok' },
    { name: 'Azure DevOps', desc: 'Azure DevOps Test Plans', status: 'pending' },
    { name: 'Polarion', desc: 'Siemens Polarion', status: 'error' }
  ];

  const startPipeline = (files, regs) => {
    // reset pipeline
    setPipeline({ history: [], finished: false });
    setActive('processing');

    const history = [];
    simulatePipeline(({ step, label, progress, finished }) => {
      if (finished) {
        setPipeline({ history: [...history], finished: true });
        setActive('review');
        // for demo, append some mocked cases
        setTestCases(prev => [...prev, { reqId: 'REQ-47', description: 'Patient data encryption at rest', testCase: 'Check DB encryption enabled', expected: 'Encrypted at rest', reg: 'ISO 27001', status: 'Draft' }]);
        setStats(s => ({ ...s, totalReq: s.totalReq + 1, totalCases: s.totalCases + 1 }));
        return;
      }
      // update or append to history
      const idx = history.findIndex(h => h.step === step);
      if (idx === -1) history.push({ step, label, progress }); else history[idx] = { step, label, progress };
      setPipeline({ history: [...history], finished: false });
    });
  };

  const updateCase = (idx, updated) => {
    setTestCases(prev => prev.map((p, i) => i === idx ? updated : p));
  };

  const approveAll = () => {
    setTestCases(prev => prev.map(c => ({ ...c, status: 'Approved' })));
    alert('All test cases approved (demo)');
  };

  const handleSync = (name) => {
    alert('Syncing to ' + name + ' (demo)');
  };

  const onConnect = () => alert('Open integrations modal (demo)');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col">
        <Header onConnect={onConnect} />
        <motion.div className="flex-1 overflow-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {active === 'home' && <Home setActive={setActive} />}
          {active === 'upload' && <UploadPage onStart={startPipeline} />}
          {active === 'processing' && <ProcessingPage pipelineState={pipeline} />}
          {active === 'review' && <ReviewPage cases={testCases} onUpdateCase={updateCase} onApproveAll={approveAll} />}
          {active === 'compliance' && <ComplianceDashboard stats={stats} />}
          {active === 'integration' && <IntegrationsPage integrations={integrations} onSync={handleSync} />}
          {active === 'settings' && <div className="p-6">Settings page (configure agents, API keys, GDPR pilot options)...</div>}
        </motion.div>
      </div>
    </div>
  );
}
