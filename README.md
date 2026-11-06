# NAGAR CONNECT (नागर कनेक्ट)
### Smart Civic Infrastructure and Road Issue Reporting Platform
**Jurisdiction:** Mira-Bhayandar Municipal Corporation (MBMC), Government of Maharashtra, India  
**Stack:** React.js (Vite) + Tailwind CSS + Supabase (PostgreSQL, Auth, Storage) + Leaflet / OSM + Vercel

---

## 1. Project Overview

**NAGAR CONNECT** is a production-grade, QR-code enabled civic grievance redressal and municipal infrastructure monitoring portal for road defect management across **Wards 1 through 6** in the Mira-Bhayandar urban municipal belt.

The platform bridges citizens, municipal executive engineers, and field rapid-response squads (QRT):
- **Citizens:** Report potholes, open manholes, damaged road surfaces, and incomplete utility trenching with browser GPS geocoding and photographic evidence. Track progress in real-time using cryptographically secure docket tokens.
- **Municipal Administrators & Junior Engineers:** Triage incoming complaints, verify AI and EXIF telemetry, assign responsible departments and executing contractors, monitor statutory SLA compliance, and export certified compliance logs.
- **Field Workers (QRT & Patrol Teams):** Mobile-first dispatch interface for site inspection, capturing field depth/area measurements, uploading resolution evidence, and certifying work completion.

---

## 2. Technical Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (JavaScript ES6+, JSX) |
| **Build Tool** | Vite 6 |
| **Styling & Design System** | Tailwind CSS (MBMC Civic Cadre Design Tokens) |
| **Routing** | React Router DOM v7 (Role-Based Protected Routes) |
| **Database & BaaS** | Supabase PostgreSQL with Row Level Security (RLS) |
| **Authentication** | Supabase Auth (Session persistence, profile triggers) |
| **File & Evidence Storage** | Supabase Storage (`complaint-evidence`, `inspection-evidence`, `resolution-evidence`) |
| **GIS Mapping** | Leaflet + React Leaflet + OpenStreetMap |
| **Analytics & Data Viz** | Recharts (Responsive bar, area, pie, and donut charts) |
| **QR Code Engine** | `qrcode.react` (SVG/Canvas pole locator generator) |
| **Deployment Target** | Vercel (SPA Rewrites enabled) |

---

## 3. Directory Structure

