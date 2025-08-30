-- Fix storage RLS policies and add Resume_URL column
-- Run this in your Supabase SQL Editor

-- 1. Add Resume_URL column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'candidate_data' 
        AND column_name = 'Resume_URL'
    ) THEN
        ALTER TABLE candidate_data ADD COLUMN "Resume_URL" TEXT;
        RAISE NOTICE 'Resume_URL column added to candidate_data table';
    ELSE
        RAISE NOTICE 'Resume_URL column already exists in candidate_data table';
    END IF;
END $$;

-- 2. Create storage bucket policies for 'cv' bucket
-- Note: Make sure your 'cv' bucket exists first in Storage > Settings

-- Enable RLS on storage if not already enabled (this might already be done)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies for cv bucket (if any)
DROP POLICY IF EXISTS "cv_bucket_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_delete_policy" ON storage.objects;

-- Create storage policies for 'cv' bucket
-- Allow authenticated users to view files in cv bucket
CREATE POLICY "cv_bucket_select_policy" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to upload files to cv bucket
CREATE POLICY "cv_bucket_insert_policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own files in cv bucket  
CREATE POLICY "cv_bucket_update_policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own files in cv bucket
CREATE POLICY "cv_bucket_delete_policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

-- 3. Ensure candidate_data table RLS policies are correct
-- Drop and recreate candidate_data policies to be safe
DROP POLICY IF EXISTS "Users can view their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can insert their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can update their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can delete their own candidates" ON candidate_data;

-- Create user-specific policies for candidate_data table
CREATE POLICY "Users can view their own candidates" ON candidate_data
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own candidates" ON candidate_data
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own candidates" ON candidate_data
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own candidates" ON candidate_data
  FOR DELETE USING (login_user_id = auth.uid());

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Success message
SELECT 'Storage RLS policies and Resume_URL column configured successfully!' as status;
