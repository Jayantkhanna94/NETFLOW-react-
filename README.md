# NetFlow — React Major Project

NetFlow is an enterprise-grade smart campus network monitoring and infrastructure management platform built with React 18, Vite, Lucide Icons, and Recharts.

## Architecture

The project strictly follows a clean component hierarchy and modular structure:

```text
main.jsx
   │
   ▼
App.jsx
   │
   ├── AuthContext
   │      ├── Login
   │      ├── Signup
   │      └── Logout
   │
   └── Layout
          │
          ├── Sidebar
          │      ├── Dashboard
          │      ├── Devices
          │      ├── Network
          │      ├── Resources
          │      ├── Bookings
          │      ├── Incidents
          │      ├── Reports
          │      ├── Users
          │      └── Settings
          │
          └── Page Content (<Outlet />)
```

## Directory Organization
- `src/main.jsx` — React root initialization with `BrowserRouter`
- `src/App.jsx` — Central router with `AuthProvider`, public auth routes, and protected `Layout` routes
- `src/contexts/AuthContext.jsx` — Authentication provider managing login, signup, session state, and logout
- `src/contexts/DataContext.jsx` — Real-time telemetry, device CRUD, and notification store
- `src/components/Layout.jsx` — Application shell with Topbar (search, theme switch, notifications, avatar) and `<Outlet />`
- `src/components/Sidebar.jsx` — Persistent navigation sidebar with core modules, profile link, and logout
- `src/components/ProtectedRoute.jsx` — Route guard redirecting unauthenticated users to `/login`
- `src/components/UI.jsx` — Reusable UI design system (Card, Button, Status, Stat, Header, SearchBox, AuthLayout)
- `src/services/storage.js` — Seed database and browser `localStorage` CRUD helpers
- `src/pages/` — Modular, self-contained views for each dashboard section
- `src/styles/index.css` — Global CSS variables and responsive design rules

## Modules
- **Dashboard (`/`)**: Live KPI metrics, throughput telemetry table, hardware utilization meters, quick device health, and recent incidents.
- **Devices (`/devices`)**: Full device registry, search/filter by IP or location, add/edit modal, delete, and CSV export.
- **Network Monitoring (`/network`)**: Interactive campus topology map, real-time latency, packet loss, and interface status.
- **Resources (`/resources`)**: Labs, auditoriums, and meeting room availability with capacity counters and booking triggers.
- **Bookings (`/bookings`)**: Resource reservation logs with approval workflows and date badges.
- **Incidents (`/incidents`)**: Incident triage board with severity classifications (Low, Medium, High, Critical) and resolution actions.
- **Reports (`/reports`)**: Operational reporting center with downloadable audit documents.
- **Users (`/users`)**: Role-based access control table (Admin, Faculty, Student) with user creation and editing.
- **Settings (`/settings`)**: Dashboard preferences, automated refresh interval, notification triggers, and security policies.
- **Profile (`/profile`)**: User profile editor and account security actions.

## Quick Start
```bash
npm install
npm run dev
```

### Demo Credentials
- **Email:** `admin@netflow.com`
- **Password:** `admin123`
