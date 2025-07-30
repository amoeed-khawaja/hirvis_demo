import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, #10121a 0%, #191c24 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"};
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  overflow-x: hidden;
  transition: all 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background: ${(props) =>
    props.theme === "dark"
      ? "rgba(35, 40, 55, 0.8)"
      : "rgba(255, 255, 255, 0.95)"};
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled.a`
  color: ${(props) => (props.theme === "dark" ? "#b3b8c5" : "#64748b")};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ThemeToggle = styled.button`
  width: 48px;
  height: 24px;
  background: ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.theme === "dark" ? "flex-end" : "flex-start"};
  padding: 2px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.theme === "dark" ? "#4b5563" : "#cbd5e1")};
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props) => (props.theme === "dark" ? "#1e293b" : "#ffffff")};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(175, 23, 99, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
    border: 1px solid
      ${(props) => (props.theme === "dark" ? "#374151" : "#cbd5e1")};

    &:hover {
      background: ${(props) =>
        props.theme === "dark" ? "#374151" : "#f1f5f9"};
      border-color: ${(props) =>
        props.theme === "dark" ? "#4b5563" : "#94a3b8"};
    }
  }
`;

const Hero = styled.section`
  padding: 120px 40px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 100px 20px 60px;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;

  .highlight {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  margin-bottom: 32px;
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  margin-bottom: 32px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(175, 23, 99, 0.4);
  }
`;

const SocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const Avatars = styled.div`
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid
      ${(props) => (props.theme === "dark" ? "#232837" : "#e2e8f0")};
    margin-left: -8px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const SocialText = styled.p`
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  font-size: 0.95rem;
  transition: color 0.3s ease;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) =>
    props.theme === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(175, 23, 99, 0.1)"};
  border-radius: 20px;
  font-size: 0.85rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  transition: all 0.3s ease;
`;

const DemoCard = styled.div`
  background: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  position: relative;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#e2e8f0" : "#374151")};
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 18px;
    z-index: -1;
  }
`;

const DemoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DemoDots = styled.div`
  display: flex;
  gap: 6px;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &.red {
      background: #ef4444;
    }
    &.yellow {
      background: #f59e0b;
    }
    &.green {
      background: #10b981;
    }
  }
`;

const LinkedInLogo = styled.div`
  width: 24px;
  height: 24px;
  background: #0077b5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
`;

const DemoContent = styled.div`
  color: #ffffff;
  transition: color 0.3s ease;
`;

const DemoProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .profile-pic {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .profile-info {
    .name {
      font-weight: 600;
      font-size: 1rem;
      color: #ffffff;
      transition: color 0.3s ease;
    }
    .title {
      color: #ffffff;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
  }
`;

const DemoText = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #ffffff;
  transition: color 0.3s ease;

  p {
    margin-bottom: 12px;
  }
`;

const Features = styled.section`
  padding: 80px 40px;
  background: ${(props) => (props.theme === "dark" ? "#232837" : "#ffffff")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;

  .highlight {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background: ${(props) => (props.theme === "dark" ? "#191c24" : "#f8fafc")};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s;
  animation: ${fadeInUp} 0.8s ease-out;

  &:hover {
    transform: translateY(-5px);
    border-color: #af1763;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;
`;

const FeatureDescription = styled.p`
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const TestimonialSection = styled.div`
  background: ${(props) => (props.theme === "dark" ? "#191c24" : "#f1f5f9")};
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s ease;
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .author-pic {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .author-info {
    text-align: left;

    .name {
      font-weight: 600;
      color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
      transition: color 0.3s ease;
    }

    .title {
      color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
  }
`;

const StatsSection = styled.section`
  padding: 80px 40px;
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, #10121a 0%, #191c24 100%)"
      : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  text-align: center;
`;

const StatCard = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
`;

const StatLabel = styled.p`
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  font-size: 1.1rem;
  transition: color 0.3s ease;
`;

const CTA = styled.section`
  padding: 80px 40px;
  text-align: center;
  background: ${(props) => (props.theme === "dark" ? "#232837" : "#ffffff")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const CTAContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;

  .highlight {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.1rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  margin-bottom: 32px;
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Footer = styled.footer`
  padding: 40px;
  background: ${(props) => (props.theme === "dark" ? "#10121a" : "#f8fafc")};
  text-align: center;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  border-top: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s ease;
`;

const LandingPage = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <Logo theme={theme}>
          <div className="logo-icon">HR</div>
          Hirvis
        </Logo>
        <Nav>
          <NavLink theme={theme}>Features</NavLink>
          <NavLink theme={theme}>For HR Teams</NavLink>
          <NavLink theme={theme}>Pricing</NavLink>
          <NavLink theme={theme}>Resources</NavLink>
        </Nav>
        <HeaderButtons>
          <ThemeToggle theme={theme} onClick={toggleTheme}>
            <div className="toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</div>
          </ThemeToggle>
          <Button className="secondary" theme={theme}>
            Demo
          </Button>
          <Button className="primary">Get Started →</Button>
        </HeaderButtons>
      </Header>

      <Hero>
        <HeroContent>
          <HeroTitle>
            A Complete <span className="highlight">HR System</span>. Not just
            another dashboard.
          </HeroTitle>
          <HeroSubtitle theme={theme}>
            Manage candidates, track applications, automate onboarding, and grow
            your team - all in one place.
          </HeroSubtitle>
          <CTAButton to="/signup">Get Started Free →</CTAButton>

          <SocialProof>
            <Avatars theme={theme}>
              <div className="avatar" style={{ background: "#af1763" }}>
                👩
              </div>
              <div className="avatar" style={{ background: "#5f4bfa" }}>
                👨
              </div>
              <div className="avatar" style={{ background: "#10b981" }}>
                👩
              </div>
            </Avatars>
            <SocialText theme={theme}>
              Trusted by 500+ HR professionals
            </SocialText>
          </SocialProof>

          <Badge theme={theme}>⭐ Featured on Top HR Platforms</Badge>
        </HeroContent>

        <DemoCard theme={theme}>
          <DemoHeader>
            <DemoDots>
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </DemoDots>
            <LinkedInLogo>in</LinkedInLogo>
          </DemoHeader>

          <DemoContent theme={theme}>
            <DemoProfile theme={theme}>
              <div className="profile-pic">HR</div>
              <div className="profile-info">
                <div className="name">Sophia Williams</div>
                <div className="title">HR Manager @ TechCorp • 2h</div>
              </div>
            </DemoProfile>

            <DemoText theme={theme}>
              <p>
                Just completed our quarterly hiring sprint using Hirvis. The
                results? 🤯
              </p>
              <p>• 50% faster candidate screening</p>
              <p>• 3x more qualified applicants</p>
              <p>• Automated onboarding reduced admin time by 70%</p>
              <p>
                Our team can now focus on what matters most - building
                relationships with candidates.
              </p>
              <p>
                Stop juggling spreadsheets. Start building your dream team. 🚀
              </p>
            </DemoText>
          </DemoContent>
        </DemoCard>
      </Hero>

      <Features theme={theme}>
        <FeaturesContainer>
          <SectionHeader>
            <SectionTitle>
              How Hirvis helps you <span className="highlight">grow</span>{" "}
              without burning out
            </SectionTitle>
            <SectionSubtitle theme={theme}>
              Three simple steps to transform your HR process and build a
              world-class team
            </SectionSubtitle>
          </SectionHeader>

          <FeaturesGrid>
            <FeatureCard theme={theme}>
              <FeatureIcon>📝</FeatureIcon>
              <FeatureTitle theme={theme}>
                Smart Candidate Management
              </FeatureTitle>
              <FeatureDescription theme={theme}>
                Upload resumes, track applications, and manage your entire
                hiring pipeline in one intuitive dashboard.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard theme={theme}>
              <FeatureIcon>🤖</FeatureIcon>
              <FeatureTitle theme={theme}>AI-Powered Screening</FeatureTitle>
              <FeatureDescription theme={theme}>
                Our AI assistant helps you identify the best candidates,
                schedule interviews, and automate routine tasks.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard theme={theme}>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle theme={theme}>Analytics & Insights</FeatureTitle>
              <FeatureDescription theme={theme}>
                Track your hiring metrics, identify bottlenecks, and optimize
                your recruitment process with data-driven insights.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          <TestimonialSection theme={theme}>
            <TestimonialText theme={theme}>
              "Hirvis transformed our entire hiring process. We went from
              drowning in spreadsheets to having a streamlined, efficient system
              that actually helps us find better candidates."
            </TestimonialText>
            <TestimonialAuthor theme={theme}>
              <div className="author-pic">MJ</div>
              <div className="author-info">
                <div className="name">Maria Johnson</div>
                <div className="title">Head of HR, TechStartup</div>
              </div>
            </TestimonialAuthor>
          </TestimonialSection>
        </FeaturesContainer>
      </Features>

      <StatsSection theme={theme}>
        <StatsContainer>
          <StatCard>
            <StatNumber>500+</StatNumber>
            <StatLabel theme={theme}>HR professionals trust Hirvis</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>10K+</StatNumber>
            <StatLabel theme={theme}>
              candidates screened successfully
            </StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50%</StatNumber>
            <StatLabel theme={theme}>faster hiring process</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>95%</StatNumber>
            <StatLabel theme={theme}>satisfaction rate</StatLabel>
          </StatCard>
        </StatsContainer>
      </StatsSection>

      <CTA theme={theme}>
        <CTAContainer>
          <CTATitle>
            Ready to <span className="highlight">transform</span> your HR
            process?
          </CTATitle>
          <CTASubtitle theme={theme}>
            Join hundreds of HR professionals who are already building better
            teams with Hirvis. Start your free trial today.
          </CTASubtitle>
          <CTAGroup>
            <CTAButton to="/signup">Start Free Trial →</CTAButton>
            <Button className="secondary" theme={theme}>
              Watch Demo
            </Button>
          </CTAGroup>
        </CTAContainer>
      </CTA>

      <Footer theme={theme}>
        <p>
          © 2024 Hirvis. All rights reserved. | Privacy Policy | Terms of
          Service
        </p>
      </Footer>
    </Container>
  );
};

export default LandingPage;
