# Backend (Step 1) - AI Test Case Copilot

Requirements:
- Node 18+
- npm

Install:
> cd Ui/backend
> npm install

Run:
> npm run start
# or for dev with auto-reload:
> npm run dev  (requires nodemon)

Server will run on http://localhost:4000 by default.

Endpoints:
- POST /api/upload
  - multipart form field 'files' (multiple)
  - form field 'regs' (JSON string array)
  - returns { pipelineId }
- GET /api/pipeline/:id
  - returns pipeline status & step progress
- GET /api/pipeline/:id/testcases
  - returns generated test cases (when pipeline finished)

Note: This is a demo / prototype in-memory backend. In Step 2 we'll add a more robust pipeline manager and a persistent store.
