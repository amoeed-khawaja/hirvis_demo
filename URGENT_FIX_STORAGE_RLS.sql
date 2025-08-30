-- URGENT: Fix storage RLS policies for CV bucket
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and run it

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
        RAISE NOTICE 'Resume_URL column added successfully';
    ELSE
        RAISE NOTICE 'Resume_URL column already exists';
    END IF;
END $$;

-- 2. Drop all existing storage policies for cv bucket
DROP POLICY IF EXISTS "cv_bucket_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "cv_bucket_delete_policy" ON storage.objects;

-- 3. Create NEW storage policies for cv bucket (allow all authenticated users)
CREATE POLICY "cv_bucket_select_policy" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "cv_bucket_insert_policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "cv_bucket_update_policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "cv_bucket_delete_policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cv' AND 
    auth.role() = 'authenticated'
  );

-- 4. Fix candidate_data table policies
DROP POLICY IF EXISTS "Users can view their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can insert their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can update their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can delete their own candidates" ON candidate_data;

CREATE POLICY "Users can view their own candidates" ON candidate_data
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own candidates" ON candidate_data
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own candidates" ON candidate_data
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own candidates" ON candidate_data
  FOR DELETE USING (login_user_id = auth.uid());

-- 5. Grant storage permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;

-- Success message
SELECT 'Storage RLS and Resume_URL column fixed successfully!' as status;
