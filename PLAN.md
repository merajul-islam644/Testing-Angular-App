# Lattice — Engineering Release Dashboard

This run builds the dashboard surface (T02–T06). The PRD specifies mock data
("Read/write here is against mock data; a real API can replace it later"), so
all records are seeded mock data in `src/features/releases/data`. English only,
no per-role gating, no Blocks Data schemas required.

- [x] Scaffold Blocks web app and set .env (blocks-bootstrap)
- [x] Create OIDC client and enable hosted login (blocks-bootstrap)
- [x] Apply design tokens and clean-slate shell styling (plain UI)
- [x] Add light/dark theme toggle (plain UI)
- [x] Sidebar: brand, 7 nav items, Environments, AI Assistant (plain UI)
- [x] Top bar: search (Cmd K), theme toggle, bell, user area (plain UI)
- [x] Brand home page and owner-facing text (plain UI)
- [x] Mock data model and seed deployments/environments/issues (plain UI)
- [x] Dashboard header: title, range selector, New Deployment (plain UI)
- [x] KPI row: five cards with range-aware values (plain UI)
- [x] Deployment Pipeline and Latest Deployment cards (plain UI)
- [x] Application Health Trend chart and Environment Status list (plain UI)
- [x] Recent Deployments table and Recent Issues card (plain UI)
- [x] Loading skeletons, empty and error states (plain UI)
- [x] Deployment detail: timeline, verification, evidence (plain UI)
- [x] Verification page and issue detail views (plain UI)
- [x] AI Insight block secondary to dashboard (plain UI)
- [x] Wire routes for new pages and mobile layout (plain UI)
- [x] Check and build app