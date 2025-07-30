import { supabase } from "../supabase";

// SQL commands to set up user_data table and triggers
const USER_DATA_SETUP_SQL = `
-- Create user_data table to store additional user information
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_data table
DROP POLICY IF EXISTS "Users can view their own data" ON user_data;
CREATE POLICY "Users can view their own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own data" ON user_data;
CREATE POLICY "Users can update their own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own data" ON user_data;
CREATE POLICY "Users can insert their own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_data (user_id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add users to user_data table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update last_login timestamp
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_data 
  SET last_login = NOW()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last_login on user sign in
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_email ON user_data(email);
CREATE INDEX IF NOT EXISTS idx_user_data_created_at ON user_data(created_at);
`;

// Function to set up user_data table and triggers
export const setupUserDataTable = async () => {
  try {
    console.log("🔧 Setting up user_data table and triggers...");

    // Execute the SQL commands using Supabase's SQL editor
    // Note: This needs to be run in the Supabase SQL editor
    console.log("📝 Please run the following SQL in your Supabase SQL Editor:");
    console.log(USER_DATA_SETUP_SQL);

    // Test if the table exists
    const { data, error } = await supabase
      .from("user_data")
      .select("id")
      .limit(1);

    if (error) {
      console.log(
        "❌ user_data table doesn't exist yet. Please run the SQL above."
      );
      return false;
    }

    console.log("✅ user_data table exists and is accessible");
    return true;
  } catch (error) {
    console.error("❌ Error checking user_data table:", error);
    return false;
  }
};

// Function to test the setup
export const testUserDataSetup = async () => {
  try {
    console.log("🧪 Testing user_data setup...");

    // Test table access
    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .limit(5);

    if (error) {
      console.error("❌ Error accessing user_data table:", error);
      return false;
    }

    console.log("✅ user_data table is working correctly");
    console.log("📊 Current user records:", data.length);
    return true;
  } catch (error) {
    console.error("❌ Error in testUserDataSetup:", error);
    return false;
  }
};

// Function to display setup instructions
export const displaySetupInstructions = () => {
  console.log(`
🎯 USER DATA SETUP INSTRUCTIONS

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: hr-dashoard
3. Go to SQL Editor
4. Copy and paste the SQL commands below:

${USER_DATA_SETUP_SQL}

5. Click "Run" to execute the commands
6. The system will automatically:
   - Create user_data table
   - Set up Row Level Security policies
   - Create triggers for automatic user data creation
   - Update last_login timestamps

7. Test the setup by running: testUserDataSetup()

✅ After setup, every new user signup will automatically:
   - Create a record in user_data table
   - Store their email and basic info
   - Track their login activity
  `);
};
