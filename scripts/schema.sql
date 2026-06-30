-- AYIKLA PostgreSQL Database Schema
-- You can run this in your Supabase SQL Editor to initialize the database tables.

-- 1. Profiles Table (extending Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    premium_status TEXT DEFAULT 'Free' CHECK (premium_status IN ('Free', 'Pro', 'Enterprise')),
    analysis_limit INTEGER DEFAULT 5,
    analysis_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Job Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    job_url TEXT,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    location TEXT,
    job_description TEXT,
    ghost_score INTEGER NOT NULL CHECK (ghost_score >= 0 AND ghost_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    criteria_breakdown JSONB NOT NULL,
    ai_verdict TEXT NOT NULL,
    ai_explanation TEXT NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'pending')),
    is_saved BOOLEAN DEFAULT false
);

-- Enable RLS for Analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own analyses" 
    ON public.analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own analyses" 
    ON public.analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own analyses" 
    ON public.analyses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own analyses" 
    ON public.analyses FOR DELETE USING (auth.uid() = user_id);

-- 3. Company Insights Table
CREATE TABLE IF NOT EXISTS public.company_insights (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    industry TEXT,
    employee_count_range TEXT,
    average_ghost_score INTEGER DEFAULT 0,
    total_jobs_analyzed INTEGER DEFAULT 0,
    ghost_jobs_count INTEGER DEFAULT 0,
    active_jobs_count INTEGER DEFAULT 0,
    average_days_open INTEGER DEFAULT 0,
    warning_flags TEXT[]
);

-- Enable RLS for Company Insights
ALTER TABLE public.company_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to company insights" 
    ON public.company_insights FOR SELECT USING (true);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success'))
);

-- Enable RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own notifications" 
    ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own notifications" 
    ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
