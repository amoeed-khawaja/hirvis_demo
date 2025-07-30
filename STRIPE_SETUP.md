# Stripe Integration Setup Guide

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

The Stripe packages have already been installed:

```bash
npm install stripe @stripe/stripe-js
```

### 2. Create Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Other existing variables
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Get Your Stripe Keys

1. Go to your Stripe Dashboard (https://dashboard.stripe.com)
2. Navigate to Developers > API keys
3. Copy your publishable key and secret key
4. Replace the placeholder values in your `.env` file

### 4. Create Products and Prices in Stripe

1. In your Stripe Dashboard, go to Products
2. Create two products:
   - **Monthly Plan** ($19.99/month)
   - **Monthly Pro Plan** ($29.99/month)
3. For each product, create a recurring price with monthly billing
4. Copy the Price IDs (they start with `price_`)

### 5. Update Price IDs in Code

In `src/components/Billings.js`, update the priceId values:

```javascript
priceId: plan === "Monthly"
  ? "price_your_monthly_price_id"
  : "price_your_pro_price_id";
```

### 6. Start the Application

```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the React app
npm start
```

## Features Implemented

### Frontend (React)

- ✅ Stripe Elements integration
- ✅ Payment form with card input
- ✅ Loading states and error handling
- ✅ Success/cancel message handling
- ✅ Responsive design

### Backend (Node.js/Express)

- ✅ Stripe checkout session creation
- ✅ Payment intent creation
- ✅ Error handling and validation
- ✅ Success/cancel URL handling

### Payment Flow

1. User clicks "Subscribe" button
2. Frontend creates checkout session via API
3. User is redirected to Stripe Checkout
4. After payment, user is redirected back with success/cancel status
5. Frontend displays appropriate message

## Testing

- Use Stripe's test card numbers for testing:
  - **Success**: 4242 4242 4242 4242
  - **Decline**: 4000 0000 0000 0002
  - **Expiry**: Any future date
  - **CVC**: Any 3 digits

## Security Notes

- Never expose your secret key in frontend code
- Always use environment variables for sensitive data
- The secret key is only used in the backend server
- The publishable key is safe to use in frontend code

## Troubleshooting

1. **"Stripe failed to load"**: Check your publishable key
2. **"Payment failed"**: Check your secret key and price IDs
3. **CORS errors**: Ensure your server is running on the correct port
4. **Environment variables not loading**: Restart your development server