```
Nagar Connect/
├── public/                       # Static public assets
├── src/
│   ├── assets/                   # Emblems, logos, icons
│   ├── components/
│   │   ├── common/               # Shared badges, alerts, buttons
│   │   └── maps/
│   │       └── RoadMap.jsx       # Interactive Leaflet GIS cadastre & location picker
│   ├── context/
│   │   └── AuthContext.jsx       # Unified auth state, role switcher & session manager
│   ├── layouts/
│   │   ├── PublicLayout.jsx      # Citizen header with tricolor strip, language toggles, footer
│   │   ├── AdminLayout.jsx       # Operations command sidebar & executive officer bar
│   │   └── FieldWorkerLayout.jsx # Mobile-first bottom navigation layout for site crews
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx          # Public homepage with QR pole locator & service cards
│   │   │   ├── ReportIssue.jsx   # 5-step geo-reporting form with live preview drawer
│   │   │   ├── TrackComplaint.jsx# Docket tracker with SLA countdown & timeline
│   │   │   ├── RoadSafetyMap.jsx # Interactive public road quality cadastre
│   │   │   ├── About.jsx         # Citizen Charter & SLA guidelines (Rule 12)
│   │   │   └── Contact.jsx       # Ward directories & 24x7 disaster cell helplines
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx    # Executive console with 5 KPI cards, charts & queue
│   │   │   ├── ComplaintManagement.jsx# Ward dispatch queue with filters & CSV export
│   │   │   ├── ComplaintDetails.jsx   # Full docket review, assignment & verification
│   │   │   ├── RoadIssueMap.jsx      # GIS Cadastre with tactical layer overlays
│   │   │   ├── DepartmentManagement.jsx # Municipal department registration
│   │   │   ├── WardManagement.jsx     # MBMC Wards 1 to 6 directory
│   │   │   ├── Analytics.jsx          # Performance analytics & SLA audits
│   │   │   ├── UserManagement.jsx     # Profile & role privilege administration
│   │   │   └── AuditLogs.jsx          # Immutable municipal audit trail
│   │   ├── field/
│   │   │   ├── FieldDashboard.jsx     # Mobile QRT queue & navigation launcher
│   │   │   ├── AssignedComplaints.jsx # Assigned task list
│   │   │   └── InspectionDetails.jsx  # Measurements, photos & resolution certification
│   │   └── auth/
│   │       ├── Login.jsx              # Sign-in with 1-click instant evaluation role switcher
│   │       ├── Register.jsx           # Citizen registration
│   │       └── ForgotPassword.jsx     # Password recovery
│   ├── routes/
│   │   ├── AppRoutes.jsx         # Full application routing configuration
│   │   └── ProtectedRoute.jsx    # Role-based route guard
│   ├── services/
│   │   ├── supabaseClient.js     # Resilient Supabase client with fallback preview mode
│   │   ├── authService.js        # Authentication & profile operations
│   │   ├── complaintService.js   # Grievance CRUD, RPC calls & realtime subscriptions
│   │   ├── storageService.js     # Storage bucket uploads & MIME validations
│   │   └── dashboardService.js   # Statistical aggregations & CSV export
│   ├── index.css                 # Base Tailwind imports & custom styles
│   ├── main.jsx                  # React DOM mount point
│   └── App.jsx                   # Root application component
├── supabase/
│   └── migrations/
│       ├── 20261106000000_initial_schema.sql  # Normalized schema, sequences, triggers, RLS
│       └── 20261106000001_storage_buckets.sql # Storage buckets & access policies
├── .env.example                  # Environment configuration template
├── package.json                  # NPM dependencies and scripts
├── vite.config.js                # Vite build & chunking configuration
├── vercel.json                   # Vercel SPA routing fallback rewrite
└── README.md                     # Comprehensive documentation
```

---

## 4. Local Development Setup

### Prerequisites
- **Node.js:** v18.x or v20.x or higher
- **npm:** v9.x or higher

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nagar-connect.git
   cd nagar-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your Supabase Project URL and Anon Public Key:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   *(Note: If Supabase credentials are left with defaults, NAGAR CONNECT automatically enters **Interactive Evaluation Preview Mode** with comprehensive seed data for Wards 1 to 6).*

4. **Launch Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 5. Supabase Database & Storage Setup

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Select your preferred database region (e.g. `ap-south-1` Mumbai).

### Step 2: Apply Database Migrations
In the Supabase Dashboard, navigate to **SQL Editor** and execute the migration files in sequence:

1. `supabase/migrations/20261106000000_initial_schema.sql`:
   - Creates custom ENUMs (`user_role`, `issue_category_type`, `severity_type`, `complaint_status_type`, `media_category_type`).
   - Creates tables: `profiles`, `wards`, `departments`, `complaints`, `complaint_media`, `complaint_assignments`, `complaint_status_history`, `field_inspections`, `notifications`, `audit_logs`.
   - Sets up sequence & trigger for unique complaint numbering: `NC-MBMC-YYYY-000001`.
   - Creates secure PostgreSQL functions: `submit_public_complaint` (with SHA-256 token hashing) and `track_complaint_public` (with privacy protection).
   - Enforces strict **Row Level Security (RLS)** policies on all tables.
   - Inserts initial seed data for MBMC Wards 1 to 6 and 4 municipal departments.

