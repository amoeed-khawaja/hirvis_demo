# Interview Questions Setup Guide

This guide explains how to set up and use the new interview questions functionality in the HR Dashboard.

## Database Setup

Before using the interview questions feature, you need to set up the database structure. Run the following SQL commands in your Supabase SQL Editor:

```sql
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
```

## Features

### 1. Candidate Selection with Checkboxes

- Each candidate row now has a checkbox for selection
- "Select All" checkbox in the header to select/deselect all filtered candidates
- Indeterminate state when some (but not all) candidates are selected

### 2. Interview Round Button

- Located at the bottom of the applicants table
- Only enabled when at least one candidate is selected
- Updates the `Interview_round` column to `TRUE` for selected candidates
- Automatically navigates to the interview questions page

### 3. Interview Questions Management

- New page accessible at `/jobs/:jobId/interview-questions`
- Title format: `{Job Title} - Questions`
- Features:
  - Add new questions via modal
  - Drag and drop to reorder questions
  - Delete individual questions
  - Add sample questions for quick setup
  - Real-time status messages

### 4. Drag and Drop Reordering

- Questions can be reordered by dragging them vertically
- Visual feedback during drag operations
- Automatic database updates when order changes

## Usage Flow

1. **Select Candidates**: Go to a job's applicants page and select candidates using checkboxes
2. **Send to Interview**: Click the "Interview Round" button to move selected candidates to interview round
3. **Manage Questions**: You'll be taken to the interview questions page where you can:
   - Add sample questions (if no questions exist)
   - Add custom questions
   - Reorder questions by dragging
   - Delete unwanted questions

## File Structure

- `src/components/Applicants.js` - Updated with checkbox selection and interview round functionality
- `src/components/InterviewQuestions.js` - New component for managing interview questions
- `src/utils/setupInterviewQuestions.js` - Utility functions for database setup and operations
- `add_interview_round_column.sql` - SQL script for database setup

## Troubleshooting

If you encounter issues:

1. **Database Setup**: Make sure you've run the SQL commands in Supabase
2. **RLS Policies**: Ensure Row Level Security is properly configured
3. **User Authentication**: Verify that users are properly authenticated
4. **Console Errors**: Check browser console for detailed error messages

The application will automatically detect if the database setup is incomplete and provide instructions in the console.
