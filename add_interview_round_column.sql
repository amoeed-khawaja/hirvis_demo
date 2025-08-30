-- Add Interview_round column to candidate_data table
ALTER TABLE candidate_data 
ADD COLUMN IF NOT EXISTS Interview_round BOOLEAN DEFAULT FALSE;

-- Add called column to candidate_data table
ALTER TABLE candidate_data 
ADD COLUMN IF NOT EXISTS called BOOLEAN DEFAULT FALSE;

-- Add interview_score column to candidate_data table
ALTER TABLE candidate_data 
ADD COLUMN IF NOT EXISTS interview_score INTEGER;

-- Add interview_notes column to candidate_data table
ALTER TABLE candidate_data 
ADD COLUMN IF NOT EXISTS interview_notes TEXT;

-- Add assistant column to active_jobs table
ALTER TABLE active_jobs 
ADD COLUMN IF NOT EXISTS assistant TEXT;

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id BIGINT REFERENCES active_jobs(job_id) ON DELETE CASCADE,
    login_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for interview_questions table
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS policies for interview_questions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interview_questions' 
      AND policyname = 'Users can view their own interview questions'
  ) THEN
    CREATE POLICY "Users can view their own interview questions" ON interview_questions
      FOR SELECT USING (auth.uid() = login_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interview_questions' 
      AND policyname = 'Users can insert their own interview questions'
  ) THEN
    CREATE POLICY "Users can insert their own interview questions" ON interview_questions
      FOR INSERT WITH CHECK (auth.uid() = login_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interview_questions' 
      AND policyname = 'Users can update their own interview questions'
  ) THEN
    CREATE POLICY "Users can update their own interview questions" ON interview_questions
      FOR UPDATE USING (auth.uid() = login_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'interview_questions' 
      AND policyname = 'Users can delete their own interview questions'
  ) THEN
    CREATE POLICY "Users can delete their own interview questions" ON interview_questions
      FOR DELETE USING (auth.uid() = login_user_id);
  END IF;
END
$$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_interview_questions_job_user ON interview_questions(job_id, login_user_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order ON interview_questions(question_order);
