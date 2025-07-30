# Supabase Setup Guide for HR Dashboard

## 🔧 Complete Setup Instructions

### Step 1: Run the Main SQL Script

1. **Go to your Supabase Dashboard:**

   - Open https://supabase.com/dashboard
   - Select your project: `hr-dashoard`

2. **Open SQL Editor:**

   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste This SQL:**

   ```sql
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
     FOR SELECT USING (auth.uid()::text = id::text);

   CREATE POLICY "Users can update their own data" ON users_data
     FOR UPDATE USING (auth.uid()::text = id::text);

   CREATE POLICY "Users can insert their own data" ON users_data
     FOR INSERT WITH CHECK (auth.uid()::text = id::text);

   -- Create function to handle new user signup
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO users_data (id, display_name, email, phone, paid, paid_date, assistant, login_user_id)
     VALUES (
       NEW.uid,  -- Using uid instead of uuid
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
       NEW.email,
       NEW.raw_user_meta_data->>'phone',
       0,
       NULL,
       NULL,
       NEW.uid   -- Using uid instead of uuid
     );
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
   ```

4. **Run the Script:**
   - Click the "Run" button (or press Ctrl+Enter)
   - You should see: `users_data table created successfully!`

### Step 2: Verify Authentication Settings

1. **Go to Authentication Settings:**

   - In Supabase Dashboard, click "Authentication" → "Settings"

2. **Check Email Templates:**

   - Go to "Email Templates" tab
   - Make sure "Confirm signup" template is enabled
   - You can customize the email template here

3. **Check Site URL:**
   - Make sure Site URL is set to: `http://localhost:3000`
   - Add redirect URLs: `http://localhost:3000/dashboard`

### Step 3: Check RLS Policies

1. **Go to Database → Tables:**
   - Click on "users_data" table
   - Go to "Policies" tab
   - Verify these policies exist:
     - "Users can view their own data"
     - "Users can update their own data"
     - "Users can insert their own data"

### Step 4: Test the Setup

1. **Start your development server:**

   ```bash
   cd hr-dashboard
   npm start
   ```

2. **Try the onboarding form:**
   - Sign up with a new email
   - Complete the onboarding form
   - Check if data is saved to `users_data` table

### Step 5: Troubleshooting

If you're still having issues after line 2:

1. **Check if user is authenticated:**

   - Open browser console
   - Look for any authentication errors

2. **Check database permissions:**

   - Go to Database → Tables → users_data
   - Try to insert a test record manually

3. **Check RLS policies:**

   - Make sure policies are enabled
   - Test with a simple query

4. **Check environment variables:**
   - Make sure `.env` file has correct Supabase URL and keys
   - Restart the development server after changing `.env`

### Common Issues:

1. **"No authenticated user found"** - User not logged in
2. **"Database error"** - RLS policies or table structure issue
3. **"Missing required fields"** - Form validation issue

### Next Steps:

After running the SQL script:

1. The `users_data` table will be created with correct structure
2. RLS policies will be set up
3. Trigger will automatically create user records
4. The onboarding form should work properly

Try the form again after completing these steps!
