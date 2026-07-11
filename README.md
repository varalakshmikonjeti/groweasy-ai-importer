# GrowEasy AI Importer

An AI-powered CSV Importer that intelligently extracts and maps CRM lead data from any CSV format — regardless of column names, layout, or structure. Built for the GrowEasy Software Developer assignment, the application uploads customer records, lets users preview them, transforms them into a CRM-compatible schema using **Google's Gemini AI**, and displays the final imported CRM records.

---

## 🚀 Live Demo

- **Frontend (Hosted App):** `<add your Vercel URL here>`
- **Backend (API):** `<add your Render/Railway URL here>`
- **GitHub Repository:** `<add your repo URL here>`

---

## ✨ Features

- 📤 Upload CSV files of any structure or column naming convention
- 👀 Instant preview of raw uploaded CSV data (no AI processing at this stage)
- ✅ Explicit confirmation step before triggering AI extraction
- 🤖 AI-powered CRM field mapping using **Google Gemini**
- 📦 Batch processing to handle large datasets efficiently
- 📊 Clean, responsive results table showing imported CRM records
- ⚠️ Graceful handling of skipped/invalid records
- 🖥️ Modern, responsive UI built with Next.js and TypeScript

---

## 🛠️ Tech Stack

| Layer      | Technologies |
|------------|-------------|
| Frontend   | Next.js, React, TypeScript |
| Backend    | Node.js, Express.js, TypeScript |
| File Parsing | PapaParse, Multer |
| AI Engine  | Google Gemini API |

---

## 📁 Project Structure

```
groweasy-ai-importer/
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers for upload & import routes
│   │   ├── prompts/         # Gemini prompt templates for CRM field mapping
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic (CSV parsing, AI calls, etc.)
│   │   ├── utils/           # Shared helper functions
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   └── .env                 # Environment variables (not committed)
│
└── frontend/
    ├── app/                 # Next.js app directory (pages & components)
    ├── public/              # Static assets
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A valid [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd groweasy-ai-importer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the backend in development mode:

```bash
npm run dev
```

The backend will be available at:
```
http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:
```
http://localhost:3000
```

---

## 🔌 API Endpoints

### `POST /api/upload`
Accepts a CSV file upload, parses it, and returns a raw preview of the records (no AI processing applied).

**Request:** `multipart/form-data` with a `file` field
**Response:**
```json
{
  "preview": [ { "Full Name": "John Doe", "Email Address": "john@gmail.com", ... } ]
}
```

### `POST /api/import`
Takes the previously uploaded records, sends them to Gemini AI in batches, and returns CRM-formatted records.

**Response:**
```json
{
  "imported": [ { "name": "John Doe", "email": "john@gmail.com", "crm_status": "GOOD_LEAD_FOLLOW_UP", ... } ],
  "skipped": [],
  "totalImported": 3,
  "totalSkipped": 0
}
```

---

## 🔄 Application Workflow

1. **Upload** — User selects and uploads a CSV file
2. **Preview** — Raw CSV data is parsed and displayed in a table (no AI involved yet)
3. **Confirm** — User clicks "Import to CRM" to trigger backend processing
4. **AI Extraction** — Gemini AI intelligently maps CSV columns to GrowEasy CRM fields, in batches
5. **Results** — The app displays successfully imported records, along with counts of imported and skipped rows

---

## 🧠 AI Field Mapping Logic

The AI extraction follows these rules to ensure clean, CRM-ready data:

- **CRM Status** is restricted to one of: `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE`
- **Data Source** is restricted to a predefined list, or left blank if no confident match exists
- **Dates** are normalized to a format compatible with JavaScript's `new Date()`
- **Extra contact info** (additional emails/phone numbers) is preserved in `crm_note` rather than discarded
- **Invalid records** — rows missing both an email and a mobile number are skipped and reported separately

---

## 📋 Sample CSV Columns Supported

The importer is designed to handle varying column names and formats, including but not limited to:

- Full Name
- Email Address
- Phone
- Company
- Location

---

## 🏆 Evaluation Focus Areas

This project was built with attention to:

- Accurate AI prompt engineering for messy, ambiguous datasets
- Clean backend architecture with proper error handling and batch processing
- Responsive, user-friendly frontend with clear loading and error states
- Type-safe, readable, and maintainable code throughout

---

## 👤 Author

**Konjeti Varalakshmi**

---

## 📄 License

This project was developed as part of a technical assignment for GrowEasy.