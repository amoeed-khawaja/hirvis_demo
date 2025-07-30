import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const Container = styled.div`
  min-height: 100vh;
  background: #191c24;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const FormCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
`;

const Title = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
`;

const Question = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #374151;
  border-radius: 8px;
  background: #191c24;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  text-align: center;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #af1763;
    background: #191c24;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #374151;
  border-radius: 8px;
  background: #191c24;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  text-align: center;
  box-sizing: border-box;

  option {
    background: #191c24;
    color: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: #af1763;
    background: #191c24;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #374151;
  border-radius: 8px;
  background: #191c24;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  min-height: 100px;
  resize: vertical;
  text-align: center;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #af1763;
    background: #191c24;
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const PhonePrefix = styled.span`
  background: #191c24;
  color: #ffffff;
  padding: 15px 10px;
  border: 1px solid #374151;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
  font-weight: 500;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 1px solid #374151;
  border-left: none;
  border-radius: 0 8px 8px 0;
  background: #191c24;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-align: center;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #af1763;
    background: #191c24;
  }
`;

const Button = styled.button`
  background: #af1763;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px;

  &:hover:not(:disabled) {
    background: #8a1250;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background: #198754;
  color: #ffffff;
  width: 100%;
  justify-content: center;
  padding: 15px 24px;
  font-size: 1.1rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #146c43;
    transform: translateY(-1px);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #374151;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #af1763, #0d6efd);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${(props) => (props.currentStep / props.totalSteps) * 100}%;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Label = styled.label`
  color: #bfd4d1;
  margin-bottom: 10px;
  display: block;
  font-size: 1rem;
  font-weight: 500;
`;

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    phone: "",
    organization: "",
    hr_agent_voice: "",
    hr_recruiter_name: "",
    candidate_questions: "",
    candidate_questions2: "",
  });

  const hrAgentVoices = [
    "Sarah Johnson - Professional & Friendly",
    "Michael Chen - Confident & Authoritative",
    "Emily Rodriguez - Warm & Approachable",
    "David Thompson - Analytical & Detail-Oriented",
  ];

  const steps = [
    {
      question: "What's your full name?",
      field: "display_name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      question: "What's your email address?",
      field: "email",
      type: "email",
      placeholder: "Enter your email address",
    },
    {
      question: "What's your phone number?",
      field: "phone",
      type: "phone",
      placeholder: "Enter your phone number",
    },
    {
      question: "What's your organization name?",
      field: "organization",
      type: "text",
      placeholder: "Enter your organization name",
    },
    { question: "HR Recruiter Setup", field: "form", type: "form" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: limitedDigits }));
  };

  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const step = steps[currentStep];

      if (
        step.field &&
        formData[step.field] &&
        formData[step.field].trim() !== ""
      ) {
        handleNext();
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("=== SUBMIT BUTTON CLICKED ===");
    console.log("Line 1: Submit function started");

    setLoading(true);
    setError("");

    try {
      console.log("Line 2: Getting current user...");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("Line 2 ERROR: No user found");
        throw new Error("No authenticated user found");
      }

      console.log("Line 3: User found - UID:", user.id);
      console.log("Line 4: User email:", user.email);
      console.log("Line 5: Form data:", formData);

      // Validate required fields
      const requiredFields = [
        "display_name",
        "email",
        "phone",
        "organization",
        "hr_agent_voice",
        "hr_recruiter_name",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (missingFields.length > 0) {
        console.log("Line 6 ERROR: Missing fields:", missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      console.log("Line 7: All required fields present");

      // Format phone number with +1 prefix for database
      const formattedPhone = formData.phone ? `+1${formData.phone}` : null;

      console.log("Line 8: Preparing data for database insertion...");

      // Prepare data for database - let the database generate the primary key
      const userData = {
        display_name: formData.display_name,
        email: formData.email,
        phone: formattedPhone,
        organization: formData.organization,
        assistant_name: formData.hr_agent_voice,
        recruiter_name: formData.hr_recruiter_name,
        candidate_questions: formData.candidate_questions,
        candidate_questions2: formData.candidate_questions2,
        login_user_id: user.id,
        paid: 0,
        paid_date: null,
        assistant: null,
        assistant_api: null,
      };

      console.log("Line 9: Data to insert:", userData);
      console.log("Line 10: Column names being used:");
      console.log("  - display_name:", userData.display_name);
      console.log("  - email:", userData.email);
      console.log("  - phone:", userData.phone);
      console.log("  - organization:", userData.organization);
      console.log("  - assistant_name:", userData.assistant_name);
      console.log("  - recruiter_name:", userData.recruiter_name);
      console.log("  - candidate_questions:", userData.candidate_questions);
      console.log("  - candidate_questions2:", userData.candidate_questions2);
      console.log("  - login_user_id:", userData.login_user_id);
      console.log("  - paid:", userData.paid);
      console.log("  - paid_date:", userData.paid_date);
      console.log("  - assistant:", userData.assistant);
      console.log("  - assistant_api:", userData.assistant_api);

      console.log("Line 11: Inserting data into users_data table...");
      const { data, error } = await supabase
        .from("users_data")
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error("Line 11 ERROR:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log("Line 12: Database insertion successful:", data);
      console.log("Line 13: Redirecting to dashboard...");
      // Navigate to dashboard and force reload to ensure ProtectedRoute picks up the new data
      window.location.href = "/app";
    } catch (error) {
      console.error("Line ERROR:", error);
      setError(error.message);
    } finally {
      console.log("Line 14: Setting loading to false");
      setLoading(false);
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];

    if (!step) {
      return <div style={{ color: "white" }}>Error: No step found</div>;
    }

    if (step.type === "form") {
      return (
        <div>
          <Question>HR Recruiter Setup</Question>

          <div style={{ marginBottom: "20px" }}>
            <Label>Which HR agent voice would you like to go with?</Label>
            <Select
              value={formData.hr_agent_voice}
              onChange={(e) =>
                handleInputChange("hr_agent_voice", e.target.value)
              }
            >
              <option value="">Select an HR agent voice</option>
              {hrAgentVoices.map((voice, index) => (
                <option key={index} value={voice}>
                  {voice}
                </option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Label>Name of the HR recruiter?</Label>
            <Input
              type="text"
              placeholder="Enter HR recruiter name"
              value={formData.hr_recruiter_name}
              onChange={(e) =>
                handleInputChange("hr_recruiter_name", e.target.value)
              }
              onKeyPress={handleKeyPress}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Label>
              Any set of questions you usually would ask a candidate?
            </Label>
            <TextArea
              placeholder="Enter your typical candidate questions..."
              value={formData.candidate_questions}
              onChange={(e) =>
                handleInputChange("candidate_questions", e.target.value)
              }
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Label>
              What do you look for in a candidate? What makes them an ideal fit?
            </Label>
            <TextArea
              placeholder="Describe your ideal candidate qualities..."
              value={formData.candidate_questions2}
              onChange={(e) =>
                handleInputChange("candidate_questions2", e.target.value)
              }
            />
          </div>

          <SubmitButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Setting up your account..." : "Complete Setup"}
          </SubmitButton>
        </div>
      );
    }

    if (step.type === "phone") {
      return (
        <div>
          <Question>{step.question}</Question>
          <PhoneInputContainer>
            <PhonePrefix>+1</PhonePrefix>
            <PhoneInput
              type="tel"
              placeholder={step.placeholder}
              value={formatPhoneForDisplay(formData[step.field])}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </PhoneInputContainer>
        </div>
      );
    }

    return (
      <div>
        <Question>{step.question}</Question>
        <Input
          type={step.type}
          placeholder={step.placeholder}
          value={formData[step.field]}
          onChange={(e) => handleInputChange(step.field, e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
    );
  };

  return (
    <Container>
      <FormCard>
        <Title>Complete Your Profile</Title>

        <ProgressBar>
          <ProgressFill
            currentStep={currentStep + 1}
            totalSteps={steps.length}
          />
        </ProgressBar>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {renderStep()}

        {currentStep < steps.length - 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button onClick={handleBack} disabled={currentStep === 0}>
              ← Back
            </Button>
            <Button onClick={handleNext}>Next →</Button>
          </div>
        )}
      </FormCard>
    </Container>
  );
};

export default OnboardingForm;
