-- TEMPORARILY DISABLE RLS FOR TESTING
-- ⚠️  WARNING: This disables all security policies!
-- ⚠️  Only use for testing, then re-enable with proper policies

-- Disable RLS on all tables
ALTER TABLE active_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE active_job_candidates DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('active_jobs', 'candidate_data', 'active_job_candidates')
ORDER BY tablename;

-- To re-enable RLS after testing, run the fixUserAuthRLS.sql file 