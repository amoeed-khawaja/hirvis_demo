-- Add user_login_id column to active_jobs table
ALTER TABLE active_jobs 
ADD COLUMN user_login_id uuid;

-- Add user_login_id column to candidate_data table  
ALTER TABLE candidate_data 
ADD COLUMN user_login_id uuid;

-- Add user_login_id column to active_job_candidates table
ALTER TABLE active_job_candidates 
ADD COLUMN user_login_id uuid;

-- Create indexes for better performance
CREATE INDEX idx_active_jobs_user_id ON active_jobs(user_login_id);
CREATE INDEX idx_candidate_data_user_id ON candidate_data(user_login_id);
CREATE INDEX idx_active_job_candidates_user_id ON active_job_candidates(user_login_id);

-- Update RLS policies to include user_login_id filtering
-- For active_jobs table
DROP POLICY IF EXISTS "Users can view their own jobs" ON active_jobs;
CREATE POLICY "Users can view their own jobs" ON active_jobs
  FOR ALL USING (user_login_id = auth.uid());

-- For candidate_data table  
DROP POLICY IF EXISTS "Users can view their own candidates" ON candidate_data;
CREATE POLICY "Users can view their own candidates" ON candidate_data
  FOR ALL USING (user_login_id = auth.uid());

-- For active_job_candidates table
DROP POLICY IF EXISTS "Users can view their own job candidates" ON active_job_candidates;
CREATE POLICY "Users can view their own job candidates" ON active_job_candidates
  FOR ALL USING (user_login_id = auth.uid()); 