import { supabase } from "../supabase";

// SQL commands to set up interview questions functionality
export const INTERVIEW_QUESTIONS_SETUP_SQL = `
-- Add Interview_round column to candidate_data table
ALTER TABLE candidate_data 
ADD COLUMN IF NOT EXISTS Interview_round BOOLEAN DEFAULT FALSE;

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id BIGINT REFERENCES active_jobs(job_id) ON DELETE CASCADE,
    login_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for interview_questions table
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own interview questions
CREATE POLICY "Users can view their own interview questions" ON interview_questions
    FOR SELECT USING (auth.uid() = login_user_id);

-- Policy for users to insert their own interview questions
CREATE POLICY "Users can insert their own interview questions" ON interview_questions
    FOR INSERT WITH CHECK (auth.uid() = login_user_id);

-- Policy for users to update their own interview questions
CREATE POLICY "Users can update their own interview questions" ON interview_questions
    FOR UPDATE USING (auth.uid() = login_user_id);

-- Policy for users to delete their own interview questions
CREATE POLICY "Users can delete their own interview questions" ON interview_questions
    FOR DELETE USING (auth.uid() = login_user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_interview_questions_job_user ON interview_questions(job_id, login_user_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order ON interview_questions(question_order);
`;

// Function to set up interview questions database structure
export const setupInterviewQuestions = async () => {
  try {
    console.log("🔧 Setting up interview questions database structure...");

    const { error } = await supabase.rpc("exec_sql", {
      sql: INTERVIEW_QUESTIONS_SETUP_SQL,
    });

    if (error) {
      console.error("❌ Error setting up interview questions:", error);
      return { success: false, error: error.message };
    }

    console.log(
      "✅ Interview questions database structure set up successfully"
    );
    return { success: true };
  } catch (error) {
    console.error("❌ Error in setupInterviewQuestions:", error);
    return { success: false, error: error.message };
  }
};

// Function to check if interview questions setup is complete
export const checkInterviewQuestionsSetup = async () => {
  try {
    console.log("🔍 Checking interview questions setup...");

    // Check if Interview_round column exists in candidate_data
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidate_data")
      .select("Interview_round")
      .limit(1);

    if (candidateError && candidateError.message.includes("column")) {
      console.log("❌ Interview_round column not found in candidate_data");
      return {
        interview_round_column: false,
        interview_questions_table: false,
      };
    }

    // Check if interview_questions table exists
    const { data: questions, error: questionsError } = await supabase
      .from("interview_questions")
      .select("id")
      .limit(1);

    if (questionsError) {
      console.log("❌ interview_questions table not found");
      return {
        interview_round_column: true,
        interview_questions_table: false,
      };
    }

    console.log("✅ Interview questions setup is complete");
    return {
      interview_round_column: true,
      interview_questions_table: true,
    };
  } catch (error) {
    console.error("❌ Error checking interview questions setup:", error);
    return {
      interview_round_column: false,
      interview_questions_table: false,
    };
  }
};

// Function to display setup instructions
export const displayInterviewQuestionsSetupInstructions = () => {
  console.log(`
📋 INTERVIEW QUESTIONS SETUP INSTRUCTIONS
==========================================

To set up the interview questions functionality, you need to run the following SQL commands in your Supabase SQL editor:

${INTERVIEW_QUESTIONS_SETUP_SQL}

Alternatively, you can:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL commands above
4. Click "Run" to execute the commands

This will:
- Add an Interview_round column to the candidate_data table
- Create the interview_questions table with proper RLS policies
- Set up indexes for better performance

After running these commands, the interview questions functionality will be available.
`);
};

// Function to add dummy questions for testing
export const addDummyQuestions = async (jobId) => {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const dummyQuestions = [
      "Tell me about your experience with React and JavaScript.",
      "How do you handle state management in large applications?",
      "Describe a challenging project you worked on and how you solved it.",
      "What are your career goals for the next 2-3 years?",
      "How do you stay updated with the latest technologies?",
    ];

    const questionsToInsert = dummyQuestions.map((text, index) => ({
      job_id: jobId,
      login_user_id: currentUserId,
      question_text: text,
      question_order: index + 1,
    }));

    const { data, error } = await supabase
      .from("interview_questions")
      .insert(questionsToInsert)
      .select();

    if (error) {
      throw error;
    }

    console.log("✅ Dummy questions added successfully");
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error adding dummy questions:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to get current user ID
const getCurrentUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
};
