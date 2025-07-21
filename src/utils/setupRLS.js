import { supabase } from "../supabase";

// Function to set up RLS policies for active_jobs table
export const setupRLSPolicies = async () => {
  console.log("🔐 Setting up RLS policies for active_jobs table...");

  try {
    // First, let's check if RLS is enabled and what policies exist
    const { data: policies, error: policiesError } = await supabase
      .from("information_schema.policies")
      .select("*")
      .eq("table_name", "active_jobs")
      .eq("table_schema", "public");

    if (policiesError) {
      console.error("Error checking existing policies:", policiesError);
    } else {
      console.log("Existing policies:", policies);
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      return false;
    }

    if (!user) {
      console.log("No authenticated user found");
      return false;
    }

    console.log("Authenticated user:", user.id);

    // Try to insert a test row to see the exact error
    const testJob = {
      job_title: "Test Job",
      description: "Test description",
      workplace_type: "Full-time",
      location: "Test Location",
      job_active_duration: 30,
      post_linkedin: false,
      skills: "Test skills",
    };

    const { data: insertData, error: insertError } = await supabase
      .from("active_jobs")
      .insert([testJob])
      .select();

    if (insertError) {
      console.error("Insert error details:", insertError);

      // If it's an RLS error, we need to create policies
      if (insertError.message.includes("row-level security policy")) {
        console.log("RLS policy violation detected. Creating policies...");
        return await createRLSPolicies();
      }
    } else {
      console.log("✅ Insert successful:", insertData);
      return true;
    }
  } catch (error) {
    console.error("Error in setupRLSPolicies:", error);
    return false;
  }
};

// Function to create RLS policies
const createRLSPolicies = async () => {
  console.log("📝 Creating RLS policies...");

  try {
    // Note: We can't create policies directly from the client
    // These need to be created in the Supabase dashboard or via SQL

    console.log(`
    ⚠️  RLS policies need to be created manually in Supabase dashboard.
    
    Please run these SQL commands in your Supabase SQL Editor:
    
    -- Enable RLS (if not already enabled)
    ALTER TABLE active_jobs ENABLE ROW LEVEL SECURITY;
    
    -- Policy to allow all authenticated users to view all jobs
    CREATE POLICY "Allow authenticated users to view all jobs" ON active_jobs
      FOR SELECT USING (auth.role() = 'authenticated');
    
    -- Policy to allow authenticated users to insert jobs
    CREATE POLICY "Allow authenticated users to insert jobs" ON active_jobs
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    -- Policy to allow authenticated users to update jobs
    CREATE POLICY "Allow authenticated users to update jobs" ON active_jobs
      FOR UPDATE USING (auth.role() = 'authenticated');
    
    -- Policy to allow authenticated users to delete jobs
    CREATE POLICY "Allow authenticated users to delete jobs" ON active_jobs
      FOR DELETE USING (auth.role() = 'authenticated');
    `);

    return false;
  } catch (error) {
    console.error("Error creating RLS policies:", error);
    return false;
  }
};

// Function to temporarily disable RLS for testing
export const disableRLSTemporarily = async () => {
  console.log("⚠️  Temporarily disabling RLS for testing...");

  try {
    // Note: This needs to be done in Supabase dashboard
    console.log(`
    To temporarily disable RLS for testing, run this SQL in Supabase:
    
    ALTER TABLE active_jobs DISABLE ROW LEVEL SECURITY;
    
    ⚠️  WARNING: This will disable all security policies!
    ⚠️  Only do this for testing, then re-enable with proper policies.
    `);

    return false;
  } catch (error) {
    console.error("Error disabling RLS:", error);
    return false;
  }
};

// Function to check current RLS status
export const checkRLSStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name, row_security")
      .eq("table_name", "active_jobs")
      .eq("table_schema", "public");

    if (error) {
      console.error("Error checking RLS status:", error);
      return null;
    }

    console.log("RLS status:", data);
    return data;
  } catch (error) {
    console.error("Error in checkRLSStatus:", error);
    return null;
  }
};