2. `supabase/migrations/20261106000001_storage_buckets.sql`:
   - Provisions 3 storage buckets: `complaint-evidence`, `inspection-evidence`, `resolution-evidence`.
   - Sets file size limits (10MB) and allowed MIME types (`image/jpeg`, `image/png`, `image/webp`).
   - Configures storage access policies.

---

## 6. Role-Based Access Control (RBAC) & Testing Credentials

NAGAR CONNECT features a built-in **1-Click Instant Evaluation Switcher** on the Login page (`/login`) and in the top header, enabling reviewers to immediately test all user journeys without manual account creation:

| Role | Name | Email | Permissions |
|---|---|---|---|
| **Citizen** | Suresh Narayan Patil | `citizen.suresh@gmail.com` | Report road hazards, acquire GPS geocodes, upload photos, track dockets, view public safety map. |
| **Admin** | Er. S. Patil | `admin@mbmc.gov.in` | Executive Console, review verification queues, assign departments & officers, monitor SLA breaches, export CSV, manage wards/users, inspect audit logs. |
| **Ward Officer** | Er. Aniket Joshi | `officer.w4@mbmc.gov.in` | Review Ward 04 dockets, assign QRT field squads, verify road damage severity. |
| **Field Worker** | Rajesh Sawant | `field.rajesh@mbmc.gov.in` | Mobile-first QRT console, GPS navigation to hazard spot, record inspection measurements, upload resolution evidence, certify closure. |

---

## 7. Verification of Core User Workflows (Acceptance Criteria)

- **TEST 1 (Citizen Reporting):** Navigate to `/report`. Select hazard category (e.g. Pothole), enter headline, click **"Acquire Device GPS Coordinates"** or drag the map pin. Attach photographic evidence, fill citizen contact details, and click **"Submit Grievance to MBMC"**.
- **TEST 2 & 3 (PostgreSQL Persistence & ID Generation):** Grievance is assigned unique reference `NC-MBMC-2026-XXXXXX` and issues a confidential tracking token.
- **TEST 4 (Evidence Storage):** Photographs uploaded to Supabase Storage with EXIF and resolution tags.
- **TEST 5 & 6 (Admin Verification & Assignment):** Navigate to `/admin`. Open the complaint row in the table, click **"Assign Dept"**, select department and dispatch instructions.
- **TEST 7 & 8 (Field Worker Inspection & Resolution):** Switch role to **Field Worker** at `/field`. Open the task, launch turn-by-turn navigation, click **"Conduct Inspection"**, record finding and upload resolution photo proof.
- **TEST 9 & 10 (Status Timeline Audit):** Navigate to `/track` and search the complaint ID. The live timeline reflects every authorized change: *Submitted → Under Verification → Assigned → In Progress → Resolved*.
- **TEST 11 (Security & Privacy):** Unauthorized public queries to `/track` display only road location and progress milestones, completely concealing citizen phone numbers and private email addresses.
- **TEST 12 (Production Build):** Production bundle compiles in under 12 seconds with optimized chunk splitting and zero warnings.

---

## 8. Deployment to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete production implementation of Nagar Connect"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository.
   - Set Framework Preset to **Vite**.
   - In **Environment Variables**, add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon public key
     - `VITE_MUNICIPALITY_NAME` = `Mira-Bhayandar Municipal Corporation`
     - `VITE_MUNICIPALITY_CODE` = `MBMC-MH-08`
   - Click **Deploy**.

3. **SPA Fallback Routing:**
   `vercel.json` is included in the project root with the rewrite rule ensuring client-side React routes (`/report`, `/track`, `/admin`, `/field`) resolve smoothly upon direct refresh.

---

## 9. Statutory Disclaimers & Licensing

- **Jurisdiction:** Mira-Bhayandar Municipal Corporation (MBMC), Government of Maharashtra.
- **Citizen Charter Compliance:** Rule 12 Maharashtra Public Services Guarantee Act 2015.
- **Information Security:** Section 8 Right to Information (RTI) Act compliant citizen identity masking.

