import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../supabase";
import { getCurrentUserId } from "../utils/auth";
import LoadingSpinner from "./LoadingSpinner";

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 1200px;
  width: 100%;
  background-color: #191c24;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const BackButton = styled.button`
  background: #374151;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #4b5563;
  }
`;

const ResumeContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PDFFrame = styled.iframe`
  width: 100%;
  height: 80vh;
  border: none;
  border-radius: 8px;
  background: #ffffff;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
`;

const CandidateInfo = styled.div`
  background: #2d3748;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #374151;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

const ScoreBadge = styled.span`
  background: ${(props) => {
    if (props.score >= 8) return "#198754";
    if (props.score >= 6) return "#FFC107";
    return "#AB2E3C";
  }};
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
`;

const DownloadButton = styled.a`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const ResumeViewer = () => {
  const { candidateId, jobId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, [candidateId]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);

      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      // Fetch candidate data
      const { data, error: fetchError } = await supabase
        .from("candidate_data")
        .select("*")
        .eq("id", candidateId)
        .eq("login_user_id", currentUserId)
        .single();

      if (fetchError) {
        console.error("Error fetching candidate:", fetchError);
        setError("Failed to load candidate data");
        return;
      }

      if (!data.Resume_URL) {
        setError("Resume not found for this candidate");
        return;
      }

      setCandidate(data);
    } catch (err) {
      console.error("Error in fetchCandidate:", err);
      setError("Failed to load candidate data");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/jobs/${jobId}/applicants`);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading resume..." />
      </Container>
    );
  }

  if (error || !candidate) {
    return (
      <Container>
        <Header>
          <Title>Resume Viewer</Title>
          <BackButton onClick={handleBack}>← Back to Applicants</BackButton>
        </Header>
        <ErrorMessage>{error || "Candidate not found"}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{candidate["Full Name"]} - Resume</Title>
        <BackButton onClick={handleBack}>← Back to Applicants</BackButton>
      </Header>

      <CandidateInfo>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Name</InfoLabel>
            <InfoValue>{candidate["Full Name"]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{candidate["Email"]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Phone</InfoLabel>
            <InfoValue>{candidate["Phone"]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Score</InfoLabel>
            <InfoValue>
              <ScoreBadge score={candidate["Score"]}>
                {candidate["Score"]}/10
              </ScoreBadge>
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Experience</InfoLabel>
            <InfoValue>{candidate["Experience"]} years</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Education</InfoLabel>
            <InfoValue>{candidate["Education"]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Degree</InfoLabel>
            <InfoValue>{candidate["Degree"]}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </CandidateInfo>

      <ResumeContainer>
        <DownloadButton
          href={candidate["Resume_URL"]}
          target="_blank"
          rel="noopener noreferrer"
        >
          📥 Open Resume
        </DownloadButton>

        <PDFFrame
          src={`${candidate["Resume_URL"]}#toolbar=1&navpanes=1&scrollbar=1&zoom=100`}
          title={`${candidate["Full Name"]} Resume`}
        />
      </ResumeContainer>
    </Container>
  );
};

export default ResumeViewer;
