import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #191c24 0%, #232837 100%);
  color: #ffffff;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  background: rgba(35, 40, 55, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const NavLink = styled.a`
  color: #bfd4d1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: linear-gradient(135deg, #af1763, #0d6efd);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(175, 23, 99, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: #bfd4d1;
    border: 2px solid #374151;

    &:hover {
      border-color: #af1763;
      color: #ffffff;
    }
  }
`;

const HeroSection = styled.section`
  padding: 120px 48px 80px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff, #bfd4d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(175, 23, 99, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(175, 23, 99, 0.4);
    color: #ffffff;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 48px;
  background: rgba(35, 40, 55, 0.5);
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 64px;
  color: #ffffff;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(35, 40, 55, 0.8);
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    border-color: #af1763;
    box-shadow: 0 12px 40px rgba(175, 23, 99, 0.2);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
`;

const FeatureDescription = styled.p`
  color: #9ca3af;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 80px 48px;
  background: linear-gradient(
    135deg,
    rgba(175, 23, 99, 0.1),
    rgba(13, 110, 253, 0.1)
  );
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const StatItem = styled.div``;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Footer = styled.footer`
  background: #232837;
  padding: 48px;
  text-align: center;
  border-top: 1px solid #374151;
`;

const FooterText = styled.p`
  color: #9ca3af;
  margin-bottom: 16px;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const FooterLink = styled.a`
  color: #bfd4d1;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const LandingPage = () => {
  return (
    <LandingContainer>
      <Header>
        <Logo>Hirvis HR</Logo>
        <Nav>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#about">About</NavLink>
        </Nav>
        <AuthButtons>
          <Button as={Link} to="/login" className="secondary">
            Sign In
          </Button>
          <Button as={Link} to="/signup" className="primary">
            Get Started
          </Button>
        </AuthButtons>
      </Header>

      <HeroSection>
        <HeroTitle>Transform Your HR Operations</HeroTitle>
        <HeroSubtitle>
          Streamline recruitment, manage candidates, and automate your hiring
          process with our comprehensive HR management platform. Built for
          modern teams.
        </HeroSubtitle>
        <CTAButton to="/login">
          Get Started Free
          <span>→</span>
        </CTAButton>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>Powerful Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📋</FeatureIcon>
            <FeatureTitle>Job Management</FeatureTitle>
            <FeatureDescription>
              Create, manage, and track job postings with ease. Monitor
              applications and streamline your hiring workflow.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>Candidate Tracking</FeatureTitle>
            <FeatureDescription>
              Organize and track candidates throughout the hiring process. Store
              CVs, notes, and communication history.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Analytics Dashboard</FeatureTitle>
            <FeatureDescription>
              Get insights into your hiring performance with detailed analytics
              and customizable reports.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔗</FeatureIcon>
            <FeatureTitle>LinkedIn Integration</FeatureTitle>
            <FeatureDescription>
              Automate your social media presence with AI-powered content
              generation and scheduled posting.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Recruitment Calendar</FeatureTitle>
            <FeatureDescription>
              Schedule interviews, track deadlines, and manage your recruitment
              timeline in one place.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Lead Management</FeatureTitle>
            <FeatureDescription>
              Track sales prospects and manage your pipeline with advanced lead
              scoring and communication tools.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <SectionTitle>Trusted by HR Teams</SectionTitle>
        <StatsGrid>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Active Users</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Jobs Posted</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Candidates Managed</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>99%</StatNumber>
            <StatLabel>Uptime</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <Footer>
        <FooterText>© 2024 Hirvis HR. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="#privacy">Privacy Policy</FooterLink>
          <FooterLink href="#terms">Terms of Service</FooterLink>
          <FooterLink href="#support">Support</FooterLink>
          <FooterLink href="#contact">Contact</FooterLink>
        </FooterLinks>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
