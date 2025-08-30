import { supabase } from "../supabase";

// Function to add interview_questions column to active_jobs table
export const addInterviewQuestionsColumn = async () => {
  console.log("🔧 Adding interview_questions column to active_jobs table...");

  try {
    // Execute the ALTER TABLE command
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE active_jobs 
        ADD COLUMN IF NOT EXISTS interview_questions TEXT;
        
        COMMENT ON COLUMN active_jobs.interview_questions IS 'Custom interview questions for this job posting';
      `
    });

    if (error) {
      console.error("❌ Error adding column:", error);
      
      // If RPC doesn't work, try direct query
      console.log("🔄 Trying alternative method...");
      const { error: directError } = await supabase
        .from('active_jobs')
        .select('interview_questions')
        .limit(1);
      
      if (directError && directError.message.includes('column "interview_questions" does not exist')) {
        console.log("📝 Column doesn't exist yet. You'll need to run the SQL manually in your Supabase dashboard.");
        console.log("📋 SQL to run:");
        console.log("ALTER TABLE active_jobs ADD COLUMN interview_questions TEXT;");
        return false;
      } else {
        console.log("✅ Column already exists or was added successfully");
        return true;
      }
    } else {
      console.log("✅ Column added successfully");
      return true;
    }
  } catch (error) {
    console.error("❌ Error in addInterviewQuestionsColumn:", error);
    return false;
  }
};

// Function to check if the column exists
export const checkInterviewQuestionsColumn = async () => {
  try {
    const { data, error } = await supabase
      .from('active_jobs')
      .select('interview_questions')
      .limit(1);

    if (error) {
      console.log("❌ Column doesn't exist:", error.message);
      return false;
    } else {
      console.log("✅ interview_questions column exists");
      return true;
    }
  } catch (error) {
    console.error("❌ Error checking column:", error);
    return false;
  }
}; 