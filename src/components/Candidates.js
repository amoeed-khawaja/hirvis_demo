import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #bfd4d1;
  font-size: 1.1rem;
  margin: 0;
`;

const SearchBar = styled.input`
  background: #232837;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  width: 300px;
  margin-bottom: 32px;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    border-color: #5f4bfa;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
`;

const shine = keyframes`
  0% { box-shadow: 0 0 0 0 #5f4bfa, 0 0 6px 2px #5f4bfa; }
  50% { box-shadow: 0 0 0 0 #5f4bfa, 0 0 12px 4px #5f4bfa; }
  100% { box-shadow: 0 0 0 0 #5f4bfa, 0 0 6px 2px #5f4bfa; }
`;

const Card = styled.div`
  background: #232837;
  border-radius: 16px;
  border: 1.5px solid;
  border-image: linear-gradient(135deg, #af1763, #5f4bfa) 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 #5f4bfa;
  animation: ${shine} 2.5s infinite;
  padding: 32px 28px 24px 28px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 0 0 0 #5f4bfa, 0 0 16px 6px #5f4bfa;
  }
`;

const Name = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #ffffff;
`;

const JobTitle = styled.div`
  color: #bfd4d1;
  font-size: 1.05rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ResumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: #5f4bfa;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  border-radius: 6px;
  padding: 4px 0;

  &:hover {
    color: #af1763;
    transform: translateX(2px);
  }

  &.disabled {
    color: #6b7280;
    cursor: not-allowed;
    &:hover {
      color: #6b7280;
      transform: none;
    }
  }
`;

const Icon = styled.span`
  font-size: 1.1rem;
  color: #af1763;
`;

const CardActions = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 10px;
  align-items: center;
  justify-content: flex-end;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: #b3b8c5;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s, transform 0.18s, box-shadow 0.18s;
  border-radius: 50%;
  padding: 6px;
  margin-left: 4px;
  &:hover {
    color: #af1763;
    background: rgba(175, 23, 99, 0.08);
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(175, 23, 99, 0.12);
  }
`;

const Loading = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.2rem;
  text-align: center;
  margin-top: 80px;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.1rem;
  text-align: center;
  margin-top: 80px;
`;

function deduplicateByPhone(candidates) {
  const seen = new Set();
  return candidates.filter((c) => {
    const phone = c["Phone"] || c.phone;
    if (!phone || seen.has(phone)) return false;
    seen.add(phone);
    return true;
  });
}

// Format phone number for display
function formatPhone(phone) {
  if (!phone) return "-";
  const str = String(phone).replace(/\D/g, "");
  if (str.startsWith("92")) return "+" + str;
  if (str.startsWith("3")) return "0" + str;
  return phone;
}

// SVG Icons
const MailIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="4" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const PdfIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    <path d="M9 16v-3h1.5a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1-1.5 1.5H9z" />
    <path d="M9 11v1.5" />
    <path d="M13 13v3" />
    <path d="M15 11v1" />
  </svg>
);

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        const { data, error: fetchError } = await supabase
          .from("candidate_data")
          .select("*")
          .eq("login_user_id", userId);
        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }
        setCandidates(deduplicateByPhone(data || []));
      } catch (err) {
        setError("Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${name} as a candidate?`
    );
    if (!confirm) return;
    try {
      await supabase.from("candidate_data").delete().eq("id", id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete candidate.");
    }
  };

  const handleEmail = (email) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}`;
    const win = window.open(gmailUrl, "_blank");
    setTimeout(() => {
      if (!win || win.closed || typeof win.closed === "undefined") {
        window.location.href = `mailto:${email}`;
      }
    }, 500);
  };

  const handleViewResume = (candidateId, resumeUrl) => {
    if (!resumeUrl) {
      alert("No resume available for this candidate");
      return;
    }

    // Try to find the job ID for this candidate
    // Since we don't have job_id directly in candidate_data, we'll open the resume URL directly
    // or navigate to a general resume viewer
    window.open(resumeUrl, "_blank");
  };

  const filteredCandidates = candidates.filter((c) => {
    const name = (c["Full Name"] || c.name || "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <Container>
      <Header>
        <Title>Talent Pool</Title>
        <Subtitle>Browse, filter, and manage your candidates.</Subtitle>
      </Header>
      <SearchBar
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <LoadingSpinner text="Loading candidates..." />
      ) : error ? (
        <ErrorMsg>{error}</ErrorMsg>
      ) : filteredCandidates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          No candidates found.
        </div>
      ) : (
        <Grid>
          {filteredCandidates.map((c) => {
            const name = c["Full Name"] || c.name || "Unnamed";
            const email = c["Email"] || c.email;
            return (
              <Card key={c.id}>
                <Name>{name}</Name>
                <JobTitle>
                  {c["Job Title"] || c.jobTitle || c["Degree"] || "Job title"}
                </JobTitle>
                <InfoRow>
                  <Icon>
                    <MailIcon />
                  </Icon>
                  {email || "-"}
                </InfoRow>
                <InfoRow>
                  <Icon>📞</Icon> {formatPhone(c["Phone"] || c.phone)}
                </InfoRow>
                <ResumeRow
                  className={!c["Resume_URL"] ? "disabled" : ""}
                  onClick={() => handleViewResume(c.id, c["Resume_URL"])}
                  title={
                    c["Resume_URL"]
                      ? "Click to view resume"
                      : "No resume available"
                  }
                >
                  <Icon>
                    <PdfIcon />
                  </Icon>
                  {c["Resume_URL"] ? "View Resume" : "No Resume"}
                </ResumeRow>
                <CardActions>
                  <ActionIcon title="Email" onClick={() => handleEmail(email)}>
                    <MailIcon />
                  </ActionIcon>
                  <ActionIcon
                    title="Delete"
                    onClick={() => handleDelete(c.id, name)}
                  >
                    <TrashIcon />
                  </ActionIcon>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Candidates;
