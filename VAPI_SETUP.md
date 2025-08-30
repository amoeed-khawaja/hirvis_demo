# VAPI Integration Setup Guide

This guide explains how to set up and use the VAPI integration in the HR Dashboard for automated interview calls.

## Prerequisites

1. **VAPI Account**: You need a VAPI account and API key
2. **Assistant Configuration**: Your Elliot assistant should be configured in VAPI with ID: `76fdde8e-32b0-4ecc-b6b0-6392b498e10d`

## Environment Setup

Add your VAPI credentials to the `.env` file in the `hr-dashboard` directory:

```env
VAPI_API_KEY=your_vapi_api_key_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here
```

### Getting Your Phone Number ID

1. **Log into your VAPI Dashboard**
2. **Go to Phone Numbers** section
3. **Copy the ID** of the phone number you want to use for outbound calls
4. **Add it to your .env file** as `VAPI_PHONE_NUMBER_ID`

**Note**: This is the phone number that will be used as the "from" number when making calls. The target number (+19299395133) is what gets called.

## How It Works

### Test Button Functionality

The "Test VAPI Call" button on the Interviews page performs the following:

1. **Fetches Dynamic Data**:

   - Company name from `users_data` table
   - Interview questions from `interview_questions` table for the specific job
   - Job title from the current job

2. **Builds System Prompt**:

   - Creates a comprehensive HR interview prompt
   - Includes company-specific information
   - Incorporates custom interview questions
   - Contains candidate resume data (currently hardcoded for testing)

3. **Initiates VAPI Call**:
   - Calls the test number: `+19299395133`
   - Uses Elliot assistant: `76fdde8e-32b0-4ecc-b6b0-6392b498e10d`
   - Sets first message: "Hello, this is Elliot from [Company], I will be conducting your HR interview today. How are you doing?"

### API Endpoint

**Backend Endpoint**: `POST /api/vapi-call`

**Payload**:

```json
{
  "phoneNumber": "+19299395133",
  "assistantId": "76fdde8e-32b0-4ecc-b6b0-6392b498e10d",
  "firstMessage": "Hello, this is Elliot from [Company], I will be conducting your HR interview today. How are you doing?",
  "systemMessage": "... comprehensive interview prompt ..."
}
```

**Response** (Success):

```json
{
  "success": true,
  "message": "VAPI call initiated successfully",
  "callId": "call_id_from_vapi",
  "data": { ... }
}
```

## System Prompt Features

The dynamically generated system prompt includes:

- **Professional HR Persona**: Elliot as a calm, focused HR recruiter
- **Company Branding**: Uses actual company name from database
- **Custom Questions**: Integrates job-specific interview questions
- **Resume Analysis**: Includes candidate resume for cross-verification
- **Behavioral Guidelines**: Professional conversation flow and boundaries
- **Evaluation Criteria**: Focus on communication skills, cultural fit, etc.

## Testing

1. **Navigate** to any job's Interviews page
2. **Click** "📞 Test VAPI Call" button
3. **Check Console** for detailed payload and response logs
4. **Verify Status** message shows success/error details

## Next Steps

To make this production-ready:

1. **Replace hardcoded resume** with actual candidate data
2. **Add phone number selection** from candidate list
3. **Implement call status tracking** and callbacks
4. **Add call recording and analysis** features
5. **Create interview results** integration

## Troubleshooting

### Common Issues

1. **"VAPI API key not configured"**

   - Ensure `VAPI_API_KEY` is set in `.env`
   - Restart the server after adding the key

2. **"Failed to fetch company information"**

   - Check if user has organization data in `users_data` table
   - Verify user authentication

3. **"Failed to fetch interview questions"**
   - Ensure interview questions are set up for the job
   - Check database permissions

### Debug Information

The system logs detailed information to the console:

- Complete VAPI payload
- API responses
- Error details

Check both browser console and server logs for troubleshooting.
