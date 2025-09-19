// Ui/frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, UploadCloud, Settings, CheckCircle, AlertTriangle, Database, Eye } from 'lucide-react';

// Minimal Button component (replace with your design system if needed)
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

// UploadPage now stores File objects, supports preview, and calls startPipeline
const UploadPage = ({ onStart }) => {
  const [files, setFiles] = useState([]); // array of File objects
  const [selectedRegs, setSelectedRegs] = useState(['FDA (21 CFR Part 11)', 'IEC 62304']);
  const [target, setTarget] = useState('Jira');
  const [previewFile, setPreviewFile] = useState(null); // {file, url, text}
  const regs = ['FDA (21 CFR Part 11)', 'IEC 62304', 'ISO 13485', 'ISO 9001', 'ISO 27001', 'GDPR'];

  const inputRef = useRef();

  const addFiles = (e) => {
    const list = Array.from(e.target.files || []);
    // dedupe by name+size to avoid accidental duplicates
    setFiles(prev => {
      const all = [...prev];
      list.forEach(f => {
        if (!all.some(a => a.name === f.name && a.size === f.size)) all.push(f);
      });
      return all;
    });
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const openPreview = async (file) => {
    // create preview object
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setPreviewFile({ file, url: URL.createObjectURL(file), text: null });
      return;
    }
    if (file.type === 'application/pdf') {
      setPreviewFile({ file, url: URL.createObjectURL(file), text: null });
      return;
    }
    // for text-like files (xml, md, txt) read as text
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewFile({ file, url: null, text: String(ev.target.result) });
    };
    reader.onerror = () => {
      setPreviewFile({ file, url: null, text: 'Could not read file for preview.' });
    };
    reader.readAsText(file);
  };

  const onUploadClick = () => {
    onStart(files, selectedRegs, setFiles); // pass setter optionally
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Upload Requirements</h4>
        <p className="text-sm text-slate-600 mb-4">Supported: PDF, DOCX, XML, Markdown, TXT, images.</p>

        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
          <UploadCloud className="mx-auto" size={40} />
          <p className="mt-2">Drag & drop files here, or</p>

          <div className="mt-3 flex items-center justify-center gap-3">
            <label className="inline-block">
              <input ref={inputRef} type="file" multiple onChange={addFiles} className="hidden" />
              <Button onClick={() => inputRef.current && inputRef.current.click()}>Select files</Button>
            </label>

            <Button className="bg-slate-100 text-slate-700" onClick={() => { if (files.length) onUploadClick(); else alert('Select files first'); }}>
              Generate Test Cases
            </Button>
          </div>

          <div className="mt-4 text-left">
            {files.length === 0 && <div className="text-sm text-slate-500">No files selected</div>}
            {files.map((f, idx) => (
              <div key={`${f.name}-${f.size}-${idx}`} className="flex items-center justify-between p-2 border rounded my-1">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-slate-500">{Math.round(f.size / 1024)} KB</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openPreview(f)} className="text-sm text-slate-600 hover:underline flex items-center gap-2"><Eye size={14} />Preview</button>
                  <button onClick={() => removeFile(idx)} className="text-sm text-red-600">Remove</button>
                </div>
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
            <select value={target} onChange={e => setTarget(e.target.value)} className="mt-2 p-2 border rounded w-full">
              <option>Jira</option>
              <option>Azure DevOps</option>
              <option>Polarion</option>
              <option>Export CSV/Excel</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={() => onUploadClick()}>Generate Test Cases</Button>
          <Button className="bg-slate-100 text-slate-700" onClick={() => alert('Save as draft (demo)')}>Save as Draft</Button>
        </div>
      </div>

      {/* Preview modal area */}
      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

const FilePreviewModal = ({ previewFile, onClose }) => {
  if (!previewFile) return null;
  const { file, url, text } = previewFile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-11/12 md:w-3/4 lg:w-2/3 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium">{file.name}</div>
            <div className="text-xs text-slate-500">{file.type || 'unknown'} • {Math.round(file.size / 1024)} KB</div>
          </div>
          <div>
            <button onClick={onClose} className="text-slate-600">Close</button>
          </div>
        </div>

        <div style={{ height: '60vh', overflow: 'auto' }} className="border rounded p-2">
          {url && file.type === 'application/pdf' && (
            <iframe title="pdf-preview" src={url} className="w-full h-full" />
          )}
          {url && file.type.startsWith('image/') && (
            <img src={url} alt="preview" className="max-w-full max-h-full mx-auto" />
          )}
          {text && (
            <pre className="whitespace-pre-wrap text-sm text-slate-800">{text}</pre>
          )}
          {!url && !text && (
            <div className="text-sm text-slate-500">Preview not available for this file type.</div>
          )}
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
                  <textarea className="w-full p-2 border rounded" value={c.testCase || c.testSteps?.join(' \\n ')} onChange={(e) => onUpdateCase(idx, { ...c, testCase: e.target.value })} />
                </td>
                <td className="p-2 align-top text-sm">
                  <input className="w-full p-2 border rounded" value={c.expected} onChange={(e) => onUpdateCase(idx, { ...c, expected: e.target.value })} />
                </td>
                <td className="p-2 align-top text-sm">{(c.regs || c.reg || []).join ? (c.regs || c.reg || []).join(', ') : c.reg}</td>
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
    { reqId: 'REQ-45', description: 'System shall validate medication dosage does not exceed safe threshold.', testCase: 'Enter > limit, expect error', expected: 'Error: Dosage exceeds limit', regs: ['IEC 62304'], status: 'Draft' },
    { reqId: 'REQ-46', description: 'Audit logs must be tamper-evident.', testCase: 'Create event, try modify, expect audit trail', expected: 'Original audit retained', regs: ['FDA 21 CFR'], status: 'Approved' }
  ]);

  const [stats, setStats] = useState({ totalReq: 120, totalCases: 340, coverage: 98, gaps: 2 });

  const integrations = [
    { name: 'Jira', desc: 'Atlassian Jira Cloud', status: 'ok' },
    { name: 'Azure DevOps', desc: 'Azure DevOps Test Plans', status: 'pending' },
    { name: 'Polarion', desc: 'Siemens Polarion', status: 'error' }
  ];

  // Backend base URL (change if needed)
  const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

  // startPipeline: upload files and poll backend pipeline
  const startPipeline = async (files /* File[] */, selectedRegs /* string[] */, optionalResetFilesSetter) => {
    try {
      if (!files || files.length === 0) {
        alert('Please select files to upload');
        return;
      }

      const form = new FormData();
      files.forEach(f => form.append('files', f));
      form.append('regs', JSON.stringify(selectedRegs || []));

      // upload
      const resp = await axios.post(`${BASE}/api/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const pipelineId = resp.data.pipelineId;
      console.log('started pipeline', pipelineId);

      // initialize pipeline state in UI
      setPipeline({ history: [], finished: false });
      setActive('processing');

      // poll for status
      const pollInterval = 1000;
      let failures = 0;
      const poller = setInterval(async () => {
        try {
          const s = await axios.get(`${BASE}/api/pipeline/${pipelineId}`);
          const data = s.data;
          setPipeline({ history: data.history || [], finished: data.finished || false });

          // optimistic: update local test-case count when finished
          if (data.finished) {
            clearInterval(poller);
            // fetch generated test cases
            try {
              const tcResp = await axios.get(`${BASE}/api/pipeline/${pipelineId}/testcases`);
              const newTCs = tcResp.data.testCases || [];
              setTestCases(prev => [...prev, ...newTCs]);
              setStats(st => ({ ...st, totalReq: (st.totalReq || 0) + 1, totalCases: (st.totalCases || 0) + newTCs.length }));
            } catch (err) {
              console.error('failed to fetch testcases', err);
            }

            // optionally clear uploaded files from upload UI by calling setter
            if (typeof optionalResetFilesSetter === 'function') optionalResetFilesSetter([]);

            setActive('review');
          }
        } catch (err) {
          console.error('polling error', err);
          failures += 1;
          if (failures > 10) {
            clearInterval(poller);
            alert('Unable to poll pipeline status. Check backend.');
            setActive('home');
          }
        }
      }, pollInterval);

    } catch (err) {
      console.error('startPipeline error', err);
      alert('Failed to start pipeline');
    }
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
          {active === 'home' && <div className="p-6"><div className="grid grid-cols-3 gap-6"><div className="col-span-2 bg-white rounded-xl p-6 shadow-sm"><h4 className="text-lg font-semibold mb-2">Quick Start</h4><p className="text-sm text-slate-600 mb-4">Drag & drop requirement documents, choose standards, and generate traceable test cases automatically.</p><div className="flex gap-3"><Button onClick={() => setActive('upload')}>Upload Requirements</Button><Button onClick={() => setActive('review')}>View Generated Test Cases</Button></div></div><div className="bg-white rounded-xl p-6 shadow-sm"><h4 className="text-lg font-semibold mb-2">System Status</h4><div className="flex flex-col gap-3"><div className="flex items-center justify-between"><div><div className="text-sm text-slate-500">Agents Ready</div><div className="text-base font-medium">Requirement Analyzer, Test Generator, Compliance Mapper</div></div><div className="text-green-600 font-semibold">● Online</div></div><div><div className="text-sm text-slate-500">Integrations</div><div className="flex gap-2 mt-2"><span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Jira</span><span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Azure DevOps</span><span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">Polarion</span></div></div></div></div></div><div className="mt-6 grid grid-cols-3 gap-6"><div className="col-span-3 bg-white rounded-xl p-6 shadow-sm"><h4 className="text-lg font-semibold mb-2">Recent Activity</h4><div className="text-sm text-slate-600">No recent pipelines. Upload a file to start a new pipeline.</div></div></div></div>}
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
