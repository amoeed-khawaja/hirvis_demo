import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { supabase } from "../supabase";
import { getCurrentUserId } from "../utils/auth";

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  margin-left: 280px;
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
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
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
    border-color: #af1763;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
`;

const shine = keyframes`
  0% { box-shadow: 0 0 0 0 #af1763, 0 0 6px 2px #af1763; }
  50% { box-shadow: 0 0 0 0 #af1763, 0 0 12px 4px #af1763; }
  100% { box-shadow: 0 0 0 0 #af1763, 0 0 6px 2px #af1763; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 #af1763;
  animation: ${shine} 2.5s infinite;
  padding: 32px 28px 24px 28px;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 0 0 0 #af1763, 0 0 16px 6px #af1763;
  }
`;

const Name = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const JobTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
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

const Candidates = () => {
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
        <Loading>Loading candidates...</Loading>
      ) : error ? (
        <ErrorMsg>{error}</ErrorMsg>
      ) : filteredCandidates.length === 0 ? (
        <Loading>No candidates found.</Loading>
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
