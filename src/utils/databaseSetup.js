import { supabase } from "../supabase";

// SQL commands to set up the database structure (updated for existing table)
export const DATABASE_SETUP_SQL = `
-- Create active_job_candidates table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS active_job_candidates (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES active_jobs(job_id) ON DELETE CASCADE,
  candidate_id BIGINT REFERENCES candidate_data(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Enable RLS on active_job_candidates table
ALTER TABLE active_job_candidates ENABLE ROW LEVEL SECURITY;

-- RLS policies for active_job_candidates table
CREATE POLICY "Allow authenticated users to view job candidates" ON active_job_candidates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert job candidates" ON active_job_candidates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update job candidates" ON active_job_candidates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete job candidates" ON active_job_candidates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS on candidate_data table (if not already enabled)
ALTER TABLE candidate_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for candidate_data table (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'candidate_data' AND policyname = 'Allow authenticated users to view all candidates') THEN
    CREATE POLICY "Allow authenticated users to view all candidates" ON candidate_data
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'candidate_data' AND policyname = 'Allow authenticated users to insert candidates') THEN
    CREATE POLICY "Allow authenticated users to insert candidates" ON candidate_data
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'candidate_data' AND policyname = 'Allow authenticated users to update candidates') THEN
    CREATE POLICY "Allow authenticated users to update candidates" ON candidate_data
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'candidate_data' AND policyname = 'Allow authenticated users to delete candidates') THEN
    CREATE POLICY "Allow authenticated users to delete candidates" ON candidate_data
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;
`;

// Function to check if tables exist
export const checkTablesExist = async () => {
  try {
    console.log("🔍 Checking if required tables exist...");

    // Check candidate_data table (using existing structure)
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidate_data")
      .select("id")
      .limit(1);

    if (candidateError) {
      console.error("❌ candidate_data table error:", candidateError);
      return { candidate_data: false, active_job_candidates: false };
    }

    // Check active_job_candidates table
    const { data: jobCandidates, error: jobCandidatesError } = await supabase
      .from("active_job_candidates")
      .select("id")
      .limit(1);

    if (jobCandidatesError) {
      console.error(
        "❌ active_job_candidates table error:",
        jobCandidatesError
      );
      return { candidate_data: true, active_job_candidates: false };
    }

    console.log("✅ Both tables exist and are accessible");
    return { candidate_data: true, active_job_candidates: true };
  } catch (error) {
    console.error("❌ Error checking tables:", error);
    return { candidate_data: false, active_job_candidates: false };
  }
};

// Function to test table operations with existing structure
export const testTableOperations = async () => {
  try {
    console.log("🧪 Testing table operations with existing structure...");

    // Test insert into candidate_data (using existing column names)
    const testCandidate = {
      "Full Name": "Test Candidate",
      Email: "test@example.com",
      Phone: 1234567890,
      Score: 7,
      Experience: 3,
      Education: "BSc",
      Degree: "Computer Science",
      Notes: "Test candidate for database setup",
    };

    const { data: insertedCandidate, error: insertError } = await supabase
      .from("candidate_data")
      .insert([testCandidate])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert test failed:", insertError);
      return false;
    }

    console.log("✅ Insert test successful:", insertedCandidate);

    // Test linking to a job (assuming job_id 1 exists)
    const { error: linkError } = await supabase
      .from("active_job_candidates")
      .insert([
        {
          job_id: 1,
          candidate_id: insertedCandidate.id,
        },
      ]);

    if (linkError) {
      console.error("❌ Link test failed:", linkError);
      // Clean up the test candidate
      await supabase
        .from("candidate_data")
        .delete()
        .eq("id", insertedCandidate.id);
      return false;
    }

    console.log("✅ Link test successful");

    // Clean up test data
    await supabase
      .from("active_job_candidates")
      .delete()
      .eq("candidate_id", insertedCandidate.id);

    await supabase
      .from("candidate_data")
      .delete()
      .eq("id", insertedCandidate.id);

    console.log("✅ Cleanup successful");
    return true;
  } catch (error) {
    console.error("❌ Test operations failed:", error);
    return false;
  }
};

// Function to display setup instructions
export const displaySetupInstructions = () => {
  console.log(`
🔧 DATABASE SETUP REQUIRED

I found that candidate_data table already exists but with different column names.
Please run these SQL commands in your Supabase SQL Editor to create the missing active_job_candidates table:

${DATABASE_SETUP_SQL}

📋 Steps:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL above
4. Click "Run" to execute
5. Refresh your React app

This will:
✅ Create active_job_candidates table (if missing)
✅ Set up proper RLS policies for both tables
✅ Enable all CRUD operations for authenticated users

📊 Existing candidate_data table structure:
- id (primary key)
- Full Name (text)
- Email (text)
- Phone (numeric)
- Score (numeric)
- Experience (numeric)
- Education (text)
- Degree (text)
- Notes (text)
- created_at (timestamp)
  `);
};
