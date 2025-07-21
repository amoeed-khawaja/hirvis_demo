import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
`;
const FormTitle = styled.h2`
  color: ${({ theme }) => (theme.colors.mode === "dark" ? "#fff" : "#222")};
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 6px;
  font-size: 1rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  min-height: 80px;
  margin-bottom: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 6px;
  font-size: 1rem;
`;
const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #155ab6;
  }
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.colors.text};
`;
const StatusMsg = styled.div`
  margin-top: 12px;
  color: ${({ error }) => (error ? "#ab2e3c" : "#198754")};
  font-size: 1rem;
`;

async function postToLinkedIn({
  title,
  location,
  description,
  workplaceType = "",
  requiredSkills = "",
}) {
  console.log("postToLinkedIn called", {
    title,
    location,
    description,
    workplaceType,
    requiredSkills,
  });
  // 1. Get session and access token
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("Supabase session:", session);
  const accessToken = session?.provider_token || session?.provider_access_token;
  if (!accessToken)
    throw new Error(
      "No LinkedIn access token found. Please log in with LinkedIn."
    );

  // 2. Get user's LinkedIn ID
  const profileRes = await fetch("https://api.linkedin.com/v2/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) throw new Error("Failed to fetch LinkedIn profile");
  const profile = await profileRes.json();
  const linkedInId = profile.id;
  if (!linkedInId) throw new Error("No LinkedIn ID found");

  // 3. Build post body for /rest/posts
  const postBody = {
    author: `urn:li:person:${linkedInId}`,
    commentary: `HIRING!\nWe are looking for a ${title}\nType: ${workplaceType}\nLocation: ${location}\nJob description:\n${description}\n\nRequired skills: ${requiredSkills}`,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  // 4. Post to LinkedIn
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify(postBody),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to post to LinkedIn");
  }
  return true;
}

const JobForm = ({ onAddJob }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
    workplaceType: "",
    requiredSkills: "",
  });
  const [postToLinkedInChecked, setPostToLinkedInChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    console.log(
      "Form submitted. postToLinkedInChecked:",
      postToLinkedInChecked,
      form
    );
    if (form.title && form.location && form.salaryRange && form.description) {
      onAddJob(form);
      if (postToLinkedInChecked) {
        try {
          await postToLinkedIn(form);
          setStatus("Job posted to LinkedIn successfully!");
        } catch (err) {
          setError("Failed to post to LinkedIn: " + err.message);
        }
      }
      setForm({
        title: "",
        location: "",
        salaryRange: "",
        description: "",
        workplaceType: "",
        requiredSkills: "",
      });
      setPostToLinkedInChecked(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Add New Job</FormTitle>
      <form onSubmit={handleSubmit}>
        <Input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          name="salaryRange"
          placeholder="Salary Range"
          value={form.salaryRange}
          onChange={handleChange}
          required
        />
        <Input
          name="workplaceType"
          placeholder="Workplace Type (e.g. Remote, Onsite)"
          value={form.workplaceType}
          onChange={handleChange}
        />
        <Input
          name="requiredSkills"
          placeholder="Required Skills (comma separated)"
          value={form.requiredSkills}
          onChange={handleChange}
        />
        <TextArea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={postToLinkedInChecked}
            onChange={(e) => setPostToLinkedInChecked(e.target.checked)}
          />
          Post to LinkedIn
        </CheckboxLabel>
        <Button type="submit">Add Job</Button>
        {status && <StatusMsg>{status}</StatusMsg>}
        {error && <StatusMsg error>{error}</StatusMsg>}
      </form>
    </FormContainer>
  );
};

export default JobForm;
