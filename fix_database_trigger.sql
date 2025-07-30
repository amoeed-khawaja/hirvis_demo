-- Fix for the database trigger issue causing signup errors
-- Run this in your Supabase SQL Editor

-- First, let's drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a new function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users_data table with proper error handling
  BEGIN
    INSERT INTO users_data (display_name, email, phone, paid, paid_date, assistant, login_user_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      0,
      NULL,
      NULL,
      NEW.id  -- Only use NEW.id for login_user_id, let the database generate the primary key
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE LOG 'Error creating user data for user %: %', NEW.id, SQLERRM;
      -- Return NEW to continue with the user creation
      RETURN NEW;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger again
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Make sure the function has the right permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- Success message
SELECT 'Database trigger fixed successfully!' as status; 