import { supabase } from "../supabase";

// SQL commands to fix RLS policies for candidate_data table
export const FIX_RLS_SQL = `
-- Enable RLS with proper user authentication policies
-- This creates secure user-specific policies

-- Enable RLS on all tables
ALTER TABLE active_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_job_candidates ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can insert their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can update their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Users can delete their own candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to view all candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to insert candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to update candidates" ON candidate_data;
DROP POLICY IF EXISTS "Allow authenticated users to delete candidates" ON candidate_data;

DROP POLICY IF EXISTS "Users can view their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can insert their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can update their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Users can delete their own job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to view job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to insert job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to update job candidates" ON active_job_candidates;
DROP POLICY IF EXISTS "Allow authenticated users to delete job candidates" ON active_job_candidates;

-- Create user-specific policies for candidate_data table
CREATE POLICY "Users can view their own candidates" ON candidate_data
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own candidates" ON candidate_data
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own candidates" ON candidate_data
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own candidates" ON candidate_data
  FOR DELETE USING (login_user_id = auth.uid());

-- Create user-specific policies for active_job_candidates table
CREATE POLICY "Users can view their own job candidates" ON active_job_candidates
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own job candidates" ON active_job_candidates
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own job candidates" ON active_job_candidates
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own job candidates" ON active_job_candidates
  FOR DELETE USING (login_user_id = auth.uid());

-- Create user-specific policies for active_jobs table
CREATE POLICY "Users can view their own jobs" ON active_jobs
  FOR SELECT USING (login_user_id = auth.uid());

CREATE POLICY "Users can insert their own jobs" ON active_jobs
  FOR INSERT WITH CHECK (login_user_id = auth.uid());

CREATE POLICY "Users can update their own jobs" ON active_jobs
  FOR UPDATE USING (login_user_id = auth.uid());

CREATE POLICY "Users can delete their own jobs" ON active_jobs
  FOR DELETE USING (login_user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_active_jobs_login_user_id ON active_jobs(login_user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_data_login_user_id ON candidate_data(login_user_id);
CREATE INDEX IF NOT EXISTS idx_active_job_candidates_login_user_id ON active_job_candidates(login_user_id);
`;

// Function to check current RLS status
export const checkRLSStatus = async () => {
  try {
    console.log("🔍 Checking RLS status...");

    // Test if we can read from candidate_data
    const { data: readTest, error: readError } = await supabase
      .from("candidate_data")
      .select("id")
      .limit(1);

    if (readError) {
      console.error("❌ Read test failed:", readError);
    } else {
      console.log("✅ Read test successful");
    }

    // Get current user ID for the test insert
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("❌ No authenticated user found for RLS test");
      return { readSuccess: false, insertSuccess: false };
    }

    // Test if we can insert into candidate_data
    const testData = {
      "Full Name": "RLS Test Candidate",
      Email: "rls-test@example.com",
      Phone: 1234567890,
      Score: 5,
      Experience: 2,
      Education: "RLS Test",
      login_user_id: user.id, // Include the user ID for RLS policy
    };

    const { data: insertTest, error: insertError } = await supabase
      .from("candidate_data")
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert test failed:", insertError);

      // Clean up if insert partially succeeded
      if (insertTest) {
        await supabase.from("candidate_data").delete().eq("id", insertTest.id);
      }
    } else {
      console.log("✅ Insert test successful:", insertTest);

      // Clean up test data
      await supabase.from("candidate_data").delete().eq("id", insertTest.id);

      console.log("✅ Cleanup successful");
    }

    return { readSuccess: !readError, insertSuccess: !insertError };
  } catch (error) {
    console.error("❌ RLS status check failed:", error);
    return { readSuccess: false, insertSuccess: false };
  }
};

// Function to temporarily disable RLS for testing
export const disableRLSTemporarily = async () => {
  console.log(`
⚠️  TEMPORARY RLS DISABLE INSTRUCTIONS

To temporarily disable RLS for testing, run this SQL in Supabase:

ALTER TABLE candidate_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE active_job_candidates DISABLE ROW LEVEL SECURITY;

⚠️  WARNING: This will disable all security policies!
⚠️  Only do this for testing, then re-enable with proper policies.

To re-enable after testing:
ALTER TABLE candidate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_job_candidates ENABLE ROW LEVEL SECURITY;
  `);
};

// Function to display fix instructions
export const displayFixInstructions = () => {
  console.log(`
🔧 RLS POLICY FIX REQUIRED

The candidate_data table has RLS enabled but missing policies.
Please run these SQL commands in your Supabase SQL Editor:

${FIX_RLS_SQL}

📋 Steps:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL above
4. Click "Run" to execute
5. Refresh your React app

This will:
✅ Enable RLS on candidate_data table
✅ Create proper RLS policies for all operations
✅ Create active_job_candidates table
✅ Set up RLS policies for active_job_candidates
✅ Allow authenticated users to perform CRUD operations

🔍 Alternative: If you want to test quickly, you can temporarily disable RLS:
${FIX_RLS_SQL.replace(
  /-- Create new RLS policies.*?DELETE USING \(auth\.role\(\) = 'authenticated'\);/gs,
  "-- RLS temporarily disabled for testing"
)}
  `);
};
