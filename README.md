# Fisc Financial - Backend

Fisc Financial is a budgeting application for tracking income, expenses, and paycheck allocations using Supabase.

## MVP Scope
- User Authentication (Email/Password)
- Income Tracking (Multiple sources)
- Paycheck Allocation System (Savings, Expenses, Checking)
- Real-time Balance Updates

## Prerequisites
- Docker
- Supabase CLI
- Node.js (v20+)

## Quick Start
```bash
npm install
supabase start
supabase db reset
```

## Environment Variables
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Architecture
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Security**: Row Level Security (RLS)
