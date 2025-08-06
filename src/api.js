// src/api.js

export async function getGroqResponse(messages) {
  const response = await fetch("http://localhost:5000/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error("Groq API error");
  return response.json();
}

export async function screenResume(job, candidateResumeText) {
  const jobInfo = `Job Title: ${job.title}
Location: ${job.location}
Job Type: ${job.type}
Salary Range: ${job.salaryRange}

Job Description:
${job.description}`;

  const candidateInfo = `Candidate Details:
${candidateResumeText}`;

  const combinedInput = `${jobInfo}

${candidateInfo}`;

  const messages = [
    {
      role: "system",
      content:
        "You are an intelligent resume screening assistant. You will receive two inputs:\n\nExtracted resume text, including name, contact, education, experience, and other relevant details.\n\nJob title and job description, outlining the employer's requirements.\n\nYour task is to analyze the candidate's resume in the context of the job description and return a single-row response formatted to match an Excel sheet, with the following exact column order:\n\nName | Email | Phone | Score (rate relevance to the job from 0 to 10 based on experience, skills, and alignment with the job description) | Experience (in relevant field only, summarized in years ) | Education (only the highest level or most relevant to the role e.g. bachelors ) | Degree( e.g. computer science) |  Remarks (brief comments, such as strengths, concerns, or missing qualifications)\n\nKeep your output concise and accurate, suitable for direct insertion into an Excel row. Do not add bullet points, extra text, or formatting beyond the required columns.",
    },
    {
      role: "user",
      content: combinedInput,
    },
  ];

  try {
    console.log("\n📤 Sending to Groq API:");
    console.log("=".repeat(80));
    console.log(combinedInput);
    console.log("=".repeat(80));

    const data = await getGroqResponse(messages);
    const content = data.choices?.[0]?.message?.content || "";
    console.log("Groq API Content:", content);
    return content;
  } catch (error) {
    console.error("Error screening resume:", error);
    throw error;
  }
}
