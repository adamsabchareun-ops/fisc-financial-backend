# Fisc Financial - Developer Guide

## 1. Project Overview
Fisc Financial is a subscription-based financial health dashboard built with Next.js, Supabase, and PostgreSQL.

## 2. Prerequisites
You need the following software installed before you begin:

*   **Docker Desktop**: Essential for running the app.
*   **VS Code**: Recommended editor.
*   **Git**: For version control.

## 3. First Time Setup

### Step 1: Clone the Repo
Open your terminal and run:

```bash
git clone https://github.com/adamsabchareun-ops/fisc-financial-backend.git
cd fisc-financial-backend
```

### Step 2: Environment Keys
The application currently connects to a Live Supabase Backend (Production). You must configure this manually.

1.  Create a file named `.env.local` in the root folder.
2.  Log in to your Supabase Dashboard.
3.  Select the **'Vital Code Company'** project.
4.  Go to **Settings -> API**.
5.  Copy the URL and Anon Key.
6.  Your `.env.local` should look like this:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**WARNING**: Do not commit these keys to GitHub.

### Step 3: Database Initialization (Crucial)
Because we use a custom Trigger flow, the profiles table is not automatically created by the initial migration. You must create it manually to prevent sign-up crashes.

1.  Go to **Supabase Dashboard -> SQL Editor -> New Query**.
2.  Paste and Run this script:

```sql
-- 1. Create Profiles Table (Required for Auth Trigger)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies (Users can only see/edit their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

## 4. Running the Application
We use Docker to run the Frontend application.

**Note**: While the Docker Compose file includes a local database container (`fisc_local_db`), the application is currently configured via `.env.local` to connect to the Live Supabase Cloud Project. The local database container is currently unused.

Start the App:

```bash
docker-compose up -d
```

Access: Open http://localhost:3000 in your browser.

## 5. Daily Workflow

*   **Stop the App**: `docker-compose down`
*   **View Logs**: `docker logs -f fisc_frontend`
*   **Rebuild (New Packages)**: `docker-compose up -d --build`

## 6. Troubleshooting

*   **"Database error saving new user" (500 Error)**:
    *   Check Supabase Logs. If you see `relation "public.profiles" does not exist`, you missed Step 3 above.
    *   If you see `null value in column "username"`, ensure your profiles table allows nullable usernames.

*   **"Site can't be reached"**: Ensure Docker Desktop is running.
