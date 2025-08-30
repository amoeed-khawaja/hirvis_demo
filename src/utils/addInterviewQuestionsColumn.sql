-- Add interview_questions column to active_jobs table
ALTER TABLE active_jobs 
ADD COLUMN interview_questions TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN active_jobs.interview_questions IS 'Custom interview questions for this job posting';

-- Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'active_jobs' 
  AND column_name = 'interview_questions'; 