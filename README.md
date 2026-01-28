# Fisc Financial - Developer Onboarding Guide
Welcome to the team. If you are reading this, you are likely setting up your local environment for the first time.

Please read this entire document before you run any code. It will save you from the common setup errors we have already solved.

## 1. Understanding the Repo Structure
First, a clarification on the name. You cloned a repository called 'fisc-financial-backend'. However, this is actually a Monorepo. It contains everything:

*   The Next.js Frontend (`src/app`, `components`)
*   The Backend Logic (Server Actions, Supabase utilities)
*   The Database Definitions (SQL migrations)

You do not need to look for a separate frontend repository. It is all here.

## 2. Prerequisites
Before you start, make sure you have:

*   Node.js installed on your machine.
*   Access to the 'Vital Code Company' organization on Supabase.
*   Access to this GitHub repository.

## 3. The Environment Keys (Critical Step)
The application will crash immediately if you try to run it without API keys. We do not commit these keys to GitHub for security reasons. You need to create them manually.

1.  Create a new file in the root folder of this project named: `.env.local`
2.  Log in to the Supabase Dashboard.
3.  Go to **Project Settings -> API**.

You need two values from that page:

*   Project URL
*   anon public key

Paste them into your new `.env.local` file exactly like this:

```bash
NEXT_PUBLIC_SUPABASE_URL="paste_your_url_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="paste_your_anon_key_here"
```

Save the file.

## 4. Installation and Running
Now you are ready to boot up the app. Open your terminal in the project folder and run:

```bash
npm install
npm run dev
```

Open your web browser to [http://localhost:3000](http://localhost:3000).

## 5. Troubleshooting Common Issues
New developers often hit these specific speed bumps. Check this list if you get stuck.

**ISSUE: I see a QR Code or a 'Welcome' screen.**
**SOLUTION:** This is a default overlay from our development tools or your browser extensions. We do not use QR codes for login.
1.  Ignore the terminal output.
2.  In your browser address bar, manually type [http://localhost:3000/signup](http://localhost:3000/signup) or [http://localhost:3000/login](http://localhost:3000/login) to bypass the screen.

**ISSUE: I see a red error 'Could not find the table public.pay_periods in the schema cache'.**
**SOLUTION:** The Supabase API sometimes needs a nudge to recognize new tables.
1.  Go to Supabase Dashboard -> Project Settings -> API.
2.  Click 'Reload schema cache' at the bottom.
3.  Refresh your local browser.

**ISSUE: The dashboard is empty / zeros.**
**SOLUTION:** This is normal. We have not built the onboarding wizard yet. If you are a new user, you have no data, so the app correctly shows zero.

## 6. Architecture Overview
For those working on backend features:

*   **Database:** We use PostgreSQL on Supabase.
*   **Security:** We use Row Level Security (RLS). This means you cannot simply query "all users." You can only query data where 'user_id' matches the currently logged-in user.
*   **Auth:** We use Supabase Auth (Email/Password).

If you are working on the frontend:

*   We use Tailwind CSS for styling.
*   Components are located in `src/components`.
*   Pages are in `src/app`.

If you get stuck, check the 'Standup' notes in our documentation folder or ask Adam.
