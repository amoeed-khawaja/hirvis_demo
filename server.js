require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Groq } = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/groq", async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });
    res.json(chatCompletion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/linkedin-post", async (req, res) => {
  try {
    const { accessToken, job } = req.body;
    if (!accessToken || !job) {
      return res.status(400).json({ error: "Missing accessToken or job data" });
    }
    // 1. Get user's LinkedIn ID
    console.log("Access token:", accessToken);
    console.log("Job data:", job);
    console.log("Fetching LinkedIn profile...");
    const profileRes = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("LinkedIn profile status:", profileRes.status);
    const profileText = await profileRes.text();
    console.log("LinkedIn profile response:", profileText);
    if (profileRes.status !== 200)
      throw new Error("Failed to fetch LinkedIn profile: " + profileText);
    const profile = JSON.parse(profileText);
    const linkedInId = profile.id;
    if (!linkedInId) throw new Error("No LinkedIn ID found");
    // 2. Build post body for /rest/posts
    const postBody = {
      author: `urn:li:person:${linkedInId}`,
      commentary: `HIRING!\nWe are looking for a ${job.jobTitle}\nType: ${
        job.workplaceType
      }\nLocation: ${job.jobLocation}\nJob description:\n${
        job.jobDescription
      }\n\nRequired skills: ${(job.requiredSkills || []).join(", ")}`,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };
    // 3. Post to LinkedIn
    const postRes = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
      },
      body: JSON.stringify(postBody),
    });
    if (!postRes.ok) {
      const err = await postRes.json().catch(() => ({}));
      throw new Error(err.message || "Failed to post to LinkedIn");
    }
    res.json({ success: true });
  } catch (err) {
    console.error("LinkedIn post error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
