# RunnerCoach MVP

A simple training management system for coaches and athletes.

## Tech Stack
- **Frontend**: Next.js (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Supabase Project Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `schema.sql` (found in the root of this repo) to set up the database tables and RLS policies.
3. Go to **Project Settings > API** and find your `Project URL` and `Anon Key`.

### 2. Environment Variables
1. Create a `.env.local` file in the root directory.
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## Features
- **Authentication**: Email/Password with role-based redirection (COACH or ATHLETE).
- **Coach Dashboard**:
  - Link athletes by email.
  - Plan workouts (date, type, description).
  - View athlete training history and completion status.
- **Athlete Dashboard**:
  - View weekly training plan.
  - Mark workouts as completed with RPE (1-10) and notes.
- **Matching Logic**: Automatically identifies workouts as 'planned', 'completed', or 'missed' based on date and athlete reports.
