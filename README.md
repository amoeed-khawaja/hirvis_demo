# HR Dashboard

A minimalist, elegant HR dashboard for managing job posts and candidate resumes. Built with React, React Router, styled-components, and Supabase for authentication and backend.

## Features

- **Add New Job**: Create job posts with title, location, salary range, and description.
- **Active Job Posts**: View all active jobs on the home screen.
- **Job Details**: See job info, upload candidate CVs (PDF, multiple), and view a table of parsed candidate data.
- **Candidate Table**: Filter candidates by experience and score. Open resumes directly from the table.
- **Minimalist Design**: Inspired by [Five Pack Creative](https://fivepackcreative.com/), clean and modern.
- **User Authentication**: Sign up and log in with email/password, Google, or LinkedIn (OIDC) via Supabase Auth.
- **User Profile Management**: Edit display name, phone, and profile picture. Avatar and name shown in sidebar.
- **Social Login**: "Continue with Google" and "Continue with LinkedIn" supported on signup/login pages.
- **LinkedIn Job Posting (Limited)**: Option to prepare job posts for LinkedIn. Due to persistent LinkedIn API permission issues, actual posting is currently disabled (see below for details).

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/amoeed-khawaja/hr-dashboard-automated.git
   cd hr-dashboard-automated
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in your Supabase and API keys.
   - **Do NOT commit your `.env` file or secrets to version control.**
4. **Run the app**
   ```sh
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/components/` — Main UI components
- `src/dummyData.js` — Dummy jobs and candidates
- `src/theme.js` — Theme variables
- `src/App.js` — Routing and state
- `server.js` — Express backend for LinkedIn API proxy

## PDF Resume Parsing

- Uses [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) to extract text from uploaded PDF resumes in the browser.
- If you need to use a Python or cloud-based parser, see the comments in the code for integration points.

## Social Login & LinkedIn Integration

- **Google Login**: Works out of the box via Supabase Auth.
- **LinkedIn Login**: Uses LinkedIn OIDC and requests `openid profile email w_member_social` scopes. User must grant permissions on first login.
- **LinkedIn Job Posting**: When posting a job, users can opt to prepare a LinkedIn post. Due to persistent LinkedIn API permission issues (403 ACCESS_DENIED errors), actual posting to LinkedIn is currently disabled. The system will show the prepared post content instead.
  - **Note:** LinkedIn's API consistently returns `ACCESS_DENIED` errors for posting endpoints, even with all permissions and products enabled. This is a LinkedIn-side issue affecting many developers. The integration is kept for future use when LinkedIn resolves these API issues.

## Environment Variables & Secret Management

- Store all secrets (API keys, Supabase keys) in a `.env` file.
- **Never commit your `.env` file or secrets to git.**
- Add `.env` to your `.gitignore`.
- If you accidentally commit a secret, remove it from git history and rotate the key immediately.

## Deployment

You can deploy this app to Vercel, Netlify, or any static hosting provider. For GitHub Pages, see [Create React App deployment docs](https://create-react-app.dev/docs/deployment/).

## License

MIT
