-- SQL Script to set up users_data table in Supabase
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- First, let's backup the existing data (if any)
CREATE TABLE IF NOT EXISTS users_data_backup AS SELECT * FROM users_data;

-- Drop the existing table and recreate with correct structure
DROP TABLE IF EXISTS users_data CASCADE;

-- Create the users_data table with the exact structure required
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

-- Enable Row Level Security
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users_data table
CREATE POLICY "Users can view their own data" ON users_data
  FOR SELECT USING (auth.uid()::text = login_user_id::text);

CREATE POLICY "Users can update their own data" ON users_data
  FOR UPDATE USING (auth.uid()::text = login_user_id::text);

CREATE POLICY "Users can insert their own data" ON users_data
  FOR INSERT WITH CHECK (auth.uid()::text = login_user_id::text);

-- Create function to handle new user signup
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
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add users to users_data table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_data_id ON users_data(id);
CREATE INDEX IF NOT EXISTS idx_users_data_email ON users_data(email);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users_data TO authenticated;

-- Success message
SELECT 'users_data table created successfully!' as status; 