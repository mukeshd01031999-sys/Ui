# 🧪 AI Test Case Copilot

An AI-powered system that **automatically converts healthcare software requirements into compliant, traceable test cases** with multi-agent orchestration.  
Supports **regulatory compliance (FDA, IEC 62304, ISO 13485, ISO 27001)** and integrates with enterprise toolchains like **Jira, Azure DevOps, Polarion**.

---

## 🚀 Features
- **Frontend (React + Tailwind + Vite)**
  - Google/Microsoft-style UI with sidebar, dashboard, review mode.
  - Upload PDFs/Docs/XML and select compliance frameworks.
  - Visual pipeline history (multi-agent steps).
  - Interactive review of generated test cases.
  - Compliance dashboard & integration page.

- **Backend (Node.js + Express)**
  - File upload & pipeline orchestration endpoints.
  - Multi-Agent system with explicit **agent cards**:
    1. Requirement Understanding Agent → structured JSON
    2. Test Case Generator → draft test cases
    3. Compliance Mapping Agent → map to standards
    4. Integration Agent → push to Jira/ADO/Polarion
    5. Reviewer Agent (optional) → QC & refinements
  - Simulated orchestration now; ready for **Vertex AI Agent Builder** integration.

---

## 📂 Project Structure
