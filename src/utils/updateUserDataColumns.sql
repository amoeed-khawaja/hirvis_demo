-- Add new columns to user_data table for onboarding form
-- This script adds the missing columns needed for the HR recruiter setup

-- Add organization column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_data' AND column_name = 'organization') THEN
        ALTER TABLE user_data ADD COLUMN organization TEXT;
    END IF;
END $$;

-- Add hr_recruiter_name column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_data' AND column_name = 'hr_recruiter_name') THEN
        ALTER TABLE user_data ADD COLUMN hr_recruiter_name TEXT;
    END IF;
END $$;

-- Add hr_agent_voice column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_data' AND column_name = 'hr_agent_voice') THEN
        ALTER TABLE user_data ADD COLUMN hr_agent_voice TEXT;
    END IF;
END $$;

-- Add candidate_questions column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_data' AND column_name = 'candidate_questions') THEN
        ALTER TABLE user_data ADD COLUMN candidate_questions TEXT;
    END IF;
END $$;

-- Add candidate_questions2 column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_data' AND column_name = 'candidate_questions2') THEN
        ALTER TABLE user_data ADD COLUMN candidate_questions2 TEXT;
    END IF;
END $$;

-- Show the updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_data'
ORDER BY ordinal_position; 