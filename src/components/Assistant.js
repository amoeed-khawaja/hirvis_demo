import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { supabase } from "../supabase";
import { getCurrentUser } from "../utils/auth";
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
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
`;

const MetricsSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 24px 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 32px 24px;
  border: 1px solid #374151;
  position: relative;
  overflow: hidden;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const ChartContainer = styled.div`
  height: 120px;
  margin-top: 16px;
  position: relative;
`;

const ChartLine = styled.div`
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 2px;
  position: relative;
  margin: 20px 0;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.1), transparent);
    border-radius: 10px;
  }
`;

const ChartDot = styled.div`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  position: absolute;
  top: -2.5px;
  right: 0;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
`;

const CallAnalysisSection = styled.div`
  margin-bottom: 32px;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

const AnalysisCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
`;

const AnalysisTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const BarChart = styled.div`
  height: 120px;
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 0 8px;
`;

const Bar = styled.div`
  flex: 1;
  background: ${(props) => props.color || "#3b82f6"};
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  position: relative;

  &::after {
    content: "${(props) => props.value || ""}";
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: #9ca3af;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color || "#3b82f6"};
`;

const AddCreditsButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 32px;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const AssistantInfoCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #374151;
  text-align: center;
`;

const AvatarContainer = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const waveAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 24px;
  animation: ${waveAnimation} 2s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(175, 23, 99, 0.3);
`;

const AvatarLabel = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 16px;
`;

const Description = styled.p`
  color: #9ca3af;
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
  padding: 40px;
`;

// Modal Styles
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
  max-width: 400px;
  padding: 32px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
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

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5f4bfa;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

const CancelButton = styled(Button)`
  background: #374151;
  color: #ffffff;

  &:hover {
    background: #4b5563;
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const Assistant = () => {
  const [recruiterName, setRecruiterName] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await getCurrentUser();
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("users_data")
          .select("recruiter_name, assistant_name")
          .eq("login_user_id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching user data:", fetchError);
          setError("Failed to fetch user data");
          setLoading(false);
          return;
        }

        setRecruiterName(data?.recruiter_name || "Assistant");
        setAssistantName(data?.assistant_name || "");

        // Dummy data for metrics (will be replaced with VAPI API later)
        setTotalCredits(150);
        setTotalCalls(23);
        setTotalMinutes(45.2);
        setTotalSpent(12.5);

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddCredits = () => {
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount < 1) {
      alert("Please enter a valid amount (minimum $1)");
      return;
    }

    // Here you would typically integrate with your payment system
    // For now, we'll just show a success message
    alert(`Successfully added $${amount} in credits!`);
    setShowAddCreditsModal(false);
    setCreditAmount("");

    // Update the credits in the UI (in a real app, this would come from the server)
    setTotalCredits((prev) => prev + Math.floor(amount * 10)); // Assuming $1 = 10 credits
  };

  const getAvatarInfo = () => {
    const name = assistantName.toLowerCase();

    if (
      name.includes("sarah") ||
      name.includes("johnson") ||
      name.includes("emily") ||
      name.includes("rodriguez")
    ) {
      return {
        emoji: "👩🏻‍💼",
        gender: "female",
        description: "Professional & Friendly",
      };
    } else if (
      name.includes("michael") ||
      name.includes("chen") ||
      name.includes("david") ||
      name.includes("thompson")
    ) {
      return {
        emoji: "👨🏻‍💼",
        gender: "male",
        description: "Confident & Authoritative",
      };
    } else {
      return {
        emoji: "🤖",
        gender: "neutral",
        description: "AI Assistant",
      };
    }
  };

  const avatarInfo = getAvatarInfo();

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading Assistant..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText>Error: {error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{recruiterName}</Title>
        <Subtitle>Your AI-powered recruitment assistant</Subtitle>
      </Header>

      <MetricsSection>
        <SectionTitle>Metrics</SectionTitle>
        <StatsContainer>
          <StatCard>
            <StatHeader>
              <StatInfo>
                <StatValue>{totalCredits}</StatValue>
                <StatLabel>Total Credits</StatLabel>
              </StatInfo>
              <StatIcon>💳</StatIcon>
            </StatHeader>
            <ChartContainer>
              <ChartLine>
                <ChartDot />
              </ChartLine>
            </ChartContainer>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatInfo>
                <StatValue>{totalCalls}</StatValue>
                <StatLabel>Number of Calls</StatLabel>
              </StatInfo>
              <StatIcon>📞</StatIcon>
            </StatHeader>
            <ChartContainer>
              <ChartLine
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                }}
              >
                <ChartDot
                  style={{
                    background: "#f59e0b",
                    boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.2)",
                  }}
                />
              </ChartLine>
            </ChartContainer>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatInfo>
                <StatValue>{totalMinutes.toFixed(1)}</StatValue>
                <StatLabel>Total Call Minutes</StatLabel>
              </StatInfo>
              <StatIcon>⏱️</StatIcon>
            </StatHeader>
            <ChartContainer>
              <ChartLine
                style={{
                  background: "linear-gradient(90deg, #10b981, #3b82f6)",
                }}
              >
                <ChartDot
                  style={{
                    background: "#10b981",
                    boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)",
                  }}
                />
              </ChartLine>
            </ChartContainer>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatInfo>
                <StatValue>${totalSpent.toFixed(2)}</StatValue>
                <StatLabel>Total Spent</StatLabel>
              </StatInfo>
              <StatIcon>💰</StatIcon>
            </StatHeader>
            <ChartContainer>
              <ChartLine
                style={{
                  background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
                }}
              >
                <ChartDot
                  style={{
                    background: "#8b5cf6",
                    boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.2)",
                  }}
                />
              </ChartLine>
            </ChartContainer>
          </StatCard>
        </StatsContainer>
      </MetricsSection>

      <CallAnalysisSection>
        <SectionTitle>Call Analysis</SectionTitle>
        <AnalysisGrid>
          <AnalysisCard>
            <AnalysisTitle>Call Duration by Assistant</AnalysisTitle>
            <BarChart>
              <Bar color="#8b5cf6" value="2.5min" style={{ height: "60%" }} />
              <Bar color="#3b82f6" value="1.8min" style={{ height: "45%" }} />
              <Bar color="#10b981" value="3.2min" style={{ height: "80%" }} />
            </BarChart>
            <Legend>
              <LegendItem>
                <LegendDot color="#8b5cf6" />
                <span>Maria</span>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#3b82f6" />
                <span>John</span>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#10b981" />
                <span>Sarah</span>
              </LegendItem>
            </Legend>
          </AnalysisCard>

          <AnalysisCard>
            <AnalysisTitle>Call Success Rate</AnalysisTitle>
            <BarChart>
              <Bar color="#10b981" value="85%" style={{ height: "85%" }} />
              <Bar color="#f59e0b" value="12%" style={{ height: "12%" }} />
              <Bar color="#ef4444" value="3%" style={{ height: "3%" }} />
            </BarChart>
            <Legend>
              <LegendItem>
                <LegendDot color="#10b981" />
                <span>Successful</span>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#f59e0b" />
                <span>Partial</span>
              </LegendItem>
              <LegendItem>
                <LegendDot color="#ef4444" />
                <span>Failed</span>
              </LegendItem>
            </Legend>
          </AnalysisCard>
        </AnalysisGrid>
      </CallAnalysisSection>

      <AddCreditsButton onClick={() => setShowAddCreditsModal(true)}>
        Add Credits
      </AddCreditsButton>

      <AssistantInfoCard>
        <AvatarContainer>
          <Avatar>{avatarInfo.emoji}</Avatar>
          <AvatarLabel>{assistantName || "AI Assistant"}</AvatarLabel>
        </AvatarContainer>

        <Description>
          Welcome to your personalized recruitment assistant. This{" "}
          {avatarInfo.gender} AI assistant is designed to help streamline your
          recruitment process with {avatarInfo.description.toLowerCase()}
          interactions. Soon you'll be able to have natural conversations, get
          candidate insights, and automate routine tasks.
        </Description>
      </AssistantInfoCard>

      {/* Add Credits Modal */}
      {showAddCreditsModal && (
        <ModalOverlay onClick={() => setShowAddCreditsModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowAddCreditsModal(false)}>
              ×
            </CloseButton>
            <ModalTitle>Add Credits</ModalTitle>

            <InputGroup>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount (minimum $1)"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </InputGroup>

            <ButtonGroup>
              <CancelButton onClick={() => setShowAddCreditsModal(false)}>
                Cancel
              </CancelButton>
              <ConfirmButton onClick={handleAddCredits}>
                Add Credits
              </ConfirmButton>
            </ButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Assistant;
