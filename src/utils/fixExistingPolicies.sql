-- Safe RLS fix that handles existing policies
-- This will drop existing policies and create new ones

-- Enable RLS on all tables
ALTER TABLE active_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_job_candidates ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
-- active_jobs policies
DROP POLICY IF EXISTS "Users can view their own jobs" ON active_jobs;
DROP POLICY IF EXISTS "Users can insert their own jobs" ON active_jobs;
DROP POLICY IF EXISTS "Users can update their own jobs" ON active_jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs" ON active_jobs;
DROP POLICY IF EXISTS "Allow authenticated users to view jobs" ON active_jobs;
DROP POLICY IF EXISTS "Allow authenticated users to insert jobs" ON active_jobs;
DROP POLICY IF EXISTS "Allow authenticated users to update jobs" ON active_jobs;
DROP POLICY IF EXISTS "Allow authenticated users to delete jobs" ON active_jobs;

-- candidate_data policies
DROP POLICY IF EXISTS "Users can view their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can insert their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can update their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can delete their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to view all candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to insert candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to update candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to delete candidates" ON candidate_data;

-- active_job_candidates policies
DROP POLICY IF EXISTS "Users can view their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can insert their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can update their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can delete their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to view job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to insert job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to update job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to delete job candidates" ON active_job_candidates;

-- Create new user-specific policies for active_jobs table
CREATE POLICY "Users can view their own jobs" ON active_jobs
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own jobs" ON active_jobs
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own jobs" ON active_jobs
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own jobs" ON active_jobs
  FOR DELETE USING (login_user_id = auth.uid());

-- Create new user-specific policies for candidate_data table
CREATE POLICY "Users can view their own candidates" ON candidate_data
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own candidates" ON candidate_data
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own candidates" ON candidate_data
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own candidates" ON candidate_data
  FOR DELETE USING (login_user_id = auth.uid());

-- Create new user-specific policies for active_job_candidates table
CREATE POLICY "Users can view their own job candidates" ON active_job_candidates
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own job candidates" ON active_job_candidates
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own job candidates" ON active_job_candidates
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own job candidates" ON active_job_candidates
  FOR DELETE USING (login_user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_active_jobs_login_user_id ON active_jobs(login_user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_data_login_user_id ON candidate_data(login_user_id);
CREATE INDEX IF NOT EXISTS idx_active_job_candidates_login_user_id ON active_job_candidates(login_user_id);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_active_job_candidates_job_user ON active_job_candidates(job_id, login_user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_data_id_user ON candidate_data(id, login_user_id);

-- Verify the policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('active_jobs', 'candidate_data', 'active_job_candidates')
ORDER BY tablename, policyname; 