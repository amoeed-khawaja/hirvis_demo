require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk");
const stripe = require("stripe")("sk_test_51RqCU9JnhtNNhpGH");

const app = express();
app.use(cors());
app.use(express.json());

// Add webhook endpoint for Stripe events
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Payment successful for session:", session.id);
        // You can add logic here to update user subscription status
        break;
      case "customer.subscription.created":
        const subscription = event.data.object;
        console.log("Subscription created:", subscription.id);
        break;
      case "customer.subscription.updated":
        const updatedSubscription = event.data.object;
        console.log("Subscription updated:", updatedSubscription.id);
        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        console.log("Subscription deleted:", deletedSubscription.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Stripe payment endpoints
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, planName } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        planName: planName,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("Creating checkout session with data:", req.body);
    const { planName, priceId } = req.body;

    if (!planName || !priceId) {
      console.error("Missing required fields:", { planName, priceId });
      return res.status(400).json({ error: "Missing planName or priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // Use Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/billings?success=true`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/billings?canceled=true`,
      metadata: {
        planName: planName,
      },
    });

    console.log("Checkout session created successfully:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/groq", async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });
    res.json(chatCompletion);
  } catch (err) {
    // Server-side detailed logging
    console.error("Groq error: ", {
      message: err?.message,
      name: err?.name,
      stack: err?.stack,
      status: err?.status || err?.statusCode,
      responseData: err?.response || err?.data || err?.body,
      envHasKey: !!process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
    });

    // Return detailed but safe payload to client
    return res.status(500).json({
      error: "Groq API call failed",
      message: err?.message || "Unknown error",
      name: err?.name || null,
      status: err?.status || err?.statusCode || 500,
      model: "llama-3.3-70b-versatile",
      hints: [
        "Verify GROQ_API_KEY is set and the server was restarted",
        "Try a model your account has access to (e.g. llama-3.1-70b-versatile)",
        "Ensure request body shape is { messages: Array<{role, content}> }",
      ],
      // Include a truncated stack for easier debugging
      stack: err?.stack ? String(err.stack).split("\n").slice(0, 5) : null,
      // Surface any SDK response payload if present (stringify if object)
      response: err?.response
        ? typeof err.response === "object"
          ? JSON.parse(JSON.stringify(err.response))
          : String(err.response)
        : null,
    });
  }
});

