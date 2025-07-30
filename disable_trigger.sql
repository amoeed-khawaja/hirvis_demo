-- Completely disable automatic user data creation
-- Run this in your Supabase SQL Editor to fix the signup issue

-- Drop the trigger that's causing the signup error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function as well
DROP FUNCTION IF EXISTS handle_new_user();

-- Success message
SELECT 'Automatic user data creation disabled. Users will be created manually after onboarding.' as status; 