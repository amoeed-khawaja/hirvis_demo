const fs = require("fs");
const path = require("path");

const envContent = `# Supabase Configuration
SUPABASE_URL=https://ncccwwzblxjeptjnmpzb.supabase.co
SUPABASE_ANON_KEY=sb_publishable_yMee_EXE_WL2nJyG-dZp5g_gIkePin_

# React App Supabase Configuration (for frontend)
REACT_APP_SUPABASE_URL=https://ncccwwzblxjeptjnmpzb.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_yMee_EXE_WL2nJyG-dZp5g_gIkePin_

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51RqCU9JnhtNNhpGH
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Client Configuration
CLIENT_URL=http://localhost:3001
PORT=5000
`;

const envPath = path.join(__dirname, ".env");

try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log("📝 Please update the following values in your .env file:");
  console.log("   - GROQ_API_KEY: Get from https://console.groq.com/");
  console.log("   - STRIPE_WEBHOOK_SECRET: Get from your Stripe dashboard");
  console.log(
    "   - REACT_APP_STRIPE_PUBLISHABLE_KEY: Get from your Stripe dashboard"
  );
  console.log("");
  console.log("🚀 After updating the .env file, restart your server:");
  console.log("   npm run server");
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
}