app.post("/api/check-linkedin-permissions", async (req, res) => {
  console.log("Checking LinkedIn permissions...");
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Missing accessToken" });
    }

    // Decode the JWT token to see what's in it
    const tokenParts = accessToken.split(".");
    let tokenInfo = {};

    if (tokenParts.length >= 2) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString()
        );
        tokenInfo = {
          issuer: payload.iss,
          subject: payload.sub,
          audience: payload.aud,
          issuedAt: new Date(payload.iat * 1000).toISOString(),
          expiresAt: new Date(payload.exp * 1000).toISOString(),
          scopes: payload.scope || "No scopes found in token",
          hasUserInfo: !!payload.sub,
          tokenType: "JWT",
        };
      } catch (err) {
        tokenInfo = { error: "Could not decode token", tokenType: "Unknown" };
      }
    }

    // Try to get user info from LinkedIn
    const testEndpoints = [
      { name: "/v2/me", url: "https://api.linkedin.com/v2/me" },
      {
        name: "/v2/emailAddress",
        url: "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      },
      { name: "/v2/userinfo", url: "https://api.linkedin.com/v2/userinfo" },
    ];

    const endpointResults = [];

    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint.url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "LinkedIn-Version": "202312",
          },
        });

        endpointResults.push({
          endpoint: endpoint.name,
          status: response.status,
          statusText: response.statusText,
          accessible: response.ok,
          response: response.ok ? await response.json() : await response.text(),
        });
      } catch (err) {
        endpointResults.push({
          endpoint: endpoint.name,
          error: err.message,
          accessible: false,
        });
      }
    }

    return res.json({
      tokenInfo,
      endpointResults,
      summary: {
        totalEndpoints: testEndpoints.length,
        accessibleEndpoints: endpointResults.filter((r) => r.accessible).length,
        hasValidToken: !!accessToken,
        tokenLength: accessToken.length,
      },
    });
  } catch (err) {
    console.error("Error checking LinkedIn permissions:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/linkedin-post", async (req, res) => {
  console.log("Received POST /api/linkedin-post", req.body);
  try {
    const { accessToken, job } = req.body;
    if (!accessToken || !job) {
      return res.status(400).json({ error: "Missing accessToken or job data" });
    }

    // Build the post content
    const postContent = `HIRING! We are looking for a ${
      job.jobTitle || job.title
    }
Type: ${job.workplaceType || job.type || "Full-time"}
Location: ${job.jobLocation || job.location}
Job description: ${job.jobDescription || job.description}
Required skills: ${
      job.requiredSkills ? job.requiredSkills.join(", ") : "Not specified"
    }`;

    console.log("Attempting to post to LinkedIn:", postContent);

    // Step 1: Try multiple approaches to get LinkedIn ID
    let linkedInId = null;

    // Approach 1: Try /v2/userinfo endpoint (this one works!)
    console.log("Step 1a: Trying /v2/userinfo endpoint...");
    try {
      const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202312",
        },
      });

      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        console.log("User info response:", JSON.stringify(userInfo, null, 2));

        // Extract LinkedIn ID from userinfo response
        if (userInfo.sub) {
          linkedInId = userInfo.sub.replace("urn:li:person:", "");
          console.log(
            "Successfully got LinkedIn ID from /v2/userinfo sub:",
            linkedInId
          );
        } else if (userInfo.id) {
          linkedInId = userInfo.id;
          console.log(
            "Successfully got LinkedIn ID from /v2/userinfo id:",
            linkedInId
          );
        } else {
          console.log(
            "No LinkedIn ID found in userinfo response. Available fields:",
            Object.keys(userInfo)
          );
        }
      } else {
        console.log("Failed /v2/userinfo endpoint:", userInfoRes.status);
      }
    } catch (err) {
      console.log("Error with /v2/userinfo endpoint:", err.message);
    }

    // Approach 2: Try /v2/me endpoint (fallback)
    if (!linkedInId) {
      console.log("Step 1b: Trying /v2/me endpoint...");
      try {
        const profileRes = await fetch("https://api.linkedin.com/v2/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "LinkedIn-Version": "202312",
          },
        });

        if (profileRes.ok) {
          const profile = await profileRes.json();
          linkedInId = profile.id;
          console.log("Successfully got LinkedIn ID from /v2/me:", linkedInId);
        } else {
          console.log("Failed /v2/me endpoint:", profileRes.status);
        }
      } catch (err) {
        console.log("Error with /v2/me endpoint:", err.message);
      }
    }

    // Approach 3: Try email endpoint if others failed
    if (!linkedInId) {
      console.log("Step 1c: Trying email endpoint...");
      try {
        const emailRes = await fetch(
          "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "LinkedIn-Version": "202312",
            },
          }
        );

        if (emailRes.ok) {
          const emailData = await emailRes.json();
          console.log("Email endpoint response:", emailData);
          // Try to extract ID from email response if possible
          if (emailData.elements && emailData.elements.length > 0) {
            // This is a fallback - we might not get the ID from email
            console.log("Got email data but no direct ID");
          }
        } else {
          console.log("Failed email endpoint:", emailRes.status);
        }
      } catch (err) {
        console.log("Error with email endpoint:", err.message);
      }
    }

    // If we still don't have an ID, try to extract it from the access token
    if (!linkedInId) {
      console.log("Step 1d: Trying to extract ID from token...");
      try {
        // LinkedIn access tokens sometimes contain user info
        const tokenParts = accessToken.split(".");
        if (tokenParts.length >= 2) {
          const payload = JSON.parse(
            Buffer.from(tokenParts[1], "base64").toString()
          );
          console.log("Token payload:", payload);
          // Look for user ID in token payload
          if (payload.sub) {
            linkedInId = payload.sub.replace("urn:li:person:", "");
            console.log("Extracted LinkedIn ID from token:", linkedInId);
          }
        }
      } catch (err) {
        console.log("Error extracting from token:", err.message);
      }
    }

    // If we still don't have an ID, we can't proceed
    if (!linkedInId) {
      console.log("Could not obtain LinkedIn ID through any method");
      return res.status(500).json({
        error:
          "Unable to obtain LinkedIn user ID. This is a known LinkedIn API limitation.",
        fallbackMessage:
          "LinkedIn API is currently restricting access to user profile data. This is a platform-side issue affecting many developers.",
        postContent: postContent,
        suggestion:
          "You can copy the prepared post content and manually post it to LinkedIn.",
      });
    }

    // Step 2: Create the post
    console.log("Step 2: Creating LinkedIn post with ID:", linkedInId);
    const postBody = {
      author: `urn:li:person:${linkedInId}`,
      commentary: postContent,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    // Debug: Check what scopes are in the token
    console.log("=== DEBUGGING TOKEN ===");
    const tokenParts = accessToken.split(".");
    if (tokenParts.length >= 2) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString()
        );
        console.log("Token scopes:", payload.scope);
        console.log("Token audience:", payload.aud);
        console.log("Token issuer:", payload.iss);
      } catch (err) {
        console.log("Could not decode token:", err.message);
      }
    }

    console.log("Sending LinkedIn post with version: 202312");
    console.log("Full headers being sent:", {
      Authorization: `Bearer ${accessToken.substring(0, 20)}...`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202312",
    });

    const postRes = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202312",
      },
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const errorText = await postRes.text();
      console.error("Failed to post to LinkedIn:", postRes.status, errorText);
      return res.status(500).json({
        error: `Failed to post to LinkedIn: ${errorText}`,
        fallbackMessage:
          "LinkedIn posting failed. This may be due to API permission issues or content restrictions.",
        postContent: postContent,
        suggestion:
          "You can copy the prepared post content and manually post it to LinkedIn.",
      });
    }

    const postResult = await postRes.json();
    console.log("LinkedIn post successful:", postResult);

    return res.json({
      success: true,
      message: "Job posted to LinkedIn successfully!",
      postId: postResult.id,
      postContent: postContent,
    });
  } catch (err) {
    console.error("LinkedIn post error:", err);
    res.status(500).json({
      error: err.message,
      fallbackMessage:
        "An unexpected error occurred while posting to LinkedIn.",
      postContent: postContent,
      suggestion:
        "You can copy the prepared post content and manually post it to LinkedIn.",
    });
  }
});

