-- =====================================================
-- SUPABASE SQL SCRIPTS FOR HR DASHBOARD
-- =====================================================
-- Copy and paste these scripts into your Supabase SQL Editor
-- Run them one by one in order

-- =====================================================
-- SCRIPT 1: CREATE USERS_DATA TABLE
-- =====================================================

-- First, backup existing data (if any)
CREATE TABLE IF NOT EXISTS users_data_backup AS SELECT * FROM users_data;

-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS users_data CASCADE;

-- Create the users_data table with exact structure required
CREATE TABLE users_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  candidate_questions TEXT,
  candidate_questions2 TEXT,
  paid INTEGER DEFAULT 0,
  paid_date TIMESTAMP WITH TIME ZONE,
  assistant TEXT,
  login_user_id UUID,
  assistant_api TEXT,
  assistant_name TEXT,
  recruiter_name TEXT
);

-- =====================================================
-- SCRIPT 2: ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on users_data table
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SCRIPT 3: CREATE RLS POLICIES
-- =====================================================

-- Policy for users to view their own data
CREATE POLICY "Users can view their own data" ON users_data
  FOR SELECT USING (auth.uid()::text = id::text);

-- Policy for users to update their own data
CREATE POLICY "Users can update their own data" ON users_data
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy for users to insert their own data
CREATE POLICY "Users can insert their own data" ON users_data
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- =====================================================
-- SCRIPT 4: CREATE TRIGGER FUNCTION
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_data (id, display_name, email, phone, paid, paid_date, assistant, login_user_id)
  VALUES (
    NEW.uid,  -- Using uid from auth.users
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    0,
    NULL,
    NULL,
    NEW.uid   -- Using uid from auth.users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCRIPT 5: CREATE TRIGGER
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically add users to users_data table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- SCRIPT 6: CREATE INDEXES
-- =====================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_data_id ON users_data(id);
CREATE INDEX IF NOT EXISTS idx_users_data_email ON users_data(email);
CREATE INDEX IF NOT EXISTS idx_users_data_login_user_id ON users_data(login_user_id);

-- =====================================================
-- SCRIPT 7: GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users_data TO authenticated;

-- =====================================================
-- SCRIPT 8: VERIFICATION QUERIES
-- =====================================================

-- Check if table was created successfully
SELECT 'users_data table created successfully!' as status;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users_data';

-- Check trigger
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- =====================================================
-- SCRIPT 9: TEST DATA INSERT (OPTIONAL)
-- =====================================================

-- Uncomment the lines below to test with sample data
-- INSERT INTO users_data (id, display_name, email, phone, organization, paid, login_user_id)
-- VALUES (
--   gen_random_uuid(),
--   'Test User',
--   'test@example.com',
--   '+1234567890',
--   'Test Organization',
--   0,
--   gen_random_uuid()
-- );

-- =====================================================
-- SCRIPT 10: CLEANUP (IF NEEDED)
-- =====================================================

-- If you need to start over, uncomment these lines:
-- DROP TABLE IF EXISTS users_data CASCADE;
-- DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Copy each script section above
-- 2. Paste into Supabase SQL Editor
-- 3. Run each script in order (1-8)
-- 4. Check the verification queries in script 8
-- 5. Your onboarding form should now work!
-- ===================================================== 