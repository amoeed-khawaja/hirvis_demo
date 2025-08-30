import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../supabase";
import LoadingSpinner from "./LoadingSpinner";
import { getCurrentUserId } from "../utils/auth";

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

const SectionContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CandidateCount = styled.span`
  background: ${(props) =>
    props.variant === "pending" ? "#f59e0b" : "#10b981"};
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow: auto;
  max-width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
  table-layout: fixed;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 1rem;
  color: #9ca3af;
  border-bottom: 1px solid #374151;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px 12px;
  border-bottom: 1px solid #374151;
  color: #ffffff;
  vertical-align: top;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const ResumeLink = styled.a`
  color: #5f4bfa;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ScoreBadge = styled.span`
  background: ${(props) => {
    if (props.score >= 8) return "#10b981";
    if (props.score >= 6) return "#f59e0b";
    return "#ef4444";
  }};
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

const CallButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessStatus = styled(StatusMessage)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
`;

const ErrorStatus = styled(StatusMessage)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
`;

const Interviews = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [conductedCandidates, setConductedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch job details
  const fetchJob = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("active_jobs")
        .select("*")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
      } else {
        setJob(data);
      }
    } catch (err) {
      console.error("Error in fetchJob:", err);
      setError("Failed to fetch job details");
    }
  };

  // Fetch candidates for this job
  const fetchCandidates = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      // Get candidate IDs from active_job_candidates table
      const { data: jobCandidates, error: jobCandidatesError } = await supabase
        .from("active_job_candidates")
        .select("candidate_id")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId);

      if (jobCandidatesError) {
        console.error("Error fetching job candidates:", jobCandidatesError);
        setError(jobCandidatesError.message);
        return;
      }

      if (!jobCandidates || jobCandidates.length === 0) {
        setPendingCandidates([]);
        setConductedCandidates([]);
        return;
      }

      // Extract candidate IDs
      const candidateIds = jobCandidates.map((jc) => jc.candidate_id);

      // Get candidate data
      const { data: candidateData, error: candidateDataError } = await supabase
        .from("candidate_data")
        .select("*")
        .in("id", candidateIds)
        .eq("login_user_id", currentUserId);

      if (candidateDataError) {
        console.error("Error fetching candidate data:", candidateDataError);
        setError(candidateDataError.message);
      } else {
        // Filter candidates based on Interview_round status
        const pending = candidateData.filter(
          (c) => c.Interview_round === true && c.called !== true
        );
        const conducted = candidateData.filter((c) => c.called === true);

        setPendingCandidates(pending);
        setConductedCandidates(conducted);
      }
    } catch (err) {
      console.error("Error in fetchCandidates:", err);
      setError("Failed to fetch candidates");
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJob(), fetchCandidates()]);
      setLoading(false);
    };
    loadData();
  }, [jobId]);

  const handleBack = () => {
    // Check URL search params to see where user came from
    const searchParams = new URLSearchParams(location.search);
    const fromPage = searchParams.get("from");

    if (fromPage === "applicants") {
      navigate(`/jobs/${jobId}/applicants`);
    } else {
      navigate(`/jobs/${jobId}/interview-questions?from=interviews`);
    }
  };

  const handleCallCandidate = async (candidateId) => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setStatusMessage({
          type: "error",
          message: "User not authenticated",
        });
        return;
      }

      const { error } = await supabase
        .from("candidate_data")
        .update({ called: true })
        .eq("id", candidateId)
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error updating candidate:", error);
        setStatusMessage({
          type: "error",
          message: `Failed to update candidate: ${error.message}`,
        });
      } else {
        setStatusMessage({
          type: "success",
          message: "Candidate marked as called successfully!",
        });

        // Refresh candidates list
        await fetchCandidates();
      }
    } catch (error) {
      console.error("Error in handleCallCandidate:", error);
      setStatusMessage({
        type: "error",
        message: `Error updating candidate: ${error.message}`,
      });
    }
  };

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const str = String(phone).replace(/\D/g, "");
    if (str.startsWith("92")) return "+" + str;
    if (str.startsWith("3")) return "0" + str;
    return phone;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading interviews..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div
          style={{
            textAlign: "center",
            color: "#ef4444",
            padding: "60px 20px",
          }}
        >
          Error: {error}
        </div>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <EmptyState>Job not found</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{job.job_title} - Interviews</Title>
        <BackButton onClick={handleBack}>← Back to Questions</BackButton>
      </Header>

      {/* Pending Interviews Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            ⏳ Pending Interviews
            <CandidateCount variant="pending">
              {pendingCandidates.length}
            </CandidateCount>
          </SectionTitle>
        </SectionHeader>

        {pendingCandidates.length === 0 ? (
          <EmptyState>
            No pending interviews. All candidates have been called or are not in
            interview round.
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: "20%" }}>Name</Th>
                  <Th style={{ width: "25%" }}>Email</Th>
                  <Th style={{ width: "15%" }}>Phone</Th>
                  <Th style={{ width: "10%" }}>Score</Th>
                  <Th style={{ width: "15%" }}>Resume</Th>
                  <Th style={{ width: "15%" }}>Action</Th>
                </tr>
              </thead>
              <tbody>
                {pendingCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <Td>{candidate["Full Name"]}</Td>
                    <Td>{candidate["Email"]}</Td>
                    <Td>{formatPhone(candidate["Phone"])}</Td>
                    <Td>
                      <ScoreBadge score={candidate["Score"]}>
                        {candidate["Score"]}/10
                      </ScoreBadge>
                    </Td>
                    <Td>
                      <ResumeLink href="#" onClick={(e) => e.preventDefault()}>
                        View Resume
                      </ResumeLink>
                    </Td>
                    <Td>
                      <CallButton
                        onClick={() => handleCallCandidate(candidate.id)}
                      >
                        📞 Call
                      </CallButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </SectionContainer>

      {/* Conducted Interviews Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            ✅ Conducted Interviews
            <CandidateCount variant="conducted">
              {conductedCandidates.length}
            </CandidateCount>
          </SectionTitle>
        </SectionHeader>

        {conductedCandidates.length === 0 ? (
          <EmptyState>
            No conducted interviews yet. Call candidates to start interviews.
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: "15%" }}>Name</Th>
                  <Th style={{ width: "20%" }}>Email</Th>
                  <Th style={{ width: "12%" }}>Phone</Th>
                  <Th style={{ width: "10%" }}>Interview Score</Th>
                  <Th style={{ width: "12%" }}>Resume</Th>
                  <Th style={{ width: "31%" }}>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {conductedCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <Td>{candidate["Full Name"]}</Td>
                    <Td>{candidate["Email"]}</Td>
                    <Td>{formatPhone(candidate["Phone"])}</Td>
                    <Td>
                      <ScoreBadge score={candidate["interview_score"] || 0}>
                        {candidate["interview_score"] || "N/A"}/10
                      </ScoreBadge>
                    </Td>
                    <Td>
                      <ResumeLink href="#" onClick={(e) => e.preventDefault()}>
                        View Resume
                      </ResumeLink>
                    </Td>
                    <Td>{candidate["interview_notes"] || "No notes"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </SectionContainer>

      {statusMessage &&
        (statusMessage.type === "success" ? (
          <SuccessStatus>✅ {statusMessage.message}</SuccessStatus>
        ) : (
          <ErrorStatus>❌ {statusMessage.message}</ErrorStatus>
        ))}
    </Container>
  );
};

export default Interviews;
