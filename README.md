# GrowEasy AI Importer

An AI-powered CSV importer that intelligently extracts and maps CRM lead data from **any CSV format** — regardless of column names, layout, or structure — into GrowEasy's standardized CRM schema. Built for the GrowEasy Software Developer assignment.

The core challenge this project solves is not CSV parsing itself, but **reliable, ambiguous-column field mapping using AI** — so uploads like Facebook Lead Exports, Google Ads exports, real estate CRM dumps, or manually created spreadsheets can all be normalized into a consistent CRM record format.

---

## Live Deployment

| Component | URL |
|---|---|
| **Frontend (Live App)** | https://groweasy-frontend-2gqf.onrender.com |
| **Backend (API)** | https://groweasy-backend-doiv.onrender.com |
| **GitHub Repository** | https://github.com/varalakshmikonjeti/groweasy-ai-importer |

> **Note:** The backend runs on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the service wakes up — this is expected behavior, not an error.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Application Workflow](#application-workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [AI Field Mapping Logic](#ai-field-mapping-logic)
- [API Reference](#api-reference)
- [Local Setup](#local-setup)
- [Design Decisions](#design-decisions)

---

## Architecture Overview

The system is a two-tier application: a **Next.js frontend** for file upload and result visualization, and a **Node.js/Express backend** that handles CSV parsing, batching, and AI-driven field extraction via the Google Gemini API.

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────┐
│                  │  CSV   │                  │ Batch  │                 │
│  Next.js         │──────► │  Express Backend │──────► │  Gemini AI      │
│  Frontend        │        │                  │        │  (Field Mapper) │
│  (Render)        │ ◄──────│  (Render)        │ ◄──────│                 │
│                  │  JSON  │                  │  JSON  │                 │
└─────────────────┘        └──────────────────┘        └─────────────────┘
```

The frontend never talks to Gemini directly — all AI orchestration happens server-side, keeping the API key secure and allowing batch/retry logic to be centrally controlled.

---

## Application Workflow

The app follows a strict **4-step flow**, with AI processing deliberately deferred until the user explicitly confirms the import — matching the assignment's UX requirements.

| Step | Action | AI Involved? |
|---|---|---|
| 1. Upload | User selects/uploads a CSV file | No |
| 2. Preview | Raw CSV rows are parsed and displayed in a table | No |
| 3. Confirm | User clicks "Import to CRM" to trigger backend processing | — |
| 4. Result | Backend returns AI-mapped CRM records + import/skip counts | Yes |

This separation ensures users can review their raw data before any AI cost is incurred, and avoids silent AI processing on data the user hasn't confirmed.

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend**
- Node.js + Express 5
- TypeScript
- Multer (file upload handling)
- PapaParse (CSV parsing)
- Google Gemini API (`@google/genai`) — AI field extraction

**Deployment**
- Render (both frontend and backend, deployed as separate services from a single monorepo)

---

## Project Structure

```
groweasy-ai-importer/
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers (upload, import)
│   │   ├── prompts/           # Gemini prompt template + CRM mapping rules
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # CSV parsing, AI extraction, batching logic
│   │   ├── utils/             # Shared helpers (e.g. batch chunking)
│   │   ├── app.ts             # Express app config, CORS, middleware
│   │   └── server.ts          # Server entry point
│   ├── package.json
│   └── .env                   # Local only — GEMINI_API_KEY, PORT (not committed)
│
└── frontend/
    ├── app/
    │   ├── page.tsx            # Main UI — upload, preview, import, results
    │   ├── layout.tsx
    │   └── globals.css
    ├── public/
    └── package.json
```

---

## AI Field Mapping Logic

The backend batches records (50 per batch) and sends them to Gemini with a structured prompt instructing it to map arbitrary CSV columns into the following fixed CRM schema:

`created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description`

**Rules enforced in the prompt:**

- **`crm_status`** is restricted to exactly one of: `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE` — inferred from note/sentiment context when present.
- **`data_source`** is restricted to a fixed known list, or left blank if no confident match exists.
- **`created_at`** is normalized to a format compatible with JavaScript's `new Date()`.
- **Multiple emails/phone numbers** in a single row: the first is used as the primary field; any additional ones are appended into `crm_note` rather than discarded.
- **Invalid records** — any row missing *both* an email and a mobile number — are excluded from the output entirely.
- The backend calculates `totalRecords`, `totalImported`, and `totalSkipped` by comparing input record count to AI output count, and surfaces these directly in the UI.
- Each Gemini batch call includes **up to 3 retry attempts** with a 2-second backoff on failure, to handle transient API errors gracefully.

This logic has been validated against both clean, well-labeled CSVs and deliberately messy test data (inconsistent column names, missing fields, multiple contact points, sentiment-based notes) to confirm correct mapping, skip behavior, and status inference.

---

## API Reference

### `POST /api/upload`
Accepts a CSV file, parses it, and returns a raw preview — **no AI processing occurs at this stage.**

**Request:** `multipart/form-data`, field name: `file`

**Response:**
```json
{
  "message": "CSV uploaded successfully",
  "totalRows": 3,
  "preview": [
    { "Full Name": "John Doe", "Email Address": "john@gmail.com", "Phone": "9876543210", "Company": "ABC Corp", "Location": "Bangalore" }
  ]
}
```

### `POST /api/import`
Takes the previously previewed records, processes them through Gemini in batches, and returns CRM-formatted records along with import statistics.

**Request:**
```json
{ "records": [ /* array of raw preview row objects */ ] }
```

**Response:**
```json
{
  "success": true,
  "totalRecords": 5,
  "totalImported": 4,
  "totalSkipped": 1,
  "data": [
    {
      "name": "Amit Sharma",
      "email": "amit.sharma@example.com",
      "mobile_without_country_code": "9123456780",
      "company": "Reliance Infra",
      "city": "Pune",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Client asked to reschedule demo. Secondary Email: amit.alt@example.com. Alt Phone: 9988776655"
    }
  ]
}
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/varalakshmikonjeti/groweasy-ai-importer.git
cd groweasy-ai-importer
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the backend:
```bash
npm run dev
```
Backend available at `http://localhost:5000`

### 3. Frontend setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend available at `http://localhost:3000`

> By default, the frontend is configured to call the **live deployed backend**. To test against your local backend instead, update the fetch URLs in `frontend/app/page.tsx` from the Render URL to `http://localhost:5000`.

---

## Design Decisions

- **AI processing is server-side only.** The API key is never exposed to the client, and all batching/retry logic is centralized in the backend for easier maintenance and cost control.
- **Skip-count is derived, not AI-reported.** Rather than trusting the AI to self-report which records it skipped, the backend calculates `totalSkipped` as the difference between input and output record counts — a more reliable, deterministic signal.
- **Preview step is AI-free by design**, per the assignment's UX requirement, so users only incur AI processing cost once they explicitly confirm.
- **Batching (50 records/batch)** balances prompt size against Gemini's context and rate limits, while retry-with-backoff handles transient failures without failing the whole import.

---

