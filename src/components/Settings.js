import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";
import { getCurrentUser } from "../utils/auth";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #191c24;
  padding: 20px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 0 10px;
    gap: 20px;
  }
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground || "#232837"};
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  padding: 48px 40px 40px 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 32px 24px 24px 24px;
  }
`;

const QuestionnaireCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground || "#232837"};
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  padding: 32px;
  color: #fff;
  position: relative;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  background: #191c24;
  border: 3px solid #af1763;
`;

const InitialsAvatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #af1763;
`;

const UploadLabel = styled.label`
  margin-top: 10px;
  color: #af1763;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 18px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Label = styled.label`
  color: #b3b8c5;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #232837;
  background: #181a20;
  color: #fff;
  font-size: 1rem;
  transition: border 0.2s;
  text-align: center;
  &:focus {
    border-color: #af1763;
    outline: none;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const Status = styled.div`
  margin-top: 12px;
  color: ${({ error }) => (error ? "#ab2e3c" : "#198754")};
  font-size: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #af1763;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(175, 23, 99, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #232837;
  background: #181a20;
  color: #fff;
  font-size: 1rem;
  transition: border 0.2s;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  text-align: center;

  &:focus {
    border-color: #af1763;
    outline: none;
  }

  &:disabled {
    background: #232837;
    color: #b3b8c5;
    cursor: not-allowed;
  }
`;

const QuestionnaireForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QuestionnaireSaveButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  margin-top: 16px;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Settings = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Questionnaire state
  const [organization, setOrganization] = useState("");
  const [recruiterName, setRecruiterName] = useState("");

  // Edit state
  const [isEditingQuestionnaire, setIsEditingQuestionnaire] = useState(false);
  const [questionnaireStatus, setQuestionnaireStatus] = useState("");
  const [questionnaireError, setQuestionnaireError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const u = await getCurrentUser();
      setUser(u);
      // Name: prefer user_metadata.name, fallback to email prefix
      setDisplayName(
        u?.user_metadata?.name ||
          u?.user_metadata?.["Display name"] ||
          u?.user_metadata?.display_name ||
          (u?.email ? u.email.split("@")[0] : "")
      );
      setEmail(u?.email || "");
      // Phone: prefer user.phone, fallback to user_metadata.phone
      setPhone(
        u?.phone || u?.user_metadata?.Phone || u?.user_metadata?.phone || ""
      );
      setAvatarUrl(
        u?.user_metadata?.["Avatar URL"] || u?.user_metadata?.avatar_url || ""
      );

      // Fetch questionnaire data from users_data table
      if (u?.id) {
        try {
          const { data: userData, error: userDataError } = await supabase
            .from("users_data")
            .select("*")
            .eq("id", u.id)
            .single();

          if (userDataError && userDataError.code !== "PGRST116") {
            console.error("Error fetching user data:", userDataError);
          } else if (userData) {
            setOrganization(userData.organization || "");
            setRecruiterName(userData.recruiter_name || "");
          }
        } catch (err) {
          console.error("Error fetching questionnaire data:", err);
        }
      }
    }
    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    let uploadedAvatarUrl = avatarUrl;
    try {
      if (avatarFile) {
        // Upload avatar to Supabase Storage (bucket: 'avatars')
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        uploadedAvatarUrl = publicUrlData?.publicUrl || avatarUrl;
      }
      // Update user metadata
      const updates = {
        data: {
          "Display name": displayName,
          Phone: phone,
          "Avatar URL": uploadedAvatarUrl,
        },
      };
      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;
      setStatus("Profile updated successfully!");
      setError("");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
      setStatus("");
    }
  };

  const handleQuestionnaireSave = async (e) => {
    e.preventDefault();
    setQuestionnaireStatus("");
    setQuestionnaireError("");

    try {
      const updateData = {
        organization,
        recruiter_name: recruiterName,
      };

      // Try to update first
      const { data: existingData, error: selectError } = await supabase
        .from("users_data")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("users_data")
          .update(updateData)
          .eq("id", user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("users_data")
          .insert({
            id: user.id,
            display_name: displayName,
            email: email,
            phone: phone,
            login_user_id: user.id,
            ...updateData,
          });

        if (insertError) throw insertError;
      }

      setQuestionnaireStatus("Questionnaire updated successfully!");
      setIsEditingQuestionnaire(false);
      setQuestionnaireError("");
    } catch (err) {
      setQuestionnaireError("Failed to update questionnaire: " + err.message);
      setQuestionnaireStatus("");
    }
  };

  return (
    <PageContainer>
      <Container>
        {/* Profile Settings Card */}
        <ProfileCard>
          <AvatarWrapper>
            {avatarUrl ? (
              <Avatar src={avatarUrl} alt={displayName} />
            ) : (
              <InitialsAvatar>{getInitials(displayName)}</InitialsAvatar>
            )}
            <UploadLabel htmlFor="avatar-upload">
              Change Photo
              <HiddenInput
                id="avatar-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </UploadLabel>
          </AvatarWrapper>
          <Title>Account Settings</Title>
          <Form onSubmit={handleSave}>
            <div>
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <SaveButton type="submit">Save Changes</SaveButton>
            {status && <Status>{status}</Status>}
            {error && <Status error={!!error}>{error}</Status>}
          </Form>
        </ProfileCard>

        {/* Questionnaire Card */}
        <QuestionnaireCard>
          <SectionHeader>
            <SectionTitle>HR Recruiter Profile</SectionTitle>
            <EditButton
              type="button"
              onClick={() => setIsEditingQuestionnaire(!isEditingQuestionnaire)}
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
              </svg>
              {isEditingQuestionnaire ? "Cancel" : "Edit"}
            </EditButton>
          </SectionHeader>

          <QuestionnaireForm onSubmit={handleQuestionnaireSave}>
            <FieldGroup>
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization name"
                disabled={!isEditingQuestionnaire}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="recruiterName">HR Recruiter Name</Label>
              <Input
                id="recruiterName"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Enter HR recruiter name"
                disabled={!isEditingQuestionnaire}
              />
            </FieldGroup>

            {isEditingQuestionnaire && (
              <QuestionnaireSaveButton type="submit">
                Save Questionnaire
              </QuestionnaireSaveButton>
            )}

            {questionnaireStatus && <Status>{questionnaireStatus}</Status>}
            {questionnaireError && (
              <Status error={!!questionnaireError}>{questionnaireError}</Status>
            )}
          </QuestionnaireForm>
        </QuestionnaireCard>
      </Container>
    </PageContainer>
  );
};

export default Settings;
