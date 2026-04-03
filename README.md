# Finance Manager

A full-stack personal finance dashboard built with Next.js. Track income and expenses, visualize spending patterns, manage budgets, and explore the app instantly with a live demo mode — no sign-up required.

---

## Live Demo

**Deployed:** https://finance-manager.vercel.app/

> Click **Live Demo** in the navbar to explore the full dashboard with pre-loaded mock data without creating an account.

---

## Requirements Checklist

| Requirement | Status |
|---|---|
| Summary cards (Balance, Income, Expenses) | ✅ |
| Time-based visualization (Balance Trend line chart) | ✅ |
| Categorical visualization (Spending Breakdown pie chart) | ✅ |
| Transactions list with Date, Amount, Category, Type | ✅ |
| Search, filter, sort on transactions | ✅ |
| Role-based UI (Admin / Viewer toggle) | ✅ |
| Insights section (top category, month-over-month comparison) | ✅ |
| State management (Context API) | ✅ |
| Responsive design | ✅ |
| Empty / no-data state handling | ✅ |
| Dark mode | ✅ |
| Data persistence (localStorage) | ✅ |
| Export CSV / JSON | ✅ |
| Animations / transitions | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Clerk |
| Database | NeonDB (PostgreSQL) |
| ORM | Prisma |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Email | Resend + React Email |
| Background Jobs | Inngest |
| Rate Limiting | ArcJet |
| Receipt Scanning | Gemini API |
| Theme | next-themes |

---

## Features

### Dashboard
- **Summary Cards** — Total Balance, Total Income, Total Expenses computed from all transactions
- **Balance Trend Chart** — Line chart showing true running balance over time (Last Month / 3 Months / 6 Months / All Time). Balance is computed from the full transaction history so it never shows false negatives
- **Spending Breakdown** — Pie chart grouped by category with a date range selector. Shows top 5 categories and groups the rest as "Others"
- **Recent Transactions** — Last 5 transactions per account
- **Quick Insights** — Highest spending category this month, month-over-month expense comparison, income transaction count
- **Monthly Expense Limit** — Set and track a monthly spending budget with a progress bar (green → yellow → red as limit approaches)
- **Account Cards** — Overview of all accounts with balance

### Transactions
- Full table with Date, Name, Category, Type, Amount, Recurring status
- **Search** by name or description
- **Filter** by type (Income / Expense), category, recurring status
- **Sort** by date, amount, or type (click column headers)
- **Pagination** — 10 per page
- **Bulk delete** and single delete (Admin only)
- **Edit** transactions (Admin only)
- **Export** currently filtered transactions as CSV or JSON

### Role-Based UI
- **Admin** — full access: add, edit, delete transactions; manage accounts; set expense limit
- **Viewer** — read-only: all write actions (buttons, dropdowns) are hidden
- Toggle in the navbar persists across sessions via localStorage

### Demo Mode
- Available to logged-out users via the **Live Demo** toggle in the navbar
- Loads 48 pre-built mock transactions spanning 12 months across 10+ categories
- Admin can add, edit, and delete demo transactions — all changes persist in localStorage
- Switching Demo OFF shows the Login / Sign Up flow
- Dedicated demo account page at `/account/demo`

### Authentication
- Sign in / Sign up via Clerk
- New users are automatically provisioned in the database on first login

### Receipt Scanner
- Upload a receipt image on the Add Transaction page
- Gemini API extracts amount, date, description, and transaction type automatically

### Automated Background Jobs (Inngest)
- **Recurring transactions** — processed daily, creates new transaction entries on due dates
- **Budget alerts** — checks every 6 hours, sends email when monthly expense limit exceeds 80%
- **Monthly reports** — sent on the 1st of each month with income/expense summary and spending insights

### Dark Mode
- System preference detected automatically
- Manual toggle in the navbar (sun/moon icon)
- Persists across sessions

---

## Project Structure

```
├── app/
│   ├── (auth)/              # Sign-in / Sign-up pages
│   ├── (main)/
│   │   ├── dashboard/       # Main dashboard page + components
│   │   ├── account/[id]/    # Individual account page
│   │   ├── account/demo/    # Demo account page (no auth)
│   │   ├── transaction/create/  # Add/edit transaction (authenticated)
│   │   └── transaction/new/     # Add/edit transaction (demo mode)
│   └── api/inngest/         # Inngest background job handler
├── actions/                 # Next.js server actions
├── components/              # Shared UI components
│   ├── MockDataContext.jsx  # Demo data state (localStorage)
│   ├── RoleContext.jsx      # Role + demo mode state
│   ├── SummaryCards.jsx
│   ├── BalanceTrendChart.jsx
│   └── Header.jsx
├── data/
│   ├── mock-data.js         # 48 mock transactions across 12 months
│   └── categories.js        # Income + expense category definitions
├── lib/inngest/             # Background job functions
├── emails/                  # Email templates
└── prisma/schema.prisma     # Database schema
```

---

## State Management

All state is managed via React Context API:

| Context | State Managed |
|---|---|
| `RoleContext` | Current role (admin/viewer), demo mode on/off — both persisted in localStorage |
| `MockDataContext` | Demo transactions array — persisted in localStorage, exposes add/update/delete |

Transaction filters, sort config, pagination, and search are local component state inside `TransactionTable`.

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase project (PostgreSQL)
- Clerk account
- Gemini API key
- ArcJet key
- Resend API key

### 1. Clone the repo

```bash
git clone https://github.com/NamanBhatia-NB/Finance_Manager
cd Finance_Manager
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up

DATABASE_URL=""
DIRECT_URL=""

ARCJET_KEY=
RESEND_API_KEY=
GEMINI_API_KEY=
```

> **Clerk keys:** When you first load `localhost:3000`, click "Claim Clerk Keys" in the bottom-right corner to generate and copy your keys automatically.

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **No keys? No problem.** Click **Live Demo** in the navbar to explore the full dashboard with mock data — no account or API keys needed.

---

## Database Schema

```
User          — Clerk user linked to DB record
Account       — Bank / Cash / Brokerage / Crypto accounts
Transaction   — Income or Expense with category, recurring support
Portfolio     — Stores monthly expense limit per user
Holding       — Asset holdings linked to portfolio
AIQuery       — Stores Gemini query/response history
```

---

## Future Scope

- **Multilingual support** — Hindi, Tamil, Bengali via browser locale detection
- **Mobile app** — React Native with offline mode and push notifications for budget alerts
- **Predictive insights** — Forecast next month's spending based on historical patterns
- **ESG tracking** — Tag transactions by environmental/social impact
- **Bank sync** — Connect real bank accounts via Plaid or Setu (India)
- **Shared budgets** — Multi-user household finance tracking

---
