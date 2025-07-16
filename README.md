# HR Dashboard

A minimalist, elegant HR dashboard for managing job posts and candidate resumes. Built with React, React Router, and styled-components.

## Features

- **Add New Job**: Create job posts with title, location, salary range, and description.
- **Active Job Posts**: View all active jobs on the home screen.
- **Job Details**: See job info, upload candidate CVs (PDF, multiple), and view a table of parsed candidate data.
- **Candidate Table**: Filter candidates by experience and score. Open resumes directly from the table.
- **Minimalist Design**: Inspired by [Five Pack Creative](https://fivepackcreative.com/), clean and modern.

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
3. **Run the app**
   ```sh
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/components/` — Main UI components
- `src/dummyData.js` — Dummy jobs and candidates
- `src/theme.js` — Theme variables
- `src/App.js` — Routing and state

## PDF Resume Parsing

- Uses [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) to extract text from uploaded PDF resumes in the browser.
- If you need to use a Python or cloud-based parser, see the comments in the code for integration points.

## Deployment

You can deploy this app to Vercel, Netlify, or any static hosting provider. For GitHub Pages, see [Create React App deployment docs](https://create-react-app.dev/docs/deployment/).

## License

MIT
