
## Integrate Lovable Cloud into Zumert

Lovable Cloud provides your app with a database, authentication, and storage -- all with zero external setup.

### Step 1: Enable Lovable Cloud

Activate Lovable Cloud to provision a database and auth system for the project.

### Step 2: Database — Jobs table

Create a `jobs` table to store job listings with columns: id, title, company, location, salary, type, posted_at, logo, tags, and user_id (the poster). Enable Row-Level Security so anyone can read jobs, but only the poster can create/edit/delete their own.

### Step 3: Database — Profiles table

Create a `profiles` table (id, full_name, email, avatar_url, bio, location, role) linked to auth users with auto-creation via trigger. RLS so users can read all profiles but only update their own.

### Step 4: Authentication — Login and Signup

Wire up the existing login and signup pages to real Supabase auth (email/password + Google sign-in). Add session state management using `onAuthStateChange` and an auth context/provider.

### Step 5: Protected Routes

Add an `_authenticated` layout route to protect the Post Job and Profile pages. Redirect unauthenticated users to `/login`.

### Step 6: Post Job — Save to Database

Update the Post Job form to submit real data to the `jobs` table via a server function, tied to the authenticated user.

### Step 7: Homepage — Load Jobs from Database

Replace the hardcoded `sampleJobs` with a server function that fetches jobs from the database. Keep the category filter working against live data.

### Step 8: Profile Page — Show Real User Data

Display the logged-in user's profile info from the `profiles` table instead of the hardcoded "John Doe". Show real saved jobs count and applications.

---

### What Lovable Cloud gives you

- **Database and storage** are built in -- no external accounts needed
- **User authentication** with email/password and Google sign-in, zero hassle
- **Server functions** for secure backend logic (posting jobs, fetching data)

