-- Add credits column to users_data table
-- Run this script in your Supabase SQL Editor

-- Add credits column if it doesn't exist
ALTER TABLE users_data 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- Update existing records to have 0 credits if they don't have any
UPDATE users_data 
SET credits = 0 
WHERE credits IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_data_credits ON users_data(credits);

-- Success message
SELECT 'Credits column added successfully!' as status; 