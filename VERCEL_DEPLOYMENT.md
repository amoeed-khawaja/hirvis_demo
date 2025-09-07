# Vercel Deployment Guide for Hirvis Demo

## Prerequisites
- Vercel account (free tier available)
- All your API keys and credentials ready

## Step 1: Deploy to Vercel

### Option A: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

### Option B: Deploy via GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/amoeed-khawaja/hirvis_demo.git`
4. Vercel will automatically detect it's a React app

## Step 2: Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

### Required Environment Variables:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
VAPI_API_KEY=your_vapi_api_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

## Step 3: Configure Stripe Webhooks

1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-app-name.vercel.app/api/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.*`
5. Copy the webhook secret to your Vercel environment variables

## Step 4: Configure VAPI Webhooks

1. Go to your VAPI Dashboard
2. Set webhook URL: `https://your-app-name.vercel.app/api/vapi-webhook`
3. Enable call completion events

## Step 5: Redeploy

After adding environment variables, redeploy your application:
```bash
vercel --prod
```

## Project Structure

Your app is configured as:
- **Frontend**: React app served from `/` routes
- **Backend**: Express.js API server handling `/api/*` routes
- **Build**: Static files served from `build/` directory

## API Endpoints

Your deployed app will have these API endpoints:
- `/api/groq` - Groq AI integration
- `/api/create-checkout-session` - Stripe payments
- `/api/webhook` - Stripe webhooks
- `/api/vapi-call` - VAPI phone calls
- `/api/vapi-webhook` - VAPI webhooks
- `/api/check-subscription/:userId` - Subscription status
- And more...

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that `vercel-build` script exists
- Verify Node.js version compatibility

### API Issues
- Check environment variables are set correctly
- Verify API keys are valid
- Check Vercel function logs for errors

### CORS Issues
- Vercel handles CORS automatically for same-origin requests
- For external domains, update your CORS configuration

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors
