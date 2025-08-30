// Script to add interview_questions column to active_jobs table
// Run this with: node addInterviewQuestionsColumn.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addInterviewQuestionsColumn() {
  console.log("🔧 Adding interview_questions column to active_jobs table...");

  try {
    // First, check if the column already exists
    const { data, error } = await supabase
      .from('active_jobs')
      .select('interview_questions')
      .limit(1);

    if (error && error.message.includes('column "interview_questions" does not exist')) {
      console.log("📝 Column doesn't exist. You need to add it manually in Supabase dashboard.");
      console.log("📋 Run this SQL in your Supabase SQL Editor:");
      console.log("ALTER TABLE active_jobs ADD COLUMN interview_questions TEXT;");
      console.log("COMMENT ON COLUMN active_jobs.interview_questions IS 'Custom interview questions for this job posting';");
    } else if (error) {
      console.error("❌ Error checking column:", error);
    } else {
      console.log("✅ interview_questions column already exists");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addInterviewQuestionsColumn(); 