// Check subscription status endpoint
app.get("/api/check-subscription/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has paid subscription in database
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data: userData, error } = await supabase
      .from("users_data")
      .select("paid, paid_date")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking subscription:", error);
      return res
        .status(500)
        .json({ error: "Failed to check subscription status" });
    }

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const isSubscribed = userData.paid === 1;

    res.json({
      subscribed: isSubscribed,
      paidDate: userData.paid_date,
      subscriptionStatus: isSubscribed ? "active" : "inactive",
    });
  } catch (err) {
    console.error("Subscription check error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update subscription status endpoint
app.post("/api/update-subscription", async (req, res) => {
  try {
    const { userId, subscribed, subscriptionId } = req.body;

    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { error } = await supabase
      .from("users_data")
      .update({
        paid: subscribed ? 1 : 0,
        paid_date: subscribed ? new Date().toISOString() : null,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating subscription:", error);
      return res
        .status(500)
        .json({ error: "Failed to update subscription status" });
    }

    res.json({
      success: true,
      message: subscribed
        ? "Subscription activated"
        : "Subscription deactivated",
    });
  } catch (err) {
    console.error("Update subscription error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add credits endpoint
app.post("/api/add-credits", async (req, res) => {
  try {
    const { userId, credits } = req.body;

    if (!userId || !credits || credits <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid user ID or credits amount" });
    }

    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // First check if user has an active subscription
    const { data: userData, error: userError } = await supabase
      .from("users_data")
      .select("paid, credits")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error checking user subscription:", userError);
      return res
        .status(500)
        .json({ error: "Failed to check user subscription" });
    }

    if (!userData || userData.paid !== 1) {
      return res
        .status(403)
        .json({ error: "Active subscription required to add credits" });
    }

    // Update credits (add to existing credits)
    const currentCredits = userData.credits || 0;
    const newCredits = currentCredits + parseInt(credits);

    const { error: updateError } = await supabase
      .from("users_data")
      .update({ credits: newCredits })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      return res.status(500).json({ error: "Failed to update credits" });
    }

    res.json({
      success: true,
      message: `Successfully added ${credits} credits`,
      totalCredits: newCredits,
    });
  } catch (err) {
    console.error("Add credits error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Manual subscription activation endpoint
app.post("/api/activate-subscription", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Update user subscription status
    const { error } = await supabase
      .from("users_data")
      .update({
        paid: 1,
        paid_date: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error activating subscription:", error);
      return res.status(500).json({ error: "Failed to activate subscription" });
    }

    res.json({
      success: true,
      message: "Subscription activated successfully",
    });
  } catch (err) {
    console.error("Activate subscription error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
