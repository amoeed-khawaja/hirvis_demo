-- Add Resume_URL column to candidate_data table if it doesn't exist
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Check if the column already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'candidate_data' 
        AND column_name = 'Resume_URL'
    ) THEN
        -- Add the column
        ALTER TABLE candidate_data 
        ADD COLUMN "Resume_URL" TEXT;
        
        RAISE NOTICE 'Resume_URL column added to candidate_data table';
    ELSE
        RAISE NOTICE 'Resume_URL column already exists in candidate_data table';
    END IF;
END $$;

-- Optionally, you can also add a comment to the column
COMMENT ON COLUMN candidate_data."Resume_URL" IS 'URL to the candidate resume stored in Supabase storage';
