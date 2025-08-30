import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";
import { getGroqResponse } from "../api";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
`;

const ModalHeader = styled.div`
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ffffff;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
  &:hover {
    color: #ffffff;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 32px;
  background: #374151;
  border-radius: 8px;
  padding: 4px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: ${(props) => (props.$active ? "#AF1763" : "transparent")};
  color: ${(props) => (props.$active ? "#FFFFFF" : "#9CA3AF")};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$active ? "#AF1763" : "rgba(175, 23, 99, 0.1)"};
    color: ${(props) => (props.$active ? "#FFFFFF" : "#FFFFFF")};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  option {
    background: #374151;
    color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;
  padding-right: 96px;
  padding-bottom: 42px;
  width: 100%;
  display: block;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #af1763;
`;

const CheckboxLabel = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
`;

const SkillsSection = styled.div`
  margin-top: 24px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const SkillChip = styled.div`
  background: rgba(175, 23, 99, 0.1);
  border: 1px solid rgba(175, 23, 99, 0.3);
  border-radius: 20px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(175, 23, 99, 0.2);
    color: #ffffff;
  }
`;

const AddSkillContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AddSkillInput = styled.input`
  flex: 1;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const AddSkillButton = styled.button`
  background: #af1763;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #8a1250;
  }

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const CommonSkillsContainer = styled.div`
  margin-top: 16px;
`;

const CommonSkillsTitle = styled.h4`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 12px 0;
`;

const CommonSkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CommonSkillButton = styled.button`
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 16px;
  padding: 6px 12px;
  color: #ffffff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #af1763;
    border-color: #af1763;
  }
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
  font-size: 1rem;
`;

const PrimaryButton = styled(Button)`
  background: #af1763;
  color: #ffffff;
  &:hover {
    background: #8a1250;
  }
  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: #374151;
  color: #ffffff;
  &:hover {
    background: #4b5563;
  }
`;

// Assistant selector styles
const AssistantSelect = styled.div`
  position: relative;
`;

const AssistantTrigger = styled.button`
  width: 100%;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AssistantMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #232837;
  border: 1px solid #374151;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  padding: 8px;
  z-index: 10;
`;

const AssistantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2b3143;
  }
`;

const AssistantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AssistantAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
`;

const AssistantName = styled.div`
  color: #ffffff;
  font-weight: 600;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #374151;
  border: 1px solid #4b5563;
  color: #9ca3af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const GenderTag = styled(Tag)`
  margin-left: 8px;
`;

const PlayButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.85rem;
  cursor: pointer;
`;

const TextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  display: block;
`;

const GenerateJDButton = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const AddJobModal = ({ isOpen, onClose, onAddJob, initialData }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    jobTitle: "",
    workplaceType: "Full-time",
    jobLocation: "",
    jobDescription: "",
    jobDuration: 30,
    postToLinkedIn: false,
    requiredSkills: [],
    assistant: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);

  const assistants = [
    {
      id: "Elliot",
      name: "Elliot",
      traits: ["Calm", "Professional"],
      gender: "Male",
      sample:
        "Hello, I'm Elliot. I'll guide your candidates with a calm, professional tone.",
    },
    {
      id: "Emily",
      name: "Emily",
      traits: ["Energetic", "Cheeky"],
      gender: "Female",
      sample:
        "Hi! I'm Emily. Expect a lively, cheeky twist to keep things engaging!",
    },
    {
      id: "Harry",
      name: "Harry",
      traits: ["Energetic", "Professional"],
      gender: "Male",
      sample:
        "Hey there, I'm Harry. Energetic yet professional—let's make this smooth.",
    },
    {
      id: "Paige",
      name: "Paige",
      traits: ["Calm", "Professional"],
      gender: "Female",
      sample:
        "Hello, I'm Paige. Calm, composed, and professional throughout the interview.",
    },
  ];

  const selectedAssistant = assistants.find((a) => a.id === formData.assistant);

  const previewAssistant = (assistant) => {
    try {
      const utterance = new SpeechSynthesisUtterance(assistant.sample);
      // Best-effort voice selection by gender (may vary by system/browser)
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        const preferred = voices.find((v) =>
          assistant.gender === "Female"
            ? /female|woman/i.test(v.name)
            : /male|man/i.test(v.name)
        );
        if (preferred) utterance.voice = preferred;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis not supported:", e);
    }
  };

  const commonSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "SQL",
  ];

  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || initialData.position || "",
        workplaceType:
          initialData.workplaceType || initialData.type || "Full-time",
        jobLocation: initialData.jobLocation || initialData.location || "",
        jobDescription: initialData.jobDescription || "",
        jobDuration: initialData.jobDuration || 30,
        postToLinkedIn: initialData.postToLinkedIn || false,
        requiredSkills: initialData.requiredSkills || [],
        assistant: initialData.assistant || "",
      });
    } else if (isOpen && !initialData) {
      setFormData({
        jobTitle: "",
        workplaceType: "Full-time",
        jobLocation: "",
        jobDescription: "",
        jobDuration: 30,
        postToLinkedIn: false,
        requiredSkills: [],
        assistant: "",
      });
    }
  }, [isOpen, initialData]);

  const isBasicInfoValid = () => {
    return (
      formData.jobTitle.trim() !== "" &&
      formData.jobLocation.trim() !== "" &&
      formData.jobDescription.trim() !== "" &&
      formData.jobDuration > 0
    );
  };

  const isSkillsValid = () => {
    return formData.requiredSkills.length > 0;
  };

  const canProceedToSkills = () => {
    return isBasicInfoValid();
  };

  const canCreateJob = () => {
    return isBasicInfoValid() && isSkillsValid();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const handleAddCommonSkill = (skill) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
      }));
    }
  };

  const generateProfessionalJD = async () => {
    if (!formData.jobTitle.trim()) {
      setError("Please enter Job Title first.");
      return;
    }
    try {
      setIsGeneratingJD(true);
      setError("");

      // Determine if we're rewriting existing description or creating from scratch
      const hasExistingDescription =
        formData.jobDescription && formData.jobDescription.trim();

      const messages = [
        {
          role: "system",
          content: hasExistingDescription
            ? "You rewrite job descriptions. Return ONLY two sections titled exactly: 'Overview:' and 'Requirements:'. No markdown asterisks, no placeholders like [Insert...], no meta text. Keep it concise and professional."
            : "You are a professional job description writer. Create a comprehensive job description with ONLY two sections titled exactly: 'Overview:' and 'Requirements:'. No markdown asterisks, no placeholders like [Insert...], no meta text. Keep it concise and professional.",
        },
        {
          role: "user",
          content: hasExistingDescription
            ? `Job Title: ${formData.jobTitle}\nLocation: ${
                formData.jobLocation || "Not specified"
              }\nWorkplace Type: ${
                formData.workplaceType || "Not specified"
              }\n\nExisting Description:\n${
                formData.jobDescription
              }\n\nRewrite into two sections: Overview and Requirements (list with dashes).`
            : `Job Title: ${formData.jobTitle}\nLocation: ${
                formData.jobLocation || "Not specified"
              }\nWorkplace Type: ${
                formData.workplaceType || "Full-time"
              }\n\nCreate a professional job description with two sections: Overview and Requirements (list with dashes). Base it on the job title and include typical responsibilities and requirements for this role.`,
        },
      ];
      const data = await getGroqResponse(messages);
      const content = data.choices?.[0]?.message?.content?.trim?.() || "";
      if (!content) throw new Error("Empty response from model");
      setFormData((prev) => ({ ...prev, jobDescription: content }));
    } catch (e) {
      console.error("Job description generation error:", e);
      let errorMessage = "Failed to generate job description";

      if (e.message) {
        if (e.message.includes("Groq API error")) {
          errorMessage =
            "Groq API service is currently unavailable. Please check your API key and try again.";
        } else if (e.message.includes("500")) {
          errorMessage =
            "Server error. Please ensure the Groq API key is properly configured and the server is running.";
        } else {
          errorMessage = e.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsGeneratingJD(false);
    }
  };

  async function checkLinkedInPermissions() {
    console.log("Checking LinkedIn permissions...");
    setStatus("");
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken =
      session?.provider_token || session?.provider_access_token;

    if (!accessToken) {
      setError("No LinkedIn access token found. Please log in with LinkedIn.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/check-linkedin-permissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        }
      );
      const data = await res.json();
      console.log("LinkedIn permissions check:", data);

      if (res.ok) {
        setStatus(
          `LinkedIn Permissions Check Complete. Accessible endpoints: ${data.summary.accessibleEndpoints}/${data.summary.totalEndpoints}`
        );
        console.log("Full permissions data:", data);
      } else {
        setError("Failed to check LinkedIn permissions: " + data.error);
      }
    } catch (err) {
      setError("Error checking LinkedIn permissions: " + err.message);
    }
  }

  async function postToLinkedIn(job) {
    console.log("Attempting to post to LinkedIn", job);
    setStatus("");
    setError("");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken =
      session?.provider_token || session?.provider_access_token;
    if (!accessToken)
      throw new Error(
        "No LinkedIn access token found. Please log in with LinkedIn."
      );
    try {
      console.log("Will send POST to backend", { accessToken, job });
      const res = await fetch("http://localhost:5000/api/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, job }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to post job to LinkedIn:", data.error || data);
        throw new Error(data.error || "Failed to post to LinkedIn");
      }
      console.log("LinkedIn response:", data);
      return data;
    } catch (err) {
      console.error("Error posting job to LinkedIn:", err);
      throw err;
    }
  }

  const handleSubmit = async () => {
    if (canCreateJob()) {
      setStatus("");
      setError("");
      onAddJob(formData);
      if (formData.postToLinkedIn) {
        try {
          const linkedInResponse = await postToLinkedIn(formData);
          if (linkedInResponse.message) {
            setStatus(linkedInResponse.message);
          } else {
            setStatus("Job posted to LinkedIn successfully!");
          }
        } catch (err) {
          setError("Failed to post to LinkedIn: " + err.message);
        }
      }
      onClose();
      setFormData({
        jobTitle: "",
        workplaceType: "Full-time",
        jobLocation: "",
        jobDescription: "",
        jobDuration: 30,
        postToLinkedIn: false,
        requiredSkills: [],
        assistant: "",
      });
    }
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <HeaderIcon>💼</HeaderIcon>
            <HeaderText>
              <Title>
                {isEditing ? "Edit Job Posting" : "Create Job Posting"}
              </Title>
              <Subtitle>
                {isEditing
                  ? "Update the job posting details"
                  : "Create a compelling job description to attract the best candidates"}
              </Subtitle>
            </HeaderText>
          </HeaderContent>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <TabContainer>
          <Tab
            $active={activeTab === "basic"}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </Tab>
          <Tab
            $active={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
          >
            Required Skills
          </Tab>
        </TabContainer>

        <ModalBody>
          {activeTab === "basic" && (
            <>
              <FormGroup>
                <Label>Job Title *</Label>
                <Input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Workplace Type</Label>
                <Select
                  value={formData.workplaceType}
                  onChange={(e) =>
                    handleInputChange("workplaceType", e.target.value)
                  }
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Job Location *</Label>
                <Input
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={formData.jobLocation}
                  onChange={(e) =>
                    handleInputChange("jobLocation", e.target.value)
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Job Description *</Label>
                <TextAreaContainer>
                  <TextArea
                    placeholder="Describe the role, responsibilities, requirements, and any screening questions"
                    value={formData.jobDescription}
                    onChange={(e) =>
                      handleInputChange("jobDescription", e.target.value)
                    }
                    required
                  />
                  <GenerateJDButton
                    type="button"
                    onClick={generateProfessionalJD}
                    disabled={isGeneratingJD}
                    title={
                      formData.jobDescription.trim()
                        ? "Rewrite professionally with AI"
                        : "Generate job description from title with AI"
                    }
                  >
                    ❇️{" "}
                    {isGeneratingJD
                      ? "Generating..."
                      : formData.jobDescription.trim()
                      ? "Rewrite"
                      : "Generate"}
                  </GenerateJDButton>
                </TextAreaContainer>
              </FormGroup>

              <FormGroup>
                <Label>Job Active Duration (days) *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.jobDuration}
                  onChange={(e) =>
                    handleInputChange(
                      "jobDuration",
                      parseInt(e.target.value) || 0
                    )
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Interviewer Agent</Label>
                <AssistantSelect>
                  <AssistantTrigger onClick={() => setAssistantOpen((o) => !o)}>
                    <span>
                      {selectedAssistant
                        ? `${
                            selectedAssistant.name
                          } — ${selectedAssistant.traits.join(" + ")}`
                        : "Select an agent"}
                    </span>
                    <span>▾</span>
                  </AssistantTrigger>
                  {assistantOpen && (
                    <AssistantMenu>
                      {assistants.map((a) => (
                        <AssistantItem
                          key={a.id}
                          onClick={() => {
                            handleInputChange("assistant", a.id);
                            setAssistantOpen(false);
                          }}
                        >
                          <AssistantInfo>
                            <AssistantAvatar>{a.name[0]}</AssistantAvatar>
                            <div>
                              <AssistantName>{a.name}</AssistantName>
                              <Tags>
                                {a.traits.map((t) => (
                                  <Tag key={t}>{t}</Tag>
                                ))}
                                <GenderTag>{a.gender}</GenderTag>
                              </Tags>
                            </div>
                          </AssistantInfo>
                          <PlayButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              previewAssistant(a);
                            }}
                          >
                            ▶︎ Play
                          </PlayButton>
                        </AssistantItem>
                      ))}
                    </AssistantMenu>
                  )}
                </AssistantSelect>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
                  Preview the assistant's voice before selecting.
                </p>
              </FormGroup>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={formData.postToLinkedIn}
                  onChange={(e) =>
                    handleInputChange("postToLinkedIn", e.target.checked)
                  }
                />
                <CheckboxLabel>Post to LinkedIn</CheckboxLabel>
              </CheckboxContainer>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginTop: "8px",
                }}
              >
                Automatically create and post a job listing to your LinkedIn
                profile.
              </p>

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <SecondaryButton
                  onClick={checkLinkedInPermissions}
                  style={{ fontSize: "0.8rem", padding: "8px 16px" }}
                >
                  Check LinkedIn Permissions
                </SecondaryButton>
                <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  Test what LinkedIn API access you have
                </span>
              </div>
            </>
          )}

          {activeTab === "skills" && (
            <SkillsSection>
              <FormGroup>
                <Label>Required Technologies *</Label>
                <AddSkillContainer>
                  <AddSkillInput
                    type="text"
                    placeholder="Type and press Enter to add technology"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <AddSkillButton onClick={handleAddSkill}>Add</AddSkillButton>
                </AddSkillContainer>

                <CommonSkillsContainer>
                  <CommonSkillsTitle>Common Skills</CommonSkillsTitle>
                  <CommonSkillsGrid>
                    {commonSkills.map((skill) => (
                      <CommonSkillButton
                        key={skill}
                        onClick={() => handleAddCommonSkill(skill)}
                      >
                        + {skill}
                      </CommonSkillButton>
                    ))}
                  </CommonSkillsGrid>
                </CommonSkillsContainer>

                <SkillsGrid>
                  {formData.requiredSkills.map((skill) => (
                    <SkillChip key={skill}>
                      {skill}
                      <RemoveButton onClick={() => handleRemoveSkill(skill)}>
                        ×
                      </RemoveButton>
                    </SkillChip>
                  ))}
                </SkillsGrid>

                {formData.requiredSkills.length === 0 && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "0.9rem",
                      marginTop: "8px",
                    }}
                  >
                    Please add at least one required technology.
                  </p>
                )}

                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                  Specifying required technologies helps candidates understand
                  if they're a good fit for the role.
                </p>
              </FormGroup>
            </SkillsSection>
          )}
        </ModalBody>

        <ModalFooter>
          {status && (
            <div style={{ color: "#198754", marginRight: 16 }}>{status}</div>
          )}
          {error && (
            <div style={{ color: "#ab2e3c", marginRight: 16 }}>{error}</div>
          )}
          {activeTab === "basic" ? (
            <PrimaryButton
              onClick={() => setActiveTab("skills")}
              disabled={!canProceedToSkills()}
              style={{
                opacity: canProceedToSkills() ? 1 : 0.5,
                cursor: canProceedToSkills() ? "pointer" : "not-allowed",
              }}
            >
              Next
            </PrimaryButton>
          ) : (
            <>
              <SecondaryButton onClick={() => setActiveTab("basic")}>
                Back to Details
              </SecondaryButton>
              <PrimaryButton
                onClick={handleSubmit}
                disabled={!canCreateJob()}
                style={{
                  opacity: canCreateJob() ? 1 : 0.5,
                  cursor: canCreateJob() ? "pointer" : "not-allowed",
                }}
              >
                Create Job Posting
              </PrimaryButton>
            </>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddJobModal;
