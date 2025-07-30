import React from "react";
import styled from "styled-components";

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchInput = styled.input`
  background: #232837;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  width: 300px;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #af1763;
  }
`;

const CreateButton = styled.button`
  background: #198754;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #146c43;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const IconButton = styled.button`
  background: #232837;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #374151;
    border-color: #af1763;
  }
`;

const PromoBanner = styled.div`
  background: linear-gradient(135deg, #af1763, #0d6efd);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
`;

const PromoContent = styled.div`
  flex: 1;
`;

const PromoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const PromoText = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
`;

const PromoButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${(props) => props.color || "#AF1763"};
  color: #ffffff;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => (props.positive ? "#198754" : "#AB2E3C")};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
`;

const ContentCard = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
`;

const CardTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 24px 0;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  margin-bottom: 16px;
  color: #bfd4d1;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(175, 23, 99, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(175, 23, 99, 0.1);
`;

const ActivityDot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
  background: ${(props) => props.color || "#AF1763"};
`;

const ProgressBar = styled.div`
  background: #374151;
  border-radius: 8px;
  height: 10px;
  margin-bottom: 18px;
  overflow: hidden;
`;

const Progress = styled.div`
  background: #af1763;
  height: 100%;
  width: ${(props) => props.value || 0}%;
  transition: width 0.3s;
`;

const GoalsList = styled.div`
  margin-bottom: 12px;
`;

const GoalRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const GoalLabel = styled.div`
  flex: 1;
  color: #bfd4d1;
`;

const GoalValue = styled.div`
  margin-left: 12px;
  color: #ffffff;
  font-weight: 600;
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: #af1763;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.08rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #8a1250;
  }
`;

const BottomStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

const Dashboard = () => {
  return (
    <Container>
      <Header>
        <Title>Klarus Dashboard</Title>
        <SearchBar>
          <SearchInput placeholder="Search candidates..." />
          <CreateButton>+ Create New Job</CreateButton>
          <TopBar>
            <IconButton>⊞</IconButton>
            <IconButton>✉️</IconButton>
            <IconButton>🔔</IconButton>
            <IconButton>👤</IconButton>
          </TopBar>
        </SearchBar>
      </Header>

      <PromoBanner>
        <PromoContent>
          <PromoTitle>Welcome to Klarus HR Dashboard</PromoTitle>
          <PromoText>
            Streamline your recruitment process with AI-powered candidate
            screening and intelligent job matching!
          </PromoText>
        </PromoContent>
        <PromoButton>Get Started</PromoButton>
      </PromoBanner>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Leads</StatTitle>
            <StatIcon color="#0DCAF0">👥</StatIcon>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatChange positive>
            <span>↗</span>
            +0%
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Jobs</StatTitle>
            <StatIcon color="#198754">💼</StatIcon>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatChange positive>
            <span>↗</span>
            +0%
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Candidates</StatTitle>
            <StatIcon color="#FFC107">👤</StatIcon>
          </StatHeader>
          <StatValue>3</StatValue>
          <StatChange positive>
            <span>↗</span>
            +3
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Applications</StatTitle>
            <StatIcon color="#AF1763">📝</StatIcon>
          </StatHeader>
          <StatValue>12</StatValue>
          <StatChange positive>
            <span>↗</span>
            +12
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <ContentCard>
          <CardTitle>Recent Activity</CardTitle>
          <ActivityList>
            <ActivityItem>
              <ActivityDot color="#0DCAF0" />
              New lead added: John Smith{" "}
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9CA3AF",
                  fontSize: "0.95em",
                }}
              >
                2 hours ago
              </span>
            </ActivityItem>
            <ActivityItem>
              <ActivityDot color="#198754" />
              Job posting "Senior Developer" published{" "}
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9CA3AF",
                  fontSize: "0.95em",
                }}
              >
                4 hours ago
              </span>
            </ActivityItem>
            <ActivityItem>
              <ActivityDot color="#FFC107" />3 new applications received{" "}
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9CA3AF",
                  fontSize: "0.95em",
                }}
              >
                6 hours ago
              </span>
            </ActivityItem>
            <ActivityItem>
              <ActivityDot color="#AF1763" />
              Interview scheduled with Sarah Connor{" "}
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9CA3AF",
                  fontSize: "0.95em",
                }}
              >
                1 day ago
              </span>
            </ActivityItem>
            <ActivityItem>
              <ActivityDot color="#0D6EFD" />
              Resume screening completed for 5 candidates{" "}
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9CA3AF",
                  fontSize: "0.95em",
                }}
              >
                2 days ago
              </span>
            </ActivityItem>
          </ActivityList>
        </ContentCard>

        <ContentCard>
          <CardTitle>Recruitment Goals</CardTitle>
          <GoalsList>
            <GoalRow>
              <GoalLabel>Monthly Lead Target</GoalLabel>
              <ProgressBar style={{ flex: 1, margin: "0 12px" }}>
                <Progress value={0} />
              </ProgressBar>
              <GoalValue>0/50</GoalValue>
            </GoalRow>
            <GoalRow>
              <GoalLabel>Job Placements</GoalLabel>
              <ProgressBar style={{ flex: 1, margin: "0 12px" }}>
                <Progress value={30} />
              </ProgressBar>
              <GoalValue>3/10</GoalValue>
            </GoalRow>
            <GoalRow>
              <GoalLabel>Interview Completion</GoalLabel>
              <ProgressBar style={{ flex: 1, margin: "0 12px" }}>
                <Progress value={60} />
              </ProgressBar>
              <GoalValue>6/10</GoalValue>
            </GoalRow>
          </GoalsList>

          <CardTitle style={{ marginTop: "32px", marginBottom: "16px" }}>
            Quick Actions
          </CardTitle>
          <QuickActions>
            <ActionButton>Add New Lead</ActionButton>
            <ActionButton>Create Job Posting</ActionButton>
            <ActionButton>Schedule Interview</ActionButton>
          </QuickActions>
        </ContentCard>
      </ContentGrid>

      <BottomStats>
        <StatCard>
          <StatHeader>
            <StatTitle>Plan Usage</StatTitle>
            <StatIcon color="#0D6EFD">📊</StatIcon>
          </StatHeader>
          <StatValue>50%</StatValue>
          <StatChange positive>
            <span>↗</span>
            Ideas generated
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>AI Screening</StatTitle>
            <StatIcon color="#AB2E3C">🤖</StatIcon>
          </StatHeader>
          <StatValue>85%</StatValue>
          <StatChange positive>
            <span>↗</span>
            Accuracy rate
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Time Saved</StatTitle>
            <StatIcon color="#198754">⏱️</StatIcon>
          </StatHeader>
          <StatValue>40hrs</StatValue>
          <StatChange positive>
            <span>↗</span>
            This month
          </StatChange>
        </StatCard>
      </BottomStats>
    </Container>
  );
};

export default Dashboard;
