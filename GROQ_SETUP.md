# Groq API Setup

To enable resume processing features, you need to configure the Groq API key.

## Steps:

1. **Get a Groq API Key:**

   - Go to [https://console.groq.com/](https://console.groq.com/)
   - Sign up or log in
   - Create a new API key

2. **Configure the API Key:**

   - Open the `.env` file in the `hr-dashboard` directory
   - Replace `your_groq_api_key_here` with your actual Groq API key:

   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

3. **Restart the Server:**
   - Stop the current server (Ctrl+C)
   - Run `node server.js` again

## Testing:

Once configured, try uploading a resume PDF to test the processing functionality. The system will:

1. Extract text from the PDF
2. Send it to Groq API for analysis
3. Parse the response and save candidate data to the database

## Troubleshooting:

- Check the browser console for detailed error messages
- Check the server console for API request/response logs
- Ensure the server is running on port 5000
- Verify your Groq API key is valid and has sufficient credits
