# Doctor Tracker - Frontend Web Application

Frontend client for Doctor Tracker, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. Designed as a clean administrative portal for clinic coordinators to manage doctors, track patients, and view real-time statistics.

- **Live Frontend Application:** https://doctortracker.adibdev.me/
- **Backend GitHub Repo:** https://github.com/Adib23704/doctortracker-backend/
- **Live Backend API:** https://doctortracker-api.adibdev.me/

---

## Description

Doctor Tracker Frontend is a responsive web dashboard designed for managing clinic operations. It allows coordinators to view, search, and filter doctors by medical specialization and date, drill down into individual doctor profiles to view and manage their assigned patients, track patients across the clinic on a dedicated management page, and review live clinic metrics (such as patient admissions over time and doctor caseload distributions) through interactive Recharts visualizations.

---

## Setup Guide

### Prerequisites
- **Node.js**: v18.0 or newer (tested on Node 20 & 24)
- **npm**: v9.0 or newer
- **Backend API**: The backend server should be running (locally on `http://localhost:5000` or hosted remotely)

---

### Step-by-Step Installation

#### 1. Navigate to the frontend directory
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Set up environment variables
Copy the provided `.env.example` file to create your local `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and set your backend API base URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
*(If your backend is hosted on Render or another service, replace this with your live backend API URL).*

#### 4. Start the development server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

#### 5. Logging into the portal
When you open `http://localhost:3000`, you will be redirected to the `/login` portal.

- You can manually enter the default admin credentials:
  - **Email:** `admin@doctortracker.com`
  - **Password:** `Admin@123456`
- **Or click the "Auto-fill Demo" button:** A one-click helper button is included directly on the login card to immediately populate the credentials for fast testing.

#### 6. Build for production (optional)
To compile an optimized production build:
```bash
npm run build
npm start
```

#### 7. Linting & formatting (Biome)
Validate and format code using Biome:
```bash
npm run lint         # Verify code against Biome lint & style rules
npm run lint:fix     # Apply auto-fixes and organize imports
npm run format       # Format codebase
```

---

## System Architecture

The frontend is built using Next.js 16 App Router with clean separation between pages, UI components, API services, and session state:

```
frontend/src/
├── app/
│   ├── layout.tsx         # Root layout (Inter typography, AuthProvider, Sonner toaster)
│   ├── globals.css        # Tailwind directives and clean scrollbar styling
│   ├── page.tsx           # Redirects root to /dashboard
│   ├── login/page.tsx     # Admin login screen with demo credentials auto-fill
│   ├── dashboard/page.tsx # KPI summary cards and Recharts analytics grid
│   ├── doctors/
│   │   ├── page.tsx       # Doctors directory with search, filter toolbar, and table
│   │   └── [id]/page.tsx  # Doctor detail view with assigned patient sub-list
│   └── patients/page.tsx  # Dedicated patient management directory with multi-filters
├── components/
│   ├── auth/              # ProtectedRoute guard wrapper
│   ├── layout/            # Sidebar navigation, Header breadcrumbs, DashboardLayout
│   ├── doctors/           # DoctorTable, DoctorProfileHeader, AddDoctorModal, DoctorPatientList
│   ├── patients/          # PatientTable, PatientFilterToolbar, EditPatientModal
│   ├── dashboard/         # StatCards, AdmissionsChart, DoctorLoadChart, ConditionDistributionChart
│   └── common/            # SearchBar (debounced), Pagination, ConfirmDialog
├── contexts/              # AuthContext (JWT session persistence & reactive useAuth hook)
├── lib/                   # api.ts (typed HTTP client with Bearer token injection) & utils.ts
└── types/                 # Shared TypeScript interfaces (Doctor, Patient, User, Analytics)
```

---

## Technical Decisions

### 1. URL Search Parameters for Search & Filters vs. Ephemeral React State
**The Problem:** Keeping search terms, active dropdown filters, and current page numbers purely inside React `useState` means that refreshing the page or clicking the browser's back button resets all filters. It also makes it impossible to share a link to a specific filtered view.

**Our Solution:** We synchronize search queries, filter values, and page numbers with the browser's URL search parameters (`?page=1&search=...&specialization=...`). 

**Why it matters:**
- Filter states persist across page refreshes.
- Browser back and forward buttons navigate through filter history naturally.
- We added a 300ms debounce to the search bar so API requests only fire after the user pauses typing, preventing request thrashing.

---

### 2. Client-Mounted Hydration Guard for Recharts vs. Server-Rendered Charts
**The Problem:** Recharts components use responsive containers (`ResponsiveContainer`) that calculate DOM container width and height in the browser. In Next.js App Router, rendering charts directly on the server can cause hydration mismatch errors because server-side rendering does not have access to client viewport dimensions.

**Our Solution:** Each chart component includes a simple client-side mounting guard (`mounted` state with `useEffect`) that delays rendering until after the component mounts on the client.

**Why it matters:** This completely eliminates SSR hydration errors and layout shifts while allowing smooth client animations, gradient area fills, and interactive hover tooltips.

---

## Visual Evidence

Screenshots documenting the UI and responsive layout are located in `docs/screenshots/`:

1. **Login Page:** Clean authentication form with demo auto-fill shortcut.
2. **Dashboard:** KPI summary cards, monthly admissions trend chart, doctor caseload bar chart, condition donut chart, and recent admissions feed.
3. **Doctors Directory:** Filter toolbar, debounced search, doctor table with specialty badges, and "Add Doctor" modal.
4. **Doctor Profile Page:** Header card with doctor contact details and sub-table of patients assigned to that doctor.
5. **Patients Management Page:** Full patient table with diagnosis badges, status pills, assigned doctor links, and "Edit Patient" modal.
6. **Mobile View:** Responsive layout with slide-out navigation drawer and mobile-friendly tables.

---

## Submission Details

- **Live Frontend URL:** `[Insert Live Frontend Website URL on Vercel / Netlify]`
- **Backend GitHub Repo:** `[Insert Backend Repo URL]`
- **Frontend GitHub Repo:** `[Insert Frontend Repo URL]`
- **Live Backend API URL:** `[Insert Live Backend URL on Render / VPS / Railway]`
- **Admin Login Credentials:**
  - **Email:** `admin@doctortracker.com`
  - **Password:** `Admin@123456`

---

## UI Design System

- **Color Palette:** Clinical slate with deep teal accents:
  - Background Canvas: `#f8fafc` (`bg-slate-50`)
  - Elevated Cards: `#ffffff` (`bg-white`, `border-slate-200`)
  - Primary Accent: `#0d9488` (`teal-600`), `#0f766e` (`teal-700`)
  - Headings: `#0f172a` (`text-slate-900`)
  - Body Text: `#475569` (`text-slate-600`)
- **Status Pills:** Semantic color coding for quick scanning:
  - `Active`: Green (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - `Under Observation`: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
  - `Critical`: Red (`bg-rose-50 text-rose-800 border-rose-200`)
  - `Discharged`: Gray (`bg-slate-100 text-slate-700 border-slate-200`)
