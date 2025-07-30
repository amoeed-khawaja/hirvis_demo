-- Fix RLS policies to allow user data creation during onboarding
-- Run this in your Supabase SQL Editor

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users_data;
DROP POLICY IF EXISTS "Users can update their own data" ON users_data;
DROP POLICY IF EXISTS "Users can insert their own data" ON users_data;

-- Create new policies that are more permissive for authenticated users
CREATE POLICY "Users can view their own data" ON users_data
  FOR SELECT USING (auth.uid()::text = login_user_id::text);

CREATE POLICY "Users can update their own data" ON users_data
  FOR UPDATE USING (auth.uid()::text = login_user_id::text);

-- More permissive insert policy - allow any authenticated user to insert
CREATE POLICY "Users can insert their own data" ON users_data
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users_data TO authenticated;

-- Success message
SELECT 'RLS policies updated successfully! Users can now create their data during onboarding.' as status; 