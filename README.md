# Hirvis Demo - AI-Powered HR Dashboard

A comprehensive HR management system with AI-powered features including automated interviews, candidate management, and job posting capabilities.

## Features

- 🤖 **AI-Powered Interviews**: Automated phone interviews using VAPI
- 📊 **Candidate Management**: Track and manage job applicants
- 💳 **Subscription System**: Stripe-powered billing and credits
- 🔗 **LinkedIn Integration**: Post jobs directly to LinkedIn
- 🎯 **Smart Matching**: AI-powered candidate-job matching
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 19, Styled Components
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API, VAPI
- **Payments**: Stripe
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key
- Stripe account
- VAPI account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/amoeed-khawaja/hirvis_demo.git
   cd hirvis_demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your actual API keys and credentials in `.env`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Start the backend server** (in another terminal)
   ```bash
   npm run server
   ```

## Deployment to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amoeed-khawaja/hirvis_demo)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env.example`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Environment Variables

See `.env.example` for all required environment variables:

- **Supabase**: Database and authentication
- **Groq**: AI API for smart features
- **Stripe**: Payment processing
- **VAPI**: Phone call automation
- **Client URL**: Your deployed app URL

## API Endpoints

- `POST /api/groq` - AI chat completions
- `POST /api/create-checkout-session` - Stripe payments
- `POST /api/webhook` - Stripe webhooks
- `POST /api/vapi-call` - Initiate phone calls
- `POST /api/vapi-webhook` - VAPI callbacks
- `GET /api/check-subscription/:userId` - Check user subscription
- `POST /api/linkedin-post` - Post jobs to LinkedIn

## Project Structure

```
hirvis_demo/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── utils/            # Utility functions
│   └── ...
├── server.js             # Express.js backend
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the deployment guide in `VERCEL_DEPLOYMENT.md`
- Review the setup guides in the project root

## Roadmap

- [ ] Enhanced AI interview questions
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Integration with more job boards