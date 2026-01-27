# Fisc Financial (Full Stack)
This repository contains the full-stack Next.js application for Fisc Financial. It includes both the frontend UI and the backend logic (Server Actions) connected to Supabase.

## Tech Stack
**Framework**: Next.js 14 (App Router)

**Database**: Supabase (PostgreSQL)

**Auth**: Supabase Auth

**Styling**: Tailwind CSS

## Getting Started
### 1. Prerequisites
- Node.js installed
- Access to the "Vital Code Company" Supabase Organization

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/adamsabchareun-ops/fisc-financial-backend.git
cd fisc-financial-backend
npm install
```

### 3. Environment Setup (Critical)
This project requires environment variables to connect to the live database.

1. Create a file named `.env.local` in the root directory.
2. Log in to Supabase and go to **Project Settings > API**.
3. Copy the Project URL and anon public key.
4. Paste them into your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL="your_project_url_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
- `/src/app`: Main pages (Dashboard, Login, Signup).
- `/src/components`: Reusable UI components.
- `/src/hooks`: Custom hooks for data fetching (useHorizon).
- `/supabase`: SQL snippets and database documentation.

## Current Features (v0.1)
- **Authentication**: Email/Password Signup & Login with Redirects.
- **Dashboard**: "Weekly Horizon" view (List View).
- **Allocations**: Create, View, and Delete budget allocations.
- **Security**: Full Row Level Security (RLS) enabled on all tables.
