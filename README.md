# Fisc Financial - Developer Guide

## 1. Project Overview
Fisc Financial is a subscription-based financial health dashboard built with Next.js, Supabase, and PostgreSQL.

## 2. Prerequisites (Step-by-Step)
You need the following software installed before you begin:

*   **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Essential for running the app (Database + Frontend).
*   **[VS Code](https://code.visualstudio.com/)**: Recommended editor.
*   **[Git](https://git-scm.com/downloads)**: For version control.

## 3. First Time Setup

### Step 1: Clone the Repo
Open your terminal and run:
```bash
git clone https://github.com/adamsabchareun-ops/fisc-financial-backend.git
cd fisc-financial-backend
```

### Step 2: Environment Keys
The application connects to a live Supabase backend for Authentication. You need to configure this manually.

1.  Create a file named `.env.local` in the root folder of the project.
2.  **How to get these keys:**
    *   Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
    *   Select the **'Vital Code Company'** (or your active) project.
    *   Go to **Project Settings** (Cog icon at the bottom left) -> **API**.
    *   Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`.
    *   Copy the **anon / public key** and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Your `.env.local` should look like this:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

> **WARNING**: Do not commit these keys to GitHub.

## 4. Running the Application (The 'One-Click' Method)
We use Docker to run the entire stack (Database + Website). You do not need to install Node.js locally if you don't want to.

1.  **Start the App**:
    ```bash
    docker-compose up -d
    ```
2.  **Access**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Daily Workflow

*   **Stop the App**:
    ```bash
    docker-compose down
    ```

*   **View Logs**:
    ```bash
    docker-compose logs -f web
    ```

*   **Rebuild** (If you add new packages):
    ```bash
    docker-compose up -d --build
    ```

## 6. Troubleshooting

*   **"Site can't be reached"**: Ensure Docker Desktop is running.
*   **"Infinite Refresh Loop"**: This is fixed by the volume config, but if it happens, restart Docker.
*   **"Database Connection Error"**: Ensure the `db` container is healthy in the Docker Dashboard.
